import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	IconButton,
	Box,
	Typography,
	Divider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@mui/material';
import {
	Menu as MenuIcon,
	Description as DescriptionIcon,
	People as PeopleIcon,
	Science as ScienceIcon,
	Biotech as BiotechIcon,
	Psychology as PsychologyIcon,
	ExitToApp as ExitToAppIcon,
	ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useSnackbar } from '../Snackbar/context';

const drawerWidth = 240;

function SideMenu() {
	const navigate = useNavigate();
	const location = useLocation();
	const [showModal, setShowModal] = useState(false);
	const [open, setOpen] = useState(true);
	const [, setSnackbar] = useSnackbar();

	const actions = [
		{
			name: 'Crear Reporte',
			link: 'create-report',
			icon: <DescriptionIcon />,
		},
		{
			name: 'Administrar Usuarios',
			link: 'users',
			icon: <PeopleIcon />,
		},
	];

	const configurations = [
		{
			name: 'RS',
			link: 'snps',
			icon: <ScienceIcon />,
		},
		{
			name: 'Genotipos',
			link: 'genotypes',
			icon: <BiotechIcon />,
		},
		{
			name: 'Interpretaciones',
			link: 'interpretations',
			icon: <PsychologyIcon />,
		},
		{
			name: 'Efectos en Genotipos',
			link: 'genotypes-effects',
			icon: <BiotechIcon />,
		},
	];

	const handleDrawerToggle = () => {
		setOpen(!open);
	};

	const logout = () => {
		window.localStorage.removeItem('token');
		navigate('/login', { replace: true });
		setSnackbar({
			show: true,
			message: 'Sesión terminada',
			className: 'success',
		});
		setShowModal(false);
	};

	const MenuSection = ({ title, items }) => (
		<>
			<Box sx={{ px: 2, py: 1.5 }}>
				<Typography
					variant="overline"
					sx={{
						color: 'rgba(255,255,255,0.7)',
						fontSize: '0.75rem',
						fontWeight: 500,
						letterSpacing: '0.08em',
					}}
				>
					{title}
				</Typography>
			</Box>
			<List>
				{items.map((item) => (
					<ListItem
						button
						key={item.link}
						onClick={() => navigate(item.link)}
						selected={location.pathname.includes(item.link)}
						sx={{
							mx: 1,
							borderRadius: 1,
							mb: 0.5,
							'&.Mui-selected': {
								backgroundColor: 'rgba(255,255,255,0.16)',
								'&:hover': {
									backgroundColor: 'rgba(255,255,255,0.24)',
								},
							},
							'&:hover': {
								backgroundColor: 'rgba(255,255,255,0.08)',
							},
						}}
					>
						<ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
							{item.icon}
						</ListItemIcon>
						<ListItemText
							primary={item.name}
							primaryTypographyProps={{
								fontSize: '0.875rem',
								fontWeight: 500,
							}}
						/>
					</ListItem>
				))}
			</List>
			<Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
		</>
	);

	return (
		<>
			<Drawer
				variant="permanent"
				sx={{
					width: open ? drawerWidth : 72,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: open ? drawerWidth : 72,
						boxSizing: 'border-box',
						transition: (theme) =>
							theme.transitions.create(['width'], {
								easing: theme.transitions.easing.sharp,
								duration: theme.transitions.duration.enteringScreen,
							}),
						overflowX: 'hidden',
						background: 'linear-gradient(180deg, #004A93 0%, #003366 100%)',
						color: '#ffffff',
						border: 'none',
						position: 'relative'
					},
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						p: 2,
						backgroundColor: 'rgba(255,255,255,0.1)',
					}}
				>
					{open && (
						<img
							src="https://unigem.co/wp-content/uploads/2014/09/cropped-cropped-logo-unigem.png"
							alt="unigem-logo"
							style={{ height: 40, width: 'auto', filter: 'brightness(0) invert(1)' }}
						/>
					)}
					<IconButton
						onClick={handleDrawerToggle}
						sx={{
							color: '#ffffff',
							'&:hover': {
								backgroundColor: 'rgba(255,255,255,0.08)',
							},
						}}
					>
						{open ? <ChevronLeftIcon /> : <MenuIcon />}
					</IconButton>
				</Box>
				<Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
				
				{open && (
					<>
						<MenuSection title="Acciones" items={actions} />
						<MenuSection title="Configuraciones" items={configurations} />
					</>
				)}
				
				<Box sx={{ flexGrow: 1 }} />
				<List>
					<ListItem
						button
						onClick={() => setShowModal(true)}
						sx={{
							mx: 1,
							borderRadius: 1,
							color: '#ffffff',
							'&:hover': {
								backgroundColor: 'rgba(255,255,255,0.08)',
							},
						}}
					>
						<ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
							<ExitToAppIcon />
						</ListItemIcon>
						{open && (
							<ListItemText
								primary="Cerrar sesión"
								primaryTypographyProps={{
									fontSize: '0.875rem',
									fontWeight: 500,
					}}
				/>
			)}
					</ListItem>
				</List>
			</Drawer>

			<Dialog
				open={showModal}
				onClose={() => setShowModal(false)}
				PaperProps={{
					sx: {
						borderRadius: 2,
					},
				}}
			>
				<DialogTitle sx={{ color: '#004A93', fontWeight: 600 }}>
					Salir
				</DialogTitle>
				<DialogContent>
					<Typography>¿Deseas cerrar la sesión?</Typography>
				</DialogContent>
				<DialogActions sx={{ p: 2 }}>
					<Button
						onClick={() => setShowModal(false)}
						sx={{
							color: '#666666',
							'&:hover': {
								backgroundColor: 'rgba(0,0,0,0.04)',
							},
						}}
					>
						Cancelar
					</Button>
					<Button
						onClick={logout}
						variant="contained"
						color="primary"
						sx={{
							background: 'linear-gradient(45deg, #004A93 30%, #00B5E2 90%)',
							'&:hover': {
								background: 'linear-gradient(45deg, #003366 30%, #007d99 90%)',
							},
						}}
					>
						Cerrar sesión
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default SideMenu;
