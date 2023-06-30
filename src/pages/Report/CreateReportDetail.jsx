import React, { useEffect, useState } from 'react'
import { request } from '../../utils/fetch';
import Select from '../../components/Select';
import './CreateReportDetail.scss';
import { useSnackbar } from '../../components/Snackbar/context';
import Input from '../../components/Input';

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;

const CreateReportDetail = (props) => {
  const { user } = props;
  const [reportDetail, setReportDetail] = useState([]);
  const [localData, setLocalData] = useState({});
  const [schema, setSchema] = useState([]);
  const [, setSnackbar] = useSnackbar();

  const [reportDate, setReportDate] = useState(`${year}-${month}-${day}`);

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

  useEffect(() => {
    request('report', { method: 'GET' }, data => {
		setReportDetail(data);
		const initialLocalData = data.reduce(
			(prev, curr) => ({
				...prev,
				[curr.id]: null,
			}),
			{},
		);
		setLocalData(initialLocalData);
	}, onError);
    request('report/schema', { method: 'GET' }, data => setSchema(data), onError);
  }, [])

  const onGenotypeSelected = (value, referenceSnp) => {
    setLocalData({ ...localData, [referenceSnp.id]: value });
  }

  const onSaveReport = () => {
	const formFilled = reportDetail.filter(rd => {
		console.log(localData[rd.id]);
		return localData[rd.id] ? false : true;
	}).length === 0;
	console.log({ reportDetail, formFilled});
	if (formFilled) {
		request(
			'report',
			{ method: 'POST', body: { user, reportDate, detail: localData } },
			() => {
				setSnackbar({
					show: true,
					message: 'Reporte creado',
					className: 'success',
				});
			},
			onError,
		);
	} else {
		setSnackbar({
			show: true,
			message: 'Faltan campos por llenar',
			className: 'error',
		});
	}
  }

  return (
		<div className='create-report-detail'>
			<div className="report-name">
				<label>Fecha de Reporte</label>
				<Input
					type='date'
					value={reportDate}
					onChange={event => setReportDate(event.target.value)}
				/>
			</div>
			<div className='report-detail-form'>
				{reportDetail.map(r => (
					<div className='reference-snp'>
						<label>{r.rs_name}</label>
						<Select
							value={localData[r.id] || null}
							options={r.genotypes?.map(g => ({
								id: g.genotype_id,
								text: g.genotype_name,
							}))}
							onSelect={value => onGenotypeSelected(value, r)}
						/>
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
}

export default CreateReportDetail