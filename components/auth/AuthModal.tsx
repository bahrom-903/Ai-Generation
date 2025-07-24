import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../Button';
import Icon from '../Icon';
import { Icons } from '../../constants';
import Modal from './Modal';

const AuthModal: React.FC = () => {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <Modal title={isLoginView ? 'Вход' : 'Регистрация'} show>
             <div className="mb-4 border-b border-white/10">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button
                        onClick={() => setIsLoginView(true)}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${isLoginView ? 'border-fuchsia-400 text-fuchsia-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                    >
                        Вход
                    </button>
                    <button
                        onClick={() => setIsLoginView(false)}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${!isLoginView ? 'border-fuchsia-400 text-fuchsia-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}
                    >
                        Регистрация
                    </button>
                </nav>
            </div>
            {isLoginView ? <LoginForm /> : <RegisterForm />}
        </Modal>
    );
};

const LoginForm: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <InputField type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" required />
            <Button type="submit" variant="primary" className="w-full">Войти</Button>
        </form>
    );
};

const RegisterForm: React.FC = () => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register(name, email, password);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField value={name} onChange={e => setName(e.target.value)} placeholder="Имя" required />
            <InputField type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <InputField type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" required />
            <Button type="submit" variant="primary" className="w-full">Создать аккаунт</Button>
        </form>
    );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
    const { theme } = useAppContext();
    return (
        <input
            {...props}
            className={`w-full p-3 rounded-md border ${theme.colors.border} ${theme.colors.inputBg} ${theme.colors.text} focus:ring-2 focus:ring-fuchsia-500 focus:outline-none transition-all`}
        />
    );
};

export default AuthModal;
