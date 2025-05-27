import React, { useEffect, useState } from 'react';
import { 
	Box, 
	AppBar, 
	Toolbar, 
	Typography, 
	IconButton, 
	Paper,
	Grid,
	Tooltip
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { parseJwt } from '../../utils/jwt';
import { fileRequest, request } from '../../utils/fetch';
import Table from '../../components/Table';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../components/Snackbar/context';
import AcceptModal from '../../components/Modal/AcceptModal';
import Loading from '../../components/Loading';
import PageContainer from '../../components/PageContainer';

const ReportGenerator = () => {
	const [reports, setReports] = useState([]);
	const [fileUrl, setFileUrl] = useState();
	const [reportGenerated, setReportGenerated] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	const [, setSnackbar] = useSnackbar();
	const [loading, setLoading] = useState(false);

	const onError = e => {
		setLoading(false);
		if (e.status === 403) {
			setSnackbar({
				show: true,
				message: 'Tu sesión ha expirado',
				className: 'success',
			});
			navigate('/login', {replace: true});
		} else {
			setSnackbar({
				show: true,
				message: 'Error generando el reporte, intentalo más tarde',
				className: 'error',
			});
		}
		setLoading(false);
	};

	useEffect(() => {
		const fetchReports = async () => {
			setLoading(true);
			try {
				const jwt = window.localStorage.getItem('token');
				const user = parseJwt(jwt);
				if (user) {
					const data = await request(`report/userReports/${user.id}`, { method: 'GET' });
					setReports(data);
				}
			} catch (error) {
				onError(error);
			} finally {
				setLoading(false);
			}
		};
		
		fetchReports();
	}, []);

	const onGenerateReport = report => {
		setLoading(true);
		fileRequest(
			`generate-report/${report.id}`,
			{ method: 'POST' },
			data => {
				const url = window.URL.createObjectURL(data);
				setReportGenerated(true);
				setFileUrl(url);
				setLoading(false);
			},
			onError,
		);
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

	return (
		<Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
			<AppBar position="static" color="transparent" elevation={0}>
				<Toolbar sx={{ justifyContent: 'space-between' }}>
					<Box sx={{ height: 60 }}>
					<img
						src='https://unigem.co/wp-content/uploads/2014/09/cropped-cropped-logo-unigem.png'
						alt='unigem-logo'
							style={{ height: '100%' }}
					/>
					</Box>
					<Tooltip title="Cerrar sesión">
						<IconButton 
							color="primary" 
							onClick={() => setShowModal(true)}
						>
							<LogoutIcon />
						</IconButton>
					</Tooltip>
				</Toolbar>
			</AppBar>

			<PageContainer>
				<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
					{loading && <Loading />}
					<Grid container spacing={3} sx={{ flex: 1, height: '100%' }}>
						<Grid item xs={12} md={reportGenerated ? 4 : 12}>
							<Paper 
								elevation={0} 
								sx={{ 
									p: 3, 
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									gap: 2
								}}
							>
								<Typography variant="h5" gutterBottom>
									Reportes
								</Typography>
								<Typography variant="body2" color="text.secondary" paragraph>
						Puedes escoger que reporte deseas generar dando click en las opciones de
						abajo. Un PDF aparecerá a la derecha cuando la generación del mismo termine.
								</Typography>
								<Box sx={{ flex: 1 }}>
					<Table
						data={reports}
						columns={Object.keys(reports[0] || {})
							?.map(key => ({ column_name: key }))
							.filter(column => column.column_name !== 'id')}
						onUpdate={onGenerateReport}
										onUpdateText="Ver reporte"
						onUpdateTooltip='Ver reporte'
					/>
								</Box>
							</Paper>
						</Grid>
				{reportGenerated && (
							<Grid item xs={12} md={8}>
								<Paper 
									elevation={0} 
									sx={{ 
										height: '100%',
										minHeight: 600,
										overflow: 'hidden'
									}}
								>
									<embed 
										src={fileUrl} 
										style={{
											width: '100%',
											height: '100%',
											border: 'none'
										}}
									/>
								</Paper>
							</Grid>
				)}
					</Grid>
				</Box>
			</PageContainer>

			{showModal && (
				<AcceptModal
					title='Salir'
					message='¿Deseas cerrar la sesión?'
					onAccept={logout}
					onReject={() => {
						setShowModal(false);
					}}
				/>
			)}
		</Box>
	);
};

export default ReportGenerator;
