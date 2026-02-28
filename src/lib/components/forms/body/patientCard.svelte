<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";

  import { zod } from "sveltekit-superforms/adapters";
  import { patientCardSchema } from "$lib/schemas/patientCard";
  import type { z } from "zod";
  import { untrack } from "svelte";

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

  // Initialize Superform in SPA mode
  const { form, enhance } = superForm(
    defaults(
      untrack(() => initialData),
      zod(patientCardSchema as any),
    ),
    {
      SPA: true,
      validators: zod(patientCardSchema as any),
      resetForm: false, // Prevent form from resetting to stale initialData
      onUpdate: async ({ form }) => {
        if (form.valid) {
          try {
            await onSave(form.data);
            toast.success("Saved successfully");
          } catch (error) {
            console.error("Save failed", error);
            toast.error("Error saving.");
          }
        }
      },
    },
  );
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
    <TextInput label="Schedule" bind:value={$form.schedule} />
  </div>
{/snippet}

<FormSectionCard
  title="Patient Card"
  data={$form}
  patientId={patientId ?? ""}
  sourcePath="patientCard"
>
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
