import React, { useEffect, useState } from 'react';
import { request } from '../../utils/fetch';
import Form from '../../components/Form';
import Select from '../../components/Select';
import './CreateReport.scss';
import CreateReportDetail from './CreateReportDetail';

const API = '/users/user';
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
	const [selectedValue, setSelectedValue] = useState(0);
	const [showForm, setShowForm] = useState(false);
	const [showCreateReportDetail, setShowCreateReportDetail] = useState(false);
	const onError = error => console.log(error);

	useEffect(() => {
		request(API, { method: 'GET' }, d => setUsers(d), onError);
		request(`${API}/schema`, { method: 'GET' }, d => setSchema(d), onError);
	}, []);

	const onUserSelected = value => {
		setShowForm(true);
		setSelectedValue(value);
	};

	return (
		<>
			<div className='create-report'>
				<label>Selecciona el usuario que deseas reportar:</label>
				<Select
					value={selectedValue}
					options={users.map(user => ({
						id: user.id,
						text: `${user.document} - ${user.name} ${user.last_names}`,
					}))}
					onSelect={onUserSelected}
				/>
				{showForm && (
					<>
						<Form
							disabled
							schema={schema}
							data={users.find(user => user.id === selectedValue)}
							dependencies={dependencies}
						/>
						<div className='create-report-options'>
							<button className='primary' onClick={setShowCreateReportDetail}>
								Crear Reporte
							</button>
						</div>
					</>
				)}
			</div>
			{showCreateReportDetail && <CreateReportDetail user={selectedValue} />}
		</>
	);
}

export default Report;
