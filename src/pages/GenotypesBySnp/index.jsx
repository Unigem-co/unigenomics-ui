import React, { useEffect, useState } from 'react'
import { request } from '../../utils/fetch';
import DependentData from '../../components/DependentData';

const deps = {
  config: {
    reference_snp: {
      displayValue: 'rs_name'
    },
    genotype: {
      displayValue: 'genotype_name'
    },
  }
};

const GenotypesBySnp = () => {
  const [genotypes, setGenotypes] = useState([]); 
  const [referenceSnp, setReferenceSnp] = useState([]); 
  const [dependencies, setDependencies] = useState(deps);

  const onError = (error) => {
    console.log(error);
  };

  useEffect(() => {
    request('genotype', { method: 'GET' }, (d) => setGenotypes(d), onError);
    request('referenceSnp', { method: 'GET' }, (d) => setReferenceSnp(d), onError);
  }, []);

  useEffect(() => {
    setDependencies({ 
      genotype: { displayValue: 'genotype_name', data: genotypes }, 
      reference_snp: { displayValue: 'rs_name', data: referenceSnp } 
    });
  }, [genotypes, referenceSnp]);

  return <DependentData endpoint="genotypesByreferenceSnp" dependencies={dependencies} />;
}

export default GenotypesBySnp