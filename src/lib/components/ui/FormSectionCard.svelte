<script lang="ts">
    import { api } from "../../../../convex/_generated/api";
    import { useConvexClient, useQuery } from "convex-svelte";
    import { toast } from "svelte-sonner";
    import type { Snippet } from "svelte";
    // @ts-ignore
    import type { Id } from "../../../../convex/_generated/dataModel";

    let { title, data, patientId, sourcePath, children } = $props<{
        title: string;
        data: any;
        patientId: string;
        sourcePath?: string;
        children: Snippet;
    }>();

    const convex = useConvexClient();
    const patient = useQuery(api.patients.getById, () => ({
        id: patientId as Id<"users">,
    }));

    let isPinning = $state(false);
    const isPinned = $derived(
        patient.data?.pinnedSections?.includes(title) ?? false,
    );

    async function handlePin() {
        if (isPinning) return;
        isPinning = true;
        try {
            await convex.mutation(api.patients.togglePin, {
                patientId: patientId as Id<"users">,
                section: title,
            });

            if (!isPinned) {
                toast.success(`Pinned ${title} to timeline`);
            } else {
                toast.success(`Removed ${title} from timeline`);
            }
        } catch (error: any) {
            console.error("Failed to toggle pin:", error);
            toast.error(`Error: ${error.message || "Failed to update pin"}`);
        } finally {
            isPinning = false;
        }
    }
</script>

<div class="form-section-card group relative">
    <div
        class="flex justify-between items-center mb-4 border-b border-gray-100 pb-2"
    >
        <h3 class="text-xl font-bold text-gray-800">{title}</h3>
        <button
            class="p-2 rounded-full transition-colors {isPinned
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-100 text-gray-400 hover:text-blue-600'}"
            onclick={handlePin}
            title={isPinned ? "Remove from Timeline" : "Pin to Timeline"}
            disabled={isPinning || patient.isLoading}
        >
            {#if isPinning || patient.isLoading}
                <div
                    class="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                ></div>
            {:else}
                <!-- Pin Icon -->
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={isPinned ? "currentColor" : "none"}
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <line x1="12" y1="17" x2="12" y2="22"></line>
                    <path
                        d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"
                    ></path>
                </svg>
            {/if}
        </button>
    </div>

    {@render children()}
</div>
