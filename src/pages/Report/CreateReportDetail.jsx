import React, { useEffect, useState } from 'react';
import { request } from '../../utils/fetch';
import './CreateReportDetail.scss';
import { useSnackbar } from '../../components/Snackbar/context';
import Input from '../../components/Input';
import AcceptModal from '../../components/Modal/AcceptModal';
import SearchInput from '../../components/SearchInput';
import TextArea from '../../components/TextArea';
import { Box, Grid, Typography, Paper, CircularProgress, FormControl, InputLabel, MenuItem, LinearProgress, Button, Select as MuiSelect } from '@mui/material';
import { translate } from '../../utils/translations';

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;

const REPORTS = 'report';
const INTERPRETATIONS = 'interpretation';

const createInitialLocalData = referencesWithGenotypes =>
	referencesWithGenotypes?.reduce(
		(prev, curr) => ({
			...prev,
			[curr.id]: { genotype: null },
		}),
		{},
	);

const CreateReportDetail = props => {
	const { user, referencesWithGenotypes, selectedReport, onReportCreated, onCancel } = props;
	const [localData, setLocalData] = useState(createInitialLocalData(referencesWithGenotypes));
	const [searchValue, setSearchValue] = useState('');
	const [, setSnackbar] = useSnackbar();
	const [reportDate, setReportDate] = useState(`${year}-${month}-${day}`);
	const [samplingDate, setSamplingDate] = useState(`${year}-${month}-${day}`);
	const [observations, setObservations] = useState('');
	const [interpretations, setInterpretations] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [showUnfinishedWorkModal, setShowUnfinishedWorkModal] = useState(false);

	const showSnackbarMessage = (className, message) => {
		setSnackbar({
			show: true,
			message,
			className
		});
	};

	useEffect(() => {
		setIsLoading(true);
		if (selectedReport?.id) {
			request(
				`${REPORTS}/detailed/${selectedReport?.id}`,
				{ method: 'GET' },
				data => {
					try {
						// Create initial data structure for all reference SNPs
						const initialData = createInitialLocalData(referencesWithGenotypes);
						
						// Update with saved values and their interpretations
						const newLocalData = {};
						const newInterpretations = {};

						data.forEach(item => {
							newLocalData[item.reference_snp] = {
								genotype: item.result,
								genotype_name: item.genotype_name
							};
							// Store the interpretation directly from the API response
							newInterpretations[item.reference_snp] = item.interpretation || '';
						});

						// Merge with initial data to ensure all reference SNPs are included
						const finalLocalData = { ...initialData, ...newLocalData };

						setReportDate(selectedReport.report_date);
						setSamplingDate(selectedReport.sampling_date);
						setObservations(selectedReport.observations ?? '');
						setInterpretations(newInterpretations);
						setLocalData(finalLocalData);
					} catch (error) {
						console.error('Error processing report data:', error);
						showSnackbarMessage('error', translate('error_loading_report'));
					} finally {
						setIsLoading(false);
					}
				},
				onError,
			);
		} else {
			// Initialize with empty values for all reference SNPs
			const initialData = referencesWithGenotypes.reduce(
				(prev, curr) => ({
					...prev,
					[curr.id]: { genotype: null, genotype_name: null },
				}),
				{},
			);
			setLocalData(initialData);
			setSamplingDate(`${year}-${month}-${day}`);
			setReportDate(`${year}-${month}-${day}`);
			setObservations('');
			setInterpretations({});
			setIsLoading(false);
		}
	}, [selectedReport?.id, referencesWithGenotypes]);

	const onError = response => {
		setIsLoading(false);
		if (response.status === 403) {
			setSnackbar({
				show: true,
				message: translate('session_expired'),
				className: 'error',
			});
		} else {
			setSnackbar({
				show: true,
				message: translate('generic_error'),
				className: 'error',
			});
		}
	};

	const onGenotypeSelected = (value, referenceSnp) => {
		const rsId = referenceSnp.id;
		
		// Only fetch interpretation when selecting a new genotype
		setInterpretations(prev => ({
			...prev,
			[rsId]: undefined // Set to undefined to show loading state
		}));
		
		request(
			`${INTERPRETATIONS}/findResultInterpretation/${rsId}/${value}`,
			{ method: 'GET' },
			data => {
				setInterpretations(prev => ({
					...prev,
					[rsId]: data.interpretation,
				}));
			},
			onError,
		);

		// Update local data with the selected genotype
		const selectedGenotype = referenceSnp.genotypes.find(g => g.genotype_id === value);
		setLocalData(prev => ({
			...prev,
			[rsId]: { 
				genotype: value,
				genotype_name: selectedGenotype?.genotype_name
			}
		}));
	};

	const saveChanges = () => {
		setIsLoading(true);
		if (selectedReport?.id) {
			request(
				REPORTS,
				{
					method: 'PUT',
					body: {
						reportId: selectedReport.id,
						reportDate,
						samplingDate,
						observations,
						detail: localData,
					},
				},
				() => {
					setSnackbar({
						show: true,
						message: translate('report_updated'),
						className: 'success',
					});
					onReportCreated();
					setIsLoading(false);
				},
				(error) => {
					setIsLoading(false);
					setSnackbar({
						show: true,
						message: error.data?.message || translate('error_updating_report'),
						className: 'error',
					});
				}
			);
		} else {
			const detail = Object.keys(localData).reduce(
				(prev, key) => ({
					...prev,
					...(localData[key].genotype
						? { [key]: { genotype: localData[key].genotype } }
						: {}),
				}),
				{},
			);
			request(
				REPORTS,
				{ 
					method: 'POST', 
					body: { 
						user, 
						reportDate, 
						samplingDate, 
						observations, 
						detail 
					} 
				},
				() => {
					setSnackbar({
						show: true,
						message: translate('report_created'),
						className: 'success',
					});
					onReportCreated();
					setIsLoading(false);
				},
				(error) => {
					setIsLoading(false);
					setSnackbar({
						show: true,
						message: error.data?.message || translate('error_creating_report'),
						className: 'error',
					});
				}
			);
		}
	};

	const onSaveReport = () => {
		const unfilledGenotypes = referencesWithGenotypes.filter(rd => !localData[rd.id]?.genotype).length;
		const hasUnfilledGenotypes = unfilledGenotypes > 0;
		
		if (hasUnfilledGenotypes) {
			setShowUnfinishedWorkModal(true);
		} else {
			saveChanges();
		}
	};

	const onDeleteReport = (reportId) => {
		setIsLoading(true);
		request(
			`${REPORTS}/${reportId}`,
			{ method: 'DELETE' },
			() => {
				setSnackbar({
					show: true,
					message: translate('report_deleted'),
					className: 'success',
				});
				onReportCreated();
				setIsLoading(false);
			},
			(error) => {
				setIsLoading(false);
				setSnackbar({
					show: true,
					message: error.data?.message || translate('error_deleting_report'),
					className: 'error',
				});
			}
		);
	};

	const filteredReferences = searchValue
		? referencesWithGenotypes.filter(referenceWithGenotype =>
				referenceWithGenotype.rs_name.includes(searchValue),
		  )
		: referencesWithGenotypes;

	return (
		<>
			<Box 
				sx={{ 
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 1200,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					bgcolor: 'rgba(0, 0, 0, 0.5)'
				}}
			>
				<Box
					sx={{
						width: '90vw',
						height: '90vh',
						maxWidth: '1200px',
						bgcolor: '#ffffff',
						borderRadius: 2,
						display: 'flex',
						flexDirection: 'column',
						color: 'black',
						position: 'relative',
						zIndex: 1201,
						p: 3,
						gap: 2
					}}
				>
					{isLoading && (
						<Box 
							sx={{ 
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								zIndex: 1202,
								bgcolor: 'rgba(255, 255, 255, 0.8)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<CircularProgress />
						</Box>
					)}

					{/* Header Section */}
					<Typography variant="h4" sx={{ textAlign: 'center', color: 'black' }}>
						{selectedReport?.id ? translate('edit_report') : translate('create_report')}
					</Typography>

					{/* Dates and Observations */}
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								<Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: 'black' }}>
									{translate('report_date')}
								</Typography>
								<Input
									type='date'
									value={reportDate}
									onChange={event => setReportDate(event.target.value)}
									placeholder={translate('report_date_label')}
									aria-label={translate('report_date_label')}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: 'black' }}>
									{translate('sampling_date')}
								</Typography>
								<Input
									type='date'
									value={samplingDate}
									onChange={event => setSamplingDate(event.target.value)}
									placeholder={translate('sampling_date_label')}
									aria-label={translate('sampling_date_label')}
								/>
							</Grid>
						</Grid>

						<Box>
							<Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: 'black' }}>
								{translate('observations')}
							</Typography>
							<TextArea
								value={observations}
								onChange={event => setObservations(event.target.value)}
								placeholder={translate('observations_label')}
								aria-label={translate('observations_label')}
							/>
						</Box>
					</Box>

					{/* Search and RS List Section */}
					<Paper 
						sx={{ 
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							bgcolor: '#ffffff',
							borderRadius: 2,
							overflow: 'hidden',
							border: '1px solid rgba(0, 0, 0, 0.12)',
							boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
						}}
					>
						{/* Search Box */}
						<Box 
							sx={{ 
								p: 2,
								borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
								bgcolor: '#f5f5f5'
							}}
						>
							<SearchInput 
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								placeholder={translate('search_rs')}
								fullWidth
								size="small"
							/>
						</Box>

						{/* RS Grid */}
						<Box 
							sx={{ 
								flex: 1,
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
								gap: 2,
								overflowY: 'auto',
								p: 2,
								bgcolor: '#ffffff',
								'&::-webkit-scrollbar': {
									width: '8px'
								},
								'&::-webkit-scrollbar-track': {
									bgcolor: '#f5f5f5',
									borderRadius: 1
								},
								'&::-webkit-scrollbar-thumb': {
									bgcolor: '#ddd',
									borderRadius: 1,
									'&:hover': {
										bgcolor: '#ccc'
									}
								}
							}}
						>
							{filteredReferences && filteredReferences.length > 0 ? (
								filteredReferences.map(r => (
									<Paper
										key={r.id}
										sx={{ 
											p: 2,
											bgcolor: '#ffffff',
											border: '1px solid rgba(0, 0, 0, 0.12)',
											borderRadius: 2,
											boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
										}}
									>
										<Typography variant="h6" sx={{ mb: 1, color: 'black' }}>
											{r.rs_name}
										</Typography>
										
										<FormControl fullWidth>
											<InputLabel sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
												{translate('select_genotype')}
											</InputLabel>
											<MuiSelect
												value={localData[r.id]?.genotype || ''}
												onChange={(event) => onGenotypeSelected(event.target.value, r)}
												label={translate('select_genotype')}
												disabled={isLoading}
												MenuProps={{
													PaperProps: {
														sx: {
															maxHeight: 300,
															bgcolor: '#ffffff',
															boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
															'& .MuiMenuItem-root': {
																color: 'black',
																'&:hover': {
																	bgcolor: '#f5f5f5'
																},
																'&.Mui-selected': {
																	bgcolor: '#e3f2fd',
																	'&:hover': {
																		bgcolor: '#bbdefb'
																	}
																}
															}
														}
													},
													container: document.getElementById('root'),
													sx: { 
														zIndex: theme => theme.zIndex.modal + 2
													}
												}}
											>
												{r.genotypes && r.genotypes.length > 0 ? (
													r.genotypes.map((g) => (
														<MenuItem 
															key={g.genotype_id}
															value={g.genotype_id}
															selected={localData[r.id]?.genotype === g.genotype_id}
														>
															{g.genotype_name}
														</MenuItem>
													))
												) : (
													<MenuItem disabled>
														{translate('no_genotypes')}
													</MenuItem>
												)}
											</MuiSelect>
										</FormControl>

										{/* Interpretation Section */}
										<Box 
											sx={{
												mt: 2,
												p: 2,
												bgcolor: '#f5f5f5',
												borderRadius: 1,
												border: '1px solid rgba(0, 0, 0, 0.12)',
												minHeight: '80px',
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'center'
											}}
										>
											<Typography variant="subtitle2" sx={{ 
												fontWeight: 'bold',
												mb: 1,
												color: 'black'
											}}>
												{translate('interpretation')}:
											</Typography>
											
											{localData[r.id]?.genotype ? (
												interpretations[r.id] === undefined ? (
													<Box sx={{ width: '100%' }}>
														<Typography variant="body2" sx={{ 
															mb: 1,
															color: 'rgba(0, 0, 0, 0.6)'
														}}>
															{translate('loading_interpretation')}
														</Typography>
														<LinearProgress 
															sx={{ 
																bgcolor: 'rgba(0, 0, 0, 0.1)',
																'& .MuiLinearProgress-bar': {
																	bgcolor: 'primary.main'
																}
															}} 
														/>
													</Box>
												) : (
													<Typography sx={{ color: 'black' }}>
														{interpretations[r.id] || translate('no_interpretation')}
													</Typography>
												)
											) : (
												<Typography sx={{ color: 'rgba(0, 0, 0, 0.6)', fontStyle: 'italic' }}>
													{translate('select_genotype_to_see_interpretation')}
												</Typography>
											)}
										</Box>
									</Paper>
								))
							) : (
								<Box sx={{ 
									gridColumn: '1 / -1',
									textAlign: 'center',
									p: 4,
									color: 'rgba(0, 0, 0, 0.6)'
								}}>
									<Typography>
										{searchValue ? translate('no_rs_found') : translate('no_rs_available')}
									</Typography>
								</Box>
							)}
						</Box>
					</Paper>

					{/* Footer */}
					<Box 
						sx={{ 
							display: 'flex',
							justifyContent: 'flex-end',
							gap: 2,
							pt: 2
						}}
					>
						<Button
							variant="outlined"
							color="error"
							onClick={() => setShowModal(true)}
						>
							{translate('cancel')}
						</Button>
						<Button
							variant="contained"
							onClick={onSaveReport}
							disabled={isLoading}
							sx={{
								background: 'linear-gradient(45deg, #004A93 30%, #00B5E2 90%)',
								'&:hover': {
									background: 'linear-gradient(45deg, #003366 30%, #007d99 90%)'
								}
							}}
						>
							{isLoading ? translate('saving') : translate('save')}
						</Button>
					</Box>
				</Box>
			</Box>

			{/* Unfinished Work Modal */}
			{showUnfinishedWorkModal && (
				<AcceptModal
					title={translate('unfinished_work')}
					message={translate('unfinished_work_message')}
					onAccept={() => {
						setShowUnfinishedWorkModal(false);
						saveChanges();
					}}
					onReject={() => {
						setShowUnfinishedWorkModal(false);
					}}
				/>
			)}

			{/* Cancel Modal */}
			{showModal && (
				<AcceptModal
					title={selectedReport?.id ? translate('cancel_edit') : translate('cancel_create')}
					message={selectedReport?.id ? translate('cancel_edit_message') : translate('cancel_create_message')}
					onAccept={onCancel}
					onReject={() => {
						setShowModal(false);
					}}
				/>
			)}
		</>
	);
};

export default CreateReportDetail;
