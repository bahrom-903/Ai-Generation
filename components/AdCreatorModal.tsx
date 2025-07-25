import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Icon from './Icon';
import { ICONS } from '../constants';

const AdCreatorModal: React.FC = () => {
    const { setIsAdCreatorModalOpen, saveUserAd, updateUserAd, selectedAdOption, adToEdit, setAdToEdit } = useAppContext();
    
    const [images, setImages] = useState<[string | null, string | null]>([null, null]);
    const [links, setLinks] = useState<[string, string]>(['', '']);
    const [shortText, setShortText] = useState('');
    const [longText, setLongText] = useState('');
    const fileInputRef1 = useRef<HTMLInputElement>(null);
    const fileInputRef2 = useRef<HTMLInputElement>(null);

    const isEditing = !!adToEdit;

    useEffect(() => {
        if (isEditing) {
            setImages(adToEdit.images);
            setLinks(adToEdit.links);
            setShortText(adToEdit.shortText);
            setLongText(adToEdit.longText);
        }
    }, [adToEdit, isEditing]);
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newImages = [...images] as [string | null, string | null];
                newImages[index] = event.target?.result as string;
                setImages(newImages);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClose = () => {
        setIsAdCreatorModalOpen(false);
        setAdToEdit(null); // Clear ad being edited on close
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!images[0] && !images[1]) {
            alert("Пожалуйста, загрузите хотя бы одно изображение.");
            return;
        }
        if (!shortText.trim()) {
            alert("Пожалуйста, введите короткий текст.");
            return;
        }

        if (isEditing) {
            const updatedAd = { ...adToEdit, images, links, shortText, longText };
            updateUserAd(updatedAd);
            alert("Ваша реклама успешно обновлена!");
        } else {
            if (!selectedAdOption) {
                alert("Ошибка: не выбрана опция покупки.");
                return;
            }
            saveUserAd({ images, links, shortText, longText }, selectedAdOption.durationDays);
            alert("Ваша реклама успешно создана и размещена!");
        }
        
        handleClose();
    };

    const modalBg = "bg-gray-100 dark:bg-gray-800";
    const modalText = "text-gray-800 dark:text-gray-200";
    const inputBg = "bg-gray-200 dark:bg-gray-900/50";
    const border = "border-gray-300 dark:border-gray-600";
    
    const ImageUploader = ({ index }: { index: 0 | 1}) => (
        <div 
            onClick={() => (index === 0 ? fileInputRef1 : fileInputRef2).current?.click()}
            className={`aspect-video w-full rounded-lg border-2 border-dashed ${border} flex items-center justify-center cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all bg-cover bg-center`}
            style={{ backgroundImage: `url(${images[index] || ''})` }}
        >
            {!images[index] && (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <Icon className="w-10 h-10 mx-auto opacity-50">{ICONS.upload}</Icon>
                    <p className="mt-1 text-sm">Изображение {index + 1}</p>
                </div>
            )}
            <input type="file" ref={index === 0 ? fileInputRef1 : fileInputRef2} onChange={(e) => handleImageUpload(e, index)} className="hidden" accept="image/*" />
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 font-sans" onClick={handleClose}>
             <div className={`w-full max-w-3xl ${modalBg} rounded-2xl shadow-2xl relative animate-fade-in flex flex-col`} style={{maxHeight: '90vh'}} onClick={(e) => e.stopPropagation()}>
                <header className={`flex items-center justify-between p-4 border-b ${border}`}>
                    <h2 className={`text-xl font-bold ${modalText}`}>{isEditing ? 'Редактирование рекламы' : 'Создание рекламы'}</h2>
                    <button onClick={handleClose} className={`${modalText} opacity-50 hover:opacity-100 transition-colors`}>
                        <Icon className="w-7 h-7">{ICONS.close}</Icon>
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <ImageUploader index={0} />
                       <ImageUploader index={1} />
                    </div>
                     <div>
                        <label className={`block text-sm font-medium ${modalText} mb-1`}>Короткий текст (заголовок)</label>
                        <input
                            type="text"
                            value={shortText}
                            onChange={(e) => setShortText(e.target.value)}
                            maxLength={150}
                            className={`w-full p-2 ${inputBg} border ${border} rounded-md`}
                            required
                        />
                         <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">{shortText.length} / 150</p>
                    </div>
                     <div>
                        <label className={`block text-sm font-medium ${modalText} mb-1`}>Длинный текст (описание)</label>
                        <textarea
                            value={longText}
                            onChange={(e) => setLongText(e.target.value)}
                            maxLength={600}
                            rows={4}
                            className={`w-full p-2 ${inputBg} border ${border} rounded-md`}
                        />
                        <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">{longText.length} / 600</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium ${modalText} mb-1`}>Ссылка #1</label>
                            <input
                                type="url"
                                placeholder="https://example.com"
                                value={links[0]}
                                onChange={(e) => setLinks([e.target.value, links[1]])}
                                className={`w-full p-2 ${inputBg} border ${border} rounded-md`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium ${modalText} mb-1`}>Ссылка #2</label>
                            <input
                                type="url"
                                placeholder="https://example.com"
                                value={links[1]}
                                onChange={(e) => setLinks([links[0], e.target.value])}
                                className={`w-full p-2 ${inputBg} border ${border} rounded-md`}
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 shadow-lg">
                        {isEditing ? 'Сохранить изменения' : 'Сохранить и опубликовать'}
                    </button>
                </form>
             </div>
        </div>
    )
}

export default AdCreatorModal;
