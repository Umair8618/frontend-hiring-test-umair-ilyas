import { getToken, refreshAccessToken } from "@/lib/auth";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
  from,
  Observable,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { fromPromise } from "@apollo/client";

// HTTP Link
const httpLink = createHttpLink({
  uri: "https://frontend-test-api.aircall.dev/graphql",
});

// WebSocket Link (for subscriptions)
const wsLink =
  typeof window !== "undefined"
    ? new WebSocketLink({
        uri: "wss://frontend-test-api.aircall.dev/graphql",
        options: {
          reconnect: true,
          connectionParams: () => ({
            Authorization: `Bearer ${getToken()}`,
          }),
        },
      })
    : null;

// Auth middleware: attach token to headers
const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error handling for token expiration
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        return fromPromise(refreshAccessToken()).flatMap((newToken) => {
          if (newToken) {
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              },
            }));
            return forward(operation);
          } else {
            window.location.href = "/login";
            return new Observable(() => {}); // prevent crash
          }
        });
      }
    }
  }
});

// Split for subscriptions vs query/mutation
const splitLink =
  typeof window !== "undefined" && wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        from([errorLink, authLink.concat(httpLink)])
      )
    : from([errorLink, authLink.concat(httpLink)]);

// Final Apollo Client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
