<script lang="ts">
    interface Props {
        label: string;
        checked?: boolean;
        error?: string[] | undefined;
    }

    let { label, checked = $bindable(false), error }: Props = $props();
</script>

<div class="relative flex items-start">
    <div class="flex items-center">
        <input
            type="checkbox"
            bind:checked
            class="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
    </div>
    <div class="ml-3 text-sm">
        <label>
            <button type="button" class="font-medium text-gray-700 cursor-pointer"
            onclick={() => (checked = !checked)}>{label}</button>
        </label>    
   
        {#if error}
            <p class="text-xs text-red-500 mt-1">{error[0]}</p>
        {/if}
    </div>
</div>
