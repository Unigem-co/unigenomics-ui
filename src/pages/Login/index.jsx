import React, { useState } from 'react';
import Input from '../../components/Input';
import './Login.scss';
import { request } from '../../utils/fetch';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../components/Snackbar/context';
import Loading from '../../components/Loading';

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [, setSnackbar] = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission
        if (!user.username || !user.password) {
            setSnackbar({
                show: true,
                message: 'Por favor ingrese usuario y contraseña',
                className: 'error',
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await request('users/login', {
                method: 'POST',
                body: user,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response && response.token) {
                window.localStorage.setItem('token', response.token);
                setSnackbar({
                    show: true,
                    message: 'Inicio de sesión exitoso',
                    className: 'success',
                });
                navigate('/', { replace: true });
            } else {
                throw new Error('Token no recibido');
            }
        } catch (error) {
            console.error('Login error:', error);
            setSnackbar({
                show: true,
                message: error.message || 'Usuario o contraseña inválidos',
                className: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className='login-container'>
            {isLoading && <Loading />}
            <form className='login-form' onSubmit={handleSubmit}>
                <div className='form-icon'>
                    <img
                        src='https://unigem.co/wp-content/uploads/2014/09/cropped-cropped-logo-unigem.png'
                        alt='unigem-logo'
                    />
                </div>
                <div className='form-field'>
                    <label>Usuario</label>
                    <Input
                        value={user.username}
                        onChange={event => setUser({ ...user, username: event.target.value })}
                        placeholder='documento de identidad'
                        onKeyPress={handleKeyPress}
                        required
                    />
                </div>
                <div className='form-field password'>
                    <label>Contraseña</label>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        value={user.password}
                        onChange={event => setUser({ ...user, password: event.target.value })}
                        onKeyPress={handleKeyPress}
                        required
                    />
                    <button 
                        type="button"
                        className='transparent' 
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <i className={`bi bi-eye${showPassword ? '' : '-slash'}`} />
                    </button>
                </div>

                <div className='form-options'>
                    <button type="submit" className='primary'>
                        Iniciar sesión
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
