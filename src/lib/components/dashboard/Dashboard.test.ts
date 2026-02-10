import { render, screen } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ClinicStats from './ClinicStats.svelte';
import Chair from './Chair.svelte';

describe('Dashboard Logic & Components', () => {

    describe('ClinicStatsComponent', () => {
        it('should display the correct load format (3/12)', () => {
            render(ClinicStats, { totalPatients: 3, totalChairs: 12 });

            // Check if "3" and "/12" are present
            const statsText = screen.getByText(/3/);
            expect(statsText).toBeInTheDocument();
            expect(screen.getByText(/\/12/)).toBeInTheDocument();
        });

        it('should display correctly when empty (0/12)', () => {
            render(ClinicStats, { totalPatients: 0, totalChairs: 12 });
            expect(screen.getByText(/0/)).toBeInTheDocument();
            expect(screen.getByText(/\/12/)).toBeInTheDocument();
        });
    });

    describe('ChairComponent', () => {
        const mockProps = {
            patientName: 'Test Patient',
            chairNumber: '10',
            onclick: vi.fn(),
            onSignOut: vi.fn()
        };

        it('should have red classes for critical priority', () => {
            const { container } = render(Chair, { ...mockProps, priority: 'critical' });
            const chairDiv = container.querySelector('[role="button"]');
            expect(chairDiv).toHaveClass('bg-red-500');
        });

        it('should have yellow classes for warning priority', () => {
            const { container } = render(Chair, { ...mockProps, priority: 'warning' });
            const chairDiv = container.querySelector('[role="button"]');
            expect(chairDiv).toHaveClass('bg-yellow-400');
        });

        it('should have green classes for stable priority', () => {
            const { container } = render(Chair, { ...mockProps, priority: 'stable' });
            const chairDiv = container.querySelector('[role="button"]');
            expect(chairDiv).toHaveClass('bg-green-500');
        });

        it('should display "Clean Chair" button on the chair', () => {
            render(Chair, { ...mockProps, priority: 'stable' });
            expect(screen.getByText('Clean Chair')).toBeInTheDocument();
        });
    });
});
