<script lang="ts">
  import { page } from "$app/state";
  import { useQuery, useConvexClient } from "convex-svelte";
  import { api } from "../../convex/_generated/api";
  import { goto } from "$app/navigation";

  // Dashboard Components
  import PatientSidebar from "$lib/components/dashboard/PatientSidebar.svelte";
  import PatientHeader from "$lib/components/dashboard/PatientHeader.svelte";
  import Chair from "$lib/components/dashboard/Chair.svelte";
  import ActiveAlerts from "$lib/components/dashboard/ActiveAlerts.svelte";
  import ClinicStats from "$lib/components/dashboard/ClinicStats.svelte";
  import InfoSection from "$lib/components/dashboard/InfoSection.svelte";
  import PatientQueue from "$lib/components/dashboard/PatientQueue.svelte";
  import PatientTimeline from "$lib/components/dashboard/PatientTimeline.svelte";

  // Forms
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

  // Fetch Data for Sidebar
  const patientsQuery = useQuery(api.patients.get, {});

  // Dashboard State
  let existingPatients = $derived(patientsQuery.data || []);
  // Chairs: Array of 12
  let chairs = $state(Array(12).fill(null));

  // Queue: Fetched from backend, filtered by those not in chairs
  const queueQuery = useQuery(api.meetings.getQueue, {});
  let queue = $derived(
    (queueQuery.data || []).filter(
      (p) => !chairs.some((main) => main && main.id === p._id),
    ),
  );

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
  let activeChairForAction = $state<{ index: number; patient: any } | null>(
    null,
  );

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
  }

  function signOutPatient(chairIndex: number) {
    const p = chairs[chairIndex];
    if (p) {
      // Return to queue (implicitly happens because they are removed from chairs)
      chairs[chairIndex] = null;
    }
  }

  function handleChairDoubleClick(index: number, patient: any) {
    if (patient.priority === "cleaning") {
      // If chair is cleaning, double click marks it as done (Available)
      chairs[index] = null;
    } else {
      activeChairForAction = { index, patient };
    }
  }

  function dismissPatient() {
    if (activeChairForAction) {
      const { index, patient: p } = activeChairForAction;
      // Mark as Cleaning
      chairs[index] = {
        id: "cleaning",
        name: "Cleaning...",
        priority: "cleaning",
        chairNumber: String(index + 1).padStart(2, "0"),
        alert: null,
      };

      // Mark patient as not present (removes from queue query)
      convex.mutation(api.patients.setPresence, {
        patientId: p.id || p._id, // Handle both shapes if needed
        present: false,
      });

      activeChairForAction = null;
    }
  }

  function handleQueueDoubleClick(patientId: string) {
    const chairIndex = chairs.findIndex((c) => c === null);
    if (chairIndex !== -1) {
      const patientIndex = queue.findIndex((p) => p._id === patientId);
      if (patientIndex !== -1) {
        const p = queue[patientIndex];
        chairs[chairIndex] = {
          id: p._id,
          name:
            p.firstName && p.lastName
              ? `${p.firstName} ${p.lastName}`
              : "Unknown Patient",
          priority: p.priority || "stable",
          alert: p.alert,
          chairNumber: String(chairIndex + 1).padStart(2, "0"),
        };
        // queue.splice is NOT needed because queue is derived
      }
    } else {
      alert("No available chairs!");
    }
  }

  function resetToDashboard() {
    selectedPatientId = null;
    goto("/dashboard");
  }

  // Drag and Drop
  function handleDragStart(event: DragEvent, patientId: string) {
    if (!event.dataTransfer) return;
    event.dataTransfer.setData("text/plain", patientId);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.dataTransfer!.dropEffect = "move";
  }

  function handleDrop(event: DragEvent, chairIndex: number) {
    event.preventDefault();
    const patientId = event.dataTransfer!.getData("text/plain");
    const patientIndex = queue.findIndex((p) => p._id === patientId);

    if (patientIndex !== -1 && chairs[chairIndex] === null) {
      const p = queue[patientIndex];
      // Determine priority based on patient data (keeping existing)
      chairs[chairIndex] = {
        id: p._id,
        name:
          (p.firstName && p.lastName
            ? `${p.firstName} ${p.lastName}`
            : "Unknown Patient"),
        priority: p.priority || "stable",
        alert: p.alert,
        chairNumber: String(chairIndex + 1).padStart(2, "0"),
      };
      // queue splice not needed
    }
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
    {
      id: "debug",
      title: "Debug Refresh",
      icon: "🧪",
      desc: "Check form re-rendering",
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
    selectedPatientId={selectedPatientId || ""}
    onSelect={(id) => {
      handleSelectPatient(id);
    }}
    mobileOpen={isSidebarOpen}
    onClose={() => (isSidebarOpen = false)}
  />

  <div class="flex-1 flex flex-col min-w-0">
    {#if !selectedPatientId}
      <!-- DASHBOARD VIEW -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
        <div class="max-w-7xl mx-auto">
          <header
            class="mb-10 flex flex-col md:flex-row justify-between items-end gap-4"
          >
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
            <!-- Info Section Scaled -->
            <div class="origin-top-right transform scale-90 md:scale-100">
              <InfoSection {infectionCount} {totalPatients} />
            </div>
          </header>

          {#if activeAlerts.length > 0}
            <ActiveAlerts alerts={activeAlerts} />
          {/if}

          <div class="flex flex-col lg:flex-row gap-8 mt-8">
            <!-- Left: Chairs -->
            <div class="flex-1">
              <h3
                class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4"
              >
                Treatment Area
              </h3>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {#each chairs as chair, i}
                  <div
                    role="region"
                    ondragover={handleDragOver}
                    ondrop={(e) => handleDrop(e, i)}
                    class="h-full"
                  >
                    {#if chair}
                      <Chair
                        patientName={chair.name}
                        chairNumber={chair.chairNumber}
                        priority={chair.priority}
                        onclick={() => {
                          /* Navigate to patient or show details */
                        }}
                        onDoubleClick={() => handleChairDoubleClick(i, chair)}
                        onSignOut={() => signOutPatient(i)}
                      />
                    {:else}
                      <div
                        class="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-xl h-full min-h-[140px] opacity-70 hover:opacity-100 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-default"
                      >
                        <div
                          class="text-[10px] uppercase font-bold text-gray-400 mb-1"
                        >
                          Chair {String(i + 1).padStart(2, "0")}
                        </div>
                        <div class="text-sm font-bold text-gray-400">
                          Available
                        </div>
                        <div class="text-[10px] text-gray-300 mt-2">
                          Drop Patient Here
                        </div>
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>

            <!-- Right: Queue -->
            <div class="w-full lg:w-72 shrink-0">
              <PatientQueue
                patients={queue}
                onDragStart={handleDragStart}
                onPatientDoubleClick={handleQueueDoubleClick}
              />
            </div>
          </div>
        </div>
      </main>
    {:else}
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
            {#if selectedPatientId}
              <PatientTimeline patientId={selectedPatientId} />
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
                  initialData={(patient as any)?.[activeDocConfig.dataKey!] ||
                    activeDocConfig.defaultData ||
                    {}}
                  patientId={selectedPatientId || ""}
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
                <h2 class="text-2xl font-black text-blue-900">
                  Debug Renderer
                </h2>
              </div>
            </div>
          {/if}
        {/if}
      </main>
    {/if}
  </div>

  <!-- ACTION MODAL -->
  {#if activeChairForAction}
    <div
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-6"
      >
        <div class="text-center">
          <h3 class="text-xl font-black text-gray-900">
            {activeChairForAction.patient.name}
          </h3>
          <p class="text-gray-500 text-sm">Select an action</p>
        </div>

        <div class="grid grid-cols-1 gap-3">
          <button
            class="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            onclick={() => {
              handleSelectPatient(activeChairForAction!.patient.id);
              activeChairForAction = null;
            }}
          >
            <span>Go to Dashboard</span>
            <span>→</span>
          </button>

          <button
            class="w-full py-4 px-6 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl transition-colors"
            onclick={dismissPatient}
          >
            Finish Treatment & Clean
          </button>
        </div>

        <button
          class="w-full py-2 text-sm text-gray-400 font-bold hover:text-gray-600"
          onclick={() => (activeChairForAction = null)}
        >
          Cancel
        </button>
      </div>
    </div>
  {/if}
</div>
