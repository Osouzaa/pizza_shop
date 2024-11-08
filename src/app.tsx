import { Helmet, HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";

import { Toaster } from "sonner";
import { Router } from "./routes";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme/theme-provider";
import "./index.css";
import { queryClient } from "./lib/react-query";

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey="pizzashop-theme" defaultTheme="dark">
        <Toaster richColors />
        <Helmet titleTemplate="%s | pizza.shop" />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={Router} />;
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
