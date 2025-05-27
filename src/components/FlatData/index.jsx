import React, { useState } from 'react';
import { Box } from '@mui/material';
import Table from '../../components/Table';
import FormModal from '../FormModal';
import ConfirmationModal from '../ConfirmationModal';
import PageContainer from '../PageContainer';

const FlatData = ({ 
	data = [],
	schema = [],
	title = '',
	dependencies = {},
	isLoading = false,
	onSave = async () => {},
	onDelete = async () => {}
}) => {
	const [selectedRow, setSelectedRow] = useState({});
	const [showForm, setShowForm] = useState(false);
	const [showModal, setShowModal] = useState(false);

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

	const handleDelete = async () => {
		await onDelete(selectedRow);
		setShowModal(false);
	};

	const handleSave = async values => {
		await onSave(values);
		setShowForm(false);
	};

	const onCancel = () => setShowForm(false);

	// Ensure schema has the required field property for DataGrid
	const processedSchema = schema.map(col => ({
		...col,
		field: col.column_name || col.field || 'id'
	}));

	// Ensure data has unique ids
	const processedData = data.map(row => ({
		...row,
		id: row.id || Math.random().toString()
	}));

	return (
		<PageContainer>
			<Box sx={{ height: '100%', position: 'relative' }}>
				<Table
					data={processedData}
					columns={processedSchema}
					onCreate={onCreate}
					onUpdate={onUpdate}
					onDelete={(value) => {
						setSelectedRow(value);
						setShowModal(true);
					}}
					title={title}
					isLoading={isLoading}
				/>

				<FormModal
					open={showForm}
					onClose={onCancel}
					data={selectedRow}
					schema={schema}
					dependencies={dependencies}
					onSave={handleSave}
				/>

				<ConfirmationModal
					open={showModal}
					title='Eliminar'
					message='¿Deseas eliminar este registro?'
					onConfirm={handleDelete}
					onCancel={() => setShowModal(false)}
				/>
			</Box>
		</PageContainer>
	);
};

export default FlatData;
