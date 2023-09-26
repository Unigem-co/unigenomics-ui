import React, { useEffect, useState } from 'react';
import { translate } from '../../utils/translations';
import './Table.scss';
import Search from '../Search';

const search = (data, searchedValue) => {
	return searchedValue
		? data?.filter(d => Object.keys(d).find(k => d[k]?.toString().includes(searchedValue))) || []
		: data;
};

const Table = props => {
	const { 
		data, 
		columns, 
		onUpdate, 
		onCreate, 
		onDelete,
		onUpdateText,
		onUpdateTooltip,
		extraOptions
	} = props;

	const [searchedValue, setSearchedValue] = useState('');
	const [tableData, setTableData] = useState(data);

	useEffect(() => {
		setTableData(search(data, searchedValue));
	}, [searchedValue, data]);

	const onSearch = event => {
		setSearchedValue(event.target.value);
	};
	return (
		<div className='table-scroll'>
			<table id='table' cellspacing='0'>
				<thead>
					<tr className='table-row-header'>
						{columns.map(column => (
							<th key={column.column_name} colSpan={1}>
								{translate(column.column_name)}
							</th>
						))}
						<th>
							<span>Acciones</span>
							{onCreate ? (
								<button className='transparent' onClick={onCreate} title='Nuevo'>
									<i className='bi bi-plus-square'></i>
								</button>
							) : null}
						</th>
					</tr>
					<tr className='search-header'>
						<th colSpan={100}>
							<Search placeholder='Buscar' onChange={onSearch} />
						</th>
					</tr>
				</thead>
				<tbody>
					{tableData?.map((row, index) => (
						<>
							<tr
								key={`row-${index}`}
								className='table-row-data'
								onClick={() => onUpdate(row)}
							>
								{columns.map(column => (
									<td
										style={{
											textAlign:
												row[column.column_name]?.toString().length > 20
													? 'left'
													: 'center',
										}}
									>
										{row[column.column_name]}
									</td>
								))}
								<td>
									{onUpdate && (
										<button
											className='primary'
											onClick={event => {
												event.stopPropagation();
												event.preventDefault();
												onUpdate(row);
											}}
											title={onUpdateTooltip ? onUpdateTooltip : 'Editar'}
										>
											{onUpdateText ? (
												onUpdateText
											) : (
												<i className='bi bi-pencil-square'></i>
											)}
										</button>
									)}
									{onDelete && (
										<button
											className='delete'
											onClick={event => {
												event.stopPropagation();
												event.preventDefault();
												onDelete(row);
											}}
											title='Eliminar'
										>
											<i className='bi bi-trash'></i>
										</button>
									)}
									{extraOptions &&
										extraOptions.map(({ onClick, icon, title }) => (
											<button
												className='transparent'
												onClick={event => {
													event.stopPropagation();
													event.preventDefault();
													onClick(row);
												}}
												title={title}
											>
												<i className={icon}></i>
											</button>
										))}
								</td>
							</tr>
						</>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
