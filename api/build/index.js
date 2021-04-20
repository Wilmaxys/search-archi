"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const fastify_1 = __importDefault(require("fastify"));
const querystring_1 = __importDefault(require("querystring"));
const axios_1 = __importDefault(require("axios"));
const functions_1 = require("./utils/functions");
const cache_1 = require("./utils/cache");
//@Load Env
dotenv.config();
const server = fastify_1.default({ logger: true });
//@Cache
const cache = new cache_1.SimpleCache(parseInt(process.env.CACHE_DURATION || '120'));
// Clear old cache every 5 minutes
const cacheInterval = setInterval(() => cache.empty(), 5 * 60000);
//@Facades
const facades = ['http://elastic_facade:8080/search'];
//@Routes
server.route({
    method: 'GET',
    url: '/',
    schema: {
        querystring: {
            query: {
                type: 'string',
            },
        },
    },
    handler: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = querystring_1.default.stringify(req.query);
            if (!query) {
                return res.status(400).send('Query parameter cannot be null');
            }
            const cachedResponse = cache.get(query);
            if (cachedResponse) {
                res.status(200).send(cachedResponse);
            }
            else {
                const promises = [];
                facades.forEach((facade) => promises.push(axios_1.default.get(`${facade}?${query}`)));
                const response = yield functions_1.raceToSuccess(promises);
                cache.set(query, response.data);
                res.status(200).send(cache.get(query));
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
    }),
});
//@Hooks
server.addHook('onClose', () => clearInterval(cacheInterval));
//@Server
server.listen(8080, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    else {
        console.log(`Server running, navigate to https://localhost:8080`);
    }
});
