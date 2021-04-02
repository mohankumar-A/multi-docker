const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

redisClient.on("error", (e) => {
    console.log(e);
});

const sub = redisClient.duplicate();

// this very slow solution
function fib(index) {
    if (index < 2) return index;
    return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
    console.log(message);
    redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');