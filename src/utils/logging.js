export function logPubNub(message, colorCode = '\x1b[36m') {
  console.log(`[\x1b[35mPUBNUB\x1b[0m  ] ${colorCode}${message}\x1b[0m`);
}
export default logPubNub;