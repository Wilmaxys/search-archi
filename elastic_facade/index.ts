import { fastify } from 'fastify';

import { Client } from '@elastic/elasticsearch';

interface SearchResult {
  content: string;
  path: string;
  title?: string;
  author?: string;
}

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
        type: 'array',
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
        highlight: {
          fields: {
            content: {},
          },
          fragment_size: 250,
        },
      },
    });
    reply.send(
      body?.hits?.hits?.map(
        (hit: { _source: SearchResult; highlight: { content: string[] } }) => {
          return { ...hit._source, content: hit.highlight.content[0] };
        }
      )
    );
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
