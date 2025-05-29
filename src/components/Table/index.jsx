import React, { useState, useEffect } from 'react';
import { 
	Box,
	Paper,
	IconButton,
	Tooltip,
	Typography,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	useTheme,
	useMediaQuery
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { translate } from '../../utils/translations';
import SearchInput from '../SearchInput';
import ActionButton from '../ActionButton';

const TextDialog = ({ open, onClose, title, content }) => (
	<Dialog 
		open={open} 
		onClose={onClose}
		maxWidth="md"
		fullWidth
	>
		<DialogTitle>{title}</DialogTitle>
		<DialogContent dividers>
			<Typography
				sx={{
					whiteSpace: 'pre-wrap',
					lineHeight: '1.6',
					fontSize: '1rem',
					padding: '16px',
					backgroundColor: 'background.paper',
					borderRadius: 1
				}}
			>
				{content}
			</Typography>
		</DialogContent>
		<DialogActions>
			<Button onClick={onClose} color="primary">
				Cerrar
			</Button>
		</DialogActions>
	</Dialog>
);

const Table = ({ 
	data = [], 
	columns = [], 
	onUpdate, 
	onCreate, 
	onDelete,
	onUpdateText,
	onUpdateTooltip,
	extraOptions = [],
	title,
	isLoading
}) => {
	const [pageSize, setPageSize] = useState(10);
	const [searchTerm, setSearchTerm] = useState('');
	const [textDialog, setTextDialog] = useState({ open: false, title: '', content: '' });
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	// Ensure each row has a unique ID
	const processedData = React.useMemo(() => {
		return data.map((row, index) => ({
			...row,
			_uniqueId: row.id || `row-${index}-${Date.now()}`
		}));
	}, [data]);

	// Debug logging
	useEffect(() => {
		console.log('Table Data:', data);
		console.log('Table Columns:', columns);
	}, [data, columns]);

	// Action column configuration
	const actionColumn = {
		field: 'actions',
		headerName: 'Acciones',
		sortable: false,
		filterable: false,
		width: isMobile ? 140 : 160,
		minWidth: isMobile ? 140 : 160,
		maxWidth: isMobile ? 140 : 160,
		align: 'center',
		headerAlign: 'center',
		resizable: false,
		hideable: false,
		renderCell: (params) => (
			<Box sx={{ 
				display: 'flex', 
				gap: 0.5,
				flexWrap: 'nowrap',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				height: '100%',
				bgcolor: 'background.paper'
			}}>
				{onUpdate && (
					<Tooltip title={onUpdateTooltip || translate('edit')}>
						<IconButton 
							size="small"
							onClick={() => onUpdate(params.row)}
							sx={{ 
								color: 'primary.main',
								padding: isMobile ? '4px' : '8px',
								'&:hover': {
									backgroundColor: 'action.hover'
								}
							}}
						>
							<EditIcon fontSize={isMobile ? 'small' : 'medium'} />
						</IconButton>
					</Tooltip>
				)}
				{onDelete && (
					<Tooltip title={translate('delete')}>
						<IconButton
							size="small"
							onClick={() => onDelete(params.row)}
							sx={{ 
								color: 'error.main',
								padding: isMobile ? '4px' : '8px',
								'&:hover': {
									backgroundColor: 'action.hover'
								}
							}}
						>
							<DeleteIcon fontSize={isMobile ? 'small' : 'medium'} />
						</IconButton>
					</Tooltip>
				)}
				{extraOptions.map((option, index) => (
					<Tooltip key={index} title={option.title}>
						<IconButton
							size="small"
							onClick={() => option.onClick(params.row)}
							sx={{ 
								color: 'primary.main',
								padding: isMobile ? '4px' : '8px',
								'&:hover': {
									backgroundColor: 'action.hover'
								}
							}}
						>
							{React.isValidElement(option.icon) ? 
								option.icon : 
								<i className={option.icon} style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}></i>
							}
						</IconButton>
					</Tooltip>
				))}
			</Box>
		)
	};

	const getColumnConfig = (col) => {
		const columnName = col.column_name || col.name;
		const headerName = col.display_name || translate(columnName);
		const fieldName = columnName || `column_${Math.random().toString(36).substr(2, 9)}`;

		const baseColumn = {
			field: fieldName,
			headerName: headerName,
			flex: col.config?.flex || 1,
			minWidth: isMobile ? (col.config?.minWidth || 150) * 0.8 : col.config?.minWidth || 150,
			sortable: col.config?.sortable !== false,
			filterable: col.config?.filterable !== false,
			resizable: true,
			headerAlign: 'left',
			align: 'left'
		};

		switch (col.type?.toLowerCase()) {
			case 'date':
				return {
					...baseColumn,
					type: 'string',
					renderCell: (params) => {
						if (!params?.row?.[fieldName]) return '-';
						try {
							const date = new Date(params.row[fieldName]);
							return isMobile 
								? date.toLocaleDateString('es-ES')
								: date.toLocaleString('es-ES');
						} catch (error) {
							return params.row[fieldName] || '-';
						}
					}
				};
			case 'text':
				return {
					...baseColumn,
					minWidth: isMobile ? 200 : 250,
					flex: 2,
					renderCell: (params) => {
						const content = params?.row?.[fieldName] || '-';
						return (
							<Box sx={{ 
								display: 'flex', 
								alignItems: 'center', 
								width: '100%',
								gap: 1
							}}>
								<Typography
									sx={{
										whiteSpace: 'pre-wrap',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										display: '-webkit-box',
										WebkitLineClamp: isMobile ? 2 : 3,
										WebkitBoxOrient: 'vertical',
										lineHeight: '1.4',
										flex: 1,
										fontSize: isMobile ? '0.75rem' : '0.875rem'
									}}
								>
									{content}
								</Typography>
								{content !== '-' && (
									<Tooltip title="Ver texto completo">
										<IconButton
											size="small"
											onClick={(e) => {
												e.stopPropagation();
												setTextDialog({
													open: true,
													title: headerName,
													content: content
												});
											}}
											sx={{ 
												padding: isMobile ? '4px' : '8px'
											}}
										>
											<FullscreenIcon fontSize={isMobile ? 'small' : 'medium'} />
										</IconButton>
									</Tooltip>
								)}
							</Box>
						);
					}
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
					renderCell: (params) => (
						<Typography
							sx={{
								fontSize: isMobile ? '0.75rem' : '0.875rem',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis'
							}}
						>
							{params.value || '-'}
						</Typography>
					)
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
		if (!searchTerm) return processedData;
		return processedData.filter(row => 
			Object.entries(row).some(([key, value]) => {
				if (value == null || key === '_uniqueId') return false;
				return String(value).toLowerCase().includes(searchTerm.toLowerCase());
			})
		);
	}, [processedData, searchTerm]);

	return (
		<Box sx={{ 
			height: '100%',
			width: '100%',
			display: 'flex',
			flexDirection: 'column',
			gap: 2
		}}>
			<Box sx={{ 
				display: 'flex',
				flexDirection: { xs: 'column', sm: 'row' },
				gap: { xs: 1, sm: 2 },
				alignItems: { xs: 'stretch', sm: 'center' },
				justifyContent: 'space-between',
				p: { xs: 1, sm: 2 }
			}}>
				{title && (
					<Typography variant="h6" component="h2" sx={{ 
						color: 'text.primary',
						fontSize: { xs: '1.125rem', sm: '1.25rem' }
					}}>
						{title}
					</Typography>
				)}
				<Box sx={{ 
					display: 'flex',
					gap: 1,
					flexDirection: { xs: 'column', sm: 'row' },
					alignItems: { xs: 'stretch', sm: 'center' }
				}}>
					<SearchInput
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder={translate('search')}
						sx={{ minWidth: { xs: '100%', sm: 200 } }}
					/>
					{onCreate && (
						<ActionButton
							onClick={onCreate}
							startIcon={<AddIcon />}
							sx={{ 
								whiteSpace: 'nowrap',
								width: { xs: '100%', sm: 'auto' }
							}}
						>
							{translate('create')}
						</ActionButton>
					)}
				</Box>
			</Box>

			<Paper
				sx={{
					height: 'calc(100% - 80px)',
					width: '100%',
					overflow: 'hidden',
					borderRadius: 2,
					'& .MuiDataGrid-root': {
						border: 'none',
						'& .MuiDataGrid-cell': {
							borderColor: 'divider'
						},
						'& .MuiDataGrid-columnHeaders': {
							borderColor: 'divider',
							bgcolor: 'background.default'
						},
						'& .MuiDataGrid-footerContainer': {
							borderColor: 'divider'
						}
					}
				}}
			>
				<DataGrid
					rows={filteredData}
					columns={gridColumns}
					pageSize={pageSize}
					onPageSizeChange={setPageSize}
					rowsPerPageOptions={[5, 10, 20, 50]}
					getRowId={(row) => row._uniqueId}
					disableSelectionOnClick
					loading={isLoading}
					initialState={{
						pinnedColumns: {
							right: ['actions']
						}
					}}
					components={{
						LoadingOverlay: () => (
							<Box sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								height: '100%'
							}}>
								<CircularProgress />
							</Box>
						)
					}}
					sx={{
						'& .MuiDataGrid-cell': {
							fontSize: isMobile ? '0.75rem' : '0.875rem',
							py: isMobile ? 1 : 2
						},
						'& .MuiDataGrid-columnHeader': {
							fontSize: isMobile ? '0.75rem' : '0.875rem',
							py: isMobile ? 1 : 2
						},
						'& .MuiDataGrid-columnHeader--moving': {
							backgroundColor: 'background.paper'
						},
						'& .MuiDataGrid-cell--pinned': {
							backgroundColor: 'background.paper',
							borderLeft: '1px solid',
							borderLeftColor: 'divider'
						},
						'& .MuiDataGrid-columnHeader--pinned': {
							backgroundColor: 'background.paper',
							borderLeft: '1px solid',
							borderLeftColor: 'divider'
						}
					}}
				/>
			</Paper>

			<TextDialog
				open={textDialog.open}
				onClose={() => setTextDialog({ open: false, title: '', content: '' })}
				title={textDialog.title}
				content={textDialog.content}
			/>
		</Box>
	);
};

export default Table;
