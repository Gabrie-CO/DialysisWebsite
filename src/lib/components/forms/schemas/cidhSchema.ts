import type { FormSchema, FormField } from '../generator/types';

const accessTypes = [
    { key: "fistula", label: "Fistula" },
    { key: "graft", label: "Injerto" },
    { key: "permCatheter", label: "Catéter Permanente" },
    { key: "tempCatheter", label: "Catéter Temporal" },
] as const;

const symptomsList = [
    { k: "general", l: "Malestar general" },
    { k: "fever", l: "Fiebre" },
    { k: "cough", l: "Tos" },
    { k: "sputum", l: "Expectoración" },
    { k: "dyspnea", l: "Disnea" },
    { k: "sweats", l: "Sudoración Nocturna" },
    { k: "upperResp", l: "Resp. Superior (odinofagia, etc)" },
] as const;

export const cidhSchema: FormSchema = [
    {
        id: "patient",
        title: "Datos del Paciente",
        cols: 2,
        fields: [
            { key: "patient.firstName", label: "Nombre del Paciente", type: "text" },
            { key: "patient.lastName", label: "Apellidos", type: "text" },
            {
                key: "patient.gender", label: "Género", type: "radio", options: [
                    { value: "F", label: "F" },
                    { value: "M", label: "M" }
                ]
            },
            { key: "patient.dob", label: "Fecha Nacimiento", type: "date" },
            { key: "patient.clinic", label: "Clínica", type: "text" },
            { key: "patient.cubicle", label: "Cubículo", type: "text" },
            { key: "patient.eventDate", label: "Fecha Evento", type: "date" },
            // Group for diseases
            {
                key: "patient.diseases_group", type: "group", label: "Enfermedades", fields: [
                    { key: "patient.diseases.dm", label: "DM", type: "checkbox" },
                    { key: "patient.diseases.hta", label: "HTA", type: "checkbox" },
                ]
            }
        ]
    },
    {
        id: "access",
        title: "Tipo de Acceso",
        cols: 1,
        fields: [
            {
                key: "access",
                type: "table",
                columns: [
                    { key: "active", label: "Activo", type: "checkbox" },
                    {
                        key: "date",
                        label: "Fecha en que se Realiza",
                        type: "date",
                        disabled: (row) => !row.active
                    },
                    {
                        key: "unknownDate",
                        label: "Fecha Desconocida",
                        type: "checkbox",
                        disabled: (row) => !row.active
                    }
                ]
            }
        ]
    },
    {
        id: "nursing",
        title: "Datos de Enfermería",
        cols: 2,
        fields: [
            { key: "nursing.fever", label: "Fiebre ≥ 38 axilar", type: "checkbox" },
            { key: "nursing.chills", label: "Escalofríos", type: "checkbox" },
            { key: "nursing.cough", label: "Tos", type: "checkbox" },
            { key: "nursing.hypotension", label: "Caída de presión arterial", type: "checkbox" },
            { key: "nursing.pus", label: "Piel del Acceso (pus, enrojecimiento)", type: "checkbox" },
            { key: "nursing.cellulitis", label: "Celulitis (piel enrojecida, caliente)", type: "checkbox" },
            { key: "nursing.wound", label: "Herida sin relación al acceso", type: "checkbox" },
            { key: "nursing.other", label: "Otros", type: "text" }
        ]
    },
    {
        id: "medical",
        title: "Datos del Medico (Semiología)",
        cols: 1,
        fields: [
            ...symptomsList.flatMap(sym => ({
                key: `medical.symptoms.${sym.k}_group`, type: "group", cols: 3, fields: [
                    { key: `medical.symptoms.${sym.k}.active`, label: sym.l, type: "checkbox" },
                    { key: `medical.symptoms.${sym.k}.start`, label: "Fecha Inicio", type: "date" },
                    { key: `medical.symptoms.${sym.k}.char`, label: "Característica", type: "text", placeholder: "Características..." }
                ]
            } as FormField)),
            {
                key: "medical.diagnosis_group", type: "group", label: "Impresión Diagnostica", cols: 2, fields: [
                    { key: "medical.diagnosis.vascularInfection", label: "Infección del Acceso Vascular", type: "checkbox" },
                    { key: "medical.diagnosis.pneumonia", label: "Neumonía", type: "checkbox" },
                    { key: "medical.diagnosis.cellulitis", label: "Celulitis", type: "checkbox" },
                    { key: "medical.diagnosis.uti", label: "Infección Tracto Urinario", type: "checkbox" },
                    { key: "medical.diagnosis.cold", label: "Resfriado común / Gripe", type: "checkbox" },
                    { key: "medical.diagnosis.tb", label: "Tuberculosis", type: "checkbox" },
                    { key: "medical.diagnosis.diabeticFoot", label: "Pie Diabético", type: "checkbox" },
                    { key: "medical.diagnosis.other", label: "Otros", type: "text" }
                ]
            },
            {
                key: "medical.tests_group", type: "group", label: "Pruebas Enviadas", cols: 1, fields: [
                    { key: "medical.tests.bloodCulture", label: "Hemocultivo", type: "checkbox" },
                    { key: "medical.tests.urineCulture", label: "Urocultivo", type: "checkbox" },
                    { key: "medical.tests.hemogram", label: "Hemograma", type: "checkbox" },
                    { key: "medical.tests.other", label: "Otras", type: "text" },
                    {
                        key: "medical.referral.sent", label: "Se refiere", type: "radio", options: [
                            { value: true, label: "SI" },
                            { value: false, label: "NO" }
                        ]
                    },
                    { key: "medical.referral.where", label: "Donde...", type: "text", visible: (data) => data.medical.referral.sent }
                ]
            }
        ]
    },
    {
        id: "followUp",
        title: "HOJA DE SEGUIMIENTO",
        cols: 1,
        fields: [
            {
                key: "followUp.general_group", type: "group", cols: 2, fields: [
                    { key: "followUp.date", label: "Fecha de seguimiento", type: "date" },
                    {
                        key: "followUp.hospitalized", label: "Paciente Hospitalizado", type: "radio", options: [
                            { value: true, label: "SI" },
                            { value: false, label: "NO" }
                        ]
                    }
                ]
            },
            {
                key: "followUp.result_group", type: "group", label: "Resultado", cols: 1, fields: [
                    {
                        key: "followUp.result.checks_group", type: "group", cols: 3, fields: [
                            { key: "followUp.result.hemoculture", label: "Hemocultivo", type: "checkbox" },
                            { key: "followUp.result.positive", label: "Positivo", type: "checkbox" },
                            { key: "followUp.result.negative", label: "Negativo", type: "checkbox" }
                        ]
                    },
                    {
                        key: "followUp.result.pathogen_group", type: "group", label: "Agente Patógeno Cultivado", cols: 2, fields: [
                            { key: "followUp.result.pathogen.staphAureus", label: "Staphylococcus Aureus", type: "checkbox" },
                            { key: "followUp.result.pathogen.other", label: "Otros", type: "text" }
                        ]
                    },
                    {
                        key: "followUp.result.sensitivity_group", type: "group", label: "Sensibilidad Antibiótica", cols: 2, fields: [
                            { key: "followUp.result.sensitivity.vancomycin", label: "Vancomicina", type: "checkbox" },
                            { key: "followUp.result.sensitivity.other", label: "Otros", type: "text" }
                        ]
                    }
                ]
            },
            {
                key: "followUp.treatment_group", type: "group", label: "Inicio tratamiento IV con Vancomicina", cols: 1, className: "bg-blue-50/50 p-3 rounded-lg border border-blue-100", fields: [
                    {
                        key: "followUp.treatmentStart.wrapper", type: "group", cols: 3, fields: [
                            {
                                key: "followUp.treatmentStart.ivVancomycin", type: "radio", options: [
                                    { value: true, label: "SI" },
                                    { value: false, label: "NO" }
                                ]
                            },
                            { key: "followUp.treatmentStart.dose", placeholder: "dosis", type: "text", className: "w-24" },
                            {
                                key: "followUp.treatmentStart.everyXDaysWrapper", type: "group", cols: 1, fields: [
                                    // Just using text input for simplicity, label can be part of placeholder or we extend renderer later
                                    { key: "followUp.treatmentStart.everyXDays", placeholder: "cada X días", type: "text", className: "w-full text-center" }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                key: "followUp.logs", label: "Tratamiento (Registro de Administración)", type: "table", columns: [
                    { key: "date", label: "Fecha", type: "date" },
                    { key: "patientBrought", label: "Traído por Paciente", type: "checkbox" },
                    { key: "doseIndicated", label: "Dosis Indicada", type: "text" },
                    { key: "doseAdmin", label: "Dosis Administrada", type: "text" },
                    {
                        key: "route", label: "Vía", type: "select", options: [
                            { value: "IV", label: "IV" },
                            { value: "Oral", label: "Oral" }
                        ]
                    },
                    { key: "comment", label: "Observación", type: "text" }
                ]
            },
            {
                key: "followUp.outcomes", label: "Resultados del tratamiento", type: "group", cols: 1, fields: [
                    {
                        key: "followUp.outcomes.completedWrapper", type: "group", cols: 2, fields: [
                            {
                                key: "followUp.outcomes.completed", label: "Completó tratamiento", type: "radio", options: [
                                    { value: "SI", label: "SI" },
                                    { value: "NO", label: "NO" }
                                ]
                            }
                        ]
                    },
                    {
                        key: "followUp.outcomes.abandonedWrapper", type: "group", cols: 1, fields: [
                            {
                                key: "followUp.outcomes.abandoned", label: "Abandonó tratamiento", type: "radio", options: [
                                    { value: "SI", label: "SI" },
                                    { value: "NO", label: "NO" }
                                ]
                            },
                            { key: "followUp.outcomes.whyAbandoned", label: "Por qué?", type: "text", visible: (data) => data.followUp.outcomes.abandoned === "SI" }
                        ]
                    },
                    {
                        key: "followUp.outcomes.feverWrapper", type: "group", cols: 1, fields: [
                            {
                                key: "followUp.outcomes.continuingFever", label: "Persiste con picos febriles", type: "radio", options: [
                                    { value: "SI", label: "SI" },
                                    { value: "NO", label: "NO" }
                                ]
                            }
                        ]
                    },
                    {
                        key: "followUp.outcomes.referredWrapper", type: "group", cols: 1, fields: [
                            {
                                key: "followUp.outcomes.referredAgain", label: "Se refiere nuevamente", type: "radio", options: [
                                    { value: "SI", label: "SI" },
                                    { value: "NO", label: "NO" }
                                ]
                            }
                        ]
                    },
                    { key: "followUp.outcomes.finalComment", label: "Comentario Final", type: "text" }
                ]
            }
        ]
    }
];
