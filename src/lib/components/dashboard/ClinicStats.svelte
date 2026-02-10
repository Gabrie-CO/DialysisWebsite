<script lang="ts">
    let { totalPatients, totalChairs } = $props<{
        totalPatients: number;
        totalChairs: number;
    }>();
</script>

<div
    class="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm"
>
    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest"
        >Clinic Load</span
    >
    <span class="text-sm font-black text-blue-600">
        {totalPatients}<span class="text-gray-300 font-medium"
            >/{totalChairs}</span
        >
    </span>
</div>
