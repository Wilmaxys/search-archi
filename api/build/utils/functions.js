'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.raceToSuccess = void 0;
function raceToSuccess(promises) {
    // Get first successful request = invert logic of Promise.all
    return Promise.all(
        promises.map((p) => {
            return p.then(
                (val) => Promise.reject(val),
                (err) => Promise.resolve(err)
            );
        })
    ).then(
        (errors) => Promise.reject(errors),
        (val) => Promise.resolve(val)
    );
}
exports.raceToSuccess = raceToSuccess;
