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
    },
    {
      id: "fichas",
      title: "Fichas (Checklists)",
      icon: "✅",
      desc: "Annual checklists validation",
    },
    {
      id: "cidh",
      title: "Infection Control (CIDH)",
      icon: "🦠",
      desc: "Report infection signs/events",
    },
    {
      id: "clinicalHistory",
      title: "Clinical History",
      icon: "🏥",
      desc: "Complete clinical history",
    },
    {
      id: "clinicalHistory2",
      title: "Clinical History 2",
      icon: "🏥",
      desc: "Alternative clinical history",
    },
    {
      id: "fistula",
      title: "Fistula Check",
      icon: "💉",
      desc: "Fistula monitoring",
    },
    {
      id: "hemodialysisSheet",
      title: "Hemodialysis Sheet",
      icon: "🩸",
      desc: "Daily hemodialysis record",
    },
    {
      id: "infections",
      title: "Infections",
      icon: "🤒",
      desc: "Infection tracking",
    },
    {
      id: "medicationSheet",
      title: "Medication Sheet",
      icon: "💊",
      desc: "Medication administration",
    },
    {
      id: "examControls",
      title: "Exam Controls",
      icon: "🔬",
      desc: "Laboratory exam controls",
    },
    {
      id: "monthlyProgress",
      title: "Monthly Progress",
      icon: "📅",
      desc: "Monthly patient progress",
    },
    {
      id: "debug",
      title: "Debug Refresh",
      icon: "🧪",
      desc: "Check form re-rendering",
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
        {:else}
          <div class="max-w-4xl mx-auto space-y-6">
            <button
              class="text-gray-400 hover:text-black font-bold"
              onclick={() => (activeDocument = null)}>&larr; Back</button
            >

            {#if activeDocument === "patientCard"}
              <PatientCard
                initialData={patient?.patientCard || DEFAULT_PATIENT_CARD}
                onSave={async (formData) => {
                  await convex.mutation(api.patients.updatePatientCard, {
                    patientId: selectedPatientId as any,
                    patientCardData: formData,
                  });
                }}
              />
            {:else if activeDocument === "fichas"}
              <Fichas
                initialData={patient?.fichas || {}}
                onSave={async (data) => {
                  await convex.mutation(api.patients.updateFichas, {
                    patientId: selectedPatientId as any,
                    fichasData: data,
                  });
                }}
              />
            {:else if activeDocument === "cidh"}
              <CIDH
                initialData={patient?.cidh || {}}
                onSave={async (data) => {
                  await convex.mutation(api.patients.updateCIDH, {
                    patientId: selectedPatientId as any,
                    cidhData: data,
                  });
                }}
              />
            {:else if activeDocument === "clinicalHistory"}
              <ClinicHistory
                initialData={patient?.clinicHistoryOld || {}}
                onSave={async (data) => {
                  await convex.mutation(api.patients.updateClinicHistoryOld, {
                    patientId: selectedPatientId as any,
                    data: data,
                  });
                }}
              />
            {:else if activeDocument === "clinicalHistory2"}
              <ClinicalHistory2
                initialData={patient?.clinicalHistory || {}}
                onSave={async (data) => {
                  await convex.mutation(api.patients.updateClinicalHistory, {
                    patientId: selectedPatientId as any,
                    clinicalHistoryData: data,
                  });
                }}
              />
            {:else if activeDocument === "fistula"}
              <Fistula
                initialData={patient?.fistula || {}}
                onSave={async (data) => {
                  await convex.mutation(api.patients.updateFistula, {
                    patientId: selectedPatientId as any,
                    data: data,
                  });
                }}
              />
            {:else if activeDocument === "hemodialysisSheet"}
              <HemodialysisSheet
                initialData={patient?.hemodialysis || {}}
                onSave={async (data) => {
                  await convex.mutation(api.patients.updateHemodialysis, {
                    patientId: selectedPatientId as any,
                    data: data,
                  });
                }}
              />
            {:else if activeDocument === "infections"}
              <Infections
                initialData={patient?.infections || {}}
                onSave={async (data) => {
                  await convex.mutation(api.patients.updateInfections, {
                    patientId: selectedPatientId as any,
                    infectionsData: data,
                  });
                }}
              />
            {:else if activeDocument === "medicationSheet"}
              <MedicationApplicationSheet
                initialData={patient?.medicationSheet || {}}
                onSave={async (data) => {
                  await convex.mutation(api.patients.updateMedicationSheet, {
                    patientId: selectedPatientId as any,
                    data: data,
                  });
                }}
              />
            {:else if activeDocument === "examControls"}
              <ExamControls
                initialData={patient?.examControls || {}}
                onSave={async (data) => {
                  await convex.mutation(api.patients.updateExamControls, {
                    patientId: selectedPatientId as any,
                    data: data,
                  });
                }}
              />
            {:else if activeDocument === "monthlyProgress"}
              <MonthlyProgress
                initialData={patient?.monthlyProgress || {}}
                onSave={async (data) => {
                  await convex.mutation(api.patients.updateMonthlyProgress, {
                    patientId: selectedPatientId as any,
                    data: data,
                  });
                }}
              />
            {:else if activeDocument === "debug"}
              <div
                class="bg-white p-12 rounded-2xl border-4 border-dashed border-blue-100 flex flex-col items-center gap-4"
              >
                <div class="text-6xl animate-bounce">🧪</div>
                <h2 class="text-2xl font-black text-blue-900">
                  Debug Renderer
                </h2>
                <p class="text-gray-500 font-medium">
                  This component was rendered at:
                </p>
                <div
                  class="bg-blue-50 px-6 py-3 rounded-xl font-mono text-blue-700 font-bold text-xl border border-blue-100"
                >
                  {new Date().toLocaleTimeString()}
                </div>
                <p class="text-xs text-gray-400 mt-4">
                  If this time updates when you click the box, re-rendering is
                  working.
                </p>
              </div>
            {/if}
          </div>
        {/if}
      {/if}
    </main>
  </div>
</div>
