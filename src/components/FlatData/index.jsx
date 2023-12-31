import React, { useEffect, useState } from 'react';
import { request } from '../../utils/fetch';
import Table from '../../components/Table';
import Form from '../../components/Form';
import { useSnackbar } from '../Snackbar/context';
import AcceptModal from '../Modal/AcceptModal';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading';

const FlatData = props => {
	const { endpoint } = props;
	const [data, setData] = useState([]);
	const [schema, setSchema] = useState([]);
	const [selectedRow, setSelectedRow] = useState({});
	const [showForm, setShowForm] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [, setSnackbar] = useSnackbar();
	const [isLoading, setisLoading] = useState(false);

	const navigate = useNavigate();

	const onError = response => {
		setisLoading(false);
		if (response.status === 403) {
			navigate('/login', { replace: true });
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
		setisLoading(true);
		request(
			endpoint,
			{ method: 'GET' },
			d => {
				setData(d);
				setisLoading(false);
			},
			onError,
		);
		request(
			`${endpoint}/schema`,
			{ method: 'GET' },
			s => {
				setSchema(s);
			},
			onError,
		);
	}, [endpoint]);

	const onCreate = () => {
		setShowForm(false);
		setSelectedRow({});
		setShowForm(true);
	};

	const onUpdate = value => {
		setShowForm(false);
		setSelectedRow(value);
		setShowForm(true);
	};

	const onDelete = async value => {
		setisLoading(true);
		console.log(value);
		await request(
			endpoint,
			{ method: 'DELETE', body: value },
			() => {
				setData(data.filter(gen => gen.id !== value.id));
				setShowForm(false);
				setSnackbar({
					show: true,
					message: 'Registro eliminado',
					className: 'success',
				});
				setisLoading(false);
			},
			onError,
		);
		setShowModal(false);
	};

	const onSave = async values => {
		setisLoading(true);
		if (values.id) {
			await request(
				endpoint,
				{ method: 'PUT', body: values },
				() => {
					setData([...data.filter(d => d.id !== values.id), values]);
					setShowForm(false);
					setisLoading(false);
					setSnackbar({
						show: true,
						message: 'Registro actualizado',
						className: 'success',
					});
				},
				onError,
			);
		} else {
			await request(
				endpoint,
				{ method: 'POST', body: values },
				res => {
					setData([...data, { id: res.id, ...values }]);
					setShowForm(false);
					setisLoading(false);
					setSnackbar({
						show: true,
						message: 'Registro creado',
						className: 'success',
					});
				},
				onError,
			);
		}
	};

	const onCancel = () => setShowForm(false);

	return (
		<>
			{isLoading && <Loading />}
			{!isLoading && (
				<Table
					data={data}
					columns={schema}
					onCreate={onCreate}
					onUpdate={onUpdate}
					onDelete={(value) => {
						setSelectedRow(value);
						setShowModal(true);
					}}
				/>
			)}
			{showForm && (
				<div className='side-form'>
					<Form schema={schema} data={selectedRow} onSave={onSave} onCancel={onCancel} />
				</div>
			)}
			{showModal && (
				<AcceptModal
					title='Eliminar'
					message='Deseas eliminar este registro?'
					onAccept={() => onDelete(selectedRow)}
					onReject={() => {
						setShowModal(false);
					}}
				/>
			)}
		</>
	);
};

export default FlatData;
