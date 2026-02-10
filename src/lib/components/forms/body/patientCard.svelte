<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { patientCardSchema } from "$lib/schemas/patientCard";
  import type { z } from "zod";

  let { initialData, onSave } = $props<{
    initialData: z.infer<typeof patientCardSchema>;
    onSave: (data: z.infer<typeof patientCardSchema>) => void;
  }>();

  // Initialize Superform in SPA mode
  const { form, errors, constraints, enhance } = superForm(
    defaults(initialData, zod(patientCardSchema as any)),
    {
      SPA: true,
      validators: zod(patientCardSchema as any),
      onUpdate: async ({ form }) => {
        if (form.valid) {
          onSave(form.data);
        }
      },
    },
  );

  // Sync initialData when it changes (e.g. switching patients)
  $effect(() => {
    form.set(initialData);
  });
</script>

<div
  class="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-xl border border-gray-100 font-sans text-gray-800"
>
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-gray-800">Patient Card</h2>
    {#if $form.updatedAt}
      <p class="text-xs text-gray-500">
        Last Updated: {new Date($form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </div>

  <form method="POST" use:enhance class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6"></div>

    <!-- Clinical Indicators -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-100"
    >
      <div
        class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
      >
        <input
          id="elderly80_90"
          type="checkbox"
          bind:checked={$form.elderly80_90}
          class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label for="elderly80_90" class="flex flex-col cursor-pointer">
          <span class="text-sm font-medium text-gray-900">Elderly (80-90)</span>
          <span class="text-xs text-gray-500">(WHO Standard)</span>
        </label>
      </div>

      <div
        class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
      >
        <input
          id="malnutrition"
          type="checkbox"
          bind:checked={$form.malnutrition}
          class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          for="malnutrition"
          class="text-sm font-medium text-gray-900 cursor-pointer"
          >Malnutrition</label
        >
      </div>

      <div
        class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
      >
        <input
          id="preservedDiuresis"
          type="checkbox"
          bind:checked={$form.preservedDiuresis}
          class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          for="preservedDiuresis"
          class="text-sm font-medium text-gray-900 cursor-pointer"
          >Preserved Diuresis</label
        >
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
      <div class="space-y-2">
        <label for="time" class="block text-sm font-medium text-gray-700"
          >Time (min)</label
        >
        <input
          id="time"
          type="text"
          bind:value={$form.time}
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
        />
      </div>

      <div class="space-y-2">
        <label for="qd" class="block text-sm font-medium text-gray-700"
          >Qd</label
        >
        <input
          id="qd"
          type="text"
          bind:value={$form.qd}
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
        />
      </div>

      <div class="space-y-2">
        <label for="qb" class="block text-sm font-medium text-gray-700"
          >Qb</label
        >
        <input
          id="qb"
          type="text"
          bind:value={$form.qb}
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <div class="space-y-2">
        <label for="ktvt" class="block text-sm font-medium text-gray-700"
          >KT/v T</label
        >
        <input
          id="ktvt"
          type="text"
          bind:value={$form.ktvt}
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
        />
      </div>

      <div class="space-y-2">
        <label for="filter" class="block text-sm font-medium text-gray-700"
          >Filter</label
        >
        <input
          id="filter"
          type="text"
          bind:value={$form.filter}
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
        />
      </div>
    </div>

    <div class="space-y-2 pt-4">
      <label for="observations" class="block text-sm font-medium text-gray-700"
        >Observations</label
      >
      <textarea
        id="observations"
        bind:value={$form.observations}
        rows="4"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border resize-none"
      ></textarea>
    </div>

    <div class="pt-6 mt-6 border-t border-gray-100 flex justify-end">
      <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Save Changes
      </button>
    </div>
  </form>
</div>
