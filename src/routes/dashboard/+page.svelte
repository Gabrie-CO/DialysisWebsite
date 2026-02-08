<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import PatientSidebar from "$lib/components/dashboard/PatientSidebar.svelte";
  import PatientHeader from "$lib/components/dashboard/PatientHeader.svelte";
  import type { PageData } from "./$types";

  let { data } = $props<{ data: PageData }>();

  // Initialize Superforms
  const {
    form: sessionForm,
    errors: sessionErrors,
    constraints: sessionConstraints,
    enhance: sessionEnhance,
  } = superForm(data.hemodialysisForm, {
    resetForm: false,
  });
  interface Patient {
    id: number | string;
    name: string;
    [key: string]: any;
  }
  const {
    form: noteForm,
    errors: noteErrors,
    constraints: noteConstraints,
    enhance: noteEnhance,
  } = superForm(data.quickNoteForm, {
    id: "quick-note-form", // clear ID to distinguish forms
    resetForm: true,
  });

  // Local State
  let selectedPatientId = $state(data.patients[0].id);
  let activeTab = $state("timeline");
  let activeDocument = $state<string | null>(null);

  // Computed
  let patient = $derived(
    data.patients.find((p: Patient) => p.id === selectedPatientId) ||
      data.patients[0],
  );

  let sessions = $derived(
    data.sessions[selectedPatientId as keyof typeof data.sessions] || [],
  );
  let activeSession = $derived(
    data.activeSession[selectedPatientId as keyof typeof data.activeSession] ||
      null,
  );

  function handleSelectPatient(id: string) {
    selectedPatientId = id;
    activeTab = "timeline";
    activeDocument = null;
    // Reset forms or fetch new data here if needed
  }

  const AVAILABLE_DOCUMENTS = [
    {
      id: "hemodialysis",
      title: "Hoja de Hemodiálisis",
      icon: "🩸",
      desc: "Routine treatment record",
    },
    {
      id: "cidh",
      title: "Infection Control (CIDH)",
      icon: "🦠",
      desc: "Report infection signs/events",
    },
    // ... (other docs)
  ];
</script>

