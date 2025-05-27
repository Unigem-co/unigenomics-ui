import React, { useState, useEffect } from 'react';
import { 
	Box,
	Paper,
	IconButton,
	Tooltip,
	Typography,
	CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { translate } from '../../utils/translations';
import SearchInput from '../SearchInput';
import ActionButton from '../ActionButton';

const Table = ({ 
		data, 
		columns, 
		onUpdate, 
		onCreate, 
		onDelete,
		onUpdateText,
		onUpdateTooltip,
	extraOptions,
	title,
	isLoading
}) => {
	const [pageSize, setPageSize] = useState(10);
	const [searchTerm, setSearchTerm] = useState('');

	// Debug logging
	useEffect(() => {
		console.log('Table Data:', data);
		console.log('Table Columns:', columns);
	}, [data, columns]);

	const actionColumn = {
		field: 'actions',
		headerName: 'Acciones',
		width: 150,
		sortable: false,
		filterable: false,
		renderHeader: () => (
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<span>Acciones</span>
				{onCreate && (
					<Tooltip title="Nuevo">
						<IconButton
							onClick={onCreate}
							size="small"
							color="primary"
						>
							<AddIcon />
						</IconButton>
					</Tooltip>
				)}
			</Box>
		),
		renderCell: (params) => (
			<Box>
									{onUpdate && (
					<Tooltip title={onUpdateTooltip || 'Editar'}>
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								onUpdate(params.row);
											}}
							size="small"
							color="primary"
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
									)}
									{onDelete && (
					<Tooltip title="Eliminar">
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								onDelete(params.row);
							}}
							size="small"
							color="error"
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				)}
				{extraOptions?.map(({ onClick, icon, title }) => (
					<Tooltip key={title} title={title}>
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								onClick(params.row);
							}}
							size="small"
						>
							<i className={icon} />
						</IconButton>
					</Tooltip>
				))}
			</Box>
		)
	};

	const getColumnConfig = (col) => {
		// Get the column name from either column_name or name property
		const columnName = col.column_name || col.name;
		
		// Get the display name from either display_name or translate the column name
		const headerName = col.display_name || translate(columnName);
		
		console.log('Processing column:', columnName, 'with data:', col);

		// Ensure field is always set and valid
		const fieldName = columnName || `column_${Math.random().toString(36).substr(2, 9)}`;

		// Base column configuration for MUI X DataGrid
		const baseColumn = {
			field: fieldName,
			headerName: headerName,
			flex: col.config?.flex || 1,
			minWidth: col.config?.minWidth || 150,
			sortable: col.config?.sortable !== false,
			filterable: col.config?.filterable !== false,
			resizable: true
		};

		// Handle different column types
		switch (col.type?.toLowerCase()) {
			case 'date':
				return {
					...baseColumn,
					type: 'string',
					renderCell: (params) => {
						if (!params?.row?.[fieldName]) return '-';
						try {
							return new Date(params.row[fieldName]).toLocaleString('es-ES');
						} catch (error) {
							return params.row[fieldName] || '-';
						}
					}
				};
			case 'text':
				return {
					...baseColumn,
					type: 'string',
					renderCell: (params) => (
						<div style={{ 
							whiteSpace: 'pre-wrap',
							lineHeight: '1.4',
							padding: '8px 0',
							maxHeight: '150px',
							overflow: 'auto'
						}}>
							{params?.row?.[fieldName] || '-'}
						</div>
					)
				};
			case 'boolean':
				return {
					...baseColumn,
					type: 'boolean',
					renderCell: (params) => {
						const value = params?.row?.[fieldName];
						if (value === null || value === undefined) return '-';
						return value ? 'Sí' : 'No';
					}
				};
			default:
				return {
					...baseColumn,
					type: 'string',
					renderCell: (params) => {
						const value = params?.row?.[fieldName];
						if (value === null || value === undefined) return '-';
						return value;
					}
				};
		}
	};

	// Debug data and columns
	useEffect(() => {
		console.log('Current data:', data);
		console.log('Current columns:', columns);
		console.log('Processed columns:', columns.map(getColumnConfig));
	}, [data, columns]);

	const gridColumns = [
		actionColumn,
		...columns.map(getColumnConfig)
	];

	const filteredData = React.useMemo(() => {
		if (!searchTerm) return data;
		return data.filter(row => 
			Object.entries(row).some(([key, value]) => {
				if (value == null) return false;
				return String(value).toLowerCase().includes(searchTerm.toLowerCase());
			})
		);
	}, [data, searchTerm]);

	return (
		<Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
			{title && (
				<Typography variant="h5" component="h1" sx={{ px: 2, pt: 2, fontWeight: 500 }}>
					{title}
				</Typography>
			)}
			<Paper
				elevation={0}
				sx={{
					flex: 1,
					overflow: 'hidden',
					borderRadius: 2,
					'& .MuiDataGrid-root': {
						border: 'none',
						'& .MuiDataGrid-cell': {
							borderColor: 'divider'
						},
						'& .MuiDataGrid-columnHeaders': {
							bgcolor: 'background.neutral',
							borderRadius: 0
						},
						'& .MuiDataGrid-virtualScroller': {
							bgcolor: 'background.paper'
						}
					}
				}}
			>
				<DataGrid
					rows={filteredData}
					columns={gridColumns}
					initialState={{
						pagination: {
							paginationModel: { pageSize: pageSize }
						}
					}}
					pageSizeOptions={[5, 10, 25, 50]}
					pagination
					disableRowSelectionOnClick
					disableColumnMenu
					getRowId={(row) => row.id || Math.random()}
					loading={isLoading}
					slots={{
						toolbar: () => (
							<Box sx={{ p: 2 }}>
								<SearchInput
									placeholder="Buscar..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
							</Box>
						),
						loadingOverlay: () => (
							<Box sx={{ 
								display: 'flex', 
								alignItems: 'center', 
								justifyContent: 'center',
								height: '100%',
								width: '100%',
								position: 'absolute',
								top: 0,
								left: 0,
								backgroundColor: 'rgba(255, 255, 255, 0.7)',
								zIndex: 1
							}}>
								<CircularProgress />
							</Box>
						),
						noRowsOverlay: () => (
							<Box sx={{ 
								display: 'flex', 
								alignItems: 'center', 
								justifyContent: 'center',
								height: '100%'
							}}>
								No hay datos disponibles
							</Box>
						)
					}}
					sx={{
						'& .MuiDataGrid-cell': {
							whiteSpace: 'normal',
							lineHeight: 'normal',
							padding: 1
						}
					}}
				/>
			</Paper>
		</Box>
	);
};

export default Table;
