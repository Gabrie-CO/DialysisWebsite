<script lang="ts">
    import type { FormSchema } from "./types";
    import FieldRenderer from "./FieldRenderer.svelte";

    let { schema, data = $bindable() }: { schema: FormSchema; data: any } =
        $props();
</script>

<div class="space-y-6">
    {#each schema as section}
        <div class="form-section-container">
            {#if section.title}
                <div class="form-section">
                    <h3 class="form-section-title">{section.title}</h3>
                </div>
            {/if}

            <div
                class={`grid grid-cols-1 md:grid-cols-${section.cols || 1} gap-6 mb-6 p-4`}
            >
                {#each section.fields as field}
                    <FieldRenderer {field} bind:data />
                {/each}
            </div>
        </div>
    {/each}
</div>
