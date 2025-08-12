import React from 'react'

const LoadingSpinner = ({ size = 'default', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-16 h-16',
    large: 'w-24 h-24'
  }

  const textSizes = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Primary spinner */}
        <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}></div>
        
        {/* Secondary spinner with delay */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-accent-500 rounded-full animate-spin animation-delay-200`}></div>
      </div>
      
      {text && (
        <p className={`mt-4 text-secondary-600 font-medium ${textSizes[size]}`}>
          {text}
        </p>
      )}
      
      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  )
}

export default LoadingSpinner
