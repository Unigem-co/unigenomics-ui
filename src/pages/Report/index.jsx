import React, { useEffect, useState, useMemo } from 'react';
import { fileRequest, request, generateReport } from '../../utils/fetch';
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
	Fade,
	Stack,
	TextField,
	Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PageContainer from '../../components/PageContainer';
import { translate } from '../../utils/translations';

const USERS = 'users/user';
const REPORTS = 'report';
const REFERENCE_SNP = 'referenceSnp';
const GENOTYPES = 'genotype';

const dependencies = {
	document_type: {
		displayValue: 'display',
		data: [
			{
				id: 'C.C',
				value: 'C.C',
				display: 'C.C'
			},
			{
				id: 'Pasaporte',
				value: 'Pasaporte',
				display: 'Pasaporte'
			},
		],
	},
};

const schema = [
	{
		column_name: 'document_type',
		type: 'select',
		grid: { xs: 12, sm: 4 },
		label: translate('document_type'),
		required: true,
		renderValue: (value) => {
			const option = dependencies.document_type.data.find(opt => opt.id === value);
			return option ? option.display : value;
		}
	},
	{
		column_name: 'document',
		type: 'text',
		grid: { xs: 12, sm: 8 },
		label: translate('document'),
		required: true
	},
	{
		column_name: 'name',
		type: 'text',
		grid: { xs: 12 },
		label: translate('name'),
		required: true
	},
	{
		column_name: 'last_names',
		type: 'text',
		grid: { xs: 12 },
		label: translate('last_names'),
		required: true
	},
	{
		column_name: 'birth_date',
		type: 'date',
		grid: { xs: 12 },
		label: translate('birth_date'),
		required: true
	},
	{
		column_name: 'prime_id',
		type: 'text',
		grid: { xs: 12 },
		label: translate('prime_id'),
		required: true
	}
];

