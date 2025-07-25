import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ICONS } from '../constants';
import Icon from './Icon';
import { UserAd } from '../types';

const MAX_ADS = 5;

const AdDisplay: React.FC<{ ad: UserAd }> = ({ ad }) => {
    const { theme, user, setAdToEdit, setIsAdCreatorModalOpen } = useAppContext();
    const [timeLeft, setTimeLeft] = useState('');
    const isOwner = user?.id === ad.userId;

    useEffect(() => {
        if (!isOwner) return;

        const timer = setInterval(() => {
            const now = Date.now();
            const distance = ad.expiresAt - now;

            if (distance < 0) {
                setTimeLeft("Истекло");
                clearInterval(timer);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft(`${days}д ${hours}ч ${minutes}м`);
        }, 1000);

        return () => clearInterval(timer);
    }, [ad, isOwner]);

    const AdLinkButton = ({ link, text }: { link: string, text: string }) => (
        <a href={link} target="_blank" rel="noopener noreferrer" className={`mt-2 w-full text-center py-2 rounded-lg text-sm font-semibold transition-colors ${theme.colors.accent.replace('text-','bg-')} text-black hover:opacity-90`}>
            {text}
        </a>
    );

    const handleEdit = () => {
        setAdToEdit(ad);
        setIsAdCreatorModalOpen(true);
    };

    return (
        <div className={`p-3 rounded-md ${theme.colors.cardBg}`}>
            {isOwner && (
                <div className="flex justify-between items-center text-xs opacity-60 mb-2">
                    <span>Ваша реклама</span>
                    <span>(осталось: {timeLeft})</span>
                </div>
            )}
            <div className="space-y-2 mb-2">
                {ad.images[0] && <img src={ad.images[0]} alt="Ad image 1" className="rounded w-full aspect-video object-cover" />}
                {ad.images[1] && <img src={ad.images[1]} alt="Ad image 2" className="rounded w-full aspect-video object-cover" />}
            </div>
            <h4 className="font-semibold text-sm">{ad.shortText}</h4>
            <p className="text-xs opacity-70 mt-1 mb-2 whitespace-pre-wrap">{ad.longText}</p>
            {ad.links[0] && <AdLinkButton link={ad.links[0]} text="Ссылка 1" />}
            {ad.links[1] && <AdLinkButton link={ad.links[1]} text="Ссылка 2" />}
            {isOwner && (
                 <button onClick={handleEdit} className={`mt-2 w-full text-center py-2 rounded-lg text-sm font-semibold transition-colors bg-white/10 ${theme.colors.text} hover:bg-white/20 flex items-center justify-center gap-1.5`}>
                    <Icon className="w-4 h-4">{ICONS.edit}</Icon>
                    Редактировать
                </button>
            )}
        </div>
    );
};

const AdPlaceholder: React.FC = () => {
    const { theme, setIsAdPurchaseModalOpen, setIsAdCreatorModalOpen, pendingAdSlot } = useAppContext();
    
    const handleClick = () => {
        if (pendingAdSlot) {
            setIsAdCreatorModalOpen(true);
        } else {
            setIsAdPurchaseModalOpen(true);
        }
    };
    
    return (
        <div className={`p-4 rounded-lg ${theme.colors.cardBg} border-2 border-dashed ${theme.colors.border}`}>
            <h4 className="font-bold text-center">Место для вашей рекламы!</h4>
            <p className="text-xs opacity-70 text-center my-2">Продвигайте свой аккаунт, сайт или проект прямо здесь.</p>
            <button
                onClick={handleClick}
                className={`w-full mt-2 py-2 rounded-lg text-sm font-semibold transition-colors ${theme.colors.accent.replace('text-','bg-')} text-black hover:opacity-90`}
            >
                {pendingAdSlot ? 'Завершить создание' : 'Разместить рекламу'}
            </button>
        </div>
    );
};


const AdFeedPanel: React.FC = () => {
    const { theme, isAdFeedCollapsed, setIsAdFeedCollapsed, userAds, appBlur } = useAppContext();
    const panelWidth = isAdFeedCollapsed ? 'w-10' : 'w-72';
    
    const placeholders = Array(MAX_ADS - userAds.length).fill(0);

    return (
        <aside className={`hidden lg:flex flex-col flex-shrink-0 ${panelWidth} transition-all duration-300 ease-in-out`}>
            <div 
                className={`mt-4 rounded-lg border-2 ${theme.colors.border} ${theme.colors.main}/60 shadow-lg flex flex-col h-full`}
                style={{ backdropFilter: `blur(${appBlur}px)` }}
            >
                <div className="flex items-center p-2 border-b-2 border-dashed border-white/10">
                    <button onClick={() => setIsAdFeedCollapsed(!isAdFeedCollapsed)} className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${theme.colors.text}`}>
                        <Icon className="w-5 h-5">{isAdFeedCollapsed ? ICONS.chevronLeft : ICONS.chevronRight}</Icon>
                    </button>
                    {!isAdFeedCollapsed && (
                        <h3 className={`text-lg font-bold ${theme.colors.accent} flex-grow text-right mr-2`}>Предложения</h3>
                    )}
                </div>
                
                {!isAdFeedCollapsed && (
                    <div className="flex-grow p-3 overflow-y-auto space-y-4 animate-fade-in">
                        {userAds.map(ad => <AdDisplay key={ad.id} ad={ad} />)}
                        {placeholders.map((_, index) => <AdPlaceholder key={index} />)}
                    </div>
                )}
            </div>
        </aside>
    );
};

export default AdFeedPanel;