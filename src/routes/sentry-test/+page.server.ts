
export const load = async () => {
    return {
        message: "Sentry Test Page"
    };
};

export const actions = {
    throwError: async () => {
        throw new Error("Sentry Test: Server-side Action Error");
    }
};
