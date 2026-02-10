import { untrack } from "svelte";

// --- TYPES ---
export interface AccessData {
    active: boolean;
    date: string;
    unknownDate: boolean;
}

export interface SymptomData {
    active: boolean;
    start: string;
    char: string;
    desc?: string;
}

export interface CIDHFormData {
    patient: {
        firstName: string;
        lastName: string;
        gender: string;
        dob: string;
        clinic: string;
        cubicle: string;
        eventDate: string;
        address: string;
        manager: string;
        diseases: { dm: boolean; hta: boolean };
    };
    access: {
        fistula: AccessData;
        graft: AccessData;
        permCatheter: AccessData;
        tempCatheter: AccessData;
        [key: string]: AccessData; // Index signature for schema loop
    };
    nursing: {
        fever: boolean;
        chills: boolean;
        cough: boolean;
        hypotension: boolean;
        pus: boolean;
        cellulitis: boolean;
        wound: boolean;
        other: string;
        signature: string;
        [key: string]: boolean | string; // Index signature for loop access
    };
    medical: {
        symptoms: {
            general: SymptomData;
            fever: SymptomData;
            cough: SymptomData;
            sputum: SymptomData;
            dyspnea: SymptomData;
            sweats: SymptomData;
            upperResp: SymptomData;
            other: SymptomData;
            [key: string]: SymptomData;
        };
        diagnosis: {
            vascularInfection: boolean;
            pneumonia: boolean;
            cellulitis: boolean;
            uti: boolean;
            cold: boolean;
            tb: boolean;
            diabeticFoot: boolean;
            other: string;
            [key: string]: boolean | string;
        };
        tests: {
            bloodCulture: boolean;
            urineCulture: boolean;
            hemogram: boolean;
            other: string;
            [key: string]: boolean | string;
        };
        referral: {
            sent: boolean;
            where: string;
            followUp: string;
        };
        signature: string;
    };
    followUp: {
        date: string;
        hospitalized: boolean;
        result: {
            hemoculture: boolean;
            positive: boolean;
            negative: boolean;
            pathogen: { staphAureus: boolean; other: string };
            sensitivity: { vancomycin: boolean; other: string };
        };
        treatmentStart: {
            ivVancomycin: boolean;
            dose: string;
            everyXDays: string;
        };
        logs: Array<{
            date: string;
            patientBrought: boolean;
            doseIndicated: string;
            doseOtherIndicated: string;
            doseAdmin: string;
            doseOtherAdmin: string;
            route: string;
            comment: string;
        }>;
        outcomes: {
            completed: string | null;
            abandoned: string | null;
            whyAbandoned: string;
            continuingFever: string | null;
            referredAgain: string | null;
            finalComment: string;
        };
    };
    updatedAt?: string;
}

export function createCIDHData(initialData: Partial<CIDHFormData> = {}): CIDHFormData {
    return {
        patient: {
            firstName: "",
            lastName: "",
            gender: "",
            dob: "",
            clinic: "",
            cubicle: "",
            eventDate: "",
            address: "",
            manager: "",
            diseases: { dm: false, hta: false },
            ...initialData.patient,
        },
        access: {
            fistula: { active: false, date: "", unknownDate: false },
            graft: { active: false, date: "", unknownDate: false },
            permCatheter: { active: false, date: "", unknownDate: false },
            tempCatheter: { active: false, date: "", unknownDate: false },
            ...initialData.access,
        },
        nursing: {
            fever: false,
            chills: false,
            cough: false,
            hypotension: false,
            pus: false,
            cellulitis: false,
            wound: false,
            other: "",
            signature: "",
            ...initialData.nursing,
        },
        medical: {
            symptoms: {
                general: { active: false, start: "", char: "" },
                fever: { active: false, start: "", char: "" },
                cough: { active: false, start: "", char: "" },
                sputum: { active: false, start: "", char: "" },
                dyspnea: { active: false, start: "", char: "" },
                sweats: { active: false, start: "", char: "" },
                upperResp: { active: false, start: "", char: "" },
                other: { active: false, start: "", char: "", desc: "" },
                ...initialData.medical?.symptoms,
            },
            diagnosis: {
                vascularInfection: false,
                pneumonia: false,
                cellulitis: false,
                uti: false,
                cold: false,
                tb: false,
                diabeticFoot: false,
                other: "",
                ...initialData.medical?.diagnosis,
            },
            tests: {
                bloodCulture: false,
                urineCulture: false,
                hemogram: false,
                other: "",
                ...initialData.medical?.tests,
            },
            referral: {
                sent: false,
                where: "",
                followUp: "same",
                ...initialData.medical?.referral,
            },
            signature: "",
            ...initialData.medical,
        },
        followUp: {
            date: "",
            hospitalized: false,
            result: {
                hemoculture: false,
                positive: false,
                negative: false,
                pathogen: { staphAureus: false, other: "" },
                sensitivity: { vancomycin: false, other: "" },
                ...initialData.followUp?.result,
            },
            treatmentStart: {
                ivVancomycin: false,
                dose: "",
                everyXDays: "",
                ...initialData.followUp?.treatmentStart,
            },
            logs:
                initialData.followUp?.logs ||
                Array.from({ length: 10 }, () => ({
                    date: "",
                    patientBrought: false,
                    doseIndicated: "1g",
                    doseOtherIndicated: "",
                    doseAdmin: "1g",
                    doseOtherAdmin: "",
                    route: "IV",
                    comment: "",
                })),
            outcomes: {
                completed: null,
                abandoned: null,
                whyAbandoned: "",
                continuingFever: null,
                referredAgain: null,
                finalComment: "",
                ...initialData.followUp?.outcomes,
            },
            ...initialData.followUp,
        },
        ...initialData,
    };
}
