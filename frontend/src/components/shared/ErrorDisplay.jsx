import Button from './Button';

export function ErrorDisplay({ message, onRetry }) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
                Something went wrong
            </h3>
            <p className="text-red-600 mb-4">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="primary">
                    Try Again
                </Button>
            )}
        </div>
    );
}

export default ErrorDisplay;
