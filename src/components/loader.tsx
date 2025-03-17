import React from 'react';
import { LockIcon } from 'lucide-react';

// Props interface with TypeScript typing
interface AuthLoaderProps {
  /** Optional custom message to display during authentication */
  message?: string;
  /** Optional custom status label */
  statusLabel?: string;
  /** Whether to show the secure badge */
  showSecureBadge?: boolean;
}

const FlowtecAuthLoader = ({
  message = "Verificando suas credenciais...",
  statusLabel = "Autenticando...",
  showSecureBadge = false,
}: AuthLoaderProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-10 ">
        {/* Header with logo */}

        
        {/* Loader animation and status */}
        <div className="flex flex-col items-center justify-center my-8">
          {/* Circular loader */}
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 animate-spin" viewBox="0 0 50 50">
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                className="stroke-white-800"
                strokeWidth="3"
                strokeDasharray="80"
                strokeDashoffset="80"
              />
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                className="stroke-blue-500"
                strokeWidth="3"
                strokeDasharray="80"
                strokeDashoffset="140"
              />
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                className="stroke-green-400"
                strokeWidth="3"
                strokeDasharray="40"
                strokeDashoffset="30"
              />
            </svg>
          </div>
          
          {/* Status text */}
          <div className="mt-6 text-sm font-medium text-black opacity-90">{statusLabel}</div>
          <div className="mt-2 text-xs text-zinc-400">{message}</div>
        </div>
        
        {/* Secure badge */}
        {showSecureBadge && (
          <div className="flex items-center justify-center mt-6 text-xs text-zinc-500 gap-2">
            <LockIcon size={12} />
            SECURE CONNECTION
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowtecAuthLoader;