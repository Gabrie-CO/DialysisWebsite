<script lang="ts">
    let { children } = $props();
    let error = $state<Error | null>(null);

    import { logger } from "$lib/services/logger";
</script>

<svelte:boundary
    onerror={(e) => {
        logger.error("Boundary caught error:", e);
    }}
>
    {@render children()}

    {#snippet failed(error: any, reset)}
        <div class="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
            <div class="text-4xl mb-4">⚠️</div>
            <h3 class="text-lg font-bold text-red-800 mb-2">
                Something went wrong
            </h3>
            <p class="text-sm text-red-600 mb-4">
                {error?.message || "An unexpected error occurred."}
            </p>
            <button
                class="bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded transition-colors"
                onclick={reset}
            >
                Try Again
            </button>
        </div>
    {/snippet}
</svelte:boundary>
