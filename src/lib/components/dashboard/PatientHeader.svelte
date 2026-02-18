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

<header class="header-container">
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

      <div class="header-avatar">
        {patient?.firstName?.[0] ?? "?"}{patient?.lastName?.[0] ?? "?"}
      </div>
      <div>
        <h1 class="header-name">
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
            <span class="badge-red">{alert}</span>
          {/each}
        {/if}
        {#if patient?.currentAccess}
          <span class="badge-blue">
            {patient.currentAccess.type} - {patient.currentAccess.location}
          </span>
        {/if}
      </div>
      <div class="text-xs text-gray-400">Last Dialysis: --</div>
    </div>
  </div>

  <!-- NAVIGATION TABS -->
  <div class="header-tabs">
    <button
      class="header-tab-btn {activeTab === 'timeline'
        ? 'header-tab-active'
        : 'header-tab-inactive'}"
      onclick={() => onTabChange("timeline")}
    >
      Patient Timeline (History)
    </button>
    <button
      class="header-tab-btn {activeTab === 'forms'
        ? 'header-tab-active'
        : 'header-tab-inactive'}"
      onclick={() => onTabChange("forms")}
    >
      + New Entry
    </button>
  </div>
</header>
