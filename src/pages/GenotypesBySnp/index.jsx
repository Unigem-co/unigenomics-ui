import React, { useEffect, useState } from 'react';
import { request } from '../../utils/fetch';
import DependentData from '../../components/DependentData';
import Loading from '../../components/Loading';

const GenotypesBySnp = () => {
	const [data, setData] = useState([]);
	const [schema, setSchema] = useState([]);
	const [genotypes, setGenotypes] = useState([]);
	const [referenceSnp, setReferenceSnp] = useState([]);
	const [dependencies, setDependencies] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const onError = error => {
		console.log(error);
		setIsLoading(false);
	};

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const [dataResponse, schemaResponse] = await Promise.all([
				request('genotypesByReferenceSnp', { method: 'GET' }),
				request('genotypesByReferenceSnp/schema', { method: 'GET' })
			]);
			setData(dataResponse);
			setSchema(schemaResponse);
		} catch (error) {
			onError(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			try {
				const [genotypesData, referenceSnpData] = await Promise.all([
					request('genotype', { method: 'GET' }),
					request('referenceSnp', { method: 'GET' })
				]);
				setGenotypes(genotypesData);
				setReferenceSnp(referenceSnpData);
				
				// Fetch main data after dependencies are loaded
				await fetchData();
			} catch (error) {
				onError(error);
			}
		};
		getData();
	}, []);

	useEffect(() => {
		setDependencies({
			genotype: { displayValue: 'genotype_name', data: genotypes },
			reference_snp: { displayValue: 'rs_name', data: referenceSnp },
		});
	}, [genotypes, referenceSnp]);

	const handleSave = async (values) => {
		setIsLoading(true);
		try {
			if (values.id) {
				await request('genotypesByReferenceSnp', { method: 'PUT', body: values });
			} else {
				await request('genotypesByReferenceSnp', { method: 'POST', body: values });
			}
			await fetchData();
		} catch (error) {
			onError(error);
			throw error; // Re-throw to let DependentData handle the error message
		}
	};

	const handleDelete = async (row) => {
		setIsLoading(true);
		try {
			await request('genotypesByReferenceSnp', { method: 'DELETE', body: row });
			await fetchData();
		} catch (error) {
			onError(error);
			throw error; // Re-throw to let DependentData handle the error message
		}
	};

	return (
		<DependentData 
			data={data}
			schema={schema}
			dependencies={dependencies}
			title="Genotipos por SNP"
			isLoading={isLoading}
			onSave={handleSave}
			onDelete={handleDelete}
		/>
	);
};

export default GenotypesBySnp;
