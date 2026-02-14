<script lang="ts">
    let props = $props<{
        patients: any[];
        onDragStart: (e: DragEvent, patientId: string) => void;
        onPatientDoubleClick?: (patientId: string) => void;
    }>();
</script>

<div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-full">
    <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
        Patient Queue
    </h3>

    {#if props.patients.length === 0}
        <div class="text-gray-400 text-sm italic py-4 text-center">
            No patients waiting
        </div>
    {:else}
        <div class="flex flex-col gap-3">
            {#each props.patients as p}
                <div
                    class="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl cursor-grab active:cursor-grabbing transition-colors relative group"
                    draggable="true"
                    ondragstart={(e) => props.onDragStart(e, p.id)}
                    ondblclick={(e) => {
                        e.preventDefault();
                        if (window.getSelection) {
                            window.getSelection()?.removeAllRanges();
                        }
                        if (props.onPatientDoubleClick)
                            props.onPatientDoubleClick(p.id);
                    }}
                    role="button"
                    tabindex="0"
                >
                    <!-- Fallback Double Click Button -->
                    <button
                        class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-blue-200 hover:bg-blue-300 rounded text-[10px] font-bold text-blue-800 transition-all z-10"
                        onclick={(e) => {
                            e.stopPropagation();
                            if (props.onPatientDoubleClick)
                                props.onPatientDoubleClick(p.id);
                        }}
                        title="Auto-assign to next chair"
                    >
                        Auto-Assign
                    </button>
                    <div class="font-bold text-gray-900">{p.name}</div>
                    {#if p.alert}
                        <div
                            class="text-[10px] text-red-500 font-bold uppercase mt-1"
                        >
                            {p.alert}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>
