<script lang="ts">
  import { page } from "$app/state";
  import { useQuery, useConvexClient } from "convex-svelte";
  import { api } from "../../../convex/_generated/api";
  import { goto } from "$app/navigation";

  // Dashboard Components
  import PatientSidebar from "$lib/components/dashboard/PatientSidebar.svelte";
  import PatientHeader from "$lib/components/dashboard/PatientHeader.svelte";
  import Chair from "$lib/components/dashboard/Chair.svelte";
  import ActiveAlerts from "$lib/components/dashboard/ActiveAlerts.svelte";
  import ClinicStats from "$lib/components/dashboard/ClinicStats.svelte";
  import InfoSection from "$lib/components/dashboard/InfoSection.svelte";
  import PatientQueue from "$lib/components/dashboard/PatientQueue.svelte";

  // Forms
  // Forms
  import PatientCard from "$lib/components/forms/body/patientCard.svelte";
  import Fichas from "$lib/components/forms/body/fichas.svelte";
  import CIDH from "$lib/components/forms/body/CIDH.svelte";
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

  // Fetch Data for Sidebar
  const patientsQuery = useQuery(api.patients.get, {});

  // Dashboard State
  let existingPatients = $derived(patientsQuery.data || []);
  let chairs = $state(Array(12).fill(null));
  let queue = $state<any[]>([]);
  let initialized = $state(false);

  // Initialize from Real Data
  $effect(() => {
    if (!initialized && existingPatients.length > 0) {
      const assigned = existingPatients.slice(0, 3);
      const unassigned = existingPatients.slice(3);

      chairs = chairs.map((c, i) => {
        if (i < 3 && assigned[i]) {
          return {
            ...assigned[i],
            id: assigned[i]._id,
            name: `${assigned[i].firstName} ${assigned[i].lastName}`,
            chairNumber: String(i + 1).padStart(2, "0"),
          };
        }
        return c;
      });

      queue = unassigned.map((p) => ({
        ...p,
        id: p._id,
        name: `${p.firstName} ${p.lastName}`,
      }));

      initialized = true;
    }
  });

  // Derived Dashboard Stats
  let activeAlerts = $derived(
    chairs
      .filter((p) => p && p.alert)
      .map((p) => ({
        id: p!.id,
        patientName: p!.name,
        message: p!.alert as string,
        priority: p!.priority,
      })),
  );
  let totalPatients = $derived(
    chairs.filter((p) => p !== null && p.priority !== "cleaning").length,
  );
  const totalChairs = 12;
  // Infection count derived from 'critical' patients for now, or 0 if none.
  let infectionCount = $derived(
    chairs.filter((p) => p !== null && p.priority === "critical").length,
  );

  // Form Defaults
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

  // Routing / View State
  let selectedPatientId = $state(page.url.searchParams.get("id") || null);
  let activeTab = $state("timeline");
  let activeDocument = $state<string | null>(null);
  let isSidebarOpen = $state(false);

  // Sync with URL
  $effect(() => {
    const urlId = page.url.searchParams.get("id");
    if (urlId !== selectedPatientId) {
      selectedPatientId = urlId;
    }
  });

  // Derived for Patient View
  // existingPatients is already defined above
  let patient = $derived(
    existingPatients.find((p: any) => p._id === selectedPatientId) ||
      existingPatients[0],
  );

  // Mock Sessions logic
  let sessions = $state([]);
  let activeSession = $derived(
    data.activeSession &&
      selectedPatientId &&
      data.activeSession[selectedPatientId]
      ? data.activeSession[selectedPatientId]
      : null,
  );

  // Handlers
  function handleSelectPatient(id: string) {
    goto(`/dashboard?id=${id}`);
    activeTab = "timeline";
    activeDocument = null;
    isSidebarOpen = false;
  }

  function resetToDashboard() {
    goto("/");
    selectedPatientId = null;
  }

  // ... (drag and drop handlers can be removed or kept if needed for other things, but likely unused in this view)
  // For now I will keep them to minimize diff size unless requested to clean up, but the main change is the view rendering.

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
    {
      id: "debug",
      title: "Debug Refresh",
      icon: "🧪",
      desc: "Check form re-rendering",
    },
  ];

  let activeDocConfig = $derived(
    AVAILABLE_DOCUMENTS.find((d) => d.id === activeDocument) as any,
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
    selectedPatientId={selectedPatientId || ""}
    onSelect={(id) => {
      handleSelectPatient(id);
    }}
    mobileOpen={isSidebarOpen}
    onClose={() => (isSidebarOpen = false)}
  />

  <div class="flex-1 flex flex-col min-w-0">
    <!-- INDIVIDUAL PATIENT VIEW -->
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
      <button
        onclick={resetToDashboard}
        class="mb-6 text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
      >
        ← Back to Clinic Overview
      </button>

      {#if activeTab === "timeline"}
        <!-- Timeline content -->
        <div class="max-w-3xl mx-auto space-y-8">
          {#if activeSession}
            <div
              class="bg-white rounded-xl shadow-lg border-l-4 border-l-green-500 overflow-hidden"
            >
              <div class="p-6">
                <h3 class="font-bold text-green-900">
                  Active Session: {activeSession.machine}
                </h3>
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
        {:else if activeDocConfig?.component}
          {@const Component = activeDocConfig.component}
          <div class="max-w-4xl mx-auto space-y-6">
            <button
              type="button"
              class="text-gray-400 hover:text-black font-bold relative z-50 cursor-pointer mb-4 inline-flex items-center gap-1"
              onclick={() => (activeDocument = null)}>&larr; Back</button
            >
            <ErrorBoundary>
              <Component
                initialData={(patient as any)?.[activeDocConfig.dataKey!] ||
                  activeDocConfig.defaultData ||
                  {}}
                onSave={async (formData: any) => {
                  if (activeDocConfig.mutation) {
                    await convex.mutation(activeDocConfig.mutation, {
                      patientId: selectedPatientId as any,
                      [activeDocConfig.argKey!]: formData,
                    } as any);
                  }
                }}
              />
            </ErrorBoundary>
          </div>
        {:else if activeDocument === "debug"}
          <!-- Debug comp -->
          <div class="max-w-4xl mx-auto space-y-6">
            <div
              class="bg-white p-12 rounded-2xl border-4 border-dashed border-blue-100 flex flex-col items-center gap-4"
            >
              <h2 class="text-2xl font-black text-blue-900">Debug Renderer</h2>
            </div>
          </div>
        {/if}
      {/if}
    </main>
  </div>
</div>
