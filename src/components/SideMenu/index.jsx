import React, { useState, useEffect } from 'react';
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
import { translate } from '../../utils/translations';

const drawerWidth = 240;

function SideMenu({ mobileOpen, onMobileClose, isMobile }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [showModal, setShowModal] = useState(false);
	const [open, setOpen] = useState(!isMobile);
	const [, setSnackbar] = useSnackbar();

	useEffect(() => {
		if (isMobile) {
			setOpen(false);
		}
	}, [isMobile]);

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
		if (isMobile) {
			onMobileClose?.();
		} else {
			setOpen(!open);
		}
	};

	const logout = () => {
		window.localStorage.removeItem('token');
		navigate('/login', { replace: true });
		setSnackbar({
			show: true,
			message: translate('session_expired'),
			className: 'info'
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

	const drawer = (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					p: 2,
					backgroundColor: 'rgba(255,255,255,0.1)',
				}}
			>
				{(open || isMobile) && (
					<img
						src="https://unigem.co/wp-content/uploads/2014/09/cropped-cropped-logo-unigem.png"
						alt="unigem-logo"
						style={{ 
							height: 40, 
							width: 'auto', 
							filter: 'brightness(0) invert(1)',
							maxWidth: '100%'
						}}
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
					{(open || isMobile) ? <ChevronLeftIcon /> : <MenuIcon />}
				</IconButton>
			</Box>
			<Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />
			
			{(open || isMobile) && (
				<>
					<MenuSection title="Acciones" items={actions} />
					<MenuSection title="Configuraciones" items={configurations} />
					<Box sx={{ flexGrow: 1 }} />
					<List>
						<ListItem
							button
							onClick={() => setShowModal(true)}
							sx={{
								mx: 1,
								borderRadius: 1,
								mb: 0.5,
								'&:hover': {
									backgroundColor: 'rgba(255,255,255,0.08)',
								},
							}}
						>
							<ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
								<ExitToAppIcon />
							</ListItemIcon>
							<ListItemText
								primary="Cerrar Sesión"
								primaryTypographyProps={{
									fontSize: '0.875rem',
									fontWeight: 500,
								}}
							/>
						</ListItem>
					</List>
				</>
			)}
		</>
	);

	return (
		<>
			{isMobile ? (
				<Drawer
					variant="temporary"
					anchor="left"
					open={mobileOpen}
					onClose={onMobileClose}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						'& .MuiDrawer-paper': {
							width: drawerWidth,
							boxSizing: 'border-box',
							background: 'linear-gradient(180deg, #004A93 0%, #003366 100%)',
							color: '#ffffff',
							border: 'none',
							height: '100%',
							zIndex: (theme) => theme.zIndex.drawer + 2
						},
					}}
				>
					{drawer}
				</Drawer>
			) : (
				<Drawer
					variant="permanent"
					sx={{
						width: open ? drawerWidth : 72,
						flexShrink: 0,
						position: 'relative',
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
							position: 'relative',
							height: '100%'
						},
						'& .MuiPaper-root': {
							position: 'relative'
						}
					}}
				>
					{drawer}
				</Drawer>
			)}
			<Dialog
				open={showModal}
				onClose={() => setShowModal(false)}
				aria-labelledby="alert-dialog-title"
				sx={{
					'& .MuiDialog-paper': {
						width: isMobile ? '90%' : 'auto',
						margin: isMobile ? '16px' : 'auto'
					}
				}}
			>
				<DialogTitle id="alert-dialog-title">
					¿Está seguro que desea cerrar sesión?
				</DialogTitle>
				<DialogActions>
					<Button onClick={() => setShowModal(false)} color="primary">
						Cancelar
					</Button>
					<Button onClick={logout} color="primary" autoFocus>
						Aceptar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default SideMenu;
