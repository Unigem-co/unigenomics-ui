import React, { useEffect, useState } from 'react';
import { request } from '../../utils/fetch';
import Select from '../../components/Select';
import './CreateReportDetail.scss';
import { useSnackbar } from '../../components/Snackbar/context';
import Input from '../../components/Input';

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;

const createInitialLocalData = referencesWithGenotypes =>
	referencesWithGenotypes?.reduce(
		(prev, curr) => ({
			...prev,
			[curr.id]: { genotype: null, genotypeEffect: null },
		}),
		{},
	);

const CreateReportDetail = props => {
	const { user, referencesWithGenotypes, selectedReport, onReportCreated } = props;
	const [localData, setLocalData] = useState(createInitialLocalData(referencesWithGenotypes));
	const [, setSnackbar] = useSnackbar();
	const [reportDate, setReportDate] = useState(`${year}-${month}-${day}`);
	const [samplingDate, setSamplingDate] = useState(`${year}-${month}-${day}`);
	const [interpretations, setInterpretations] = useState({});

	useEffect(() => {
		if (selectedReport?.id) {
			request(
				`report/detailed/${selectedReport?.id}`,
				{ method: 'GET' },
				data => {
					setReportDate(selectedReport.report_date);
					setSamplingDate(selectedReport.sampling_date);
					console.log(data);
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
					setInterpretations(interpretations);
					setLocalData(newLocalData);
				},
				onError,
			);
		} else {
			setLocalData(createInitialLocalData(referencesWithGenotypes));
			setSamplingDate(`${year}-${month}-${day}`);
			setReportDate(`${year}-${month}-${day}`);
		}
	}, [selectedReport?.id]);

	const onError = response => {
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
		request(
			`interpretation/findResultInterpretation/${referenceSnp.id}/${value}`,
			{method: 'GET'},
			data => setInterpretations({ ...interpretations, [referenceSnp.rs_name]: data.interpretation }),
			onError,
		);
		setLocalData({
			...localData,
			[referenceSnp.id]: { ...localData[referenceSnp.id], genotype: value },
		});
	};

	const onSaveReport = () => {
		const formFilled =
			referencesWithGenotypes.filter(rd =>
				localData[rd.id].genotype ? false : true,
			).length === 0;

		if (formFilled) {
			if (selectedReport?.id) {
				request(
					'report',
					{ method: 'PUT', body: { user, reportDate, samplingDate, detail: localData } },
					() => {
						setSnackbar({
							show: true,
							message: 'Reporte creado',
							className: 'success',
						});
						onReportCreated();
					},
					onError,
				);
			} else {
				request(
					'report',
					{ method: 'POST', body: { user, reportDate, samplingDate, detail: localData } },
					() => {
						setSnackbar({
							show: true,
							message: 'Reporte creado',
							className: 'success',
						});
						onReportCreated();
					},
					onError,
				);
			}
		} else {
			setSnackbar({
				show: true,
				message: 'Faltan campos por llenar',
				className: 'error',
			});
		}
	};

	return (
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
			</div>
			<div className='report-detail-form'>
				{referencesWithGenotypes.map(r => (
					<div className='reference-snp'>
						<label>{r.rs_name}</label>
						<div>
							<Select
								value={localData[r.id].genotype || null}
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
				<button className='primary' onClick={onSaveReport}>
					Guardar
				</button>
			</div>
		</div>
	);
};

export default CreateReportDetail;
