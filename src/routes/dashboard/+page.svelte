<script lang="ts">
  import { useQuery, useConvexClient } from "convex-svelte";
  import { api } from "../../../convex/_generated/api";
  import PatientSidebar from "$lib/components/dashboard/PatientSidebar.svelte";
  import PatientHeader from "$lib/components/dashboard/PatientHeader.svelte";
  import PatientCard from "$lib/components/forms/body/patientCard.svelte";
  import type { PageData } from "./$types";

  let { data } = $props<{ data: PageData }>();

  const convex = useConvexClient();

  // Fetch Data
  const patientsQuery = useQuery(api.patients.get, {});

  // Local State
  let selectedPatientId = $state("");
  let activeTab = $state("timeline");
  let activeDocument = $state<string | null>(null);

  // Derived
  let patients = $derived(patientsQuery.data || []);
  let patient = $derived(
    patients.find((p: any) => p._id === selectedPatientId) || patients[0],
  );

  // Initialize selectedPatientId
  $effect(() => {
    if (!selectedPatientId && patients.length > 0) {
      selectedPatientId = patients[0]._id;
    }
  });

  const assessmentQuery = useQuery(api.assessments.get, () => ({
    patientId: selectedPatientId as any,
    month: "October", // Dynamic later
    year: 2023, // Dynamic later
    type: "patientCard",
  }));

  // Sessions (Mock for now, or fetch if available)
  // let sessions = $derived(...)
  // For now keeping mock sessions logic based on ID if possible or just empty
  let sessions = $state([]); // Placeholder

  // Safeguard activeSession access
  let activeSession = $derived(
    data.activeSession && data.activeSession[selectedPatientId]
      ? data.activeSession[selectedPatientId]
      : null,
  );

  function handleSelectPatient(id: string) {
    selectedPatientId = id;
    activeTab = "timeline";
    activeDocument = null;
  }

  const AVAILABLE_DOCUMENTS = [
    {
      id: "patientCard",
      title: "Ficha de Paciente",
      icon: "📋",
      desc: "General patient information",
    },
    {
      id: "cidh",
      title: "Infection Control (CIDH)",
      icon: "🦠",
      desc: "Report infection signs/events",
    },
  ];
</script>

<div class="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">
  <PatientSidebar {selectedPatientId} onSelect={handleSelectPatient} />

  <div class="flex-1 flex flex-col min-w-0">
    <!-- PatientHeader expects strict Patient object. Ensure we pass compatible data -->
    <PatientHeader
      {patient}
      {activeTab}
      onTabChange={(tab) => {
        activeTab = tab;
        activeDocument = null;
      }}
    />

    <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
      {#if activeTab === "timeline"}
        <!-- Timeline content (kept mostly same but cleaned up) -->
        <div class="max-w-3xl mx-auto space-y-8">
          {#if activeSession}
            <div
              class="bg-white rounded-xl shadow-lg border-l-4 border-l-green-500 overflow-hidden"
            >
              <div class="p-6">
                <h3 class="font-bold text-green-900">
                  Active Session: {activeSession.machine}
                </h3>
                <!-- ... details ... -->
              </div>
            </div>
          {/if}
        </div>
      {:else if activeTab === "forms"}
        {#if !activeDocument}
          <div class="max-w-4xl mx-auto">
            <h3 class="text-center font-bold text-gray-700 text-xl mb-6">
              Select Document
            </h3>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {#each AVAILABLE_DOCUMENTS as doc}
                <button
                  class="bg-white p-6 rounded-xl shadow-sm border hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-3"
                  onclick={() => (activeDocument = doc.id)}
                >
                  <div class="text-4xl">{doc.icon}</div>
                  <div class="font-bold">{doc.title}</div>
                </button>
              {/each}
            </div>
          </div>
        {:else if activeDocument === "patientCard"}
          <div class="max-w-4xl mx-auto space-y-6">
            <button
              class="text-gray-400 hover:text-black font-bold"
              onclick={() => (activeDocument = null)}>&larr; Back</button
            >
            <PatientCard
              initialData={assessmentQuery.data?.data || {}}
              onSave={async (formData) => {
                await convex.mutation(api.assessments.save, {
                  patientId: selectedPatientId as any,
                  month: "October",
                  year: 2023,
                  type: "patientCard",
                  data: formData,
                });
                // Optional: Notify success
              }}
            />
          </div>
        {/if}
      {/if}
    </main>
  </div>
</div>
