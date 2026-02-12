<script lang="ts">
  import { untrack } from "svelte";
  // UI Components
  import TextInput from "../ui/TextInput.svelte";
  import Checkbox from "../ui/Checkbox.svelte";

  interface PatientCardData {
    elderly80_90: boolean;
    malnutrition: boolean;
    preservedDiuresis: boolean;
    time: string;
    qd: string;
    qb: string;
    ktvt: string;
    filter: string;
    observations: string;
    signature: string;
    updatedAt?: string;
  }

  let { initialData, onSave } = $props<{
    initialData: Partial<PatientCardData>;
    onSave: (data: PatientCardData) => void;
  }>();

  // Initialize local state
  let form = $state<PatientCardData>({
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
    ...untrack(() => initialData),
  });

  // Sync state when initialData changes (e.g. switching patients)
  $effect(() => {
    form = {
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
      ...initialData,
    };
  });

  function handleSubmit(e: Event) {
    e.preventDefault();
    onSave(form);
  }
</script>

{#snippet clinicalIndicators()}
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-100"
  >
    <div class="flex flex-col">
      <Checkbox label="Elderly (80-90)" bind:checked={form.elderly80_90} />
      <span class="text-xs ml-8 text-gray-500">(WHO Standard)</span>
    </div>

    <Checkbox label="Malnutrition" bind:checked={form.malnutrition} />

    <Checkbox
      label="Preserved Diuresis"
      bind:checked={form.preservedDiuresis}
    />
  </div>
{/snippet}

{#snippet dialysisParameters()}
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
    <TextInput label="Time (min)" bind:value={form.time} />
    <TextInput label="Qd" bind:value={form.qd} />
    <TextInput label="Qb" bind:value={form.qb} />
    <TextInput label="KT/v T" bind:value={form.ktvt} />
    <TextInput label="Filter" bind:value={form.filter} />
  </div>
{/snippet}

<div
  class="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-xl border border-gray-100 font-sans text-gray-800"
>
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-gray-800">Patient Card</h2>
    {#if form.updatedAt}
      <p class="text-xs text-gray-500">
        Last Updated: {new Date(form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </div>

  <form onsubmit={handleSubmit} class="space-y-6">
    <!-- Clinical Indicators -->
    {@render clinicalIndicators()}
    {@render dialysisParameters()}

    <div class="pt-4">
      <TextInput
        label="Observations"
        bind:value={form.observations}
        placeholder="Enter observations..."
      />
    </div>

    <div class="flex justify-end pt-6">
      <button
        type="submit"
        class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Changes
      </button>
    </div>
  </form>
</div>
