<script lang="ts">
    interface Column {
        header: string;
        width?: string;
    }

    interface Props {
        label?: string;
        columns: Column[];
        children: any; // Snippet for rows
    }

    let { label, columns, children }: Props = $props();
</script>

<div class="form-group table-input-container">
    {#if label}
        <div class="table-input-title">
            {label}
        </div>
    {/if}
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    {#each columns as col}
                        <th scope="col" class="table-input-th {col.width}">
                            {col.header}
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                {@render children()}
            </tbody>
        </table>
    </div>
</div>
