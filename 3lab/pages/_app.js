import "../styles/globals.scss";
import { Provider } from "urql";
import { Client, defaultExchanges, subscriptionExchange } from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";
var WebSocketClient = require("websocket").client;

const subscriptionClient = new SubscriptionClient(
  process.env.SECURE_DATABASE_LINK,
  { reconnect: true },
  WebSocketClient
);

const client = new Client({
  url: process.env.DATABASE_LINK,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
