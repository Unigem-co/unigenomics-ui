import React, { useEffect, useState } from 'react';
import DependentData from '../../components/DependentData';
import { request } from '../../utils/fetch';

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

const Interpretations = () => {
  const [genotypes, setGenotypes] = useState([]);
  const [referenceSnp, setReferenceSnp] = useState([]);
  const [genotypeEffects, setGenotypeEffects] = useState([]);
  const [dependencies, setDependencies] = useState(deps);

  const onError = error => {
		console.log(error);
  };

  useEffect(() => {
		request('genotype', { method: 'GET' }, d => setGenotypes(d), onError);
		request('referenceSnp', { method: 'GET' }, d => setReferenceSnp(d), onError);
		request('genotypeEffect', { method: 'GET' }, d => setGenotypeEffects(d), onError);
  }, []);

  useEffect(() => {
		setDependencies({
			genotype: { displayValue: 'genotype_name', data: genotypes },
			reference_snp: { displayValue: 'rs_name', data: referenceSnp },
			genotype_effect: { displayValue: 'name', data: genotypeEffects },
		});
  }, [genotypes, referenceSnp]);

  return <DependentData endpoint='interpretation' dependencies={dependencies} />;
}

export default Interpretations