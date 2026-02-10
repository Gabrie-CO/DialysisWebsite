<script lang="ts">
  import PatientSidebar from "$lib/components/dashboard/PatientSidebar.svelte";
  import Chair from "$lib/components/dashboard/Chair.svelte";
  import ActiveAlerts from "$lib/components/dashboard/ActiveAlerts.svelte";
  import ClinicStats from "$lib/components/dashboard/ClinicStats.svelte";
  import InfoSection from "$lib/components/dashboard/InfoSection.svelte";

  // State management
  let selectedPatientId = $state<string | null>(null);

  // Mock Data for 3 Patients
  const mockPatients = [
    {
      id: "pt-1",
      name: "Juan Perez",
      chairNumber: "01",
      priority: "critical" as const,
      alert: "Blood pressure drop detected",
    },
    {
      id: "pt-2",
      name: "Maria Garcia",
      chairNumber: "02",
      priority: "warning" as const,
      alert: "Treatment time exceeded",
    },
    {
      id: "pt-3",
      name: "Carlos Rodriguez",
      chairNumber: "03",
      priority: "stable" as const,
      alert: null,
    },
  ];

  // Derive alerts from mock data
  const activeAlerts = mockPatients
    .filter((p) => p.alert)
    .map((p) => ({
      id: p.id,
      patientName: p.name,
      message: p.alert as string,
      priority: p.priority,
    }));

  const totalPatients = mockPatients.length;
  const totalChairs = 12; // Static or dynamic
  const infectionCount = 1; // Logic placeholder

  function selectPatient(id: string) {
    selectedPatientId = id;
  }

  function resetToDashboard() {
    selectedPatientId = null;
  }

  function signOutPatient(id: string) {
    const patientName = mockPatients.find((p) => p.id === id)?.name;
    alert(`Signing out ${patientName} from their chair.`);
    // Real logic would update the database here
  }
</script>

<div class="flex h-screen bg-gray-50 overflow-hidden">
  <!-- Sidebar -->
  <PatientSidebar {selectedPatientId} onSelect={(id) => selectPatient(id)} />

  <!-- Main Content -->
  <main class="flex-1 overflow-y-auto p-8">
    {#if selectedPatientId === null}
      <!-- Dashboard Overview -->
      <div class="max-w-6xl mx-auto">
        <header class="mb-10 flex justify-between items-end">
          <div>
            <h1 class="text-3xl font-black text-gray-900 tracking-tight">
              Clinic Overview
            </h1>
            <p class="text-gray-500 font-medium mb-4">
              Real-time status of all active treatment chairs
            </p>
            <div class="flex items-center gap-4">
              <ClinicStats {totalPatients} {totalChairs} />
            </div>
          </div>
        </header>

        <!-- Alerts Section @ TOP -->
        <ActiveAlerts alerts={activeAlerts} />

        <!-- Chair Grid -->
        <div class="mb-10 mt-8">
          <h3
            class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4"
          >
            Treatment Area
          </h3>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {#each mockPatients as p}
              <Chair
                patientName={p.name}
                chairNumber={p.chairNumber}
                priority={p.priority}
                onclick={() => selectPatient(p.id)}
                onSignOut={() => signOutPatient(p.id)}
              />
            {/each}

            <!-- Empty Chairs Placeholder -->
            {#each Array(totalChairs - mockPatients.length) as _, i}
              <div
                class="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl opacity-40"
              >
                <div class="text-[10px] uppercase font-bold text-gray-400 mb-1">
                  Chair {String(mockPatients.length + i + 1).padStart(2, "0")}
                </div>
                <div class="text-sm font-bold text-gray-300">Available</div>
              </div>
            {/each}
          </div>

          <!-- Info Section -->
          <InfoSection {infectionCount} {totalPatients} />
        </div>
      </div>
    {:else}
      <!-- Patient Specific View -->
      <div class="max-w-5xl mx-auto">
        <button
          onclick={resetToDashboard}
          class="mb-6 text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
        >
          ← Back to Clinic Overview
        </button>

        <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h1 class="text-3xl font-black text-gray-900 mb-2">
            {mockPatients.find((p) => p.id === selectedPatientId)?.name ||
              "Patient Record"}
          </h1>
          <p class="text-gray-500">Patient Dashboard Placeholder</p>

          <div
            class="mt-12 p-24 border-4 border-dashed border-gray-50 rounded-2xl flex items-center justify-center"
          >
            <span class="text-gray-300 font-bold uppercase tracking-widest"
              >Detailed Vitals & Charts Loading...</span
            >
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: "Inter", sans-serif;
  }
</style>
