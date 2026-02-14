<script lang="ts">
    let { infectionCount, totalPatients } = $props<{
        infectionCount: number;
        totalPatients: number;
    }>();

    // Simple SVG Pie Chart logic using Svelte 5 derivatives
    let percentage = $derived(
        totalPatients > 0 ? (infectionCount / totalPatients) * 100 : 0,
    );
    const radius = 15.915494309189533; // Magic radius for circumference 100
    let strokeDasharray = $derived(`${percentage} ${100 - percentage}`);
</script>

<div
    class="bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm mt-8 inline-flex items-center gap-6 transform scale-125 origin-left"
>
    <div class="flex items-center gap-4">
        <!-- Medium compact Pie Chart -->
        <div class="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 42 42" class="w-full h-full transform -rotate-90">
                <circle
                    cx="21"
                    cy="21"
                    r={radius}
                    fill="transparent"
                    stroke="#f3f4f6"
                    stroke-width="8"
                />
                <circle
                    cx="21"
                    cy="21"
                    r={radius}
                    fill="transparent"
                    stroke="#ef4444"
                    stroke-width="8"
                    stroke-dasharray={strokeDasharray}
                    stroke-dashoffset="0"
                    class="transition-all duration-700 ease-in-out"
                />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-xs font-black text-gray-800"
                    >{Math.round(percentage)}%</span
                >
            </div>
        </div>

        <div class="flex flex-col">
            <span
                class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2"
                >Clinic Infection Rate</span
            >
            <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-red-500"></div>
                    <span class="text-xs font-bold text-gray-700"
                        >{infectionCount} active cases</span
                    >
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-gray-200"></div>
                    <span class="text-xs font-bold text-gray-400"
                        >{totalPatients - infectionCount} stable</span
                    >
                </div>
            </div>
        </div>
    </div>
</div>
