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
        critical: "chair-critical",
        warning: "chair-warning",
        stable: "chair-stable",
        cleaning: "chair-cleaning",
    };
</script>

<div
    class="chair-card group {colorMap[props.priority]}"
    onclick={props.onclick}
    ondblclick={(e) => {
        e.preventDefault();
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
        class="chair-card-options-btn"
        onclick={(e) => {
            e.stopPropagation();
            if (props.onDoubleClick) props.onDoubleClick();
        }}
        aria-label="Options"
    >
        ⋮
    </button>

    <div class="chair-card-number">
        Chair {props.chairNumber}
    </div>
    <div class="chair-card-name">
        {props.patientName}
    </div>
    <div class="chair-card-priority">
        {props.priority}
    </div>
</div>
