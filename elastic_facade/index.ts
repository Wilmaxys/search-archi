import { fastify } from 'fastify'

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
      query: { type: 'string' }
    },
    response: {
      200: {
        type: 'array'
      }
    }
  },
  handler: async function (request, reply) {
    const query = (request.query as any)["query"]
    const { body } = await client.search({
      index: 'game-of-thrones',
      body: {
        query: {
          match: {
            quote: query
          }
        }
      }
    })
    reply.send(body.hits.hits)
  }
})

//@Server
server.listen(5001, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log(`Server running, navigate to https://localhost:5001`);
  }
});

//ElasticSearch client
export const client = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USER || "",
    password: process.env.ELASTICSEARCH_PASSWORD || ""
  }
})


async function initData() {
  await client.index({
    index: 'game-of-thrones',
    refresh: true,
    body: {
      character: 'Ned Stark',
      quote: 'Winter is coming.'
    }
  })

  await client.index({
    index: 'game-of-thrones',
    refresh: true,
    body: {
      character: 'Daenerys Targaryen',
      quote: 'I am the blood of the dragon.'
    }
  })

  await client.index({
    index: 'game-of-thrones',
    refresh: true,
    body: {
      character: 'Tyrion Lannister',
      quote: 'A mind needs books like a sword needs a whetstone.'
    }
  })
}

initData().catch(console.log)
