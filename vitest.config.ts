import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';
import path from 'path';

export default defineConfig({
    plugins: [svelte(), svelteTesting()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/setupTest.ts'],
        include: ['src/**/*.{test,spec}.{js,ts}'],
        alias: {
            '$lib': path.resolve(__dirname, './src/lib'),
            '$app/environment': path.resolve(__dirname, './src/test/mocks.ts'),
            '$app/stores': path.resolve(__dirname, './src/test/mocks.ts'),
            '$app/navigation': path.resolve(__dirname, './src/test/mocks.ts'),
            '$app/forms': path.resolve(__dirname, './src/test/mocks.ts')
        }
    }
});
