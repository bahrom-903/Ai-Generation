import React from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Generator from './components/Generator';
import Gallery from './components/Gallery';
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/auth/AuthModal';
import ProfileModal from './components/auth/ProfileModal';
import PurchaseModal from './components/auth/PurchaseModal';

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

const AppModals: React.FC = () => {
    const { modalState } = useAuth();
    
    return (
        <>
            {modalState.auth && <AuthModal />}
            {modalState.profile && <ProfileModal />}
            {modalState.purchase && <PurchaseModal packageToBuy={modalState.purchase} />}
        </>
    )
}

const AppContent: React.FC = () => {
    const { theme, appBackground } = useAppContext();
    return (
        <div className={`min-h-screen ${theme.colors.bg} ${theme.colors.text} transition-colors duration-500 font-sans`}>
            <div 
                className="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-fixed transition-opacity duration-1000"
                style={{
                    backgroundImage: `url(${appBackground || '/backgrounds/cyberpunk.jpg'})`,
                    opacity: appBackground ? 1 : 0.2,
                }}
            ></div>
            <div className="relative z-10 container mx-auto px-4 pb-8">
                <Header />
                <main>
                    <Generator />
                    <Gallery />
                </main>
                <SettingsModal />
                <ImageViewer />
                <AppModals />
            </div>
        </div>
    );
};

const App: React.FC = () => {
  return (
    <AppProvider>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </AppProvider>
  );
};

export default App;