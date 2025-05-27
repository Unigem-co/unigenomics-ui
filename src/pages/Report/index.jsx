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
	TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PageContainer from '../../components/PageContainer';
import { translate } from '../../utils/translations';

const USERS = 'users/user';
const REPORTS = 'report';
const REFERENCE_SNP = 'referenceSnp';
const GENOTYPES = 'genotype';

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

const schema = [
	{
		column_name: 'document_type',
		type: 'select',
		grid: { xs: 12, sm: 4 }
	},
	{
		column_name: 'document',
		type: 'text',
		grid: { xs: 12, sm: 8 }
	},
	{
		column_name: 'name',
		type: 'text',
		grid: { xs: 12 }
	},
	{
		column_name: 'last_names',
		type: 'text',
		grid: { xs: 12 }
	},
	{
		column_name: 'birth_date',
		type: 'date',
		grid: { xs: 12 }
	},
	{
		column_name: 'prime_id',
		type: 'text',
		grid: { xs: 12 }
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

	const showSnackbarMessage = (className, message) => {
		setSnackbar({
			show: true,
			message,
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
				showSnackbarMessage('error', translate('error_loading_users'));
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
				// Fetch reference SNPs with their available genotypes in a single request
				const snpsResponse = await request(REFERENCE_SNP);
				if (!snpsResponse || !Array.isArray(snpsResponse)) {
					throw new Error('Invalid SNPs response format');
				}

				// Transform the response to match the expected format and ensure genotypes array exists
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
				showSnackbarMessage('error', translate('error_loading_reference_snps'));
				setReferenceSNPs([]); // Set empty array on error
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
			showSnackbarMessage('error', translate('error_loading_reports'));
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
		// Refresh the reports list for the current user
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
			
			// Create a blob URL and open in new window
			const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
			
			// Open PDF in new window
			const newWindow = window.open();
			if (newWindow) {
				newWindow.document.write(
					`<iframe src="${blobUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
				);
			} else {
				// If popup blocked, create a download link
				const link = document.createElement('a');
				link.href = blobUrl;
				link.download = `report-${row.id}.pdf`;
				link.click();
			}
			
			setFileUrl(blobUrl);
			setReportGenerated(true);
			showSnackbarMessage('success', translate('report_generated'));
		} catch (error) {
			console.error('Error generating report:', error);
			showSnackbarMessage('error', translate('error_generating_report'));
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteReport = async () => {
		try {
			setLoading(true);
			await request(`${REPORTS}/${deleteRow.id}`, { method: 'DELETE' });
			setReports(prev => prev.filter(report => report.id !== deleteRow.id));
			showSnackbarMessage('success', translate('report_deleted'));
		} catch (error) {
			console.error('Error deleting report:', error);
			showSnackbarMessage('error', translate('error_deleting_report'));
		} finally {
			setLoading(false);
			setShowModal(false);
			setDeleteRow(null);
		}
	};

	const handleCreateClient = async (clientData) => {
		try {
			// Check if user with same document type and number exists
			const existingUser = users.find(user => 
				user.document_type === clientData.document_type && 
				user.document === clientData.document
			);

			if (existingUser) {
				showSnackbarMessage('error', translate('client_already_exists'));
				return;
			}

			// Map birth_date to birdth_date for API compatibility and add role
			const apiData = {
				...clientData,
				birdth_date: clientData.birth_date || new Date().toISOString().split('T')[0], // Set today as default if not provided
				birth_date: undefined, // Remove birth_date as we're using birdth_date
				role: 'user' // Add user role for clients
			};

			setLoading(true);
			const response = await request(USERS, {
				method: 'POST',
				body: JSON.stringify(apiData)
			});
			
			// Add new client to the list and select it
			setUsers(prev => [...prev, response]);
			setSelectedUser(response.id);
			setShowForm(true);
			setShowNewClientModal(false);
			showSnackbarMessage('success', translate('client_created'));
			
			// Fetch reports for the new client
			await fetchUserReports(response.id);
		} catch (error) {
			console.error('Error creating client:', error);
			if (error.status === 409) {
				showSnackbarMessage('error', translate('client_already_exists'));
			} else if (error.message?.includes('birdth_date')) {
				showSnackbarMessage('error', translate('birth_date_required'));
			} else {
				showSnackbarMessage('error', translate('error_creating_client'));
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
						<Typography variant="subtitle1" sx={{ mb: 2 }}>
							{translate('select_client')}:
						</Typography>
						<Stack direction="row" spacing={1} alignItems="center" sx={{ maxWidth: 600 }}>
							<FormControl fullWidth>
								<InputLabel id="user-select-label">{translate('select_client')}</InputLabel>
								<MuiSelect
									key={users.length}
									labelId="user-select-label"
									id="user-select"
									value={selectedUser}
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
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: 'primary.dark',
										},
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
							minHeight: 0
						}}>
							{/* Client Information */}
							<Box sx={{ 
								flex: { xs: '1', md: '0 0 400px' },
								display: 'flex',
								flexDirection: 'column'
							}}>
								<Typography variant="h6" sx={{ mb: 2 }}>
									{translate('client_information')}
								</Typography>
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
									<Form
										disabled
										schema={schema}
										data={{
											...users.find(user => user.id === selectedUser),
											birth_date: users.find(user => user.id === selectedUser)?.birdth_date,
										}}
										dependencies={dependencies}
										stackFields={true}
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
										{translate('create_new_report')}
									</Button>
								</Box>
							</Box>
							
							{/* Reports List */}
							<Box sx={{ 
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								minWidth: 0
							}}>
								<Typography variant="h6" sx={{ mb: 2 }}>
									{translate('available_reports')}
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
												{translate('no_reports_available')}
											</Typography>
										</Box>
									)}
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
