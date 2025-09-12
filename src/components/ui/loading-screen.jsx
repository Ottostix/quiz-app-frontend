import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingScreen({ 
  message = "Loading...", 
  fullScreen = true 
}) {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'h-screen' : 'h-60'} p-4 bg-background/80`}>
      <div className="flex flex-col items-center space-y-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-foreground">{message}</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we prepare your content
          </p>
        </div>
      </div>
    </div>
  );
}

export function LoadingIndicator({ size = "md" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
  );
}

