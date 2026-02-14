import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OfflineService } from './offline';

describe('OfflineService', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should save form data to localStorage', () => {
        const formId = 'test-form';
        const data = { foo: 'bar' };

        OfflineService.saveForm(formId, data);

        const stored = localStorage.getItem(`offline_form_${formId}`);
        expect(stored).not.toBeNull();
        const parsed = JSON.parse(stored!);
        expect(parsed.data).toEqual(data);
        expect(parsed.timestamp).toBeDefined();
    });

    it('should load form data from localStorage', () => {
        const formId = 'test-form';
        const data = { foo: 'bar' };
        localStorage.setItem(`offline_form_${formId}`, JSON.stringify({ data, timestamp: 123 }));

        const loaded = OfflineService.loadForm(formId);
        expect(loaded).toEqual({ data, timestamp: 123 });
    });

    it('should return null if form data does not exist', () => {
        const loaded = OfflineService.loadForm('non-existent');
        expect(loaded).toBeNull();
    });

    it('should clear form data from localStorage', () => {
        const formId = 'test-form';
        localStorage.setItem(`offline_form_${formId}`, 'some data');

        OfflineService.clearForm(formId);

        expect(localStorage.getItem(`offline_form_${formId}`)).toBeNull();
    });

    it('should check if offline data exists', () => {
        const formId = 'test-form';
        expect(OfflineService.hasOfflineData(formId)).toBe(false);

        localStorage.setItem(`offline_form_${formId}`, 'data');
        expect(OfflineService.hasOfflineData(formId)).toBe(true);
    });

    // it('should handle localStorage errors gracefully', () => {
    //     const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    //         throw new Error('QuotaExceeded');
    //     });
    //     const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    //     OfflineService.saveForm('test', {});

    //     expect(setItemSpy).toHaveBeenCalled();
    //     expect(consoleSpy).toHaveBeenCalledWith('Failed to save offline form', expect.any(Error));
    // });
});
