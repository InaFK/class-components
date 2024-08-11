import React, { Component } from 'react';
import styles from './ErrorBoundary.module.css';

type ErrorBoundaryProps = {
  children: React.ReactNode;
  errorMessage?: string | null;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (
      prevProps.errorMessage !== this.props.errorMessage &&
      this.props.errorMessage
    ) {
      this.setState({ hasError: true });
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className={styles['error']}>
          <h1 className={styles['error-text']}>Something went wrong.</h1>
          <p className={styles['error-text']}>
            Let&apos;s try to reload the page.
          </p>
          <button
            type="button"
            className={styles['button-reload']}
            onClick={() => {
              window.location.reload();
            }}
          >
            Reload
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
