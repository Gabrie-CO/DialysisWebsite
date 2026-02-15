<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { fichasSchema } from "$lib/schemas/fichasSchema";
  import type { z } from "zod";
  import { untrack } from "svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import FormSectionCard from "../../ui/FormSectionCard.svelte";

  let {
    initialData = {},
    patientId,
    onSave,
  } = $props<{
    initialData?: Partial<z.infer<typeof fichasSchema>>;
    patientId: string;
    onSave: (data: z.infer<typeof fichasSchema>) => void;
  }>();

  // --- CONFIG ---
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];

  const LABELS = [
    { id: 1, label: "Historias Clínicas Correctas" },
    { id: 2, label: "Exámenes Complementarios y de Imagen" },
    { id: 3, label: "Consentimiento Informado" },
    { id: 4, label: "Acta de Compromiso (Derechos y Deberes del Px)" },
    { id: 5, label: "Documento de Hospital de Referencia" },
    { id: 6, label: "Ficha de Ingreso" },
    { id: 7, label: "Serología Actualizada (6 meses)" },
    { id: 8, label: "Resumen del Mes" },
    { id: 9, label: "Llenado Correcto de Enfermería" },
    { id: 10, label: "Firma y Sello del Medico" },
    { id: 11, label: "Evaluación Diaria del Paciente" },
    { id: 12, label: "Se cumplen Indicaciones Medicas" },
    { id: 13, label: "Referencias" },
  ];

  // Initialize Superform in SPA mode
  const { form, enhance } = superForm(
    defaults(
      // @ts-ignore
      untrack(() => initialData || {}),
      zod(fichasSchema as any),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zod(fichasSchema as any),
      onUpdate: async ({ form }) => {
        if (form.valid) {
          onSave(form.data);
        }
      },
    },
  );
  // Sync initialData
  $effect(() => {
    if (initialData) {
      const currentForm = untrack(() => $form);
      // Create a new object to modify before setting form
      // @ts-ignore
      const newData = { ...currentForm, ...initialData };

      // Ensure checklist object exists for years
      years.forEach((year) => {
        if (!newData.checklist[year.toString()]) {
          newData.checklist[year.toString()] = [];
        }
      });

      // @ts-ignore
      form.set(newData);
    }
  });

  function toggle(year: number, id: number, checked: boolean) {
    const yearStr = year.toString();
    const currentList = $form.checklist[yearStr] || [];

    if (checked) {
      if (!currentList.includes(id)) {
        $form.checklist[yearStr] = [...currentList, id];
      }
    } else {
      $form.checklist[yearStr] = currentList.filter((x: any) => x !== id);
    }
  }

  function isChecked(year: number, id: number) {
    return $form.checklist[year.toString()]?.includes(id) || false;
  }
</script>

{#snippet checkboxCell(year: number, id: number)}
  <td
    class="p-2 border border-black dark:border-gray-700 text-center relative bg-white dark:bg-zinc-800"
  >
    <div class="flex items-center justify-center">
      <input
        type="checkbox"
        class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        checked={isChecked(year, id)}
        onchange={(e) => toggle(year, id, e.currentTarget.checked)}
      />
    </div>
  </td>
{/snippet}

<header class="form-header mb-6">
  <h2 class="h2-text">Control de Fichas (Checklists)</h2>
  {#if $form.updatedAt}
    <p class="small-text">
      Actualizado: {new Date($form.updatedAt).toLocaleString()}
    </p>
  {/if}
</header>

<form method="POST" use:enhance>
  <FormSectionCard
    title="Control de Fichas"
    data={$form}
    patientId={patientId || ""}
  >
    <div class="overflow-x-auto border-2 border-black rounded shadow-sm">
      <table class="w-full border-collapse">
        <thead class="bg-blue-900 text-white">
          <tr>
            <th
              class="p-3 text-sm font-bold border-r border-blue-800 w-12 text-center"
              >N°</th
            >
            <th class="p-3 text-sm font-bold border-r border-blue-800 text-left"
              >FICHAS</th
            >
            {#each years as year}
              <th
                class="p-3 text-sm font-bold border-r border-blue-800 last:border-0 w-24 text-center"
              >
                {year}
              </th>
            {/each}
          </tr>
        </thead>
        <tbody class="bg-gray-50">
          {#each LABELS as row}
            <tr
              class="hover:bg-blue-50 transition-colors border-b border-gray-300 last:border-0"
            >
              <td
                class="p-3 text-center font-bold text-gray-600 border-r border-gray-300"
              >
                {row.id}
              </td>

              <td
                class="p-3 text-sm font-medium text-gray-800 border-r border-gray-300"
              >
                {row.label}
              </td>

              {#each years as year}
                {@render checkboxCell(year, row.id)}
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
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
