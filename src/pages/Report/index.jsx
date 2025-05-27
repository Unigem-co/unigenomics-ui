import React, { useEffect, useState } from 'react';
import { fileRequest, request } from '../../utils/fetch';
import Form from '../../components/Form';
import CreateReportDetail from './CreateReportDetail';
import Table from '../../components/Table';
import { useSnackbar } from '../../components/Snackbar/context';
import AcceptModal from '../../components/Modal/AcceptModal';
import Loading from '../../components/Loading';
import { 
	Box, 
	FormControl, 
	InputLabel, 
	MenuItem, 
	Select as MuiSelect,
	Typography,
	Button,
	Paper,
	IconButton,
	Modal,
	Backdrop,
	Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PageContainer from '../../components/PageContainer';

const USERS = 'users/user';
const REPORTS = 'report';

const dependencies = {
	document_type: {
		displayValue: 'value',
		data: [
			{
				id: 'C.C',
				value: 'C.C',
			},
			{
				id: 'Pasaporte',
				value: 'Pasaporte',
			},
		],
	},
};

const Report = () => {
	const [schema, setSchema] = useState({});
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState('');
	const [showForm, setShowForm] = useState(false);
	const [showCreateReportDetail, setShowCreateReportDetail] = useState(false);
	const [reports, setReports] = useState([]);
	const [selectedReport, setSelectedReport] = useState();
	const [referencesWithGenotypes, setReferencesWithGenotypes] = useState([]);
	const [, setSnackbar] = useSnackbar();
	const [deleteRow, setDeleteRow] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [reportGenerated, setReportGenerated] = useState(false);
	const [fileUrl, setFileUrl] = useState();

	const onError = error => {
		console.error('Error:', error);
		setLoading(false);
		setSnackbar({
			show: true,
			message: 'Error cargando datos. Por favor, intente más tarde.',
			className: 'error',
		});
	}

	useEffect(() => {
		const getData = async () => {
			setLoading(true);
			try {
				const [usersResponse, schemaResponse, reportsResponse] = await Promise.all([
					request(USERS, { method: 'GET' }),
					request(`${USERS}/schema`, { method: 'GET' }),
					request(REPORTS, { method: 'GET' })
				]);

				console.log('Users response:', usersResponse);
				
				if (Array.isArray(usersResponse)) {
					setUsers(usersResponse);
				} else if (usersResponse?.data && Array.isArray(usersResponse.data)) {
					setUsers(usersResponse.data);
				} else {
					console.error('Unexpected users response format:', usersResponse);
					onError(new Error('Invalid users data format'));
					return;
				}

				setSchema(schemaResponse);
				setReferencesWithGenotypes(reportsResponse);
			} catch (error) {
				onError(error);
			} finally {
			setLoading(false);
			}
		}

		getData();
	}, []);

	useEffect(() => {
		const fetchUserReports = async () => {
			if (!selectedUser) return;
			
			setLoading(true);
			try {
				const response = await request(`${REPORTS}/userReports/${selectedUser}`, { method: 'GET' });
				console.log('User reports response:', response);
				
				if (Array.isArray(response)) {
					setReports(response);
				} else if (response?.data && Array.isArray(response.data)) {
					setReports(response.data);
				} else {
					console.error('Unexpected reports response format:', response);
					setReports([]);
				}
			} catch (error) {
				console.error('Error fetching user reports:', error);
				setReports([]);
				onError(error);
			} finally {
			setLoading(false);
		}
		};

		fetchUserReports();
	}, [selectedUser]);

	const onUserSelected = (event) => {
		const value = event.target.value;
		setShowForm(true);
		setSelectedUser(value);
	};

	const onDelete = async () => {
		setLoading(true);
		try {
			await request('report', { 
				method: 'DELETE', 
				body: JSON.stringify(deleteRow),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			setSnackbar({
				show: true,
				message: 'Reporte eliminado',
				className: 'success',
			});
			
			const updatedReports = await request(`${REPORTS}/userReports/${selectedUser}`, { method: 'GET' });
			if (Array.isArray(updatedReports)) {
				setReports(updatedReports);
			} else if (updatedReports?.data && Array.isArray(updatedReports.data)) {
				setReports(updatedReports.data);
			}
		} catch (error) {
			onError(error);
		} finally {
			setLoading(false);
			setShowModal(false);
			setShowCreateReportDetail(false);
		}
	};

	const onReportCreated = async () => {
		setLoading(true);
		try {
			const updatedReports = await request(`${REPORTS}/userReports/${selectedUser}`, { method: 'GET' });
			if (Array.isArray(updatedReports)) {
				setReports(updatedReports);
			} else if (updatedReports?.data && Array.isArray(updatedReports.data)) {
				setReports(updatedReports.data);
			}
		} catch (error) {
			onError(error);
		} finally {
		setLoading(false);
		setShowCreateReportDetail(false);
		}
	};

	const onGenerateReport = report => {
		console.log('Starting report generation...');
		setLoading(true);
		setShowCreateReportDetail(false);
		
		fileRequest(
			`generate-report/${report.id}`,
			{ 
				method: 'POST'
			},
			response => {
				console.log('Received API response (blob):', response);
				console.log('Blob type:', response.type);
				console.log('Blob size:', response.size);
				
				try {
					// Create blob URL for PDF
					const blobUrl = URL.createObjectURL(response);
					console.log('Created blob URL:', blobUrl);
					
					// Set states in correct order
					setFileUrl(blobUrl);
					setLoading(false);
					setReportGenerated(true);
					
					console.log('States updated, modal should display');
				} catch (error) {
					console.error('Error processing PDF:', error);
					setSnackbar({
						show: true,
						message: 'Error al procesar el PDF. Por favor, intente nuevamente.',
						className: 'error'
					});
					setLoading(false);
					setReportGenerated(false);
				}
			},
			error => {
				console.error('Error generating report:', error);
				setSnackbar({
					show: true,
					message: 'Error al generar el reporte. Por favor, intente nuevamente.',
					className: 'error'
				});
				setLoading(false);
				setReportGenerated(false);
			}
		);
	};

	// Clean up the URL when component unmounts or when modal closes
	useEffect(() => {
		return () => {
			if (fileUrl && fileUrl.startsWith('blob:')) {
				URL.revokeObjectURL(fileUrl);
			}
		};
	}, [fileUrl]);

	// When modal closes, clean up the URL
	useEffect(() => {
		if (!reportGenerated && fileUrl && fileUrl.startsWith('blob:')) {
			URL.revokeObjectURL(fileUrl);
			setFileUrl(null);
		}
	}, [reportGenerated]);

	return (
		<PageContainer>
			<Box sx={{ 
				p: 3, 
				height: '100vh', 
				position: 'relative',
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden'
			}}>
				{loading && (
					<Box sx={{ 
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						bgcolor: 'rgba(0, 0, 0, 0.7)',
						zIndex: theme => theme.zIndex.modal + 3,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<Loading />
					</Box>
				)}
				
				{/* Client Selection and Information Section */}
				<Paper elevation={2} sx={{ p: 3, mb: 3, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
					<Typography variant="h6" sx={{ mb: 3 }}>
						Crear Reporte
					</Typography>
					
					{/* Client Dropdown */}
					<Box sx={{ mb: 3 }}>
						<Typography variant="subtitle1" sx={{ mb: 2 }}>
							Selecciona el cliente:
						</Typography>
						<FormControl fullWidth sx={{ maxWidth: 400 }}>
							<InputLabel id="user-select-label">Cliente</InputLabel>
							<MuiSelect
								labelId="user-select-label"
								id="user-select"
								value={selectedUser}
								label="Cliente"
								onChange={onUserSelected}
								sx={{ 
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: 'primary.main',
									},
									'&:hover .MuiOutlinedInput-notchedOutline': {
										borderColor: 'primary.dark',
									},
								}}
							>
								{users && users.length > 0 ? (
									users.map(user => (
										<MenuItem key={user.id} value={user.id}>
											{`${user.document || ''} - ${user.name || ''} ${user.last_names || ''}`}
										</MenuItem>
									))
								) : (
									<MenuItem disabled>No hay clientes disponibles</MenuItem>
								)}
							</MuiSelect>
						</FormControl>
					</Box>

					{/* Client Information and Reports Section */}
					{showForm && (
						<Box sx={{ 
							display: 'flex',
							flexDirection: { xs: 'column', md: 'row' },
							gap: 2,
							flex: 1,
							minHeight: 0
						}}>
							{/* Client Information */}
							<Box sx={{ 
								flex: 1,
								display: 'flex',
								flexDirection: 'column'
							}}>
								<Typography variant="h6" sx={{ mb: 2 }}>
									Información del Cliente
								</Typography>
								<Paper 
									variant="outlined"
									sx={{ 
										p: 2,
										flex: 1,
										overflowY: 'auto',
										minHeight: 0,
										'&::-webkit-scrollbar': {
											width: '8px',
										},
										'&::-webkit-scrollbar-track': {
											background: '#f1f1f1',
											borderRadius: '4px',
										},
										'&::-webkit-scrollbar-thumb': {
											background: '#888',
											borderRadius: '4px',
										},
										'&::-webkit-scrollbar-thumb:hover': {
											background: '#555',
										},
									}}
								>
									<Form
										disabled
										schema={schema}
										data={users.find(user => user.id === selectedUser)}
										dependencies={dependencies}
										stackFields={true}
										onSave={() => {}}
									/>
								</Paper>
								<Box sx={{ 
									display: 'flex', 
									justifyContent: 'flex-end', 
									pt: 2
								}}>
									<Button
										variant="contained"
										color="primary"
										onClick={() => {
											setShowCreateReportDetail(true);
											setSelectedReport(null);
										}}
										sx={{
											background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
											color: 'white',
											boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
										}}
									>
										Crear Nuevo Reporte
									</Button>
								</Box>
							</Box>
							
							{/* Reports List */}
							<Box sx={{ 
								flex: 1,
								display: 'flex',
								flexDirection: 'column'
							}}>
								<Typography variant="h6" sx={{ mb: 2 }}>
									Reportes Disponibles
								</Typography>
								<Paper 
									variant="outlined"
									sx={{ 
										p: 2,
										flex: 1,
										overflowY: 'auto',
										minHeight: 0,
										'&::-webkit-scrollbar': {
											width: '8px',
										},
										'&::-webkit-scrollbar-track': {
											background: '#f1f1f1',
											borderRadius: '4px',
										},
										'&::-webkit-scrollbar-thumb': {
											background: '#888',
											borderRadius: '4px',
										},
										'&::-webkit-scrollbar-thumb:hover': {
											background: '#555',
										},
									}}
								>
									{reports?.length > 0 ? (
										<Table
											data={reports}
											columns={Object.keys(reports[0]).map(key =>
												key === 'observations' ? {} : { column_name: key },
											)}
											onUpdate={value => {
												setSelectedReport(value);
												setShowCreateReportDetail(true);
												setReportGenerated(false);
											}}
											onDelete={value => {
												setShowModal(true);
												setDeleteRow(value);
											}}
											extraOptions={[
												{
													title: 'Generar',
													onClick: onGenerateReport,
													icon: 'bi bi-eye',
												},
											]}
										/>
									) : (
										<Box sx={{ 
											display: 'flex', 
											alignItems: 'center', 
											justifyContent: 'center',
											height: '200px',
											color: 'text.secondary'
										}}>
											<Typography>
												No hay reportes disponibles para este cliente
											</Typography>
										</Box>
									)}
								</Paper>
							</Box>
						</Box>
					)}
				</Paper>

			{showCreateReportDetail && (
					<Box sx={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						bgcolor: 'rgba(0, 0, 0, 0.5)',
						zIndex: theme => theme.zIndex.modal + 1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						p: 3
					}}>
						<Paper sx={{ 
							width: '100%', 
							maxWidth: 1200, 
							maxHeight: '90vh',
							display: 'flex',
							flexDirection: 'column',
							position: 'relative',
							overflow: 'visible'
						}}>
							<Box sx={{ 
								position: 'absolute', 
								right: 8, 
								top: 8,
								zIndex: 1
							}}>
								<IconButton onClick={() => setShowCreateReportDetail(false)}>
									<CloseIcon />
								</IconButton>
							</Box>
							<Box sx={{ 
								flex: 1,
								overflowY: 'auto',
								overflowX: 'visible',
								p: 3,
								position: 'relative'
							}}>
				<CreateReportDetail
					user={selectedUser}
					referencesWithGenotypes={referencesWithGenotypes}
					selectedReport={selectedReport}
					onReportCreated={onReportCreated}
					onCancel={() => setShowCreateReportDetail(false)}
				/>
							</Box>
						</Paper>
					</Box>
			)}

			{reportGenerated && fileUrl && (
				<Modal
					open={true}
					onClose={() => {
						console.log('Closing modal...');
						if (fileUrl && fileUrl.startsWith('blob:')) {
							URL.revokeObjectURL(fileUrl);
						}
						setReportGenerated(false);
						setFileUrl(null);
						setLoading(false);
					}}
					closeAfterTransition
					slots={{ backdrop: Backdrop }}
					slotProps={{
						backdrop: {
							timeout: 500,
						},
					}}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Fade in={true}>
						<Box
							sx={{
								position: 'fixed',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								bgcolor: 'background.paper',
								display: 'flex',
								flexDirection: 'column',
								p: 2,
								zIndex: theme => theme.zIndex.modal + 1
							}}
						>
							<Box sx={{ 
								display: 'flex', 
								justifyContent: 'flex-end',
								mb: 1
							}}>
								<IconButton 
									onClick={() => {
										console.log('Close button clicked');
										if (fileUrl && fileUrl.startsWith('blob:')) {
											URL.revokeObjectURL(fileUrl);
										}
										setReportGenerated(false);
										setFileUrl(null);
										setLoading(false);
									}}
									size="large"
									sx={{ 
										color: 'text.secondary',
										'&:hover': {
											color: 'text.primary',
											bgcolor: 'action.hover'
										}
									}}
								>
									<CloseIcon />
								</IconButton>
							</Box>
							
							<Box
								component="iframe"
								src={fileUrl}
								title="PDF Report"
								sx={{
									flex: 1,
									border: 'none',
									width: '100%',
									height: 'calc(100vh - 64px)',  // Subtract header height
									zIndex: theme => theme.zIndex.modal + 2
								}}
							/>
						</Box>
					</Fade>
				</Modal>
			)}

			{showModal && (
				<AcceptModal
					title='Eliminar'
						message='¿Deseas eliminar este reporte?'
					onAccept={onDelete}
					onReject={() => {
						setShowModal(false);
					}}
				/>
			)}
			</Box>
		</PageContainer>
	);
};

export default Report;
