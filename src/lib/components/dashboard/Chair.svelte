<script lang="ts">
    let {
        patientName,
        chairNumber,
        priority,
        onclick,
        onSignOut,
    }: {
        patientName: string;
        chairNumber: string;
        priority: "critical" | "warning" | "stable";
        onclick: () => void;
        onSignOut: () => void;
    } = $props();

    const colorMap: Record<"critical" | "warning" | "stable", string> = {
        critical: "bg-red-500 hover:bg-red-600 border-red-700 text-white",
        warning:
            "bg-yellow-400 hover:bg-yellow-500 border-yellow-600 text-gray-900",
        stable: "bg-green-500 hover:bg-green-600 border-green-700 text-white",
    };
</script>

<div
    class="relative group flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 shadow-md cursor-pointer {colorMap[
        priority
    ]}"
    {onclick}
    onkeydown={(e) => e.key === "Enter" && onclick()}
    role="button"
    tabindex="0"
>
    <!-- Sign Out Button -->
    <button
        class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all p-1 bg-white/20 hover:bg-white/40 rounded-lg text-[9px] font-bold uppercase tracking-tight z-10"
        onclick={(e) => {
            e.stopPropagation();
            onSignOut();
        }}
    >
        Clean Chair
    </button>
    <div class="text-[10px] uppercase font-bold opacity-80 mb-1">
        Chair {chairNumber}
    </div>
    <div class="text-lg font-bold text-center leading-tight">{patientName}</div>
    <div class="mt-2 text-[9px] font-mono tracking-widest opacity-60 uppercase">
        {priority}
    </div>
</div>
