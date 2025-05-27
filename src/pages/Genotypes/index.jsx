import React, { useState, useEffect } from 'react';
import FlatData from '../../components/FlatData';
import { request } from '../../utils/fetch';

const Genotypes = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [dependencies, setDependencies] = useState(null);
	const [error, setError] = useState(null);
	const [data, setData] = useState([]);
	const [schema, setSchema] = useState([]);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const [dataResponse, schemaResponse] = await Promise.all([
				request('genotype', { method: 'GET' }),
				request('genotype/schema', { method: 'GET' })
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
		const fetchDependencies = async () => {
			try {
				const [snps] = await Promise.all([
					request('referenceSnp', { method: 'GET' })
				]);

				setDependencies({
					reference_snp: {
						displayValue: 'rs_name',
						data: snps
					}
				});

				// After dependencies are loaded, fetch the main data
				await fetchData();
			} catch (err) {
				console.error('Error fetching dependencies:', err);
				setError(err);
				setIsLoading(false);
			}
		};

		fetchDependencies();
	}, []);

	const handleSave = async (values) => {
		setIsLoading(true);
		try {
			if (values.id) {
				await request('genotype', { method: 'PUT', body: values });
			} else {
				await request('genotype', { method: 'POST', body: values });
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
			await request('genotype', { method: 'DELETE', body: row });
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
			title="Administración de Genotipos"
			dependencies={dependencies}
			isLoading={isLoading}
			onSave={handleSave}
			onDelete={handleDelete}
    />
	);
}

export default Genotypes;