import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import Icon from './Icon';
import { ICONS } from '../constants';

const Auth: React.FC = () => {
    const { login, loginAsGuest } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Пожалуйста, заполните все поля.');
            return;
        }
        const success = login(email, password);
        if (!success) {
            setError('Неверные учетные данные. Попробуйте снова.');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-md flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fade-in text-gray-800">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Авторизация и вход</h1>
                    <p className="text-gray-500 mt-2">Войдите, чтобы продолжить</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                         <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
                         <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500 hover:text-indigo-600"
                                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                            >
                                <Icon className="w-5 h-5">{showPassword ? ICONS.eyeSlash : ICONS.eye}</Icon>
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 shadow-lg">
                        Войти
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-4 text-gray-500 text-sm">Или</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                <button onClick={loginAsGuest} className="w-full bg-indigo-100 text-indigo-700 font-bold py-3 px-4 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                    <span className="flex items-center justify-center gap-2">
                        <Icon className="w-5 h-5">{ICONS.profile}</Icon>
                        Войти как гость
                    </span>
                </button>
                
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        Нет аккаунта?{' '}
                        <a href="#" onClick={(e) => { e.preventDefault(); alert('Функция регистрации в разработке!'); }} className="font-semibold text-indigo-600 hover:underline">
                            Зарегистрироваться
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
