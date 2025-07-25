import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Header from './components/Header';
import Generator from './components/Generator';
import Gallery from './components/Gallery';
import SettingsModal from './components/SettingsModal';
import Auth from './components/Auth';
import ProfileModal from './components/ProfileModal';
import NewsFeedPanel from './components/NewsFeedPanel';
import AdFeedPanel from './components/AdFeedPanel';
import AdPurchaseModal from './components/AdPurchaseModal';
import AdCreatorModal from './components/AdCreatorModal';
import GamesModal from './components/GamesModal';
import TrialExpiredModal from './components/TrialExpiredModal';


const ImageViewer: React.FC = () => {
    const { viewerSrc, setViewerSrc, theme } = useAppContext();

    if (!viewerSrc) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] animate-fade-in"
            onDoubleClick={() => setViewerSrc(null)}
        >
            <img src={viewerSrc} alt="Просмотр изображения" className="max-w-[95vw] max-h-[95vh] rounded-lg shadow-2xl" style={{boxShadow: `0 0 30px ${theme.colors.accentGlow}`}}/>
        </div>
    );
}

const AppContent: React.FC = () => {
    const { theme, appBackground, isAuthenticated, isProfileOpen, isAdPurchaseModalOpen, isAdCreatorModalOpen, isGamesModalOpen, isTrialExpiredModalOpen } = useAppContext();

    if (!isAuthenticated) {
        return <Auth />;
    }

    return (
        <div className={`min-h-screen ${theme.colors.bg} ${theme.colors.text} transition-colors duration-500 font-sans`}>
            <div 
                className="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-fixed transition-opacity duration-1000"
                style={{
                    backgroundImage: `url(${appBackground})`,
                    opacity: appBackground ? 1 : 0.2,
                }}
            ></div>
            <div className="relative z-10 flex justify-center gap-4 px-2 md:px-4">
                <NewsFeedPanel />
                <div className="flex-grow max-w-7xl min-w-0"> {/* min-w-0 prevents flexbox blowout */}
                    <Header />
                    <main>
                        <Generator />
                        <Gallery />
                    </main>
                </div>
                 <AdFeedPanel />
            </div>

            {/* Modals are kept at the top level */}
            <SettingsModal />
            <ImageViewer />
            {isProfileOpen && <ProfileModal />}
            {isAdPurchaseModalOpen && <AdPurchaseModal />}
            {isAdCreatorModalOpen && <AdCreatorModal />}
            {isGamesModalOpen && <GamesModal />}
            {isTrialExpiredModalOpen && <TrialExpiredModal />}
        </div>
    );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;