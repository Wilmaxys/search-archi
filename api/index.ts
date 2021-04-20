import fastify from 'fastify';
import querystring from 'querystring';
import axios, { AxiosResponse } from 'axios';
import { raceToSuccess } from './utils/functions';
import { ICache, SimpleCache } from './utils/cache';

const server = fastify({ logger: true });

//@Cache
const cache: ICache = new SimpleCache();

//@Facades
const facades = ['http://localhost:5001'];

//@Routes
server.get(
  '/',
  {
    schema: {
      querystring: {
        query: {
          type: 'string',
        },
      },
    },
  },
  async (req, res) => {
    try {
      const query = querystring.stringify(
        req.query as querystring.ParsedUrlQueryInput
      );

      if (cache.get(query)) {
        res.status(200).send(cache.get(query));
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
      res.status(500).send({ message: err });
    }
  }
);

//@Server
server.listen(5000, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log(`Server running, navigate to https://localhost:5000`);
  }
});
