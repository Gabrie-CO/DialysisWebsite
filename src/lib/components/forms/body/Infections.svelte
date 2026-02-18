<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { infectionsSchema } from "$lib/schemas/infectionsSchema";
  import type { z } from "zod";
  import { untrack } from "svelte";

  // UI Components
  import TextInput from "../ui/TextInput.svelte";
  import DateInput from "../ui/DateInput.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import RadioGroup from "../ui/RadioGroup.svelte";
  import FormSectionCard from "../../ui/FormSectionCard.svelte";

  let {
    initialData = {},
    patientId,
    onSave,
  } = $props<{
    initialData?: Partial<z.infer<typeof infectionsSchema>>;
    patientId: string;
    onSave: (data: z.infer<typeof infectionsSchema>) => void;
  }>();

  // Initialize Superform in SPA mode
  const { form, enhance } = superForm(
    defaults(
      // @ts-ignore
      untrack(() => initialData || {}),
      zod(infectionsSchema as any),
    ),
    {
      SPA: true,
      validators: zod(infectionsSchema as any),
      onUpdate: async ({ form }) => {
        if (form.valid) {
          onSave(form.data);
        }
      },
    },
  );

  // Sync initialData when it changes
  $effect(() => {
    if (initialData) {
      const currentForm = untrack(() => $form);
      // @ts-ignore
      form.set({ ...currentForm, ...initialData });
    }
  });
</script>

<div class="form-container">
  <header class="form-header mb-6">
    <h2 class="h2-text">Comité de Infecciones</h2>
    {#if $form.updatedAt}
      <p class="small-text">
        Actualizado: {new Date($form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </header>

  <form method="POST" use:enhance class="space-y-4">
    <FormSectionCard
      title="Datos del Tratamiento"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <TextInput label="Antibiótico" bind:value={$form.antibiotic} />
        <TextInput label="Dosis" bind:value={$form.dose} />
        <TextInput label="Vía de Administración" bind:value={$form.route} />

        <div class="md:col-span-2 flex items-center gap-4 pt-2">
          <span class="form-label mb-0">PPS:</span>
          <RadioGroup
            row
            name="pps"
            options={[
              { value: "negative", label: "-" },
              { value: "positive", label: "+" },
            ]}
            bind:value={$form.pps}
          />
        </div>
      </div>
    </FormSectionCard>

    <FormSectionCard
      title="Detalles y Fechas"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <DateInput label="Fecha de Inicio" bind:value={$form.startDate} />
        <DateInput label="Fecha de Finalización" bind:value={$form.endDate} />

        <div class="md:col-span-2">
          <label class="form-label mb-1">Observaciones</label>
          <textarea
            class="form-input w-full min-h-[100px]"
            bind:value={$form.observations}
            placeholder="Observaciones..."
          ></textarea>
        </div>
      </div>
    </FormSectionCard>

    <div class="form-save-btn pt-4 flex justify-end">
      <button
        type="submit"
        class="bg-blue-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Guardar
      </button>
    </div>
  </form>
</div>
