import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { NEWS_FEED_DATA } from '../data/feedData';
import { ICONS } from '../constants';
import Icon from './Icon';

const NewsFeedPanel: React.FC = () => {
    const { theme, isNewsFeedCollapsed, setIsNewsFeedCollapsed, appBlur } = useAppContext();
    const panelWidth = isNewsFeedCollapsed ? 'w-10' : 'w-72';

    const categoryColors: { [key: string]: string } = {
        'Обновление': 'bg-blue-500',
        'Сообщество': 'bg-green-500',
        'Событие': 'bg-purple-500',
        'Советы': 'bg-yellow-500',
    };

    return (
        <aside className={`hidden lg:flex flex-col flex-shrink-0 ${panelWidth} transition-all duration-300 ease-in-out`}>
            <div 
                className={`mt-4 rounded-lg border-2 ${theme.colors.border} ${theme.colors.main}/60 shadow-lg flex flex-col h-full`}
                style={{ backdropFilter: `blur(${appBlur}px)` }}
            >
                <div className="flex items-center p-2 border-b-2 border-dashed border-white/10">
                    {!isNewsFeedCollapsed && (
                        <h3 className={`text-lg font-bold ${theme.colors.accent} flex-grow ml-2`}>Новости</h3>
                    )}
                    <button onClick={() => setIsNewsFeedCollapsed(!isNewsFeedCollapsed)} className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${theme.colors.text}`}>
                        <Icon className="w-5 h-5">{isNewsFeedCollapsed ? ICONS.chevronRight : ICONS.chevronLeft}</Icon>
                    </button>
                </div>
                
                {!isNewsFeedCollapsed && (
                    <div className="flex-grow p-3 overflow-y-auto space-y-4 animate-fade-in">
                        {NEWS_FEED_DATA.map(item => (
                            <div key={item.id} className={`p-3 rounded-md ${theme.colors.cardBg} border-l-4 ${theme.colors.border}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`px-2 py-0.5 text-xs font-semibold text-white rounded-full ${categoryColors[item.category] || 'bg-gray-500'}`}>{item.category}</span>
                                    <span className="text-xs opacity-50">{item.date}</span>
                                </div>
                                <h4 className="font-semibold">{item.title}</h4>
                                <p className="text-sm opacity-70">{item.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
};

export default NewsFeedPanel;