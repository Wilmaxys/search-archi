"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const fastify_1 = require("fastify");
const elasticsearch_1 = require("@elastic/elasticsearch");
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
            query: { type: 'string' }
        },
        response: {
            200: {
                type: 'array'
            }
        }
    },
    handler: function (request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = request.query["query"];
            const { body } = yield exports.client.search({
                index: 'game-of-thrones',
                body: {
                    query: {
                        match: {
                            quote: query
                        }
                    }
                }
            });
            reply.send(body.hits.hits);
        });
    }
});
//@Server
server.listen(5001, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    else {
        console.log(`Server running, navigate to https://localhost:5001`);
    }
});
//ElasticSearch client
exports.client = new elasticsearch_1.Client({
    node: 'http://localhost:9200',
    auth: {
        username: process.env.ELASTICSEARCH_USER || "",
        password: process.env.ELASTICSEARCH_PASSWORD || ""
    }
});
function initData() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.client.index({
            index: 'game-of-thrones',
            refresh: true,
            body: {
                character: 'Ned Stark',
                quote: 'Winter is coming.'
            }
        });
        yield exports.client.index({
            index: 'game-of-thrones',
            refresh: true,
            body: {
                character: 'Daenerys Targaryen',
                quote: 'I am the blood of the dragon.'
            }
        });
        yield exports.client.index({
            index: 'game-of-thrones',
            refresh: true,
            body: {
                character: 'Tyrion Lannister',
                quote: 'A mind needs books like a sword needs a whetstone.'
            }
        });
    });
}
initData().catch(console.log);
