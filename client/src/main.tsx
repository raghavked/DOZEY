import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "./lib/i18n";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      gcTime: 1000 * 60 * 30,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <App />
    </I18nProvider>
  </QueryClientProvider>
);
