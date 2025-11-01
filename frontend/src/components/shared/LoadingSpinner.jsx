export function LoadingSpinner({ 
    size = 'md',
    color = 'blue',
    fullScreen = false,
    inline = false,
    children  // ← Nuevo: para texto como children
}) {
    const sizeClasses = {
        xs: 'h-4 w-4 border-2',
        sm: 'h-8 w-8 border-2',
        md: 'h-12 w-12 border-3',
        lg: 'h-16 w-16 border-4',
        xl: 'h-24 w-24 border-4'
    };

    const colorClasses = {
        blue: 'border-blue-600',
        green: 'border-green-600',
        red: 'border-red-600',
        purple: 'border-purple-600',
        gray: 'border-gray-600',
        white: 'border-white'
    };

    const spinner = (
        <div className={`flex ${inline ? 'inline-flex' : 'flex-col'} items-center justify-center ${inline ? '' : 'gap-3'}`}>
            <div 
                className={`
                    animate-spin rounded-full 
                    border-t-transparent
                    ${sizeClasses[size]} 
                    ${colorClasses[color]}
                `}
                role="status"
                aria-label="Loading"
            />
            {children && !inline && (
                <p className="text-sm text-gray-600 font-medium">
                    {children}
                </p>
            )}
            <span className="sr-only">Loading...</span>
        </div>
    );

    // Full screen overlay
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    // Inline spinner (para botones)
    if (inline) {
        return spinner;
    }

    // Normal inline spinner
    return (
        <div className="flex items-center justify-center py-12">
            {spinner}
        </div>
    );
}

export default LoadingSpinner;