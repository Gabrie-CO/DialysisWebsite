<script lang="ts">
  import { useQuery } from "convex-svelte";
  import { api } from "../../../../convex/_generated/api";

  let {
    selectedPatientId,
    onSelect,
    mobileOpen = false,
    onClose,
  } = $props<{
    selectedPatientId: string;
    onSelect: (id: string) => void;
    mobileOpen?: boolean;
    onClose?: () => void;
  }>();

  const patientsQuery: any = useQuery(api.patients.get);

  let searchQuery = $state("");

  const filteredPatients = $derived(() => {
    const all = patientsQuery.data || [];
    if (!searchQuery.trim()) return all;
    const q = searchQuery.trim().toLowerCase();
    return all.filter((p: any) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const code = (p.code ?? "").toLowerCase();
      return fullName.includes(q) || code.includes(q);
    });
  });
</script>

<!-- Mobile Overlay Backdrops are handled in parent, this is just the drawer -->
<aside
  class="sidebar-container {mobileOpen
    ? 'translate-x-0 shadow-2xl'
    : '-translate-x-full'}"
>
  <div class="sidebar-header">
    <div class="flex justify-between items-center mb-2">
      <h2 class="sidebar-title">Patients</h2>
      <button
        class="md:hidden p-1 rounded hover:bg-gray-100 text-gray-500"
        onclick={onClose}
        aria-label="Close sidebar"
      >
        ✕
      </button>
    </div>
    <input
      type="text"
      placeholder="Search name or code..."
      class="sidebar-search"
      bind:value={searchQuery}
    />
  </div>

  <div class="sidebar-patient-list">
    {#if patientsQuery.isLoading}
      <div class="p-4 text-sm text-gray-500">Loading patients...</div>
    {:else if patientsQuery.error}
      <div class="p-4 text-sm text-red-500">
        Error loading patients:
        <pre class="mt-2 text-xs overflow-auto">{patientsQuery.error instanceof
          Error
            ? patientsQuery.error.toString()
            : JSON.stringify(patientsQuery.error, null, 2)}</pre>
      </div>
    {:else}
      {#each filteredPatients() as p}
        <button
          class="patient-btn group {selectedPatientId === p._id
            ? 'patient-btn-selected'
            : 'patient-btn-unselected'}"
          onclick={() => onSelect(p._id)}
        >
          <div>
            <div class="patient-name">
              {p.firstName}
              {p.lastName}
            </div>
            <div class="patient-code">
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
