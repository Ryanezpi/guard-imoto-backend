import PubNub from 'pubnub';
import { config } from 'dotenv';
import logPubNub  from './logging.js';

config();

const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  uuid: 'guardimoto-server',
});

// 🔌 Connection and message event handling
pubnub.addListener({
  status: function (statusEvent) {
    const category = statusEvent.category;

    if (category === 'PNConnectedCategory' || category === 'PNNetworkUpCategory') {
      logPubNub(`Connected → category: ${category}`, '\x1b[32m'); // Green
    } else if (category === 'PNNetworkDownCategory') {
      logPubNub(`Network down → category: ${category}`, '\x1b[31m'); // Red
    } else {
      logPubNub(`Status: ${category}`, '\x1b[33m'); // Yellow
    }
  },

  message: function (msg) {
    const payload = typeof msg.message === 'object'
      ? JSON.stringify(msg.message)
      : msg.message;
    logPubNub(`Message received → ${payload}`, '\x1b[36m'); // Cyan
  },
});

// 📡 Connect to the desired channels
pubnub.subscribe({ channels: ['server-status'] });

logPubNub('Initialized and listening on channel: server-status', '\x1b[35m');

export default pubnub;
