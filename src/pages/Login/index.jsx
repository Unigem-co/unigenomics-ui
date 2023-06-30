import React, { useState } from 'react';
import Input from '../../components/Input';
import './Login.scss';
import { request } from '../../utils/fetch';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../components/Snackbar/context';

const Login = () => {
    const navigate = useNavigate();
    const [ user, setUser ] = useState({username: '', password: ''});
    const [showPassword, setshowPassword] = useState(false);
	const [snackbar, setSnackbar] = useSnackbar();

    const login = () => {
        request(
			'users/login',
			{ method: 'POST', body: user },
			({ token }) => {
				window.localStorage.setItem('token', token);
                navigate('/', { replace: true });
				setSnackbar({
					show: true,
					message: 'Inicio de sessión exitoso',
					className: 'success',
				});
			},
			error => {
				setSnackbar({
					show: true,
					message: 'Usuario o contraseña invalidos',
					className: 'error',
				});
			},
		);        
    }
	return (
		<div className='login-container'>
			<div className='login-form'>
				<div className='form-icon'>
					<img
						src='https://unigem.co/wp-content/uploads/2014/09/cropped-cropped-logo-unigem.png'
						alt='unigem-logo'
					/>
				</div>
				<div className='form-field'>
					<label>Usuario</label>
					<Input
						value={user?.username}
						onChange={event => setUser({ ...user, username: event.target.value })}
						placeholder='documento de identidad'
					/>
				</div>
				<div className='form-field password'>
					<label>Contraseña</label>
					<Input
						type={showPassword ? null : 'password'}
						value={user?.password}
						onChange={event => setUser({ ...user, password: event.target.value })}
					/>
					<button className='transparent' onClick={() => setshowPassword(!showPassword)}>
						{showPassword ? (
							<i className='bi bi-eye' />
						) : (
							<i className='bi bi-eye-slash' />
						)}
					</button>
				</div>

				<div className='form-options'>
					<button onClick={() => login()} className='primary'>
						Iniciar sesión
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
