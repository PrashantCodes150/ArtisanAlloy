import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });

        // Log to error tracking service in production
        console.error('Error caught by boundary:', error, errorInfo);

        // You can send to services like Sentry here
        // Sentry.captureException(error, { extra: errorInfo });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center px-4 bg-jewelry-dark">
                    <div className="max-w-md w-full glass rounded-3xl p-8 text-center">
                        {/* Error Icon */}
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-400" />
                        </div>

                        {/* Error Title */}
                        <h1 className="font-display text-2xl font-bold text-jewelry-cream mb-2">
                            Oops! Something went wrong
                        </h1>

                        {/* Error Message */}
                        <p className="font-sans text-jewelry-cream/70 mb-6">
                            We're sorry for the inconvenience. Please try refreshing the page or go back to the homepage.
                        </p>

                        {/* Error Details (only in development) */}
                        {typeof process !== 'undefined' && typeof process.env !== 'undefined' && process.env?.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-6 p-4 bg-red-500/10 rounded-lg text-left">
                                <p className="text-xs text-red-400 font-mono break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>

                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans font-semibold hover:bg-jewelry-gold/10 transition-all"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </Link>
                        </div>

                        {/* Support Contact */}
                        <p className="mt-8 text-xs text-jewelry-cream/50">
                            If the problem persists, please contact{' '}
                            <a
                                href="mailto:support@f-jewelry.com"
                                className="text-jewelry-gold hover:underline"
                            >
                                support@f-jewelry.com
                            </a>
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
) => {
    return function WithErrorBoundaryWrapper(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
};

export default ErrorBoundary;
