<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    interface Props extends HTMLInputAttributes {
        label?: string;
        value?: string;
        error?: string[] | undefined;
    }

    let { label, value = $bindable(), error, ...rest }: Props = $props();
</script>

<div class="form-group">
    {#if label}
        <label class="form-label" for={rest.id}>{label}</label>
    {/if}
    <input
        type="date"
        class="form-input {error ? 'border-red-500 focus:ring-red-500' : ''}"
        bind:value
        {...rest}
    />
    {#if error}
        <span class="text-xs text-red-500 mt-1">{error[0]}</span>
    {/if}
</div>
