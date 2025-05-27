import React, { useEffect } from 'react';
import CrudTable from '../../components/CrudTable';
import SNPForm from './SNPForm';
import useCrud from '../../hooks/useCrud';
import { translate } from '../../utils/translations';
import { 
  getSNPs,
  createSNP,
  updateSNP,
  deleteSNP
} from '../../services/snps';

function Snps() {
  const {
    data: snps,
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
    fetchData: getSNPs,
    createItem: createSNP,
    updateItem: updateSNP,
    deleteItem: deleteSNP,
    entityName: 'SNP'
  });

  useEffect(() => {
    loadData();
  }, [loadData]);

  const columns = [
    { 
      column_name: 'rs_name', 
      display_name: translate('rs_name'),
      type: 'string',
      config: { flex: 1, minWidth: 150 }
    },
    {
      column_name: 'references',
      display_name: translate('references'),
      type: 'text',
      config: { flex: 2, minWidth: 300 }
    }
  ];

  return (
    <CrudTable
      title="Administración de SNPs"
      data={snps}
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
      entityName="SNP"
      FormComponent={SNPForm}
    />
  );
}

export default Snps;