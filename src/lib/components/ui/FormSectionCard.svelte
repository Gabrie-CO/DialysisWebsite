<script lang="ts">
    import { api } from "../../../../convex/_generated/api";
    import { useConvexClient } from "convex-svelte";
    import type { Snippet } from "svelte";

    let { title, data, patientId, children } = $props<{
        title: string;
        data: any;
        patientId: string;
        children: Snippet;
    }>();

    const convex = useConvexClient();
    let isPinning = $state(false);

    async function handlePin() {
        if (isPinning) return;
        isPinning = true;
        try {
            await convex.mutation(api.meetings.pinItem, {
                patientId: patientId as any,
                title: title,
                data: data,
            });
            // Optional: Add toast notification here
            console.log("Pinned successfully");
        } catch (error) {
            console.error("Failed to pin item:", error);
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
            class="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
            onclick={handlePin}
            title="Pin to Timeline"
            disabled={isPinning}
        >
            {#if isPinning}
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
                    fill="none"
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
