import React, { useState, useEffect } from 'react';
import FlatData from '../../components/FlatData';
import { request } from '../../utils/fetch';

const GenotypesEffects = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [data, setData] = useState([]);
	const [schema, setSchema] = useState([]);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const [dataResponse, schemaResponse] = await Promise.all([
				request('genotypeEffect', { method: 'GET' }),
				request('genotypeEffect/schema', { method: 'GET' })
			]);
			setData(dataResponse);
			setSchema(schemaResponse);
		} catch (err) {
			console.error('Error fetching data:', err);
			setError(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleSave = async (values) => {
		setIsLoading(true);
		try {
			if (values.id) {
				await request('genotypeEffect', { method: 'PUT', body: values });
			} else {
				await request('genotypeEffect', { method: 'POST', body: values });
			}
			await fetchData();
		} catch (err) {
			console.error('Error saving:', err);
			setError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (row) => {
		setIsLoading(true);
		try {
			await request('genotypeEffect', { method: 'DELETE', body: row });
			await fetchData();
		} catch (err) {
			console.error('Error deleting:', err);
			setError(err);
		} finally {
			setIsLoading(false);
		}
	};

	if (error) {
		return <div>Error cargando datos. Por favor, intente más tarde.</div>;
	}

  return (
    <FlatData
			data={data}
			schema={schema}
			title="Administración de Efectos de Genotipos"
			isLoading={isLoading}
			onSave={handleSave}
			onDelete={handleDelete}
    />
	);
}

export default GenotypesEffects;