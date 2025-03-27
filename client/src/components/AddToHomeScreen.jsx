import { useEffect, useState } from "react";

const AddToHomeScreen = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const isInstalled = localStorage.getItem("pwaInstalled");

        // Debugging - Check if the app is already installed
        console.log("App Installed Status:", isInstalled);

        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault(); // Prevent auto-prompt
            setDeferredPrompt(event);

            console.log("Before Install Prompt event fired");

            if (!isInstalled) {
                setShowPrompt(true);
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        window.addEventListener("appinstalled", () => {
            console.log("App installed!");
            localStorage.setItem("pwaInstalled", "true");
            setShowPrompt(false);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("User accepted the install prompt");
                    localStorage.setItem("pwaInstalled", "true");
                } else {
                    console.log("User dismissed the install prompt");
                }
                setShowPrompt(false);
            });
        }
    };

    const handleDismiss = () => {
        console.log("User dismissed the add-to-home prompt");
        setShowPrompt(false);
    };

    return (
        <>
            {showPrompt && (
                <div className="fixed bottom-4 left-4 right-4 bg-white p-4 rounded shadow-lg flex flex-col items-center">
                    <p className="text-lg font-semibold">Add this website to your Home Screen?</p>
                    <div className="flex gap-4 mt-3">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleInstall}>
                            Yes
                        </button>
                        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleDismiss}>
                            No
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddToHomeScreen;
