import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    scale: vi.fn(),
    // Add other methods if needed
})) as any;
