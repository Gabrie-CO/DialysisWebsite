<script lang="ts">
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

    let isOnline = $state(true);

    onMount(() => {
        isOnline = navigator.onLine;

        const handleOnline = () => {
            isOnline = true;
            toast.success("Back online");
        };

        const handleOffline = () => {
            isOnline = false;
            toast.error("You are offline. Changes may not be saved.");
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    });
</script>

{#if !isOnline}
    <div
        class="bg-red-600 text-white text-center py-2 px-4 text-sm font-bold fixed top-0 left-0 right-0 z-50 animate-fade-in shadow-md"
    >
        Example Dialysis App: You are currently offline. Please check your
        internet connection.
    </div>
{/if}

<style>
    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(-100%);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fade-in {
        animation: fade-in 0.3s ease-out;
    }
</style>
