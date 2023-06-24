export const translate = (key) => ({
    genotype_name: 'Nombre de Genotipo',
    id: 'Id',
    reference_snp: 'RS',
    genotype: 'Genotipo',
    name: 'Nombre',
    interpretation: 'Interpretación',
    rs_name: 'RS',
    gen: 'Gen',
    references: 'Referencias'
}[key] || key);