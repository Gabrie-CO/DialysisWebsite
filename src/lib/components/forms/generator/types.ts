export type FieldType =
    | 'text'
    | 'date'
    | 'checkbox'
    | 'radio'
    | 'textarea'
    | 'select'
    | 'header' // For subsections like "Impresión Diagnostica"
    | 'group' // For grouping fields visually without a header
    | 'table'; // For array of objects

export interface FormOption {
    value: string | boolean | number;
    label: string;
}

export interface FormField {
    key: string; // Dot notation accessor, e.g., "patient.firstName"
    label?: string; // Visible label
    type: FieldType;
    placeholder?: string;
    options?: FormOption[]; // For radio/select
    cols?: number; // Grid column span (default 1)
    className?: string; // Custom classes

    // Logic
    disabled?: (data: any) => boolean;
    visible?: (data: any) => boolean;

    // For nested layouts (groups)
    fields?: FormField[]; // If type is 'group'

    // For tables
    columns?: FormField[]; // If type is 'table', defines columns
}

export interface FormSection {
    id: string;
    title?: string;
    fields: FormField[];
    cols?: number; // Grid columns for the section (default 1 or 2)
}

export type FormSchema = FormSection[];
