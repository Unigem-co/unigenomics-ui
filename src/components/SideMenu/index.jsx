import React, { useState } from 'react';
import SideMenuOption from './SideMenuOption';
import Spacer from './Spacer';
import { useNavigate } from 'react-router-dom';
import './SideMenu.scss';
import { useSnackbar } from '../Snackbar/context';
import AcceptModal from '../Modal/AcceptModal';

function SideMenu() {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);
	const [, setSnackbar ] = useSnackbar();
	const actions = [
		{
			name: 'Crear Reporte',
			link: 'create-report',
			icon: '',
		},
		{
			name: 'Administrar Usuarios',
			link: 'users',
			icon: '',
		},
	];
	const configurations = [
		{
			name: 'RS',
			link: 'snps',
			icon: '',
		},
		{
			name: 'Genotipos',
			link: 'genotypes',
			icon: '',
		},
		/*
		{
			name: 'Genotipos x RS',
			link: 'genotypes-by-snp',
			icon: '',
		},
		*/
		{
			name: 'Interpretaciones',
			link: 'interpretations',
			icon: '',
		},
		{
			name: 'Efectos en Genotipos',
			link: 'genotypes-effects',
			icon: '',
		},
	];

	const logout = () => {
		window.localStorage.removeItem('token');
		navigate('/login', { replace: true });
		setSnackbar({
			show: true,
			message: 'Sesión terminada',
			className: 'success',
		});
		setShowModal(false);
	}
	return (
		<>
			<div className='side-menu'>
				<div className='side-menu-icon'>
					<img
						src='https://unigem.co/wp-content/uploads/2014/09/cropped-cropped-logo-unigem.png'
						alt='unigem-logo'
					/>
				</div>
				<Spacer text='Acciones'>
					{actions.map(option => (
						<SideMenuOption
							key={option.link}
							name={option.name}
							link={option.link}
							icon={option.icon}
						/>
					))}
				</Spacer>
				<Spacer text='Configuraciones'>
					{configurations.map(option => (
						<SideMenuOption
							key={option.link}
							name={option.name}
							link={option.link}
							icon={option.icon}
						/>
					))}
				</Spacer>
				<div className='sign-out'>
					<button
						onClick={() => setShowModal(true)}
						className='delete'
						title='Cerrar sesión'
					>
						<i className='bi bi-box-arrow-left'></i>
					</button>
				</div>
			</div>
			{showModal && (
				<AcceptModal
					title='Salir'
					message='Deseas cerrar la sesión?'
					onAccept={logout}
					onReject={() => {
						setShowModal(false);
					}}
				/>
			)}
		</>
	);
}

export default SideMenu;
