import { connect, JSONCodec } from 'nats';

(async () => {
    const nc = await connect({ servers: 'localhost:4222' });
    const jc = JSONCodec();

    const sub = nc.subscribe('test');
    (async () => {
        for await (const m of sub) {
            console.log(`[${sub.getProcessed()}]: ${JSON.stringify(jc.decode(m.data))}`);
        }
    })();
})();
