import { writable } from 'svelte/store';

export const browser = true;
export const dev = true;
export const building = false;
export const version = 'any';

export const page = writable({
    url: new URL('http://localhost'),
    params: {},
    route: { id: 'test' },
    data: {},
    status: 200,
    error: null
});
export const navigating = writable(null);
export const updated = writable(false);

export const goto = () => Promise.resolve();
export const invalidate = () => Promise.resolve();
export const invalidateAll = () => Promise.resolve();
export const preloadData = () => Promise.resolve();
export const preloadCode = () => Promise.resolve();
export const beforeNavigate = () => { };
export const afterNavigate = () => { };
export const pushState = () => { };
export const replaceState = () => { };

export const applyAction = () => { };
export const deserialize = () => { };
export const enhance = () => { };
