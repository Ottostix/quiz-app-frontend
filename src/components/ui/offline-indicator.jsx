import React, { useState, useEffect } from "react";
import { CloudOff, Wifi, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { Alert, AlertDescription, AlertTitle } from "./alert";

export function OfflineIndicator({
  position = "bottom",
  showRefresh = true,
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  
  if (isOnline) return null;
  
  const positionClasses = {
    top: "top-4",
    bottom: "bottom-4",
  };
  
  return (
    <div className={`fixed ${positionClasses[position]} right-4 z-50 max-w-sm`}>
      <Alert className="border-yellow-500 bg-yellow-900/90 text-white shadow-lg">
        <CloudOff className="h-4 w-4" />
        <AlertTitle className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
          Offline Mode
        </AlertTitle>
        <AlertDescription>
          <p className="text-sm">Some features may be limited while you're offline.</p>
          {showRefresh && (
            <Button 
              variant="outline" 
              size="sm"
              className="mt-2 bg-yellow-800 border-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-1"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-3 w-3" /> Try reconnecting
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  
  if (isOnline) return null;
  
  return (
    <div className="bg-yellow-600 text-white px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center gap-2">
        <CloudOff className="h-3 w-3" />
        <span>You are currently offline. Some features may not be available.</span>
      </div>
    </div>
  );
}

