import React from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../src/store';
import ErrorBoundary from '../src/components/ErrorBoundary/ErrorBoundary';
import { ThemeProvider } from '../src/context/ThemeContext';
import '../src/styles/index.css';
import '../src/styles/theme.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <ErrorBoundary>
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