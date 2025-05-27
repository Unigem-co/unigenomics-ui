# Reusable Components

This directory contains reusable components that help reduce code duplication and provide consistent patterns across the application.

## Core Reusable Components

### 1. CrudTable
A complete CRUD interface that combines Table, FormModal, and ConfirmationModal.

**Usage:**
```jsx
import { CrudTable, useCrud } from '../../components';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/users';

function UsersPage() {
  const crud = useCrud({
    fetchData: getUsers,
    createItem: createUser,
    updateItem: updateUser,
    deleteItem: deleteUser,
    entityName: 'usuario'
  });

  useEffect(() => {
    crud.loadData();
  }, [crud.loadData]);

  return (
    <CrudTable
      title="Users"
      data={crud.data}
      columns={columns}
      isLoading={crud.isLoading}
      onCreate={crud.handleCreate}
      onUpdate={crud.handleUpdate}
      onDelete={crud.handleDeleteClick}
      onSubmit={crud.handleSubmit}
      showForm={crud.showForm}
      showDeleteModal={crud.showDeleteModal}
      selectedItem={crud.selectedItem}
      itemToDelete={crud.itemToDelete}
      onFormClose={crud.handleFormClose}
      onDeleteConfirm={crud.handleDeleteConfirm}
      onDeleteCancel={crud.handleDeleteCancel}
      entityName="usuario"
      FormComponent={UserForm} // Optional custom form
    />
  );
}
```

### 2. useCrud Hook
A custom hook that encapsulates common CRUD operations and state management.

**Features:**
- Automatic loading states
- Error handling with snackbar notifications
- Consistent CRUD operations
- Form and modal state management

### 3. FormModal
A reusable modal wrapper for forms.

**Usage:**
```jsx
<FormModal
  open={showForm}
  onClose={onClose}
  data={selectedItem}
  schema={schema}
  dependencies={dependencies}
  onSave={onSave}
/>
```

### 4. ConfirmationModal
A reusable confirmation dialog.

**Usage:**
```jsx
<ConfirmationModal
  open={showDeleteModal}
  title="Delete User"
  message="Are you sure you want to delete this user?"
  onConfirm={onConfirm}
  onCancel={onCancel}
/>
```

## Benefits

1. **Reduced Code Duplication**: Common patterns are extracted into reusable components
2. **Consistent UI**: All CRUD operations follow the same patterns
3. **Easier Maintenance**: Changes to common functionality only need to be made in one place
4. **Better Testing**: Reusable components can be tested once and reused
5. **Faster Development**: New CRUD pages can be created with minimal boilerplate

## Migration Guide

### Before (Old Pattern):
```jsx
function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // ... lots of boilerplate code
  
  return (
    <PageContainer>
      <Table />
      {showForm && <UserForm />}
      {showDeleteModal && <AcceptModal />}
    </PageContainer>
  );
}
```

### After (New Pattern):
```jsx
function UsersPage() {
  const crud = useCrud({
    fetchData: getUsers,
    createItem: createUser,
    updateItem: updateUser,
    deleteItem: deleteUser,
    entityName: 'usuario'
  });

  useEffect(() => {
    crud.loadData();
  }, [crud.loadData]);

  return (
    <CrudTable
      {...crud}
      title="Users"
      columns={columns}
      entityName="usuario"
      FormComponent={UserForm}
    />
  );
}
```

## Component Architecture

```
CrudTable
├── Table (data display + actions)
├── FormModal
│   └── Form (reusable form component)
└── ConfirmationModal
    └── AcceptModal (existing modal component)
```

## Best Practices

1. **Use CrudTable for standard CRUD operations**
2. **Use useCrud hook for state management**
3. **Provide meaningful entityName for better UX messages**
4. **Use FormComponent prop for custom forms when needed**
5. **Keep service functions consistent with the expected API** 