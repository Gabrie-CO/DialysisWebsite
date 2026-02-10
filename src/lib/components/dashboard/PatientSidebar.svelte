<script lang="ts">
  import { useQuery } from "convex-svelte";
  import { api } from "../../../../convex/_generated/api";

  let { selectedPatientId, onSelect } = $props<{
    selectedPatientId: string | null;
    onSelect: (id: string) => void;
  }>();

  // Renaming to patientsQuery since it seems to be fetching a list
  const patientsQuery = useQuery(api.patients.get);
</script>

<aside
  class="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full"
>
  <div class="p-4 border-b border-gray-100">
    <h2 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
      Patients
    </h2>
    <input
      type="text"
      placeholder="Search name or code..."
      class="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
    />
  </div>

  <div class="flex-1 overflow-y-auto">
    {#if patientsQuery.isLoading}
      <div class="p-4 text-sm text-gray-500">Loading patients...</div>
    {:else if patientsQuery.error}
      <div class="p-4 text-sm text-red-500">Error loading patients</div>
    {:else}
      {#each patientsQuery.data || [] as p}
        <button
          class="w-full text-left p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex justify-between items-center group
                    {selectedPatientId === p._id
            ? 'bg-blue-50 border-l-4 border-l-blue-600'
            : 'border-l-4 border-l-transparent'}"
          onclick={() => onSelect(p._id)}
        >
          <div>
            <div
              class="font-bold text-gray-800 text-sm group-hover:text-blue-900"
            >
              {p.firstName}
              {p.lastName}
            </div>
            <div class="text-[10px] text-gray-500 font-mono">
              {p.code}
            </div>
          </div>
          <div class="flex flex-col items-end gap-1">
            <span
              class={`w-2 h-2 rounded-full ${(p as any).status === "Active" ? "bg-green-500" : "bg-red-500"}`}
            ></span>
            {#if p.alerts && p.alerts.length > 0}
              <span
                class="text-[9px] bg-red-100 text-red-600 px-1 rounded font-bold"
                >!</span
              >
            {/if}
          </div>
        </button>
      {/each}
    {/if}
  </div>
</aside>
