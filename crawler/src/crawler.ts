import * as watch from 'glob-watcher';
import { connect, JSONCodec } from 'nats';
import * as fs from "fs";
import * as pdf from "pdf-parse";

(async () => {
    const watcher = watch(['./*.pdf']);
    const nc = await connect({ servers: 'localhost:4222' });
    const jc = JSONCodec();
    console.log(`connected to ${nc.getServer()}`);

    const handleChange = (action, path) => {
        const dataBuffer = fs.readFileSync(path);

        pdf(dataBuffer).then(function(data) {
            nc.publish("test", jc.encode({
                action: action,
                path: path,
                file: {
                    numpages: data.numpages,
                    numrender: data.numrender,
                    info: data.info,
                    metadata: data.metadata,
                    version: data.version,
                    text: data,
                }
            }));
        });
    }

    watcher.on('change',  (path, stat) => {
        handleChange('change', path);
    });

    watcher.on('add',  (path, stat) => {
        handleChange('add', path);
    });

    watcher.on('unlink', (path, stat) => {
        nc.publish("test", jc.encode({
            action: 'delete',
            path: path,
        }));
    });
})();
 
 

