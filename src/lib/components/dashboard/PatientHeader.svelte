<script lang="ts">
    let { patient, activeTab, onTabChange } = $props<{
        patient: any;
        activeTab: string;
        onTabChange: (tab: string) => void;
    }>();
</script>

<header class="bg-white border-b border-gray-200 p-4 shadow-sm z-10">
    <div class="flex justify-between items-start">
        <div class="flex gap-4 items-center">
            <div
                class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg"
            >
                {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
                <h1 class="text-xl font-bold text-gray-900 leading-none">
                    {patient.firstName}
                    {patient.lastName}
                </h1>
                <div class="flex gap-3 text-sm text-gray-500 mt-1">
                    <span class="font-mono bg-gray-100 px-1 rounded"
                        >{patient.code}</span
                    >
                    <span>{patient.demographics.age} years</span>
                    <span>{patient.demographics.gender}</span>
                    <span class="font-bold text-gray-700"
                        >Dry Wt: {patient.demographics.dryWeight}kg</span
                    >
                </div>
            </div>
        </div>

        <div class="flex flex-col items-end gap-2">
            <div class="flex gap-2">
                {#each patient.alerts as alert}
                    <span
                        class="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold border border-red-200"
                        >{alert}</span
                    >
                {/each}
                <span
                    class="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold border border-blue-100"
                >
                    {patient.currentAccess.type} - {patient.currentAccess
                        .location}
                </span>
            </div>
            <div class="text-xs text-gray-400">Last Dialysis: 2 days ago</div>
        </div>
    </div>

    <!-- NAVIGATION TABS -->
    <div class="flex gap-6 mt-6 border-b border-gray-200">
        <button
            class="pb-2 text-sm font-medium border-b-2 transition-colors capitalize
            {activeTab === 'timeline'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'}"
            onclick={() => onTabChange("timeline")}
        >
            Patient Timeline (History)
        </button>
        <button
            class="pb-2 text-sm font-medium border-b-2 transition-colors capitalize
            {activeTab === 'forms'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'}"
            onclick={() => onTabChange("forms")}
        >
            + New Entry
        </button>
    </div>
</header>
