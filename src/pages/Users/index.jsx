import React, { useEffect } from 'react';
import CrudTable from '../../components/CrudTable';
import UserForm from './UserForm';
import useCrud from '../../hooks/useCrud';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/users';

function Users() {
	const {
		data: users,
		isLoading,
		selectedItem,
		itemToDelete,
		showForm,
		showDeleteModal,
		loadData,
		handleCreate,
		handleUpdate,
		handleDeleteClick,
		handleDeleteConfirm,
		handleDeleteCancel,
		handleSubmit,
		handleFormClose
	} = useCrud({
		fetchData: getUsers,
		createItem: createUser,
		updateItem: updateUser,
		deleteItem: deleteUser,
		entityName: 'usuario'
	});

	useEffect(() => {
		loadData();
	}, [loadData]);

	const columns = [
		{ column_name: 'name', label: 'Nombre' },
		{ column_name: 'email', label: 'Correo' },
		{ column_name: 'role', label: 'Rol' }
	];

	return (
		<CrudTable
			title="Administración de Usuarios"
			data={users}
			columns={columns}
			isLoading={isLoading}
			onCreate={handleCreate}
			onUpdate={handleUpdate}
			onDelete={handleDeleteClick}
			onSubmit={handleSubmit}
			showForm={showForm}
			showDeleteModal={showDeleteModal}
			selectedItem={selectedItem}
			itemToDelete={itemToDelete}
			onFormClose={handleFormClose}
			onDeleteConfirm={handleDeleteConfirm}
			onDeleteCancel={handleDeleteCancel}
			entityName="usuario"
			FormComponent={UserForm}
		/>
	);
}

export default Users;