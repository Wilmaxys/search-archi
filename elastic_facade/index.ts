import { fastify } from 'fastify';

import { Client } from '@elastic/elasticsearch';

const server = fastify({ logger: true });

//@Routes
server.get('/', (req, res) => {
  res.status(200).send({ success: true, message: 'Query successful' });
});

server.route({
  method: 'GET',
  url: '/search',
  schema: {
    querystring: {
      query: { type: 'string' },
    },
    response: {
      200: {
        type: 'object',
      },
    },
  },
  handler: async function (request, reply) {
    const query = (request.query as any)['query'];
    const { body } = await client.search({
      index: 'documents',
      body: {
        query: {
          match: {
            content: query,
          },
        },
      },
    });
    reply.send(JSON.stringify(body));
  },
});

//@Server
server.listen(8080, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log(`Server running, navigate to https://localhost:8080`);
  }
});

//ElasticSearch client
const client = new Client({
  node: 'http://elastic:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USER || '',
    password: process.env.ELASTICSEARCH_PASSWORD || '',
  },
});
