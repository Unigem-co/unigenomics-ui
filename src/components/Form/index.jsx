import React, { useEffect, useState } from 'react';
import { 
	Box,
	TextField,
	Select as MuiSelect,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
	Stack,
	Grid
} from '@mui/material';
import { translate } from '../../utils/translations';

const Form = ({ schema, data, dependencies = {}, onSave, onCancel, disabled, stackFields = false }) => {
	const defaults = Object.keys(data || {}).length
		? data
		: schema?.reduce((prev, curr) => ({ ...prev, [curr.column_name]: null }), {});
	const [values, setValues] = useState(defaults);

	useEffect(() => {
		const defaults = Object.keys(data || {}).length
			? data
			: schema?.reduce((prev, curr) => {
					return {
						...prev,
						[curr.column_name]:
							curr.column_name === 'id' || !dependencies
								? null
								: dependencies[curr.column_name]?.data?.[0]?.[
										dependencies[curr.column_name]?.displayValue
								  ] ?? null,
					};
			  }, {});

		const transformedValues = dependencies
			? Object.keys(defaults)?.reduce(
					(prev, curr) => ({
						...prev,
						[curr]: dependencies[curr]?.data?.find(
							d => d[dependencies[curr]?.displayValue] === defaults[curr]
						)?.id ?? defaults[curr],
					}),
					{},
			  )
			: defaults;

		setValues(transformedValues);
	}, [data, schema, dependencies]);

	const handleChange = (name, value) => {
		setValues(prev => ({
			...prev,
			[name]: value
		}));
	};

	const renderField = (col) => {
		// Handle select fields (both from type and dependencies)
		if ((col.type?.toLowerCase() === 'select' || dependencies?.[col.column_name]) && dependencies?.[col.column_name]?.data) {
			return (
				<FormControl fullWidth margin="normal" variant="outlined">
					<InputLabel>{translate(col.column_name)}</InputLabel>
					<MuiSelect
						value={values[col.column_name] || ''}
						onChange={(e) => handleChange(col.column_name, e.target.value)}
						label={translate(col.column_name)}
						disabled={disabled}
					>
						<MenuItem value="">
							<em>{translate('select_option')}</em>
						</MenuItem>
						{dependencies[col.column_name].data.map(option => (
							<MenuItem 
								key={option.id} 
								value={option.id}
							>
								{option[dependencies[col.column_name].displayValue]}
							</MenuItem>
						))}
					</MuiSelect>
				</FormControl>
			);
		}

		// Handle other field types
		const commonProps = {
			fullWidth: true,
			margin: "normal",
			variant: "outlined",
			label: translate(col.column_name),
			value: values[col.column_name] || '',
			onChange: (e) => handleChange(col.column_name, e.target.value),
			disabled: col.column_name === 'id' || disabled
		};

		switch (col.type?.toLowerCase()) {
			case 'text':
				return (
					<TextField
						{...commonProps}
						multiline
						rows={4}
					/>
				);
			case 'date':
				return (
					<TextField
						{...commonProps}
						type="date"
						value={values[col.column_name] ? values[col.column_name].split('T')[0] : ''}
						InputLabelProps={{
							shrink: true
						}}
					/>
				);
			case 'password':
				return (
					<TextField
						{...commonProps}
						type="password"
					/>
				);
			default:
				return (
					<TextField
						{...commonProps}
					/>
				);
		}
	};

	return (
		<Box 
			component="form" 
			sx={{ 
				display: 'flex',
				flexDirection: 'column',
				gap: 1,
				p: 2,
				bgcolor: 'background.paper',
				borderRadius: 2,
				'& .MuiTextField-root': {
					'& .MuiOutlinedInput-root': {
						borderRadius: 2,
					}
				},
				'& .MuiFormControl-root': {
					'& .MuiOutlinedInput-root': {
						borderRadius: 2,
					}
				}
			}}
		>
			<Grid container spacing={2} sx={{ mb: 2 }}>
				{schema?.map(col => (
					<Grid 
						item 
						xs={12}
						key={col.column_name}
					>
						{renderField(col)}
					</Grid>
				))}
			</Grid>
			
			{!disabled && (
				<Stack 
					direction="row" 
					spacing={2} 
					justifyContent="flex-end"
				>
					{onCancel && (
						<Button
							variant="outlined"
							onClick={() => onCancel(values)}
							sx={{
								borderRadius: 2,
								textTransform: 'none',
								px: 3
							}}
						>
							{translate('cancel')}
						</Button>
					)}
					<Button
						variant="contained"
						onClick={() => onSave(values)}
						sx={{
							borderRadius: 2,
							textTransform: 'none',
							px: 3,
							background: 'linear-gradient(45deg, #004A93 30%, #00B5E2 90%)',
							'&:hover': {
								background: 'linear-gradient(45deg, #003366 30%, #007d99 90%)',
							}
						}}
					>
						{translate('save')}
					</Button>
				</Stack>
			)}
		</Box>
	);
};

export default Form;
