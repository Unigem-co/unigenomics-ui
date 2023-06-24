import React, { useEffect, useState } from 'react';
import { request } from '../../utils/fetch';
import Table from '../../components/Table';
import Form from '../../components/Form';

const DependentData = props => {
	const { endpoint, dependencies } = props;

	const [data, setData] = useState([]);
	const [schema, setSchema] = useState([]);
	const [selectedValue, setSelectedValue] = useState({});
	const [showForm, setShowForm] = useState(false);

	const onError = error => {
		console.log(error);
	};

	useEffect(() => {
		request(endpoint, { method: 'GET' }, d => setData(d), onError);
		request(`${endpoint}/schema`, { method: 'GET' }, d => setSchema(d), onError);
	}, [endpoint]);

	const changeIdsToDescriptions = value =>
		Object.keys(value).reduce(
			(prev, curr) => ({
				...prev,
				[curr]: dependencies[curr]
					? dependencies[curr]?.data.find(d => d.id === value[curr])[
							dependencies[curr].displayValue
					  ]
					: value[curr],
			}),
			{},
		);

	const onSave = async value => {
		const descriptions = changeIdsToDescriptions(value);
		if (value.id) {
			request(
				endpoint,
				{ method: 'PUT', body: value },
				d => setData([...data.filter(v => v.id !== value.id), descriptions]),
				onError,
			);
		} else {
			request(
				endpoint,
				{ method: 'POST', body: value },
				d => setData([...data, { ...descriptions, id: d.id }]),
				onError,
			);
		}
		setSelectedValue({});
		setShowForm(false);
	};
	const onCreate = () => {
		setSelectedValue({});
		setShowForm(true);
	};
	const onUpdate = value => {
		setSelectedValue(value);
		setShowForm(true);
	};
	const onDelete = async value => {
		request(
			endpoint,
			{ method: 'DELETE', body: value },
			d => setData(data.filter(v => v.id !== d.id)),
			onError,
		);
		setSelectedValue({});
	};

	const onCancel = () => {
		setSelectedValue({});
		setShowForm(false);
	};

	return (
		<>
			<Table
				data={data}
				columns={schema}
				onCreate={onCreate}
				onUpdate={onUpdate}
				onDelete={onDelete}
			/>
			{showForm && (
				<Form
					data={selectedValue}
					schema={schema}
					dependencies={dependencies}
					onSave={onSave}
					onCancel={onCancel}
				/>
			)}
		</>
	);
};

export default DependentData;
