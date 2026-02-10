<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { patientCardSchema } from "$lib/schemas/patientCard";
  import type { z } from "zod";
  import { untrack } from "svelte";

  let { initialData, onSave } = $props<{
    initialData: z.infer<typeof patientCardSchema>;
    onSave: (data: z.infer<typeof patientCardSchema>) => void;
  }>();

  // Initialize Superform in SPA mode
  const { form, enhance } = superForm(
    defaults(
      untrack(() => initialData),
      zod(patientCardSchema as any),
    ),
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

{#snippet clinicalIndicators()}
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-100"
  >
    <div class="md-checkbox">
      <input
        id="elderly80_90"
        type="checkbox"
        bind:checked={$form.elderly80_90}
        class="comment-card"
      />
      <label for="elderly80_90" class="flex flex-col cursor-pointer">
        <span class="small-text">Elderly (80-90)</span>
        <span class="xsmall-text">(WHO Standard)</span>
      </label>
    </div>

    <div class="md-checkbox">
      <input
        id="malnutrition"
        type="checkbox"
        bind:checked={$form.malnutrition}
        class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label for="malnutrition" class="text-click">Malnutrition</label>
    </div>

    <div class="md-checkbox">
      <input
        id="preservedDiuresis"
        type="checkbox"
        bind:checked={$form.preservedDiuresis}
        class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label for="preservedDiuresis" class="text-click"
        >Preserved Diuresis</label
      >
    </div>
  </div>
{/snippet}

{#snippet dialysisParameters()}
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
    <div class="form-grid-gap">
      <label for="time" class="form-label">Time (min)</label>
      <input id="time" type="text" bind:value={$form.time} class="form-input" />
    </div>

    <div class="form-grid-gap">
      <label for="qd" class="form-label">Qd</label>
      <input id="qd" type="text" bind:value={$form.qd} class="form-input" />
    </div>

    <div class="form-grid-gap">
      <label for="qb" class="form-label">Qb</label>
      <input id="qb" type="text" bind:value={$form.qb} class="form-input" />
    </div>
  

  
    <div class="form-grid-gap">
      <label for="ktvt" class="form-label">KT/v T</label>
      <input id="ktvt" type="text" bind:value={$form.ktvt} class="form-input" />
    </div>

    <div class="form-grid-gap">
      <label for="filter" class="form-label">Filter</label>
      <input
        id="filter"
        type="text"
        bind:value={$form.filter}
        class="form-input"
      />
    </div>
</div>
{/snippet}

<div
  class="form-background"
>
  <div class="form-header">
    <h2 class="h2-text">Patient Card</h2>
    {#if $form.updatedAt}
      <p class="small-text">
        Last Updated: {new Date($form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </div>

  <form method="POST" use:enhance class="form-gap">
    <!-- Clinical Indicators -->
    {@render clinicalIndicators()}
    {@render dialysisParameters()}

    <div class="form-gap">
      <label for="observations" class="form-label">Observations</label>
      <textarea
        id="observations"
        bind:value={$form.observations}
        rows="4"
        class="form-input resize-none"
      ></textarea>
    </div>

    <div class="footer-gap">
      <button
        type="submit"
        class="form-button"
      >
        Save Changes
      </button>
    </div>
  </form>
</div>
