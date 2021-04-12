const Pusher = require('pusher');

const {
    PUSHER_APP_ID: appId,
    PUSHER_KEY: key,
    PUSHER_SECRET: secret,
    PUSHER_CLUSTER: cluster
} = process.env;

const pusher = new Pusher({
    appId,
    key,
    secret,
    cluster
});

export const publish = (eventChannel, eventName, data) => {
    pusher.trigger(eventChannel, eventName, data);
};
