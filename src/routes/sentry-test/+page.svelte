<script lang="ts">
    import { enhance } from "$app/forms";

    const throwClientError = () => {
        throw new Error("Sentry Test: Client-side Error");
    };
</script>

<div class="p-8 space-y-4">
    <h1 class="text-2xl font-bold">Sentry Integration Test</h1>

    <div class="space-x-4">
        <button
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onclick={throwClientError}
        >
            Throw Client Error
        </button>

        <form method="POST" action="?/throwError" use:enhance class="inline">
            <button
                type="submit"
                class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
                Throw Server Error
            </button>
        </form>
    </div>
</div>
