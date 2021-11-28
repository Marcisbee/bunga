import * as React from 'react';

import { cc } from '../../utils/class-names';

import style from './error-boundary.module.scss';

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: null | Error;
}

export class ErrorBoundary extends React.Component<{
  className?: string;
}> {
  public state: ErrorBoundaryState = {
    hasError: false,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      errorInfo: error,
    };
  }

  public render() {
    const { className, children } = this.props;
    const { hasError, errorInfo } = this.state;

    if (hasError) {
      return (
        <div
          className={cc([
            style.error,
            className,
          ])}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 1l-12 22h24l-12-22zm-1 8h2v7h-2v-7zm1 11.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" /></svg>
          <h3>Something went wrong.</h3>
          <pre>{errorInfo?.message}</pre>
        </div>
      );
    }

    return children;
  }
}
