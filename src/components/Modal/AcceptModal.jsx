import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	IconButton,
	Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AcceptModal = ({ title, message, onAccept, onReject }) => {
	return (
		<Dialog
			open={true}
			onClose={onReject}
			maxWidth="sm"
			fullWidth
			sx={{
				position: 'fixed',
				zIndex: 9999,
				'& .MuiDialog-paper': {
					margin: 2,
					width: '100%',
					maxWidth: 400
				}
			}}
		>
			<DialogTitle sx={{ 
				p: 2,
				pr: 6, // Make room for close button
			}}>
				<Typography variant="h6" component="div">
					{title}
				</Typography>
				<IconButton
					aria-label="close"
					onClick={onReject}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: 'grey.500',
						'&:hover': {
							color: 'grey.700',
							bgcolor: 'transparent'
						}
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ p: 2 }}>
				<Typography>{message}</Typography>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button
					onClick={onReject}
					variant="outlined"
					sx={{
						borderRadius: 2,
						textTransform: 'none',
						px: 3,
						color: 'grey.700',
						borderColor: 'grey.300',
						'&:hover': {
							borderColor: 'grey.400',
							bgcolor: 'grey.50'
						}
					}}
				>
					Cancelar
				</Button>
				<Button
					onClick={onAccept}
					variant="contained"
					sx={{
						borderRadius: 2,
						textTransform: 'none',
						px: 3,
						background: 'linear-gradient(45deg, #004A93 30%, #00B5E2 90%)',
						'&:hover': {
							background: 'linear-gradient(45deg, #003366 30%, #007d99 90%)'
						}
					}}
				>
					Aceptar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AcceptModal;
