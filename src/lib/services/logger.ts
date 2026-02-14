import * as Sentry from "@sentry/sveltekit";

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
    private context: Record<string, any> = {};

    constructor() { }

    setContext(key: string, value: any) {
        this.context[key] = value;
    }

    private formatMessage(level: LogLevel, message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const contextStr = Object.keys(this.context).length ? ` [Context: ${JSON.stringify(this.context)}]` : '';
        return `[${timestamp}] [${level.toUpperCase()}]${contextStr} ${message}`;
    }

    debug(message: string, data?: any) {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(this.formatMessage('debug', message), data || '');
        }
    }

    info(message: string, data?: any) {
        console.info(this.formatMessage('info', message), data || '');
    }

    warn(message: string, data?: any) {
        console.warn(this.formatMessage('warn', message), data || '');
    }

    error(message: string, error?: any, data?: any) {
        console.error(this.formatMessage('error', message), error || '', data || '');
        // Capture exception in Sentry
        if (error instanceof Error) {
            Sentry.captureException(error, { extra: { message, data, context: this.context } });
        } else {
            Sentry.captureException(new Error(message), { extra: { originalError: error, data, context: this.context } });
        }
    }
}

export const logger = new Logger();
