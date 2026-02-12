<script lang="ts">
    interface Option {
        value: string | boolean;
        label: string;
    }

    interface Props {
        label?: string;
        value?: string | boolean | null;
        options: Option[];
        name: string;
        error?: string[] | undefined;
        row?: boolean; // Display horizontally
    }

    let {
        label,
        value = $bindable(),
        options,
        name,
        error,
        row = false,
    }: Props = $props();
</script>

<div class="form-group">
    {#if label}
        <span class="form-label mb-2 block">{label}</span>
    {/if}
    <div class="flex flex-wrap gap-4 {row ? 'flex-row' : 'flex-col'}">
        {#each options as option}
            <label class="inline-flex items-center cursor-pointer">
                <input
                    type="radio"
                    {name}
                    value={option.value}
                    checked={value === option.value}
                    onchange={() => (value = option.value)}
                    class="form-radio text-blue-600 h-4 w-4"
                />
                <span class="ml-2 text-sm text-gray-700">{option.label}</span>
            </label>
        {/each}
    </div>
    {#if error}
        <span class="text-xs text-red-500 mt-1">{error[0]}</span>
    {/if}
</div>
