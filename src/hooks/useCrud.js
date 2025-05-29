import { useState, useCallback } from 'react';
import { useSnackbar } from '../components/Snackbar/context';
import { translate } from '../utils/translations';

const useCrud = ({
  fetchData,
  createItem,
  updateItem,
  deleteItem,
  entityName = 'registro'
}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [, setSnackbar] = useSnackbar();

  const showSuccess = useCallback((messageKey) => {
    setSnackbar({
      show: true,
      message: translate(messageKey),
      className: 'success',
    });
  }, [setSnackbar]);

  const showError = useCallback((messageKey) => {
    setSnackbar({
      show: true,
      message: translate(messageKey),
      className: 'error',
    });
  }, [setSnackbar]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchData();
      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
      showError('error_loading_items');
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, showError]);

  const handleCreate = useCallback(() => {
    setSelectedItem(null);
    setShowForm(true);
  }, []);

  const handleUpdate = useCallback((item) => {
    setSelectedItem(item);
    setShowForm(true);
  }, []);

  const handleDeleteClick = useCallback((item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteItem(itemToDelete.id);
      await loadData();
      showSuccess('item_deleted_successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      showError('error_deleting_item');
    } finally {
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  }, [deleteItem, itemToDelete, loadData, showSuccess, showError]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }, []);

  const handleSubmit = useCallback(async (itemData) => {
    try {
      if (selectedItem) {
        await updateItem(selectedItem.id, itemData);
      } else {
        await createItem(itemData);
      }
      await loadData();
      setShowForm(false);
      showSuccess(selectedItem ? 'item_updated_successfully' : 'item_created_successfully');
    } catch (error) {
      console.error('Error submitting item:', error);
      showError(selectedItem ? 'error_updating_item' : 'error_creating_item');
    }
  }, [selectedItem, updateItem, createItem, loadData, showSuccess, showError]);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setSelectedItem(null);
  }, []);

  return {
    // Data
    data,
    isLoading,
    selectedItem,
    itemToDelete,
    
    // Modal states
    showForm,
    showDeleteModal,
    
    // Actions
    loadData,
    handleCreate,
    handleUpdate,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleSubmit,
    handleFormClose,
    
    // Utilities
    showSuccess,
    showError
  };
};

export default useCrud; 