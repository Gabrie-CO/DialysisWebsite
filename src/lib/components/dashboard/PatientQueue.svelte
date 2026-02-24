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
                    class="p-3 rounded-xl cursor-grab active:cursor-grabbing transition-colors relative group border"
                    class:bg-yellow-50={!p.block || p.block === 1}
                    class:border-yellow-100={!p.block || p.block === 1}
                    class:bg-blue-50={p.block === 2}
                    class:border-blue-100={p.block === 2}
                    class:bg-indigo-50={p.block === 3}
                    class:border-indigo-100={p.block === 3}
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
                        class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 rounded text-[10px] font-bold transition-all z-10"
                        class:bg-yellow-200={!p.block || p.block === 1}
                        class:text-yellow-800={!p.block || p.block === 1}
                        class:hover:bg-yellow-300={!p.block || p.block === 1}
                        class:bg-blue-200={p.block === 2}
                        class:text-blue-800={p.block === 2}
                        class:hover:bg-blue-300={p.block === 2}
                        class:bg-indigo-200={p.block === 3}
                        class:text-indigo-800={p.block === 3}
                        class:hover:bg-indigo-300={p.block === 3}
                        onclick={(e) => {
                            e.stopPropagation();
                            if (props.onPatientDoubleClick)
                                props.onPatientDoubleClick(p._id);
                        }}
                        title="Auto-assign to next chair"
                    >
                        Auto-Assign
                    </button>
                    <div
                        class="font-bold text-gray-900 flex justify-between items-center"
                    >
                        <span>
                            {p.name ||
                                (p.firstName && p.lastName
                                    ? `${p.firstName} ${p.lastName}`
                                    : "Unknown Patient")}
                        </span>
                        {#if p.block}
                            <span
                                class="text-[10px] font-mono opacity-50 px-1 border rounded border-gray-400/20"
                                >B{p.block}</span
                            >
                        {/if}
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
