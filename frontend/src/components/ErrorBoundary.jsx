import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props){
        super(props);
        this.state = {hasError: false, error: null, errorInfo: null};
    }


    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error(`Error caught by ErrorBoundary: ${error}, ${errorInfo}`);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render(){
        if(this.state.hasError){
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
                <div className="flex justify-center mb-6">
                <div className="bg-red-100 p-4 rounded-full">
                    <svg 
                    className="w-12 h-12 text-red-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                    />
                    </svg>
                </div>
                </div>
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Oops! Something went wrong.
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    The application encountered an unexpected error. Please try reloading the page.
                </p>
                {this.state.error && (
                    <details className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                        Ver detalles del error (modo desarrollo)
                        </summary>
                        <div className="mt-4 space-y-2">
                        <div className="text-sm">
                            <strong className="text-red-600">Error:</strong>
                            <pre className="mt-2 p-3 bg-red-50 rounded text-red-800 overflow-x-auto">
                            {this.state.error.toString()}
                            </pre>
                        </div>
                        {this.state.errorInfo && (
                            <div className="text-sm">
                            <strong className="text-red-600">Stack trace:</strong>
                            <pre className="mt-2 p-3 bg-red-50 rounded text-red-800 overflow-x-auto text-xs">
                                {this.state.errorInfo.componentStack}
                            </pre>
                            </div>
                        )}
                        </div>
                    </details>
                )}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={this.handleReset}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                font-medium transition duration-200"
                    >
                        Try again
                    </button>
                    
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 
                                font-medium transition duration-200"
                    >
                        Go to the beginning
                    </button>
                </div>
            </div>
        </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary