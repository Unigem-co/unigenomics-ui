import React from 'react';
import Table from '../Table';
import FormModal from '../FormModal';
import ConfirmationModal from '../ConfirmationModal';
import PageContainer from '../PageContainer';

const CrudTable = ({
  // Data props
  data,
  columns,
  schema,
  dependencies = {},
  title,
  isLoading,
  
  // CRUD handlers
  onCreate,
  onUpdate,
  onDelete,
  onSubmit,
  
  // Modal states
  showForm,
  showDeleteModal,
  selectedItem,
  itemToDelete,
  
  // Modal handlers
  onFormClose,
  onDeleteConfirm,
  onDeleteCancel,
  
  // Customization
  entityName = 'registro',
  FormComponent,
  extraOptions,
  
  // Form props
  disabled = false,
  stackFields = false
}) => {
  const getDeleteMessage = () => {
    if (!itemToDelete) return `¿Estás seguro de que deseas eliminar este ${entityName}?`;
    
    // Try to get a meaningful identifier for the item
    const identifier = itemToDelete.name || 
                      itemToDelete.rs_name || 
                      itemToDelete.genotype_name || 
                      itemToDelete.title || 
                      itemToDelete.id;
    
    return `¿Estás seguro de que deseas eliminar ${entityName === 'usuario' ? 'al' : 'el'} ${entityName} "${identifier}"?`;
  };

  return (
    <PageContainer>
      <Table
        title={title}
        data={data}
        columns={columns}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isLoading={isLoading}
        extraOptions={extraOptions}
      />
      
      {showForm && (
        <>
          {FormComponent ? (
            <FormComponent
              open={showForm}
              onClose={onFormClose}
              onSubmit={onSubmit}
              initialData={selectedItem}
            />
          ) : (
            <FormModal
              open={showForm}
              onClose={onFormClose}
              data={selectedItem}
              schema={schema}
              dependencies={dependencies}
              onSave={onSubmit}
              disabled={disabled}
              stackFields={stackFields}
            />
          )}
        </>
      )}
      
      <ConfirmationModal
        open={showDeleteModal}
        title={`Eliminar ${entityName}`}
        message={getDeleteMessage()}
        onConfirm={onDeleteConfirm}
        onCancel={onDeleteCancel}
      />
    </PageContainer>
  );
};

export default CrudTable; 