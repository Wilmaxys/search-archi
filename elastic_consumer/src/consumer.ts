import { connect, JSONCodec } from 'nats';
import { Client } from '@elastic/elasticsearch';

//ElasticSearch client
export const client = new Client({
    node: 'http://localhost:9200',
    auth: {
        username: process.env.ELASTICSEARCH_USER || "",
        password: process.env.ELASTICSEARCH_PASSWORD || ""
    }
});

/** Mapping data to be stored in elastic search**/
async function init() {
    if (!await client.indices.exists({
        index: "documents"
    })) {
        client.indices.create({
            index: "documents",
            wait_for_active_shards: '1',
            body: {
                mappings: {
                    properties : {
                        title : {type : 'text'},
                        author: {type : 'text'},
                        content : {type : 'text'},
                        path: {type: 'text'}
                    }
                }
            }
          }).catch((error) => {console.log(error.meta.body)});
    }
};

init();

(async () => {
    const nc = await connect({ servers: 'localhost:4222' });
    const jc = JSONCodec();

    const sub = nc.subscribe('test');
    (async () => {
        for await (const m of sub) {
            const data = jc.decode(m.data) as any
            if (data) {
                switch (data.action) {
                    case 'add':
                        client.index({
                            index: 'documents',
                            refresh: true,
                            body: {
                                title: data.file.info.Title,
                                author: data.file.info.Author,
                                content: data.file.text.text,
                                path: data.path
                            }
                        }).catch((error) => {console.log(error)})
                        break;
                    case 'delete':
                        client.deleteByQuery({
                            index: 'documents',
                            refresh: true,
                            body: {
                                query: {
                                  match: {
                                    path: data.path
                                  }
                                }
                              }
                        }).catch((error) => {console.log(error)})
                        break;
                    default:
                        console.log("unknown action")
                }
            }
        }
    })();
})();
