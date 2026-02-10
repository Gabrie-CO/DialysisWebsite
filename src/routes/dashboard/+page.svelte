<script lang="ts">
  import { page } from "$app/state";
  import { useQuery, useConvexClient } from "convex-svelte";
  import { api } from "../../../convex/_generated/api";
  import PatientSidebar from "$lib/components/dashboard/PatientSidebar.svelte";
  import PatientHeader from "$lib/components/dashboard/PatientHeader.svelte";
  import PatientCard from "$lib/components/forms/body/patientCard.svelte";
  import Fichas from "$lib/components/forms/body/fichas.svelte";
  import CIDH from "$lib/components/forms/body/CIDH.svelte";
  import ClinicHistory from "$lib/components/forms/body/ClinicHistory.svelte";
  import ClinicalHistory2 from "$lib/components/forms/body/ClinicalHistory2.svelte";
  import Fistula from "$lib/components/forms/body/Fistula.svelte";
  import HemodialysisSheet from "$lib/components/forms/body/HemodialysisSheet.svelte";
  import Infections from "$lib/components/forms/body/Infections.svelte";
  import MedicationApplicationSheet from "$lib/components/forms/body/MedicationApplicationSheet.svelte";
  import ExamControls from "$lib/components/forms/body/examControls.svelte";
  import MonthlyProgress from "$lib/components/forms/body/monthlyProgress.svelte";
  import ErrorBoundary from "$lib/components/ui/ErrorBoundary.svelte";

  import type { PageData } from "./$types";

  let { data } = $props<{ data: PageData }>();

  const convex = useConvexClient();

  // Fetch Data
  const patientsQuery = useQuery(api.patients.get, {});

  const DEFAULT_PATIENT_CARD = {
    elderly80_90: false,
    malnutrition: false,
    preservedDiuresis: false,
    time: "",
    qd: "",
    qb: "",
    ktvt: "",
    filter: "",
    observations: "",
    signature: "",
  };

  // Local State
  let selectedPatientId = $state(page.url.searchParams.get("id") || "");
  let activeTab = $state("timeline");
  let activeDocument = $state<string | null>(null);
  let isSidebarOpen = $state(false);

  // Sync selectedPatientId with URL param if it changes
  $effect(() => {
    const urlId = page.url.searchParams.get("id");
    if (urlId && urlId !== selectedPatientId) {
      selectedPatientId = urlId;
    }
  });

  // Derived
  let patients = $derived(patientsQuery.data || []);
  let patient = $derived(
    patients.find((p: any) => p._id === selectedPatientId) || patients[0],
  );

  // Initialize selectedPatientId if not set and patients loaded
  $effect(() => {
    if (!selectedPatientId && patients.length > 0) {
      selectedPatientId = patients[0]._id;
    }
  });

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
      component: PatientCard,
      dataKey: "patientCard",
      defaultData: DEFAULT_PATIENT_CARD,
      mutation: api.patients.updatePatientCard,
      argKey: "patientCardData",
    },
    {
      id: "fichas",
      title: "Fichas (Checklists)",
      icon: "✅",
      desc: "Annual checklists validation",
      component: Fichas,
      dataKey: "fichas",
      mutation: api.patients.updateFichas,
      argKey: "fichasData",
    },
    {
      id: "cidh",
      title: "Infection Control (CIDH)",
      icon: "🦠",
      desc: "Report infection signs/events",
      component: CIDH,
      dataKey: "cidh",
      mutation: api.patients.updateCIDH,
      argKey: "cidhData",
    },
    {
      id: "clinicalHistory",
      title: "Clinical History",
      icon: "🏥",
      desc: "Complete clinical history",
      component: ClinicHistory,
      dataKey: "clinicHistoryOld",
      mutation: api.patients.updateClinicHistoryOld,
      argKey: "data",
    },
    {
      id: "clinicalHistory2",
      title: "Clinical History 2",
      icon: "🏥",
      desc: "Alternative clinical history",
      component: ClinicalHistory2,
      dataKey: "clinicalHistory",
      mutation: api.patients.updateClinicalHistory,
      argKey: "clinicalHistoryData",
    },
    {
      id: "fistula",
      title: "Fistula Check",
      icon: "💉",
      desc: "Fistula monitoring",
      component: Fistula,
      dataKey: "fistula",
      mutation: api.patients.updateFistula,
      argKey: "data",
    },
    {
      id: "hemodialysisSheet",
      title: "Hemodialysis Sheet",
      icon: "🩸",
      desc: "Daily hemodialysis record",
      component: HemodialysisSheet,
      dataKey: "hemodialysis",
      mutation: api.patients.updateHemodialysis,
      argKey: "data",
    },
    {
      id: "infections",
      title: "Infections",
      icon: "🤒",
      desc: "Infection tracking",
      component: Infections,
      dataKey: "infections",
      mutation: api.patients.updateInfections,
      argKey: "infectionsData",
    },
    {
      id: "medicationSheet",
      title: "Medication Sheet",
      icon: "💊",
      desc: "Medication administration",
      component: MedicationApplicationSheet,
      dataKey: "medicationSheet",
      mutation: api.patients.updateMedicationSheet,
      argKey: "data",
    },
    {
      id: "examControls",
      title: "Exam Controls",
      icon: "🔬",
      desc: "Laboratory exam controls",
      component: ExamControls,
      dataKey: "examControls",
      mutation: api.patients.updateExamControls,
      argKey: "data",
    },
    {
      id: "monthlyProgress",
      title: "Monthly Progress",
      icon: "📅",
      desc: "Monthly patient progress",
      component: MonthlyProgress,
      dataKey: "monthlyProgress",
      mutation: api.patients.updateMonthlyProgress,
      argKey: "data",
    },
  ];

  let activeDocConfig = $derived(
    AVAILABLE_DOCUMENTS.find((d) => d.id === activeDocument),
  );
