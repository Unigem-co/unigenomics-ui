import React, { useEffect, useState } from 'react';
import { request } from '../../utils/fetch';
import Table from '../../components/Table';
import Form from '../../components/Form';
import { useSnackbar } from '../Snackbar/context';
import AcceptModal from '../Modal/AcceptModal';
import Loading from '../Loading';

const DependentData = props => {
	const { endpoint, dependencies } = props;
	const [data, setData] = useState([]);
	const [schema, setSchema] = useState([]);
	const [selectedValue, setSelectedValue] = useState({});
	const [showForm, setShowForm] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [, setSnackbar] = useSnackbar();

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

	useEffect(() => {
		setIsLoading(true);
		request(
			endpoint,
			{ method: 'GET' },
			d => {
				setData(d);
				setIsLoading(false);
			},
			onError,
		);
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
		setIsLoading(true);
		const descriptions = changeIdsToDescriptions(value);
		if (value.id) {
			request(
				endpoint,
				{ method: 'PUT', body: value },
				d => {
					setData([...data.filter(v => v.id !== value.id), descriptions]);
					setIsLoading(false);
					setSnackbar({
						show: true,
						message: 'Registro actualizado',
						className: 'success',
					});
				},
				onError,
			);
		} else {
			request(
				endpoint,
				{ method: 'POST', body: value },
				d => {
					setIsLoading(false);
					setData([...data, { ...descriptions, id: d.id }]);
					setSnackbar({
						show: true,
						message: 'Registro creado',
						className: 'success',
					});
				},
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
		setIsLoading(true);
		request(
			endpoint,
			{ method: 'DELETE', body: value },
			d => {
				setIsLoading(false);
				setData(data.filter(v => v.id !== d.id));
				setSnackbar({
					show: true,
					message: 'Registro eliminado',
					className: 'success',
				});
			},
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
			{isLoading && <Loading />}
			{!isLoading && (
				<Table
					data={data}
					columns={schema}
					onCreate={onCreate}
					onUpdate={onUpdate}
					onDelete={value => {
						setShowModal(true);
						setSelectedValue(value);
					}}
				/>
			)}
			{showForm && (
				<Form
					data={selectedValue}
					schema={schema}
					dependencies={dependencies}
					onSave={onSave}
					onCancel={onCancel}
				/>
			)}
			{showModal && (
				<AcceptModal
					title='Eliminar'
					message='Deseas eliminar este registro?'
					onAccept={() => onDelete(selectedValue)}
					onReject={() => {
						setShowModal(false);
					}}
				/>
			)}
		</>
	);
};

export default DependentData;
