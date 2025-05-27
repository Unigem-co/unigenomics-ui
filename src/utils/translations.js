const translations = {
    // User fields
    name: 'Nombre',
    email: 'Correo',
    role: 'Rol',
    document: 'Documento',
    password: 'Contraseña',
    last_names: 'Apellidos',
    document_type: 'Tipo de Documento',
    birth_date: 'Fecha de Nacimiento',
    birdth_date: 'Fecha de Nacimiento',
    prime_id: 'Prime ID',
    
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
    create: 'Crear',

    // Report fields
    report_date: 'Fecha de Reporte',
    sampling_date: 'Fecha de Toma de Muestra',
    observations: 'Observaciones',
    search_rs: 'Buscar RS',
    select_genotype: 'Seleccionar genotipo',
    no_genotypes: 'No hay genotipos disponibles',
    no_rs_found: 'No se encontraron RS que coincidan con la búsqueda',
    no_rs_available: 'No hay RS disponibles',
    loading_interpretation: 'Cargando interpretación...',
    no_interpretation: 'No hay interpretación disponible',
    saving: 'Guardando...',
    save: 'Guardar',
    edit_report: 'Editar Reporte',
    create_report: 'Crear Reporte',
    cancel_edit: 'Cancelar edición',
    cancel_create: 'Cancelar creación',
    cancel_edit_message: '¿Deseas salir sin guardar los cambios de la edición?',
    cancel_create_message: '¿Deseas salir sin guardar el nuevo reporte?',
    additional_observations: 'Ingrese observaciones adicionales...',
    select_genotype_to_see_interpretation: 'Seleccione un genotipo para ver su interpretación',
    error_loading_interpretation: 'Error al cargar la interpretación',
    error_loading_report: 'Error al cargar el reporte',
    delete_report_confirmation: '¿Está seguro que desea eliminar este reporte?',
    error_deleting_report: 'Error al eliminar el reporte',
    error_loading_users: 'Error al cargar los usuarios',
    error_loading_reports: 'Error al cargar los reportes',

    // Form Labels
    report_date_label: 'Ingrese la fecha del reporte',
    sampling_date_label: 'Ingrese la fecha de toma de muestra',
    observations_label: 'Ingrese las observaciones del reporte',
    search_rs_label: 'Buscar por nombre de RS',
    select_genotype_label: 'Seleccione el genotipo para este RS',

    // Success Messages
    report_created: 'Reporte creado exitosamente',
    report_updated: 'Reporte actualizado exitosamente',
    report_deleted: 'Reporte eliminado exitosamente',
    report_generated: 'Reporte generado exitosamente',
    session_expired: 'Tu sesión ha finalizado, intenta volver a iniciar sesión',
    generic_error: 'Ocurrió un error, intentalo más tarde',

    // Validation Messages
    unfinished_work: 'Reporte Incompleto',
    unfinished_work_message: 'Hay genotipos sin seleccionar. ¿Desea guardar el reporte de todas formas? Podrá completar los genotipos faltantes más tarde.',

    // Client Information Form
    client_information: 'Información del Cliente',
    select_client: 'Selecciona el cliente',
    no_clients_available: 'No hay clientes disponibles',
    create_new_report: 'Crear Nuevo Reporte',
    available_reports: 'Reportes Disponibles',
    no_reports_available: 'No hay reportes disponibles para este cliente',
    generate_report: 'Generar',
    delete_report: 'Eliminar',
    delete_report_confirm: '¿Deseas eliminar este reporte?',
    report_deleted: 'Reporte eliminado',
    error_loading_data: 'Error cargando datos. Por favor, intente más tarde.',
    error_processing_pdf: 'Error al procesar el PDF. Por favor, intente nuevamente.',
    error_generating_report: 'Error al generar el reporte. Por favor, intente nuevamente.',
    error_loading_reference_snps: 'Error al cargar los SNPs de referencia',

    // Client Management
    new_client: 'Nuevo Cliente',
    client_created: 'Cliente creado exitosamente',
    error_creating_client: 'Error al crear el cliente',
    search_client: 'Buscar por nombre o documento...',
    select_option: 'Seleccione una opción',
    add_client: 'Agregar Cliente',
    no_results: 'No se encontraron resultados',
    client_already_exists: 'Ya existe un cliente con este tipo y número de documento',
    birth_date_required: 'La fecha de nacimiento es requerida',

    // Form Validation
    field_required: 'Este campo es requerido',

    // Error Messages
    error_creating_report: 'Error al crear el reporte',
    error_updating_report: 'Error al actualizar el reporte',
    error_deleting_report: 'Error al eliminar el reporte',
    error_loading_report: 'Error al cargar el reporte',
    error_loading_users: 'Error al cargar los usuarios',
    error_loading_reports: 'Error al cargar los reportes',
    error_loading_interpretation: 'Error al cargar la interpretación',
    error_loading_reference_snps: 'Error al cargar los SNPs de referencia',
    error_loading_data: 'Error cargando datos. Por favor, intente más tarde.',
    error_processing_pdf: 'Error al procesar el PDF. Por favor, intente nuevamente.',
    error_generating_report: 'Error al generar el reporte. Por favor, intente nuevamente.',
    session_expired: 'Tu sesión ha finalizado, intenta volver a iniciar sesión',
    generic_error: 'Ocurrió un error, intentalo más tarde',

    // Validation Messages
    field_required: 'Este campo es requerido',
    user_required: 'Usuario es requerido',
    report_date_required: 'Fecha de reporte es requerida',
    sampling_date_required: 'Fecha de toma de muestra es requerida',
    report_id_required: 'ID del reporte es requerido',
    report_not_found: 'Reporte no encontrado',
    at_least_one_result: 'Debe incluir al menos un resultado',
};

export const translate = (key) => {
    return translations[key] || key;
};

export const snackbar = {
    messages: {
        updated: 'Registro actualizado',
        created: 'Registro creado',
        deleted: 'Registro eliminado',
        report_created: 'Reporte creado exitosamente',
        report_updated: 'Reporte actualizado exitosamente'
    },
};