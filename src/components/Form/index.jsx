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
						disabled={col.disabled || disabled}
						displayEmpty
						renderValue={(selected) => {
							if (!selected) {
								return '';
							}
							if (col.renderValue) {
								return col.renderValue(selected);
							}
							const option = dependencies[col.column_name].data.find(opt => opt.id === selected);
							return option ? option[dependencies[col.column_name].displayValue] : selected;
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
			disabled: col.disabled || col.column_name === 'id' || disabled,
			error: !!errors[col.column_name],
			helperText: errors[col.column_name],
			required: col.required !== false
		};

		switch (col.type?.toLowerCase()) {
			case 'text':
				const isLongText = col.column_name.toLowerCase().includes('interpretation') || 
								 col.column_name.toLowerCase().includes('descripcion') ||
								 col.config?.multiline;
				return (
					<TextField
						{...commonProps}
						multiline={isLongText}
						minRows={isLongText ? 4 : undefined}
						maxRows={isLongText ? 8 : undefined}
						sx={{
							...(isLongText && {
								'& .MuiInputBase-root': {
									padding: '12px',
									fontFamily: 'inherit',
									fontSize: '0.875rem',
									lineHeight: '1.5',
									'& textarea': {
										fontFamily: 'inherit',
										fontSize: '0.875rem',
										lineHeight: '1.5'
									}
								}
							})
						}}
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
			{stackFields ? (
				<Stack spacing={2}>
					{schema.map((col) => (
						<Box key={col.column_name}>
							{renderField(col)}
						</Box>
					))}
				</Stack>
			) : (
				<Grid container spacing={2}>
					{schema.map((col) => {
						const isLongText = col.type?.toLowerCase() === 'text' && 
							(col.column_name.toLowerCase().includes('interpretation') || 
							 col.column_name.toLowerCase().includes('descripcion') ||
							 col.config?.multiline);
						
						return (
							<Grid 
								item 
								xs={12} 
								md={isLongText ? 12 : 6} 
								key={col.column_name}
							>
								{renderField(col)}
							</Grid>
						);
					})}
				</Grid>
			)}

			<Box sx={{ 
				display: 'flex', 
				gap: 2, 
				justifyContent: 'flex-end',
				mt: 3
			}}>
				<Button 
					variant="outlined" 
					onClick={onCancel}
					disabled={disabled}
				>
					{translate('cancel')}
				</Button>
				<Button 
					variant="contained" 
					type="submit"
					disabled={disabled}
				>
					{translate('save')}
				</Button>
			</Box>
		</Box>
	);
};

export default Form;
