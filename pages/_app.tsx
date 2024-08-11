import React from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../src/store';
import ErrorBoundary from '../src/components/ErrorBoundary/ErrorBoundary';
import { ThemeProvider } from '../src/context/ThemeContext';
import '../src/styles/index.css';
import '../src/styles/theme.css';

interface MyAppProps extends AppProps {
  pageProps: {
    errorMessage?: string | null;
    [key: string]: string; // Allow other properties in pageProps
  };
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const errorMessage = pageProps?.errorMessage || null;

  return (
    <React.StrictMode>
      <ErrorBoundary errorMessage={errorMessage}>
        <Provider store={store}>
          <ThemeProvider>
            <Component {...pageProps} />
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default MyApp;
