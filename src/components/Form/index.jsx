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
		: schema?.reduce((prev, curr) => ({ ...prev, [curr.column_name]: '' }), {});
	const [values, setValues] = useState(defaults);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		const defaults = Object.keys(data || {}).length
			? data
			: schema?.reduce((prev, curr) => {
					return {
						...prev,
						[curr.column_name]:
							curr.column_name === 'id' || !dependencies
								? ''
								: dependencies[curr.column_name]?.data?.[0]?.[
										dependencies[curr.column_name]?.displayValue
								  ] ?? '',
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

	const validateForm = () => {
		const newErrors = {};
		let isValid = true;

		schema.forEach(field => {
			if (field.required !== false) { // All fields are required by default unless explicitly set to false
				if (!values[field.column_name] || values[field.column_name].trim() === '') {
					newErrors[field.column_name] = translate('field_required');
					isValid = false;
				}
			}
		});

		setErrors(newErrors);
		return isValid;
	};

	const handleChange = (name, value) => {
		setValues(prev => ({
			...prev,
			[name]: value
		}));
		// Clear error when field is modified
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: undefined
			}));
		}
	};

	const handleSubmit = () => {
		if (validateForm()) {
			// Ensure all values are strings or appropriate types
			const formattedValues = Object.keys(values).reduce((acc, key) => ({
				...acc,
				[key]: values[key] === null ? '' : values[key]
			}), {});
			
			onSave(formattedValues);
		}
	};

	const renderField = (col) => {
		// Handle select fields (both from type and dependencies)
		if ((col.type?.toLowerCase() === 'select' || dependencies?.[col.column_name]) && dependencies?.[col.column_name]?.data) {
			return (
				<FormControl fullWidth size="small" variant="outlined" error={!!errors[col.column_name]}>
					<InputLabel>{translate(col.column_name)}</InputLabel>
					<MuiSelect
						value={values[col.column_name] || ''}
						onChange={(e) => handleChange(col.column_name, e.target.value)}
						label={translate(col.column_name)}
						disabled={disabled}
						displayEmpty
						renderValue={(selected) => {
							if (!selected) {
								return '';
							}
							const option = dependencies[col.column_name].data.find(opt => opt.id === selected);
							return option ? option[dependencies[col.column_name].displayValue] : '';
						}}
					>
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
			size: "small",
			variant: "outlined",
			label: translate(col.column_name),
			value: values[col.column_name] || '',
			onChange: (e) => handleChange(col.column_name, e.target.value),
			disabled: col.column_name === 'id' || disabled,
			error: !!errors[col.column_name],
			helperText: errors[col.column_name],
			required: col.required !== false
		};

		switch (col.type?.toLowerCase()) {
			case 'text':
				return (
					<TextField
						{...commonProps}
						multiline={col.multiline}
						rows={col.multiline ? 4 : undefined}
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
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			sx={{ 
				display: 'flex',
				flexDirection: 'column',
				height: '100%',
				p: 2,
				bgcolor: 'background.paper',
				borderRadius: 2,
				'& .MuiTextField-root': {
					'& .MuiOutlinedInput-root': {
						borderRadius: 1,
					}
				},
				'& .MuiFormControl-root': {
					'& .MuiOutlinedInput-root': {
						borderRadius: 1,
					}
				}
			}}
		>
			<Grid 
				container 
				spacing={2.5} 
				sx={{ 
					flex: 1,
					'& .MuiGrid-item': {
						display: 'flex',
					},
					'& .MuiFormControl-root': {
						flex: 1,
						minHeight: '56px'
					},
					'& .MuiInputBase-root': {
						backgroundColor: 'background.paper'
					}
				}}
			>
				{schema?.map((col, index) => {
					// Check if this is document_type and there's a next field that is document
					const isDocumentTypeField = col.column_name === 'document_type' && 
						schema[index + 1]?.column_name === 'document';
					
					// Skip rendering document field here since it will be rendered with document_type
					if (col.column_name === 'document' && schema[index - 1]?.column_name === 'document_type') {
						return null;
					}

					return (
						<Grid 
							item 
							{...(isDocumentTypeField ? { xs: 12 } : col.grid || { xs: 12 })}
							key={col.column_name}
						>
							{isDocumentTypeField ? (
								<Grid container spacing={2}>
									<Grid item xs={12} sm={4}>
										{renderField(col)}
									</Grid>
									<Grid item xs={12} sm={8}>
										{renderField(schema[index + 1])}
									</Grid>
								</Grid>
							) : (
								<Box sx={{ width: '100%' }}>
									{renderField(col)}
								</Box>
							)}
						</Grid>
					);
				})}
			</Grid>
			
			{!disabled && (
				<Stack 
					direction="row" 
					spacing={2} 
					justifyContent="flex-end"
					sx={{ mt: 3 }}
				>
					{onCancel && (
						<Button
							variant="outlined"
							onClick={() => onCancel(values)}
							sx={{
								borderRadius: 1,
								textTransform: 'none',
								px: 3
							}}
						>
							{translate('cancel')}
						</Button>
					)}
					<Button
						variant="contained"
						onClick={handleSubmit}
						sx={{
							borderRadius: 1,
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
