import React, { useEffect, useState } from 'react';
import './App.css';

/**
 * Main application component
 * Hello World implementation for testing cross-platform compatibility
 */
const App: React.FC = () => {
    const [version, setVersion] = useState<string>('Loading...');
    const [platform, setPlatform] = useState<string>('Loading...');
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        // Set initial time immediately
        setCurrentTime(new Date().toLocaleString());
        // Get application version and platform info
        const getAppInfo = async () => {
            try {
                const appVersion = await window.electronAPI.getVersion();
                const appPlatform = await window.electronAPI.getPlatform();
                setVersion(appVersion);
                setPlatform(appPlatform);
            } catch (error) {
                console.error('Failed to get app info:', error);
                setVersion('Error');
                setPlatform('Error');
            }
        };

        getAppInfo();

        // Update current time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleQuit = async () => {
        try {
            await window.electronAPI.quit();
        } catch (error) {
            console.error('Failed to quit app:', error);
        }
    };

    return (
        <div className={`app ${platform}`}>
            <header className="app-header">
                <h1>🗒️ Noter</h1>
                <p className="subtitle">Cross-Platform Note Taking App</p>
            </header>

            <main className="app-main">
                <div className="welcome-card">
                    <h2>Hello World! 👋</h2>
                    <p>Welcome to Noter - Your cross-platform note-taking companion</p>

                    <div className="info-grid">
                        <div className="info-item">
                            <strong>Version:</strong>
                            <span>{version}</span>
                        </div>

                        <div className="info-item">
                            <strong>Platform:</strong>
                            <span>{platform}</span>
                        </div>

                        <div className="info-item">
                            <strong>Current Time:</strong>
                            <span>{currentTime}</span>
                        </div>
                    </div>

                    <div className="feature-list">
                        <h3>Coming Soon:</h3>
                        <ul>
                            <li>✅ Offline note storage</li>
                            <li>✅ Folder organization</li>
                            <li>✅ Markdown support</li>
                            <li>✅ Live preview</li>
                            <li>✅ Auto-save</li>
                            <li>✅ Cross-platform compatibility</li>
                        </ul>
                    </div>

                    <button className="quit-button" onClick={handleQuit}>
                        Quit Application
                    </button>
                </div>
            </main>

            <footer className="app-footer">
                <p>Built with ❤️ using Electron, React, and TypeScript</p>
            </footer>
        </div>
    );
};

export default App;
