import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./App.css";

// Create root once and store the reference
const rootElement = document.getElementById("root");
let root;

// Only create root once
if (rootElement && !rootElement.hasAttribute("data-react-mounted")) {
  root = createRoot(rootElement);
  rootElement.setAttribute("data-react-mounted", "true");
} else if (rootElement) {
  console.warn("Root element already has React mounted. Using existing root.");
}

// Render the app
if (root) {
  root.render(<App />);
}

// Register the service worker for offline capability
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Delay service worker registration to ensure page is loaded first
    setTimeout(() => {
      navigator.serviceWorker.register("/service-worker.js")
        .then(registration => {
          console.log("Service Worker registered with scope:", registration.scope);
          
          // Check for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    console.log("New content is available; please refresh.");
                    // Optional: Show a notification to the user
                    if (window.confirm("New version of the app is available. Reload now?")) {
                      window.location.reload();
                    }
                  } else {
                    console.log("Content is cached for offline use.");
                  }
                }
              };
            }
          };
        })
        .catch(error => {
          console.error("Service Worker registration failed:", error);
        });
        
      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener("message", event => {
        if (event.data && event.data.type === "SYNC_COMPLETED") {
          console.log(`Synced ${event.data.resultsCount} quiz results`);
          // Optional: Show a notification to the user
        }
      });
    }, 1000); // Wait 1 second to ensure app is rendered first
  });
}

// Function to request background sync
export function requestBackgroundSync() {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then(registration => {
      // Use type assertion for sync registration since TypeScript doesn't know about it
      const syncManager = registration.sync;
      
      if (syncManager) {
        syncManager.register("sync-quiz-results")
          .then(() => {
            console.log("Background sync registered!");
          })
          .catch((err) => {
            console.error("Background sync registration failed:", err);
          });
      } else {
        console.log("SyncManager not available in this browser");
        manualSync();
      }
    });
  } else {
    console.log("Background sync not supported");
    manualSync();
  }
}

// Fallback function for browsers without sync support
function manualSync() {
  fetch("/api/quiz-results/sync")
    .then(response => {
      if (response.ok) {
        console.log("Manual sync completed");
      }
    })
    .catch((err) => {
      console.error("Manual sync failed:", err);
    });
}