</script>

<div class="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">
  <!-- Mobile Overlay -->
  {#if isSidebarOpen}
    <div
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      onclick={() => (isSidebarOpen = false)}
      role="button"
      tabindex="0"
      onkeydown={(e) => e.key === "Escape" && (isSidebarOpen = false)}
      aria-label="Close sidebar overlay"
    ></div>
  {/if}

  <PatientSidebar
    {selectedPatientId}
    onSelect={(id) => {
      handleSelectPatient(id);
      isSidebarOpen = false; // Close sidebar on selection on mobile
    }}
    mobileOpen={isSidebarOpen}
    onClose={() => (isSidebarOpen = false)}
  />

  <div class="flex-1 flex flex-col min-w-0">
    <!-- PatientHeader expects strict Patient object. Ensure we pass compatible data -->
    <PatientHeader
      {patient}
      {activeTab}
      onTabChange={(tab) => {
        activeTab = tab;
        activeDocument = null;
      }}
      onMenuClick={() => (isSidebarOpen = true)}
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
          <!-- Forms dashboard-->
          <div class="max-w-4xl mx-auto">
            <h3 class="text-center font-bold text-gray-700 text-xl mb-6">
              Select Document
            </h3>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {#each AVAILABLE_DOCUMENTS as doc}
                <button
                  class="bg-white p-6 rounded-xl shadow-sm border hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-3 text-center"
                  onclick={() => (activeDocument = doc.id)}
                >
                  <div class="text-4xl">{doc.icon}</div>
                  <div class="font-bold">{doc.title}</div>
                  <div class="text-xs text-gray-500">{doc.desc}</div>
                </button>
              {/each}
            </div>
          </div>
        {:else if activeDocConfig}
          <!-- individual form loop -->
          {@const Component = activeDocConfig.component}
          <div class="max-w-4xl mx-auto space-y-6">
            <button
              type="button"
              class="text-gray-400 hover:text-black font-bold relative z-50 cursor-pointer mb-4 inline-flex items-center gap-1"
              onclick={() => (activeDocument = null)}>&larr; Back</button
            >
            <ErrorBoundary>
              <Component
                initialData={(patient as any)?.[activeDocConfig.dataKey] ||
                  activeDocConfig.defaultData ||
                  {}}
                onSave={async (formData) => {
                  await convex.mutation(activeDocConfig.mutation, {
                    patientId: selectedPatientId as any,
                    [activeDocConfig.argKey]: formData,
                  } as any);
                }}
              />
            </ErrorBoundary>
          </div>
        {/if}
      {/if}
    </main>
  </div>
</div>
