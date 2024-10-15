import React from 'react'

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-20">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-flowtech-gradient rounded-full animate-ios-loading"></div>
        <div className="w-3 h-3 bg-flowtech-gradient rounded-full animate-ios-loading animation-delay-200"></div>
        <div className="w-3 h-3 bg-flowtech-gradient rounded-full animate-ios-loading animation-delay-400"></div>
      </div>
    </div>
  )
}

export default LoadingAnimation