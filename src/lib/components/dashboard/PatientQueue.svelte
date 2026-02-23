<script lang="ts">
    let props = $props<{
        patients: any[];
        activeBlock?: number;
        onDragStart: (e: DragEvent, patientId: string) => void;
        onPatientDoubleClick?: (patientId: string) => void;
    }>();
</script>

<div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full">
    <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">
            Patient Queue
        </h3>
        {#if props.activeBlock}
            <span
                class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded"
            >
                Block {props.activeBlock}
            </span>
        {/if}
    </div>

    {#if props.patients.length === 0}
        <div class="text-gray-400 text-sm italic py-4 text-center">
            No patients waiting
        </div>
    {:else}
        <div class="flex flex-col gap-3">
            {#each props.patients as p}
                <div
                    class="p-3 border rounded-xl cursor-grab active:cursor-grabbing transition-colors relative group
                    {p.block === 1
                        ? 'bg-blue-50 hover:bg-blue-100 border-blue-200'
                        : p.block === 2
                          ? 'bg-green-50 hover:bg-green-100 border-green-200'
                          : p.block === 3
                            ? 'bg-orange-50 hover:bg-orange-100 border-orange-200'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-200'}"
                    draggable="true"
                    ondragstart={(e) => props.onDragStart(e, p._id)}
                    ondblclick={(e) => {
                        e.preventDefault();
                        if (window.getSelection) {
                            window.getSelection()?.removeAllRanges();
                        }
                        if (props.onPatientDoubleClick)
                            props.onPatientDoubleClick(p._id);
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
                                props.onPatientDoubleClick(p._id);
                        }}
                        title="Auto-assign to next chair"
                    >
                        Auto-Assign
                    </button>
                    <div class="font-bold text-gray-900">
                        {p.name ||
                            (p.firstName && p.lastName
                                ? `${p.firstName} ${p.lastName}`
                                : "Unknown Patient")}
                    </div>
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
