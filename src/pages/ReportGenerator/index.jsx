import React, { useEffect } from 'react';
import { parseJwt } from '../../utils/jwt';
import { fileRequest, request } from '../../utils/fetch';
import { useState } from 'react';
import Table from '../../components/Table';
import './ReportGenerator.scss';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../components/Snackbar/context';
import AcceptModal from '../../components/Modal/AcceptModal';
import Loading from '../../components/Loading';

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
		setLoading(true);
		const jwt = window.localStorage.getItem('token');
		const user = parseJwt(jwt);
		if (user) {
			request(
				`report/userReports/${user.id}`,
				{ method: 'GET' },
				data => { 
					setReports(data);
					setLoading(false);
				},
				onError,
			);
		}
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
		<div className='user-report'>
			{loading && <Loading />}
			<header className='header'>
				<div className='unigem-logo'>
					<img
						src='https://unigem.co/wp-content/uploads/2014/09/cropped-cropped-logo-unigem.png'
						alt='unigem-logo'
					/>
				</div>
				<div>
					<div className='sign-out'>
						<button
							className='delete'
							onClick={() => setShowModal(true)}
							title='Cerrar sesión'
						>
							<i className='bi bi-box-arrow-left'></i>
						</button>
					</div>
				</div>
			</header>
			<div className='report-generator'>
				<div className='reports'>
					<h3>Reportes</h3>
					<p>
						Puedes escoger que reporte deseas generar dando click en las opciones de
						abajo. Un PDF aparecerá a la derecha cuando la generación del mismo termine.
					</p>
					<Table
						data={reports}
						columns={Object.keys(reports[0] || {})
							?.map(key => ({ column_name: key }))
							.filter(column => column.column_name !== 'id')}
						onUpdate={onGenerateReport}
						onUpdateText={<i className='bi bi-eye'></i>}
						onUpdateTooltip='Ver reporte'
					/>
				</div>
				{reportGenerated && (
					<div className='generated-report'>
						<embed src={fileUrl} className='embedded-pdf' />
					</div>
				)}
			</div>
			{showModal && (
				<AcceptModal
					title='Salir'
					message='Deseas cerrar la sesión?'
					onAccept={logout}
					onReject={() => {
						setShowModal(false);
					}}
				/>
			)}
		</div>
	);
};

export default ReportGenerator;
