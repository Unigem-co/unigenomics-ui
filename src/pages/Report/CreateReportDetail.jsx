import React, { useEffect, useState } from 'react';
import { request } from '../../utils/fetch';
import Select from '../../components/Select';
import './CreateReportDetail.scss';
import { useSnackbar } from '../../components/Snackbar/context';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import AcceptModal from '../../components/Modal/AcceptModal';
import Search from '../../components/Search';
import TextArea from '../../components/TextArea';

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
					const interpretations = data.reduce(
						(prev, curr) => ({
							...prev,
							[curr.rs_name]: curr.interpretation,
						}),
						{},
					);
					setReportDate(selectedReport.report_date);
					setSamplingDate(selectedReport.sampling_date);
					setObservations(selectedReport.observations ?? '');
					setInterpretations(interpretations);
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
		setIsLoading(true);
		request(
			`interpretation/findResultInterpretation/${referenceSnp.id}/${value}`,
			{ method: 'GET' },
			data => {
				setInterpretations({
					...interpretations,
					[referenceSnp.rs_name]: data.interpretation,
				});
				setIsLoading(false);
			},
			onError,
		);
		setLocalData({
			...localData,
			[referenceSnp.id]: { ...localData[referenceSnp.id], genotype: value },
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
						message: 'Reporte creado',
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
						message: 'Reporte creado',
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
			{isLoading && <Loading />}
			<div className='create-report-detail'>
				<h2>{selectedReport?.id ? 'Editar Reporte' : 'Crear Reporte'}</h2>
				<div className='report-dates'>
					<div>
						<label>Fecha de Reporte</label>
						<Input
							type='date'
							value={reportDate}
							onChange={event => setReportDate(event.target.value)}
						/>
					</div>
					<div>
						<label>Toma de muestra</label>
						<Input
							type='date'
							value={samplingDate}
							onChange={event => setSamplingDate(event.target.value)}
						/>
					</div>
					<div className='report-observations'>
						<label>Observaciones</label>
						<TextArea
							type='text'
							value={observations}
							onChange={event => setObservations(event.target.value)}
						/>
					</div>
				</div>
				<Search placeholder='Buscar RS' onChange={e => setSearchValue(e.target.value)} />
				<div className='report-detail-form'>
					{filteredReferences.map(r => (
						<div className='reference-snp'>
							<label>{r.rs_name}</label>
							<div>
								<Select
									value={localData[r.id]?.genotype || null}
									options={r.genotypes?.map(g => ({
										id: g.genotype_id,
										text: g.genotype_name,
									}))}
									onSelect={value => onGenotypeSelected(value, r)}
								/>
							</div>
							{interpretations[r.rs_name] ? (
								<div className='genotypes' key={`${r.rs_name}-interpretation`}>
									<p>{interpretations[r.rs_name]}</p>
								</div>
							) : null}
						</div>
					))}
				</div>
				<div className='report-detail-actions'>
					<button className='delete' onClick={() => setShowModal(true)}>
						Cancelar
					</button>
					<button className='primary' onClick={onSaveReport}>
						Guardar
					</button>
				</div>

				{showModal && (
					<AcceptModal
						title='Cancelar cambios'
						message='Deseas salir sin guardar los cambios?'
						onAccept={onCancel}
						onReject={() => {
							setShowModal(false);
						}}
					/>
				)}
				{showUnfinishedWorkModal && (
					<AcceptModal
					    className="unfinished-work-modal"
						title='Campos vacíos'
						message='No llenaste todos los Resultados, deseas continuar?'
						onAccept={saveChanges}
						onReject={() => {
							setShowUnfinishedWorkModal(false);
						}}
					/>
				)}
			</div>
		</>
	);
};

export default CreateReportDetail;
