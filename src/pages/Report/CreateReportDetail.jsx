import React, { useEffect, useState } from 'react';
import { request } from '../../utils/fetch';
import Select from '../../components/Select';
import './CreateReportDetail.scss';
import { useSnackbar } from '../../components/Snackbar/context';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import AcceptModal from '../../components/Modal/AcceptModal';
import SearchInput from '../../components/SearchInput';
import TextArea from '../../components/TextArea';
import { Box, Grid, Typography, Paper, CircularProgress, FormControl, InputLabel, MenuItem, LinearProgress, Button, Select as MuiSelect } from '@mui/material';

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;

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

	useEffect(() => {
		setIsLoading(true);
		if (selectedReport?.id) {
			request(
				`report/detailed/${selectedReport?.id}`,
				{ method: 'GET' },
				data => {
					const newLocalData = data.reduce(
						(prev, curr) => ({
							...prev,
							[curr.reference_snp]: {
								genotype: curr.result,
								genotypeEffect: curr.genotype_effect,
							},
						}),
						{},
					);
					const newInterpretations = data.reduce(
						(prev, curr) => ({
							...prev,
							[curr.reference_snp]: curr.interpretation,
						}),
						{},
					);
					setReportDate(selectedReport.report_date);
					setSamplingDate(selectedReport.sampling_date);
					setObservations(selectedReport.observations ?? '');
					setInterpretations(newInterpretations);
					setLocalData(newLocalData);
					setIsLoading(false);
				},
				onError,
			);
		} else {
			setLocalData(createInitialLocalData(referencesWithGenotypes));
			setSamplingDate(`${year}-${month}-${day}`);
			setReportDate(`${year}-${month}-${day}`);
			setObservations('');
			setInterpretations({});
			setIsLoading(false);
		}
	}, [selectedReport?.id]);

	const onError = response => {
		setIsLoading(false);
		if (response.status === 403) {
			setSnackbar({
				show: true,
				message: 'Tu sesión ha finalizado, intenta volver a iniciar sesión',
				className: 'error',
			});
		} else {
			setSnackbar({
				show: true,
				message: 'Ocurrió un error, intentalo más tarde',
				className: 'error',
			});
		}
	};

	const onGenotypeSelected = (value, referenceSnp) => {
		const rsId = referenceSnp.id;
		setInterpretations(prev => ({
			...prev,
			[rsId]: undefined // Set to undefined to show loading state
		}));
		
		request(
			`interpretation/findResultInterpretation/${rsId}/${value}`,
			{ method: 'GET' },
			data => {
				setInterpretations(prev => ({
					...prev,
					[rsId]: data.interpretation,
				}));
			},
			onError,
		);
		setLocalData({
			...localData,
			[rsId]: { ...localData[rsId], genotype: value },
		});
	};

	const saveChanges = () => {
		setIsLoading(true);
		if (selectedReport?.id) {
			request(
				'report',
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
						message: 'Reporte actualizado exitosamente',
						className: 'success',
					});
					onReportCreated();
					setIsLoading(false);
				},
				onError,
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
				'report',
				{ method: 'POST', body: { user, reportDate, samplingDate, observations, detail } },
				() => {
					setSnackbar({
						show: true,
						message: 'Reporte creado exitosamente',
						className: 'success',
					});
					onReportCreated();
					setIsLoading(false);
				},
				onError,
			);
		}
	};

	const onSaveReport = () => {
		const formFilled = referencesWithGenotypes.filter(rd => !localData[rd.id]?.genotype).length === 0;
		console.log(formFilled)
		if (!formFilled) {
			setShowUnfinishedWorkModal(true);
		} else {
			saveChanges();
		}
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
						{selectedReport?.id ? 'Editar Reporte' : 'Crear Reporte'}
					</Typography>

					{/* Dates and Observations */}
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} md={6}>
								<Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: 'black' }}>
									Fecha de Reporte
								</Typography>
								<Input
									type='date'
									value={reportDate}
									onChange={event => setReportDate(event.target.value)}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: 'black' }}>
									Toma de muestra
								</Typography>
								<Input
									type='date'
									value={samplingDate}
									onChange={event => setSamplingDate(event.target.value)}
								/>
							</Grid>
						</Grid>

						<Box>
							<Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5, color: 'black' }}>
								Observaciones
							</Typography>
							<TextArea
								value={observations}
								onChange={event => setObservations(event.target.value)}
								placeholder="Ingrese observaciones adicionales..."
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
								placeholder='Buscar RS'
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
												Seleccionar genotipo
											</InputLabel>
											<MuiSelect
												value={localData[r.id]?.genotype || ''}
												onChange={(event) => onGenotypeSelected(event.target.value, r)}
												label="Seleccionar genotipo"
												MenuProps={{
													PaperProps: {
														sx: {
															bgcolor: '#ffffff',
															boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
															'& .MuiMenuItem-root': {
																color: 'black',
																'&:hover': {
																	bgcolor: '#f5f5f5'
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
													r.genotypes.map((g, index) => (
														<MenuItem 
															key={`${g.genotype_id}-${index}`} 
															value={g.genotype_id}
														>
															{g.genotype_name}
														</MenuItem>
													))
												) : (
													<MenuItem disabled>
														No hay genotipos disponibles
													</MenuItem>
												)}
											</MuiSelect>
										</FormControl>

										{localData[r.id]?.genotype && (
											<Box 
												sx={{
													mt: 2,
													p: 2,
													bgcolor: '#f5f5f5',
													borderRadius: 1,
													border: '1px solid rgba(0, 0, 0, 0.12)'
												}}
											>
												{interpretations[r.id] === undefined ? (
													<Box sx={{ width: '100%' }}>
														<Typography variant="body2" sx={{ 
															mb: 1,
															color: 'rgba(0, 0, 0, 0.6)'
														}}>
															Cargando interpretación...
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
													<>
														<Typography variant="subtitle2" sx={{ 
															fontWeight: 'bold',
															mb: 1,
															color: 'black'
														}}>
															Interpretación:
														</Typography>
														<Typography sx={{ color: 'black' }}>
															{interpretations[r.id] || 'No hay interpretación disponible'}
														</Typography>
													</>
												)}
											</Box>
										)}
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
										{searchValue ? 'No se encontraron RS que coincidan con la búsqueda' : 'No hay RS disponibles'}
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
							Cancelar
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
							{isLoading ? 'Guardando...' : 'Guardar'}
						</Button>
					</Box>
				</Box>
			</Box>

			{/* Render AcceptModal outside the main container */}
			{showModal && (
				<AcceptModal
					title={selectedReport?.id ? 'Cancelar edición' : 'Cancelar creación'}
					message={selectedReport?.id ? '¿Deseas salir sin guardar los cambios de la edición?' : '¿Deseas salir sin guardar el nuevo reporte?'}
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
