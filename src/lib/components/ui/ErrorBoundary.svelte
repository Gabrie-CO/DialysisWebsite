<script lang="ts">
    let { children } = $props();
    let error = $state<Error | null>(null);

    // New Svelte 5 error boundary mechanism: <svelte:boundary>
    // However, to catch errors and show UI, we use the boundary snippet.
    // Wait, <svelte:boundary> is for catching errors. usage:
    // <svelte:boundary onerror={(e) => { error = e; }}>
    //    {@render children()}
    //    {#snippet failed(e, reset)}
    //       ... error ui ...
    //    {/snippet}
    // </svelte:boundary>
    // But since the API might be in flux, let's check if we can use a simple class-based component if needed, or if <svelte:boundary> is stable.
    // Actually, the prompt context mentions Svelte 5.
    // Official Svelte 5 docs use <svelte:boundary>
</script>

<svelte:boundary
    onerror={(e) => {
        console.error("Boundary caught error:", e);
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
