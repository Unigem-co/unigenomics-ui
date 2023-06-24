import React, { useEffect, useState } from 'react';
import { translate } from '../../utils/translations';
import Input from '../Input';
import './Form.scss';
import TextArea from '../TextArea';
import Select from '../Select';

const Form = props => {
	const { schema, data, dependencies, onSave, onCancel } = props;
	const defaults = Object.keys(data).legnth
		? data
		: schema.reduce((prev, curr) => ({ ...prev, [curr.column_name]: null }), {});
	const [values, setValues] = useState(defaults);

	useEffect(() => {
		const defaults = Object.keys(data).length
			? data
			: schema.reduce((prev, curr) => {
					return {
						...prev,
						[curr.column_name]:
							curr.column_name === 'id' || !dependencies
								? null
								: dependencies[curr.column_name]
								? dependencies[curr.column_name].data[0][
										dependencies[curr.column_name].displayValue
								  ]
								: null,
					};
			  }, {});
		const transformedValues = dependencies
			? Object.keys(defaults)?.reduce(
					(prev, curr) => ({
						...prev,
						[curr]: dependencies[curr]
							? dependencies[curr].data?.find(
									d => d[dependencies[curr].displayValue] === defaults[curr],
							  )?.id
							: defaults[curr],
					}),
					{},
			  )
			: defaults;

		setValues(transformedValues);
	}, [data]);

	return (
		<div id='form' onSubmit={() => false}>
			{schema?.map(col => (
				<div className='form-field' key={col.column_name}>
					<label>{translate(col.column_name)}</label>
					{dependencies && dependencies[col?.column_name] ? (
						<Select
							options={
								dependencies[col?.column_name].data.map(v => ({
									...v,
									text: v[dependencies[col?.column_name].displayValue],
								})) ?? []
							}
							onSelect={event => {
								setValues({ ...values, [col.column_name]: event.target.value });
							}}
							value={values[col.column_name]}
						/>
					) : col.data_type === 'text' ? (
						<TextArea
							type='text'
							disabled={col?.column_name === 'id'}
							value={values[col.column_name]}
							onChange={event =>
								setValues({ ...values, [col.column_name]: event.target.value })
							}
						/>
					) : (
						<Input
							disabled={col?.column_name === 'id'}
							value={values[col.column_name]}
							onChange={event =>
								setValues({ ...values, [col.column_name]: event.target.value })
							}
						/>
					)}
				</div>
			))}
			<div className='form-actions'>
				<button className='delete' onClick={() => onCancel(values)}>
					Cancelar
				</button>
				<button className='primary' onClick={() => onSave(values)}>
					Guardar
				</button>
			</div>
		</div>
	);
};

export default Form;
