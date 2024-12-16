import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'; // ChakraProvider from Chakra UI
import { defaultSystem } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
<ChakraProvider value={defaultSystem}>  {/* No need to pass a theme if you're using default */}
      <App />
    </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
