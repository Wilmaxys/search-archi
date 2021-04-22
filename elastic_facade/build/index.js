'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
const fastify_1 = require('fastify');
const elasticsearch_1 = require('@elastic/elasticsearch');
const server = fastify_1.fastify({ logger: true });
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
  handler: function (request, reply) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      const query = request.query['query'];
      const { body } = yield client.search({
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
          },
        },
      });
      console.log(body);
      reply.send(
        JSON.stringify(
          (_b =
            (_a = body === null || body === void 0 ? void 0 : body.hits) ===
              null || _a === void 0
              ? void 0
              : _a.hits) === null || _b === void 0
            ? void 0
            : _b.map((hit) => {
                var _a, _b;
                return Object.assign(Object.assign({}, hit._source), {
                  content:
                    (_b =
                      (_a = hit._source) === null || _a === void 0
                        ? void 0
                        : _a.highlight) === null || _b === void 0
                      ? void 0
                      : _b.content,
                });
              })
        )
      );
    });
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
const client = new elasticsearch_1.Client({
  node: 'http://elastic:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USER || '',
    password: process.env.ELASTICSEARCH_PASSWORD || '',
  },
});
