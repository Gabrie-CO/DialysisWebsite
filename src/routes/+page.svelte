<script lang="ts">
  import { page } from "$app/state";
  import { useQuery, useConvexClient } from "convex-svelte";
  import { api } from "../../convex/_generated/api";
  import { goto } from "$app/navigation";

  // Dashboard Components
  import PatientSidebar from "$lib/components/dashboard/PatientSidebar.svelte";
  import Chair from "$lib/components/dashboard/Chair.svelte";
  import ActiveAlerts from "$lib/components/dashboard/ActiveAlerts.svelte";
  import ClinicStats from "$lib/components/dashboard/ClinicStats.svelte";
  import InfoSection from "$lib/components/dashboard/InfoSection.svelte";
  import PatientQueue from "$lib/components/dashboard/PatientQueue.svelte";

  import type { PageData } from "./$types";

  let { data } = $props<{ data: PageData }>();

  const convex = useConvexClient();

  // Fetch Data for Sidebar
  const patientsQuery = useQuery(api.patients.get, {});

  // Dashboard State
  let existingPatients = $derived(patientsQuery.data || []);
  // Chairs: Array of 12
  const dailyChairsQuery = useQuery(api.meetings.getDailyChairs, {});

  // Dashboard State
  let cleaningChairs = $state(new Set<number>());

  let chairs = $derived.by(() => {
    const list = Array(12).fill(null);
    if (dailyChairsQuery.data) {
      dailyChairsQuery.data.forEach((c: any) => {
        const index = Number(c.chairId);
        if (index >= 0 && index < 12) {
          list[index] = c.patient;
        }
      });
    }

    // Apply cleaning overlay
    for (let i = 0; i < 12; i++) {
      if (cleaningChairs.has(i)) {
        list[i] = {
          id: "cleaning",
          name: "Cleaning Required",
          priority: "cleaning",
          chairNumber: String(i + 1).padStart(2, "0"),
          alert: "Needs disinfection",
        };
      }
    }

    return list;
  });

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
      .filter((p) => p && p.alert && p.priority !== "cleaning")
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

  // Routing / View State
  let selectedPatientId = $derived(page.url.searchParams.get("id") || null);
  let isSidebarOpen = $state(false);
  let activeChairForAction = $state<{ index: number; patient: any } | null>(
    null,
  );

  // Handlers
  function handleSelectPatient(id: string) {
    if (id === "cleaning") return;
    goto(`/dashboard?id=${id}`);
  }

  function signOutPatient(chairIndex: number) {
    if (cleaningChairs.has(chairIndex)) return;

    const p = chairs[chairIndex];
    if (p) {
      // Unassign from chair in DB
      convex.mutation(api.meetings.assignChair, {
        patientId: p.id || p._id,
        chairId: undefined,
      });
    }
  }

  function handleChairDoubleClick(index: number, patient: any) {
    if (cleaningChairs.has(index)) {
      // Mark as cleaned (Available)
      const next = new Set(cleaningChairs);
      next.delete(index);
      cleaningChairs = next;
      return;
    }

    if (patient.priority === "cleaning") {
      // Should be covered by above, but just in case
      const next = new Set(cleaningChairs);
      next.delete(index);
      cleaningChairs = next;
    } else {
      activeChairForAction = { index, patient };
    }
  }

  function dismissPatient() {
    if (activeChairForAction) {
      const { index, patient: p } = activeChairForAction;

      // 1. Mark patient as not present (removes from queue query)
      convex.mutation(api.patients.setPresence, {
        patientId: p.id || p._id,
        present: false,
      });

      // 2. Clear chair assignment
      convex.mutation(api.meetings.assignChair, {
        patientId: p.id || p._id,
        chairId: undefined,
      });

      // 3. Mark chair as needing cleaning
      const next = new Set(cleaningChairs);
      next.add(index);
      cleaningChairs = next;

      activeChairForAction = null;
    }
  }

  function handleQueueDoubleClick(patientId: string) {
    const chairIndex = chairs.findIndex((c) => c === null);
    if (chairIndex !== -1) {
      convex.mutation(api.meetings.assignChair, {
        patientId: patientId as any,
        chairId: String(chairIndex),
      });
    } else {
      alert("No available chairs!");
    }
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
      // Assign to chair in DB
      convex.mutation(api.meetings.assignChair, {
        patientId: p._id, // User ID
        chairId: String(chairIndex),
      });
    }
  }
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
