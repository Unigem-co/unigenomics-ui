import React, { useEffect, useState } from 'react';
import { request } from '../../utils/fetch';
import Form from '../../components/Form';
import Select from '../../components/Select';
import CreateReportDetail from './CreateReportDetail';
import Table from '../../components/Table';

import './CreateReport.scss';
import { useSnackbar } from '../../components/Snackbar/context';
import AcceptModal from '../../components/Modal/AcceptModal';

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

const requestReports = (selectedUser, setReports, onError) => {
	request(
		`${REPORTS}/userReports/${selectedUser}`,
		{ method: 'GET' },
		d => {
			setReports(d);
		},
		onError,
	);
};
const Report = () => {
	const [schema, setSchema] = useState({});
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(0);
	const [showForm, setShowForm] = useState(false);
	const [showCreateReportDetail, setShowCreateReportDetail] = useState(false);
	const [reports, setReports] = useState([]);
	const [selectedReport, setSelectedReport] = useState();
	const [referencesWithGenotypes, setReferencesWithGenotypes] = useState([]);
	const [, setSnackbar] = useSnackbar();
	const [deleteRow, setDeleteRow] = useState({});
	const [showModal, setShowModal] = useState(false);
	const onError = error => console.log(error);

	useEffect(() => {
		request(USERS, { method: 'GET' }, d => setUsers(d), onError);
		request(`${USERS}/schema`, { method: 'GET' }, d => setSchema(d), onError);
		request(REPORTS, { method: 'GET' }, d => setReferencesWithGenotypes(d), onError);
	}, []);

	useEffect(() => {
		requestReports(selectedUser, setReports, onError);
	}, [selectedUser]);

	const onUserSelected = value => {
		setShowForm(true);
		setSelectedUser(value);
	};

	const onDelete = () => {
		request(
			'report',
			{ method: 'DELETE', body: deleteRow },
			(id) => {
				setSnackbar({
					show: true,
					message: 'Reporte eliminado',
					className: 'success',
				});
				requestReports(selectedUser, setReports, onError);
			},
			onError,
		);
	};

	const onReportCreated = () => {
		requestReports(selectedUser, setReports, onError);
		setShowCreateReportDetail(false);
	}

	return (
		<>
			<div className='create-report'>
				<div>
					<label>Selecciona el usuario que deseas reportar:</label>
					<Select
						value={selectedUser}
						options={users.map(user => ({
							id: user.id,
							text: `${user.document} - ${user.name} ${user.last_names}`,
						}))}
						onSelect={onUserSelected}
					/>
				</div>
				{showForm && (
					<Form
						disabled
						schema={schema}
						data={users.find(user => user.id === selectedUser)}
						dependencies={dependencies}
					/>
				)}
				{!!reports?.length && (
					<Table
						data={reports}
						columns={Object.keys(reports[0]).map(key => ({ column_name: key }))}
						onUpdate={value => {
							setSelectedReport(value);
							setShowCreateReportDetail(true);
						}}
						onDelete={value => {
							setShowModal(true);
							setDeleteRow(value);
						}}
					/>
				)}
				{showForm && (
					<div className='create-report-options'>
						<button
							className='primary'
							onClick={() => {
								setShowCreateReportDetail(true);
								setSelectedReport(null);
							}}
						>
							Crear Reporte
						</button>
					</div>
				)}
			</div>
			{showCreateReportDetail && (
				<CreateReportDetail
					user={selectedUser}
					referencesWithGenotypes={referencesWithGenotypes}
					selectedReport={selectedReport}
					onReportCreated={onReportCreated}
				/>
			)}

			{showModal && (
				<AcceptModal
					title='Eliminar'
					message='Deseas eliminar este reporte?'
					onAccept={onDelete}
					onReject={() => {
						setShowModal(false);
					}}
				/>
			)}
		</>
	);
};

export default Report;