const Report = () => {
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState('');
	const [showForm, setShowForm] = useState(false);
	const [reports, setReports] = useState([]);
	const [showCreateReportDetail, setShowCreateReportDetail] = useState(false);
	const [selectedReport, setSelectedReport] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [deleteRow, setDeleteRow] = useState(null);
	const [fileUrl, setFileUrl] = useState(null);
	const [reportGenerated, setReportGenerated] = useState(false);
	const [showNewClientModal, setShowNewClientModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [referenceSNPs, setReferenceSNPs] = useState([]);
	const [, setSnackbar] = useSnackbar();

	const showSnackbarMessage = (className, messageKey) => {
		setSnackbar({
			show: true,
			message: translate(messageKey),
			className
		});
	};

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const response = await request(USERS);
				setUsers(response);
			} catch (error) {
				console.error('Error fetching users:', error);
				setSnackbar({
					show: true,
					message: translate('error_loading_users'),
					className: 'error'
				});
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	useEffect(() => {
		const fetchReferenceSNPs = async () => {
			try {
				setLoading(true);
				const snpsResponse = await request(REFERENCE_SNP);
				if (!snpsResponse || !Array.isArray(snpsResponse)) {
					throw new Error('Invalid SNPs response format');
				}

				const snpsWithGenotypes = snpsResponse.map(snp => ({
					...snp,
					genotypes: Array.isArray(snp.genotypes) ? snp.genotypes.map(g => ({
						genotype_id: g.genotype_id,
						genotype_name: g.genotype_name
					})) : []
				}));

				setReferenceSNPs(snpsWithGenotypes);
			} catch (error) {
				console.error('Error fetching reference SNPs:', error);
				setSnackbar({
					show: true,
					message: translate('error_loading_reference_snps'),
					className: 'error'
				});
				setReferenceSNPs([]);
			} finally {
				setLoading(false);
			}
		};

		fetchReferenceSNPs();
	}, []);

	const fetchUserReports = async (userId) => {
		try {
			const response = await request(`${REPORTS}/userReports/${userId}`);
			setReports(response);
		} catch (error) {
			console.error('Error fetching reports:', error);
			setSnackbar({
				show: true,
				message: translate('error_loading_reports'),
				className: 'error'
			});
			setReports([]);
		}
	};

	const onUserSelected = async (event) => {
		const userId = event.target.value;
		setSelectedUser(userId);
		setShowForm(true);
		setReports([]);
		await fetchUserReports(userId);
	};

	const onReportCreated = async () => {
		if (selectedUser) {
			await fetchUserReports(selectedUser);
		}
		setShowCreateReportDetail(false);
		setSelectedReport(null);
	};

	const onGenerateReport = async (row) => {
		try {
			setLoading(true);
			const blob = await generateReport(row.id);
			
			const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
			
			// Get user info
			const user = users.find(u => u.id === selectedUser);
			
			// Format the report date
			const reportDate = new Date(row.report_date);
			const formattedDate = reportDate.toLocaleDateString('es-ES', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			}).replace(/\//g, '-');
			
			// Create filename: document_DDMMYYYY.pdf
			const fileName = `${user.document}_${formattedDate}.pdf`;
			
			const newWindow = window.open();
			if (newWindow) {
				newWindow.document.write(
					`<iframe src="${blobUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
				);
			} else {
				const link = document.createElement('a');
				link.href = blobUrl;
				link.download = fileName;
				link.click();
			}
			
			setFileUrl(blobUrl);
			setReportGenerated(true);
			setSnackbar({
				show: true,
				message: translate('report_generated'),
				className: 'success'
			});
		} catch (error) {
			console.error('Error generating report:', error);
			setSnackbar({
				show: true,
				message: translate('error_generating_report'),
				className: 'error'
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteReport = async () => {
		try {
			setLoading(true);
			await request(`${REPORTS}/${deleteRow.id}`, { method: 'DELETE' });
			setReports(prev => prev.filter(report => report.id !== deleteRow.id));
			setSnackbar({
				show: true,
				message: translate('report_deleted'),
				className: 'success'
			});
		} catch (error) {
			console.error('Error deleting report:', error);
			setSnackbar({
				show: true,
				message: translate('error_deleting_report'),
				className: 'error'
			});
		} finally {
			setLoading(false);
			setShowModal(false);
			setDeleteRow(null);
		}
	};

	const handleCreateClient = async (clientData) => {
		try {
			const existingUser = users.find(user => 
				user.document_type === clientData.document_type && 
				user.document === clientData.document
			);

			if (existingUser) {
				setSnackbar({
					show: true,
					message: translate('client_already_exists'),
					className: 'error'
				});
				return;
			}

			const apiData = {
				...clientData,
				birdth_date: clientData.birth_date || new Date().toISOString().split('T')[0],
				birth_date: undefined,
				role: 'user'
			};

			setLoading(true);
			const response = await request(USERS, {
				method: 'POST',
				body: JSON.stringify(apiData)
			});
			
			const newUser = {
				...response,
				birth_date: response.birdth_date,
				name: clientData.name,
				last_names: clientData.last_names,
				document: clientData.document,
				document_type: clientData.document_type,
				prime_id: clientData.prime_id
			};
			
			setUsers(prev => [...prev, newUser]);
			setSelectedUser(response.id);
			setShowForm(true);
			setShowNewClientModal(false);
			
			setSnackbar({
				show: true,
				message: translate('client_created'),
				className: 'success'
			});
			
			await fetchUserReports(response.id);
		} catch (error) {
			console.error('Error creating client:', error);
			if (error.status === 409) {
				setSnackbar({
					show: true,
					message: translate('client_already_exists'),
					className: 'error'
				});
			} else if (error.message?.includes('birdth_date')) {
				setSnackbar({
					show: true,
					message: translate('birth_date_required'),
					className: 'error'
				});
			} else {
				setSnackbar({
					show: true,
					message: translate('error_creating_client'),
					className: 'error'
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateClient = async (clientData) => {
		try {
			setLoading(true);
			const currentUser = users.find(user => user.id === selectedUser);
			
			const apiData = {
				document_type: clientData.document_type,
				document: currentUser.document,
				name: clientData.name,
				last_names: clientData.last_names,
				birdth_date: clientData.birth_date,
				prime_id: clientData.prime_id,
				role: currentUser.role || 'user',
				email: currentUser.email,
				password: currentUser.password
			};

			const response = await request(USERS, {
				method: 'PUT',
				body: JSON.stringify(apiData)
			});
			
			setUsers(prev => prev.map(user => 
				user.id === selectedUser ? {
					...currentUser,
					...apiData,
					name: clientData.name,
					last_names: clientData.last_names,
					document_type: clientData.document_type,
					prime_id: clientData.prime_id,
					birdth_date: clientData.birth_date,
					id: selectedUser
				} : user
			));
			
			setSnackbar({
				show: true,
				message: translate('client_updated_successfully'),
				className: 'success'
			});
		} catch (error) {
			console.error('Error updating client:', error);
			if (error.message?.includes('birdth_date')) {
				setSnackbar({
					show: true,
					message: translate('birth_date_required'),
					className: 'error'
				});
			} else {
				setSnackbar({
					show: true,
					message: translate('error_updating_client'),
					className: 'error'
				});
			}
		} finally {
			setLoading(false);
		}
	};

	// Cleanup function for blob URLs
	useEffect(() => {
		return () => {
			if (fileUrl) {
				URL.revokeObjectURL(fileUrl);
			}
		};
	}, [fileUrl]);

	// Filter users based on search term
	const filteredUsers = useMemo(() => {
		return users.filter(user => {
			const searchLower = searchTerm.toLowerCase();
			const nameMatch = `${user.name || ''} ${user.last_names || ''}`.toLowerCase().includes(searchLower);
			const documentMatch = (user.document || '').toLowerCase().includes(searchLower);
			return nameMatch || documentMatch;
		});
	}, [users, searchTerm]);

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
						{translate('create_report')}
					</Typography>
					
					{/* Client Dropdown and Add Button */}
					<Box sx={{ mb: 3 }}>
						<Stack direction="row" spacing={1} alignItems="center" sx={{ maxWidth: 600 }}>
							<FormControl fullWidth>
								<InputLabel id="user-select-label">{translate('select_client')}</InputLabel>
								<MuiSelect
									key={`user-select-${selectedUser}`}
									labelId="user-select-label"
									id="user-select"
									value={selectedUser || ''}
									label={translate('select_client')}
									onChange={onUserSelected}
									displayEmpty
									renderValue={(selected) => {
										if (!selected) {
											return '';
										}
										const user = users.find(u => u.id === selected);
										return user ? `${user.document || ''} - ${user.name || ''} ${user.last_names || ''}` : '';
									}}
									sx={{ 
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: 'primary.main',
											borderWidth: '1px',
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: 'primary.dark',
											borderWidth: '2px',
										},
										'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
											borderColor: 'primary.main',
											borderWidth: '2px',
										},
										'&.Mui-error .MuiOutlinedInput-notchedOutline': {
											borderColor: 'error.main',
										},
										'& .MuiSelect-select': {
											'&:focus': {
												backgroundColor: 'transparent',
											}
										},
										'& .MuiInputLabel-root': {
											color: 'primary.main',
											'&.Mui-focused': {
												color: 'primary.main',
											}
										}
									}}
									onOpen={() => setSearchTerm('')}
									MenuProps={{
										PaperProps: {
											style: {
												maxHeight: 48 * 4.5 + 8,
												width: 250,
											},
										},
									}}
								>
									<Box sx={{ p: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
										<TextField
											fullWidth
											size="small"
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											placeholder={translate('search_client')}
											onClick={(e) => e.stopPropagation()}
											sx={{
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: 'primary.main',
													},
													'&:hover fieldset': {
														borderColor: 'primary.dark',
													},
												},
											}}
										/>
									</Box>
									{filteredUsers && filteredUsers.length > 0 ? (
										filteredUsers.map(user => (
											<MenuItem key={user.id} value={user.id}>
												{`${user.document || ''} - ${user.name || ''} ${user.last_names || ''}`}
											</MenuItem>
										))
									) : (
										<MenuItem disabled>
											{searchTerm ? translate('no_results') : translate('no_clients_available')}
										</MenuItem>
									)}
								</MuiSelect>
							</FormControl>
							<IconButton
								onClick={() => setShowNewClientModal(true)}
								sx={{
									bgcolor: 'primary.main',
									color: 'white',
									'&:hover': {
										bgcolor: 'primary.dark',
									},
									width: 40,
									height: 40,
								}}
								title={translate('add_client')}
							>
								<AddIcon />
							</IconButton>
						</Stack>
					</Box>

					{/* Client Information and Reports Section */}
					{showForm && selectedUser && (
						<Box sx={{ 
							display: 'flex',
							flexDirection: { xs: 'column', md: 'row' },
							gap: 3,
							flex: 1,
							minHeight: 0,
							overflowY: 'auto',
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
						}}>
							{/* Client Information */}
							<Box sx={{ 
								flex: { xs: '1', md: '0 0 400px' },
								display: 'flex',
								flexDirection: 'column',
								minHeight: { xs: 'auto', md: '100%' }
							}}>
								<Paper 
									variant="outlined"
									sx={{ 
										p: 2,
										flex: 1,
										display: 'flex',
										flexDirection: 'column',
										minHeight: 0,
										width: '100%',
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
									<Typography variant="h6" sx={{ mb: 2, px: 1 }}>
										{translate('client_information')}
									</Typography>
									<Form
										schema={schema.map(field => ({
											...field,
											disabled: (field.column_name === 'document_type' || field.column_name === 'document') ? true : undefined
										}))}
										data={{
											...users.find(user => user.id === selectedUser),
											birth_date: users.find(user => user.id === selectedUser)?.birdth_date,
										}}
										dependencies={dependencies}
										stackFields={true}
										onSave={handleUpdateClient}
									/>
								</Paper>
							</Box>
							
							{/* Reports List */}
							<Box sx={{ 
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								minWidth: 0,
								minHeight: { xs: 'auto', md: '100%' }
							}}>
								<Paper 
									variant="outlined"
									sx={{ 
										p: 2,
										flex: 1,
										display: 'flex',
										flexDirection: 'column',
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
									<Box sx={{ 
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										mb: 2,
										px: 1
									}}>
										<Typography variant="h6">
											{translate('available_reports')}
										</Typography>
										<Tooltip title={translate('create_new_report')}>
											<IconButton
												onClick={() => {
													setShowCreateReportDetail(true);
													setSelectedReport(null);
												}}
												sx={{
													bgcolor: 'primary.main',
													color: 'white',
													'&:hover': {
														bgcolor: 'primary.dark',
													},
													width: 40,
													height: 40,
												}}
											>
												<AddIcon />
											</IconButton>
										</Tooltip>
									</Box>
									<Box sx={{ flex: 1, overflowY: 'auto' }}>
										{reports?.length > 0 ? (
											<Table
												data={reports}
												columns={Object.keys(reports[0])
													.filter(key => key !== 'observations')
													.map(key => ({ 
														column_name: key,
														display_name: translate(key)
													}))
												}
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
														title: translate('generate_report'),
														onClick: onGenerateReport,
														icon: <VisibilityIcon fontSize="small" sx={{ color: 'primary.main' }} />
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
													{translate('no_reports_available')}
												</Typography>
											</Box>
										)}
									</Box>
								</Paper>
							</Box>
						</Box>
					)}
				</Paper>

				{/* Create Report Detail Modal */}
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
									selectedReport={selectedReport}
									onReportCreated={onReportCreated}
									onCancel={() => setShowCreateReportDetail(false)}
									referencesWithGenotypes={referenceSNPs}
								/>
							</Box>
						</Paper>
					</Box>
				)}

				{/* New Client Modal */}
				<Modal
					open={showNewClientModal}
					onClose={() => setShowNewClientModal(false)}
					closeAfterTransition
					slots={{
						backdrop: Backdrop
					}}
					slotProps={{
						backdrop: {
							timeout: 500,
						},
					}}
				>
					<Fade in={showNewClientModal}>
						<Box sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: '100%',
							maxWidth: 600,
							bgcolor: 'background.paper',
							boxShadow: 24,
							p: 4,
							borderRadius: 2,
						}}>
							<Typography variant="h6" sx={{ mb: 3 }}>
								{translate('new_client')}
							</Typography>
							<Form
								schema={schema}
								dependencies={dependencies}
								onSave={handleCreateClient}
								onCancel={() => setShowNewClientModal(false)}
							/>
						</Box>
					</Fade>
				</Modal>

				{/* Delete Confirmation Modal */}
				{showModal && (
					<AcceptModal
						title={translate('delete_report')}
						message={translate('delete_report_confirmation')}
						onAccept={handleDeleteReport}
						onReject={() => {
							setShowModal(false);
							setDeleteRow(null);
						}}
					/>
				)}
			</Box>
		</PageContainer>
	);
};

export default Report;
