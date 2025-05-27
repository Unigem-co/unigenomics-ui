const translations = {
    // User fields
    name: 'Nombre',
    email: 'Correo',
    role: 'Rol',
    document: 'Documento',
    password: 'Contraseña',
    
    // SNP fields
    rs_id: 'RS ID',
    rs_name: 'RS ID',
    references: 'Referencias',
    reference_snp: 'RS ID',
    
    // Genotype fields
    snp_id: 'SNP',
    genotype_name: 'Genotipo',
    description: 'Descripción',
    
    // Interpretation fields
    genotype_id: 'Genotipo',
    interpretation: 'Interpretación',
    recommendation: 'Recomendación',
    
    // Genotype Effect fields
    effect_name: 'Nombre del Efecto',

    // Common fields
    id: 'ID',
    created_at: 'Fecha de Creación',
    updated_at: 'Fecha de Actualización',

    // Actions
    edit_snp: 'Editar SNP',
    create_snp: 'Crear SNP',
    cancel: 'Cancelar',
    update: 'Actualizar',
    create: 'Crear'
};

export const translate = (key) => {
    return translations[key] || key;
};

export const snackbar = {
    messages: {
        updated: 'Registro actualizado',
        created: 'Registro creado',
        deleted: 'Registro eliminado',
    },
};