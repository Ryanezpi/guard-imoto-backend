const PubNub = require('pubnub');

const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  uuid: 'guardimoto-server',
});

// Log connection status
pubnub.addListener({
  status: function (statusEvent) {
    const category = statusEvent.category;
    if (category === 'PNConnectedCategory' || category === 'PNNetworkUpCategory') {
      console.info(`✅ PubNub connected (category: ${category})`);
    } else {
      console.debug('PubNub status:', category);
    }
  },
  message: function (msg) {
    console.log('📡 PubNub message received:', msg.message);
  },
});

// 👇 Add this to actually connect
pubnub.subscribe({ channels: ['server-status'] });

module.exports = pubnub;
