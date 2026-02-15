import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PatientCard from '../patientCard.svelte';
import { OfflineService } from '$lib/services/offline';

// Mock dependencies
// Verified fix
vi.mock('convex-svelte', () => ({
    useConvexClient: vi.fn(() => ({
        mutation: vi.fn()
    })),
    useQuery: vi.fn(() => ({
        isLoading: false,
        data: null
    })),
    useMutation: vi.fn(() => ({
        mutate: vi.fn(),
        isLoading: false
    }))
}));

vi.mock('$lib/services/offline', () => ({
    OfflineService: {
        saveForm: vi.fn(),
        loadForm: vi.fn(),
        clearForm: vi.fn(),
        hasOfflineData: vi.fn()
    }
}));

vi.mock('svelte-sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn()
    }
}));

describe('PatientCard Component', () => {
    const mockInitialData = {
        updatedAt: undefined,
        elderly80_90: false,
        malnutrition: false,
        preservedDiuresis: false,
        time: '',
        qd: '',
        qb: '',
        ktvt: '',
        filter: '',
        observations: '',
        signature: ''
    };

    const mockOnSave = vi.fn();
    const mockPatientId = '123';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render form fields correctly', () => {
        render(PatientCard, {
            initialData: mockInitialData,
            patientId: mockPatientId,
            onSave: mockOnSave
        });

        // Check for clinical indicators
        expect(screen.getByText('Elderly (80-90)')).toBeInTheDocument();
        expect(screen.getByText('Malnutrition')).toBeInTheDocument();
        expect(screen.getByText('Preserved Diuresis')).toBeInTheDocument();

        // Check for dialysis parameters
        expect(screen.getByText('Time (min)')).toBeInTheDocument();
        expect(screen.getByText('Qd')).toBeInTheDocument();
        expect(screen.getByText('Qb')).toBeInTheDocument();
        expect(screen.getByText('KT/v T')).toBeInTheDocument();
        expect(screen.getByText('Filter')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter observations...')).toBeInTheDocument();
    });

    it('should load offline data if available', async () => {
        const offlineData = {
            data: {
                ...mockInitialData,
                observations: 'Offline observation'
            }
        };

        (OfflineService.loadForm as any).mockReturnValue(offlineData);

        render(PatientCard, {
            initialData: mockInitialData,
            patientId: mockPatientId,
            onSave: mockOnSave
        });

        // Use findBy because effect runs async
        const input = await screen.findByPlaceholderText('Enter observations...');
        expect(input).toHaveValue('Offline observation');
    });
});
