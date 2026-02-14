export const OfflineService = {
    saveForm: (formId: string, data: any) => {
        try {
            localStorage.setItem(`offline_form_${formId}`, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.error("Failed to save offline form", e);
        }
    },

    loadForm: (formId: string) => {
        try {
            const item = localStorage.getItem(`offline_form_${formId}`);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            return null;
        }
    },

    clearForm: (formId: string) => {
        localStorage.removeItem(`offline_form_${formId}`);
    },

    hasOfflineData: (formId: string) => {
        return !!localStorage.getItem(`offline_form_${formId}`);
    }
};
