export const translate = (key) => ({
    genotype_name: 'Nombre de Genotipo',
    id: 'Id',
    reference_snp: 'RS',
    genotype: 'Genotipo',
    name: 'Nombre',
    interpretation: 'Interpretación',
    rs_name: 'RS',
    gen: 'Gen',
    references: 'Referencias',
    document_type: 'Tipo de Documento',
    last_names: 'Apellidos',
    document: 'Documento de identidad',
    birdth_date: 'Fecha de Nacimiento',
    role: 'Rol',
    password: 'Contraseña',
    report_date: 'Fecha de Reporte',
    sampling_date: 'Toma de Muestra',
    genotype_effect: 'Efecto en Genotipo'
}[key] || key);

export const snackbar = {
    messages: {
        updated: 'Registro actualizado',
        created: 'Registro creado',
        deleted: 'Registro eliminado',
    },
}