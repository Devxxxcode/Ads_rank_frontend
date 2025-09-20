import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'white' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
        xl: 'h-8 w-8'
    };

    const colorClasses = {
        white: 'border-white',
        gray: 'border-gray-500',
        red: 'border-red-500',
        blue: 'border-blue-500'
    };

    return (
        <div 
            className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;
