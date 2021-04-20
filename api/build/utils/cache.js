"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleCache = void 0;
class SimpleCache {
    /**
     * A new SimpleCache object
     *
     * @param maxDuration - The duration to keep cached values in minutes
     * @returns A new SimpleCache object
     */
    constructor(maxDuration) {
        this.data = {};
        this.maxDuration = maxDuration;
    }
    get(key) {
        const data = this.data[key];
        if (data) {
            data.timestamp = Date.now();
        }
        return data === null || data === void 0 ? void 0 : data.value;
    }
    set(key, value) {
        this.data[key] = { timestamp: Date.now(), value };
    }
    empty() {
        const limit = Date.now() - this.maxDuration * 60000;
        for (const [key, value] of Object.entries(this.data)) {
            if (value.timestamp < limit) {
                delete this.data[key];
            }
        }
    }
}
exports.SimpleCache = SimpleCache;
