<script lang="ts">
  import { calculateAge } from "$lib/utils";

  interface Patient {
    _id: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    dryWeight?: number;
    code?: string;
    alerts?: string[];
    currentAccess?: {
      type: string;
      location: string;
    };
    // Allow for other properties not explicitly defined
    [key: string]: any;
  }

  let { patient, activeTab, onTabChange, onMenuClick } = $props<{
    patient: Patient;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onMenuClick?: () => void;
  }>();
</script>

<header class="bg-white border-b border-gray-200 p-4 shadow-sm z-10">
  <div class="flex justify-between items-start">
    <div class="flex gap-4 items-center">
      <!-- Hamburger Menu (Mobile Only) -->
      <a
        href="/"
        class="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-2"
        aria-label="Back to Home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </a>

      <button
        class="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        onclick={onMenuClick}
        aria-label="Open sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <div
        class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg"
      >
        {patient?.firstName?.[0] ?? "?"}{patient?.lastName?.[0] ?? "?"}
      </div>
      <div>
        <h1 class="text-xl font-bold text-gray-900 leading-none">
          {patient?.firstName ?? "Unknown"}
          {patient?.lastName ?? "Patient"}
        </h1>
        <div class="flex gap-3 text-sm text-gray-500 mt-1">
          {#if patient?.code}
            <span class="font-mono bg-gray-100 px-1 rounded"
              >{patient.code}</span
            >
          {/if}

          {#if patient?.gender}<span>{patient.gender}</span>{/if}
          <span class="font-bold text-gray-700"
            >Dry Wt: {patient?.dryWeight ??
              patient?.demographics?.dryWeight ??
              "--"}kg</span
          >
        </div>
      </div>
    </div>

    <div class="flex flex-col items-end gap-2">
      <div class="flex gap-2">
        {#if patient?.alerts}
          {#each patient.alerts as alert}
            <span
              class="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold border border-red-200"
              >{alert}</span
            >
          {/each}
        {/if}
        {#if patient?.currentAccess}
          <span
            class="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold border border-blue-100"
          >
            {patient.currentAccess.type} - {patient.currentAccess.location}
          </span>
        {/if}
      </div>
      <div class="text-xs text-gray-400">Last Dialysis: --</div>
    </div>
  </div>

  <!-- NAVIGATION TABS -->
  <div class="flex gap-6 mt-6 border-b border-gray-200">
    <button
      class="pb-2 text-sm font-medium border-b-2 transition-colors capitalize
            {activeTab === 'timeline'
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'}"
      onclick={() => onTabChange("timeline")}
    >
      Patient Timeline (History)
    </button>
    <button
      class="pb-2 text-sm font-medium border-b-2 transition-colors capitalize
            {activeTab === 'forms'
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'}"
      onclick={() => onTabChange("forms")}
    >
      + New Entry
    </button>
  </div>
</header>
