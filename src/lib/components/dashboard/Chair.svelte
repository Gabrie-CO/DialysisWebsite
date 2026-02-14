<script lang="ts">
    let props: {
        patientName: string;
        chairNumber: string;
        priority: "critical" | "warning" | "stable" | "cleaning";
        onclick: () => void;
        onDoubleClick?: () => void;
        onSignOut: () => void;
    } = $props();

    const colorMap: Record<
        "critical" | "warning" | "stable" | "cleaning",
        string
    > = {
        critical: "bg-red-500 hover:bg-red-600 border-red-700 text-white",
        warning:
            "bg-yellow-400 hover:bg-yellow-500 border-yellow-600 text-gray-900",
        stable: "bg-green-500 hover:bg-green-600 border-green-700 text-white",
        cleaning:
            "bg-purple-500 hover:bg-purple-600 border-purple-700 text-white",
    };
</script>

<div
    class="relative group flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 shadow-md cursor-pointer {colorMap[
        props.priority
    ]}"
    onclick={props.onclick}
    ondblclick={(e) => {
        e.preventDefault();
        // Prevent text selection
        if (window.getSelection) {
            window.getSelection()?.removeAllRanges();
        }
        if (props.onDoubleClick) props.onDoubleClick();
    }}
    onkeydown={(e) => e.key === "Enter" && props.onclick()}
    role="button"
    tabindex="0"
>
    <!-- Options Button (Fallback for Double Click) -->
    <button
        class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all p-1 bg-white/20 hover:bg-white/40 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-20"
        onclick={(e) => {
            e.stopPropagation();
            if (props.onDoubleClick) props.onDoubleClick();
        }}
        aria-label="Options"
    >
        ⋮
    </button>

    <div class="text-[10px] uppercase font-bold opacity-80 mb-1">
        Chair {props.chairNumber}
    </div>
    <div class="text-lg font-bold text-center leading-tight">
        {props.patientName}
    </div>
    <div class="mt-2 text-[9px] font-mono tracking-widest opacity-60 uppercase">
        {props.priority}
    </div>
</div>