<div class="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">
  <PatientSidebar {selectedPatientId} onSelect={handleSelectPatient} />

  <div class="flex-1 flex flex-col min-w-0">
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
        <div class="max-w-3xl mx-auto space-y-8">
          <!-- QUICK NOTE FORM (Example of 2nd form) -->
          <div
            class="bg-white p-4 rounded-xl shadow-sm border border-orange-100"
          >
            <h3 class="font-bold text-gray-700 mb-2">Add Quick Note</h3>
            <form
              method="POST"
              action="?/addNote"
              use:noteEnhance
              class="flex gap-2"
            >
              <input
                type="text"
                name="content"
                bind:value={$noteForm.content}
                placeholder="Enter a quick note..."
                class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                {...$noteConstraints.content}
              />
              <select
                name="priority"
                bind:value={$noteForm.priority}
                class="border border-gray-300 rounded px-2 text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <button
                class="bg-orange-500 text-white px-4 py-2 rounded text-sm font-bold"
                >Add</button
              >
            </form>
            {#if $noteErrors.content}<span class="text-red-500 text-xs"
                >{$noteErrors.content}</span
              >{/if}
          </div>

          <!-- ACTIVE SESSION CARD -->
          {#if activeSession}
            <!-- ... (same active session card code from demo) ... -->
            <div
              class="bg-white rounded-xl shadow-lg border-l-4 border-l-green-500 overflow-hidden"
            >
              <div class="p-6">
                <h3 class="font-bold text-green-900">
                  Active Session: {activeSession.machine}
                </h3>
                <div class="grid grid-cols-3 gap-4 mt-4">
                  <div class="text-center">
                    <span class="block text-xs uppercase text-gray-500">BP</span
                    ><span class="text-xl font-bold"
                      >{activeSession.currentBP}</span
                    >
                  </div>
                  <div class="text-center">
                    <span class="block text-xs uppercase text-gray-500"
                      >Time Left</span
                    ><span class="text-xl font-bold text-blue-600"
                      >{activeSession.remaining}</span
                    >
                  </div>
                  <div class="text-center">
                    <span class="block text-xs uppercase text-gray-500"
                      >UFR</span
                    ><span class="text-xl font-bold"
                      >{activeSession.currentUFR}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          {/if}

          <!-- TIMELINE -->
          <div>
            <h3 class="font-bold text-gray-700 mb-4 ml-3">Activity History</h3>
            <div class="space-y-4 ml-6 border-l-2 border-gray-300 pl-6 pb-4">
              {#each sessions as s}
                <div class="relative">
                  <div
                    class="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-gray-400 border-2 border-white"
                  ></div>
                  <div
                    class="bg-white p-3 rounded shadow-sm border border-gray-200"
                  >
                    <div class="flex justify-between">
                      <span class="font-bold text-sm">Hemodialysis Session</span
                      >
                      <span class="text-xs text-gray-500">{s.date}</span>
                    </div>
                    <span
                      class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                      >{s.status}</span
                    >
                  </div>
                </div>
              {/each}
            </div>
          </div>
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
                  on:click={() => (activeDocument = doc.id)}
                >
                  <div class="text-4xl">{doc.icon}</div>
                  <div class="font-bold">{doc.title}</div>
                </button>
              {/each}
            </div>
          </div>
        {:else if activeDocument === "hemodialysis"}
          <div class="max-w-4xl mx-auto space-y-6">
            <button
              class="text-gray-400 hover:text-black font-bold"
              on:click={() => (activeDocument = null)}>&larr; Back</button
            >
            <h2 class="font-bold text-xl">New Hemodialysis Sheet</h2>

            <!-- SUPERFORM: HEMODIALYSIS -->
            <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
              <form
                method="POST"
                action="?/createSession"
                use:sessionEnhance
                class="p-6 space-y-6"
              >
                <h4 class="font-bold text-gray-700 mb-3 text-sm border-b pb-1">
                  Pre-Assessment
                </h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label class="block">
                    <span class="text-xs font-bold text-gray-500"
                      >Weight (kg)</span
                    >
                    <input
                      type="number"
                      step="0.1"
                      name="preWeight"
                      bind:value={$sessionForm.preWeight}
                      {...$sessionConstraints.preWeight}
                      class="w-full border-b font-bold text-lg focus:outline-none focus:border-blue-500"
                      placeholder="0.0"
                    />
                    {#if $sessionErrors.preWeight}<span
                        class="text-red-500 text-xs"
                        >{$sessionErrors.preWeight}</span
                      >{/if}
                  </label>

                  <label class="block">
                    <span class="text-xs font-bold text-gray-500">BP</span>
                    <input
                      type="text"
                      name="preBP"
                      bind:value={$sessionForm.preBP}
                      {...$sessionConstraints.preBP}
                      class="w-full border-b font-bold text-lg focus:outline-none focus:border-blue-500"
                      placeholder="120/80"
                    />
                    {#if $sessionErrors.preBP}<span class="text-red-500 text-xs"
                        >{$sessionErrors.preBP}</span
                      >{/if}
                  </label>

                  <label class="block">
                    <span class="text-xs font-bold text-gray-500"
                      >Temp (°C)</span
                    >
                    <input
                      type="number"
                      step="0.1"
                      name="preTemp"
                      bind:value={$sessionForm.preTemp}
                      {...$sessionConstraints.preTemp}
                      class="w-full border-b font-bold text-lg focus:outline-none focus:border-blue-500"
                      placeholder="36.5"
                    />
                    {#if $sessionErrors.preTemp}<span
                        class="text-red-500 text-xs"
                        >{$sessionErrors.preTemp}</span
                      >{/if}
                  </label>

                  <label class="block">
                    <span class="text-xs font-bold text-gray-500"
                      >Access Status</span
                    >
                    <select
                      name="accessStatus"
                      bind:value={$sessionForm.accessStatus}
                      {...$sessionConstraints.accessStatus}
                      class="w-full border-b font-bold text-base bg-transparent focus:outline-none focus:border-blue-500"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Bruising">Bruising</option>
                      <option value="Infection">Infection</option>
                      <option value="Clotted">Clotted</option>
                    </select>
                    {#if $sessionErrors.accessStatus}<span
                        class="text-red-500 text-xs"
                        >{$sessionErrors.accessStatus}</span
                      >{/if}
                  </label>
                </div>

                <div class="flex justify-end pt-4">
                  <button
                    class="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 font-bold"
                  >
                    Save & Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        {/if}
      {/if}
    </main>
  </div>
</div>
