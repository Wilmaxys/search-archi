import * as dotenv from 'dotenv';
import fastify from 'fastify';
import querystring from 'querystring';
import axios, { AxiosResponse } from 'axios';
import { raceToSuccess } from './utils/functions';
import { ICache, SimpleCache } from './utils/cache';
import fastifyCors from 'fastify-cors';

//@Load Env
dotenv.config();

const server = fastify({ logger: true });

server.register(fastifyCors, {
  origin: '*',
  methods: ['POST', 'GET'],
});

//@Cache
const cache: ICache = new SimpleCache(
  parseInt(process.env.CACHE_DURATION || '120')
);
// Clear old cache every 5 minutes
const cacheInterval = setInterval(() => cache.empty(), 5 * 60000);

//@Facades
const facades = ['http://elastic_facade:8080/search'];

//@Routes
server.route({
  method: 'GET',
  url: '/api',
  schema: {
    querystring: {
      query: {
        type: 'string',
      },
    },
  },
  handler: async (req, res) => {
    try {
      const query = querystring.stringify(
        req.query as querystring.ParsedUrlQueryInput
      );

      if (!query) {
        return res.status(400).send('Query parameter cannot be null');
      }

      const cachedResponse = cache.get(query);
      if (cachedResponse) {
        res.status(200).send(cachedResponse);
      } else {
        const promises: Promise<AxiosResponse<any>>[] = [];
        facades.forEach((facade) =>
          promises.push(axios.get(`${facade}?${query}`))
        );

        const response = await raceToSuccess(promises);
        cache.set(query, response.data);
        res.status(200).send(cache.get(query));
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
});

//@Hooks
server.addHook('onClose', () => clearInterval(cacheInterval));

//@Server
server.listen(8080, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log(`Server running, navigate to https://localhost:8080`);
  }
});
