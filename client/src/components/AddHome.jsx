import { useEffect, useState } from "react";
import "./AddHome.css";

const AddHome = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        // Check if the website is already installed
        const isInstalled = localStorage.getItem("pwaInstalled");

        // Listen for the beforeinstallprompt event
        window.addEventListener("beforeinstallprompt", (event) => {
            event.preventDefault(); // Prevent auto prompt
            setDeferredPrompt(event);

            // Show alert if not installed
            if (!isInstalled) {
                setTimeout(() => {
                    setShowInstallPrompt(true);
                }, 5000);
            }
        });

        // Check if user has already installed the app
        window.addEventListener("appinstalled", () => {
            localStorage.setItem("pwaInstalled", "true");
            setShowInstallPrompt(false);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", () => { });
            window.removeEventListener("appinstalled", () => { });
        };
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Show install prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    localStorage.setItem("pwaInstalled", "true");
                }
                setShowInstallPrompt(false);
            });
        }
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        localStorage.setItem("pwaInstalled", "false");
    };

    return (
        <div>

            {showInstallPrompt && (
                <div className="install-alert">
                    <p>Would you like to add this website to your home screen?</p>
                    <button onClick={handleInstallClick}>Yes</button>
                    <button onClick={handleDismiss}>No</button>
                </div>
            )}
        </div>
    );
};

export default AddHome;
