import React, { useState } from 'react';
import { Box } from '@mui/material';
import Table from '../../components/Table';
import FormModal from '../FormModal';
import ConfirmationModal from '../ConfirmationModal';
import { useSnackbar } from '../Snackbar/context';
import Loading from '../Loading';
import PageContainer from '../PageContainer';
import { translate } from '../../utils/translations';

const DependentData = ({ 
	data = [],
	schema = [],
	dependencies = {},
	title = '',
	isLoading = false,
	onSave = async () => {},
	onDelete = async () => {}
}) => {
	const [selectedValue, setSelectedValue] = useState({});
	const [showForm, setShowForm] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const [, setSnackbar] = useSnackbar();

	const changeIdsToDescriptions = value =>
		Object.keys(value).reduce(
			(prev, curr) => ({
				...prev,
				[curr]: dependencies[curr]
					? dependencies[curr]?.data.find(d => d.id === value[curr])?.[
							dependencies[curr].displayValue
					  ] || value[curr]
					: value[curr],
			}),
			{},
		);

	const handleSave = async value => {
		try {
			await onSave(value);
			setSelectedValue({});
			setShowForm(false);
			setSnackbar({
				show: true,
				message: translate(value.id ? 'updated' : 'created'),
				className: 'success',
			});
		} catch (error) {
			setSnackbar({
				show: true,
				message: translate('generic_error'),
				className: 'error',
			});
		}
	};

	const onCreate = () => {
		setSelectedValue({});
		setShowForm(true);
	};

	const onUpdate = value => {
		setSelectedValue(value);
		setShowForm(true);
	};

	const handleDelete = async () => {
		try {
			await onDelete(selectedValue);
			setSelectedValue({});
			setShowModal(false);
			setSnackbar({
				show: true,
				message: translate('deleted'),
				className: 'success',
			});
		} catch (error) {
			setSnackbar({
				show: true,
				message: translate('generic_error'),
				className: 'error',
			});
		}
	};

	const onCancel = () => {
		setSelectedValue({});
		setShowForm(false);
	};

	// Transform data to show descriptions instead of IDs
	const transformedData = data.map(item => changeIdsToDescriptions(item));

	return (
		<PageContainer>
			<Box sx={{ height: '100%', position: 'relative' }}>
				{isLoading && <Loading />}
				{!isLoading && (
					<Table
						data={transformedData}
						columns={schema}
						onCreate={onCreate}
						onUpdate={onUpdate}
						onDelete={value => {
							setShowModal(true);
							setSelectedValue(value);
						}}
						title={title}
					/>
				)}

				<FormModal
					open={showForm}
					onClose={onCancel}
					data={selectedValue}
					schema={schema}
					dependencies={dependencies}
					onSave={handleSave}
				/>

				<ConfirmationModal
					open={showModal}
					title={translate('delete')}
					message={translate('delete_confirmation')}
					onConfirm={handleDelete}
					onCancel={() => setShowModal(false)}
				/>
			</Box>
		</PageContainer>
	);
};

export default DependentData;
