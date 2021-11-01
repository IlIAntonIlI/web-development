import "../styles/globals.scss";
import { Provider } from "urql";
import { Client, defaultExchanges, subscriptionExchange } from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";
//import WebSocketClient from ("websocket").client;

const subscriptionClient = new SubscriptionClient(
  "ws://web-kpi-lab3.herokuapp.com/v1/graphql",
  { reconnect: true },
  //WebSocketClient
);

const client = new Client({
  url: "https://web-kpi-lab3.herokuapp.com/v1/graphql",
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
