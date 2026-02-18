<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { get } from "svelte/store";
  import { zod } from "sveltekit-superforms/adapters";
  import { patientCardSchema } from "$lib/schemas/patientCard";
  import type { z } from "zod";
  import { untrack } from "svelte";

  import { onMount } from "svelte";
  import { OfflineService } from "$lib/services/offline";
  import { toast } from "svelte-sonner";

  // UI Components
  import TextInput from "../ui/TextInput.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import FormSectionCard from "../../ui/FormSectionCard.svelte";

  let { initialData, patientId, onSave } = $props<{
    initialData: z.infer<typeof patientCardSchema>;
    patientId: string;
    onSave: (data: z.infer<typeof patientCardSchema>) => void;
  }>();

  let FORM_ID = $derived(`patientCard_${patientId}`);

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
          try {
            await onSave(form.data);
            OfflineService.clearForm(FORM_ID); // Clear offline data on success
            toast.success("Saved successfully");
          } catch (error) {
            console.error("Save failed", error);
            OfflineService.saveForm(FORM_ID, form.data);
            toast.error("Network error. Saved locally.");
          }
        }
      },
      onError: ({ result }) => {
        // Fallback for other errors
        OfflineService.saveForm(FORM_ID, get(form));
        toast.error("Error saving. Data kept locally.");
      },
    },
  );

  // Sync initialData when it changes (e.g. switching patients)
  $effect(() => {
    // Only reset if no offline data exists to avoid overwriting user work
    // But complexity here: if switching patients, we MUST reset.
    // So logic: When patientId changes, existing form instance updates.
    form.set(initialData);
  });

  // Load offline data on mount or patient change
  $effect(() => {
    if (patientId) {
      const offlineData = OfflineService.loadForm(`patientCard_${patientId}`);
      if (offlineData && offlineData.data) {
        // Check if offline data is newer than initialData?
        // For now, prompt or just load. 'toast' implies user notification.
        // Let's just load it and notify.
        form.update((current) => ({ ...current, ...offlineData.data }));
        toast.info("Restored unsaved changes from this device.");
      }
    }
  });

  // Auto-save to local storage on change
  $effect(() => {
    if (patientId && $form) {
      OfflineService.saveForm(`patientCard_${patientId}`, $form);
    }
  });
</script>

{#snippet clinicalIndicators()}
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-100"
  >
    <div class="flex flex-col">
      <Checkbox label="Elderly (80-90)" bind:checked={$form.elderly80_90} />
      <span class="xsmall-text ml-8 text-gray-500">(WHO Standard)</span>
    </div>

    <Checkbox label="Malnutrition" bind:checked={$form.malnutrition} />

    <Checkbox
      label="Preserved Diuresis"
      bind:checked={$form.preservedDiuresis}
    />
  </div>
{/snippet}

{#snippet dialysisParameters()}
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
    <TextInput label="Time (min)" bind:value={$form.time} />
    <TextInput label="Qd" bind:value={$form.qd} />
    <TextInput label="Qb" bind:value={$form.qb} />
    <TextInput label="KT/v T" bind:value={$form.ktvt} />
    <TextInput label="Filter" bind:value={$form.filter} />
  </div>
{/snippet}

<FormSectionCard title="Patient Card" data={$form} patientId={patientId ?? ""}>
  <div class="form-header">
    {#if $form.updatedAt}
      <p class="small-text">
        Last Updated: {new Date($form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </div>

  <form method="POST" use:enhance class="space-y-6">
    <!-- Clinical Indicators -->
    {@render clinicalIndicators()}
    {@render dialysisParameters()}

    <div class="pt-4">
      <TextInput
        label="Observations"
        bind:value={$form.observations}
        placeholder="Enter observations..."
      />
    </div>

    <div class="form-save-btn pt-4 flex justify-end">
      <button
        type="submit"
        class="bg-blue-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Guardar
      </button>
    </div>
  </form>
</FormSectionCard>
