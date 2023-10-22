import React, { useEffect, useState } from 'react';
import { request } from '../../utils/fetch';
import DependentData from '../../components/DependentData';
import Loading from '../../components/Loading';

const deps = {
	config: {
		reference_snp: {
			displayValue: 'rs_name',
		},
		genotype: {
			displayValue: 'genotype_name',
		},
	},
};

const GenotypesBySnp = () => {
	const [genotypes, setGenotypes] = useState([]);
	const [referenceSnp, setReferenceSnp] = useState([]);
	const [dependencies, setDependencies] = useState(deps);
	const [isLoading, setIsLoading] = useState(false);

	const onError = error => {
		console.log(error);
    setIsLoading(false);
	};

	useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			await request('genotype', { method: 'GET' }, d => setGenotypes(d), onError);
			await request('referenceSnp', { method: 'GET' }, d => setReferenceSnp(d), onError);
			setIsLoading(false);
		};
		getData();
	}, []);

	useEffect(() => {
		setDependencies({
			genotype: { displayValue: 'genotype_name', data: genotypes },
			reference_snp: { displayValue: 'rs_name', data: referenceSnp },
		});
	}, [genotypes, referenceSnp]);

	return (
		<>
			{isLoading && <Loading />}
			<DependentData endpoint='genotypesByreferenceSnp' dependencies={dependencies} />
		</>
	);
};

export default GenotypesBySnp;
