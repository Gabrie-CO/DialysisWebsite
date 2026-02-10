<script lang="ts">
    let { alerts = [] } = $props<{
        alerts: {
            id: string;
            patientName: string;
            message: string;
            priority: string;
        }[];
    }>();
</script>

{#if alerts.length > 0}
    <div class="mb-6 animate-in fade-in slide-in-from-top duration-500">
        <div class="flex items-center gap-2 mb-3">
            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h3 class="text-sm font-bold text-red-700 uppercase tracking-wider">
                Active Alerts
            </h3>
        </div>

        <div class="space-y-2">
            {#each alerts as alert}
                <div
                    class="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg shadow-sm"
                >
                    <div class="flex flex-col">
                        <span class="text-xs font-bold text-red-900"
                            >{alert.patientName}</span
                        >
                        <span class="text-sm text-red-700">{alert.message}</span
                        >
                    </div>
                    <span
                        class="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter"
                    >
                        {alert.priority}
                    </span>
                </div>
            {/each}
        </div>
    </div>
{/if}
