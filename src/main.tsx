import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { theme } from "./theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCKS !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser");
  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <ModalsProvider>
            <App />
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
