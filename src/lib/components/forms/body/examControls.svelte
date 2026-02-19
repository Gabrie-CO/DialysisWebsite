<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { examControlsSchema } from "$lib/schemas/examControlsSchema";
  import type { z } from "zod";
  import { untrack } from "svelte";

  // UI Components
  import TextInput from "../ui/TextInput.svelte";
  import FormSectionCard from "../../ui/FormSectionCard.svelte";

  const months = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ];
  const examTypes = [
    "HB",
    "HTC",
    "LEU",
    "PLAQUETAS",
    "GLUCOSA",
    "UREA",
    "CREATININA",
    "ACIDO URICO",
    "ALBUMINA",
    "COLESTEROL",
    "TRIGLICERIDOS",
    "SODIO",
    "POTASIO",
    "FOSFATASA / ALCALINA",
    "CALSIO",
    "FOSFORO",
    "NIVELES HIERRO",
    "PTH",
    "KTV",
  ];
  const serologyMap: Record<string, { id: string; label: string }> = {
    "HEP B+": { id: "hepb", label: "HEP B" },
    "HEP B-": { id: "hepb", label: "HEP B" },
    "HEP C+": { id: "hepc", label: "HEP C" },
    "HEP C-": { id: "hepc", label: "HEP C" },
    "VIH+": { id: "vih", label: "VIH" },
    "VIH-": { id: "vih", label: "VIH" },
    "TB+": { id: "tb", label: "TB" },
    "TB-": { id: "tb", label: "TB" },
  };
  let {
    initialData = {},
    patientId,
    onSave,
  } = $props<{
    initialData?: Partial<z.infer<typeof examControlsSchema>>;
    patientId: string;
    onSave: (data: z.infer<typeof examControlsSchema>) => void;
  }>();

  // Initialize Superform in SPA mode
  const { form, enhance } = superForm(
    defaults(
      // @ts-ignore
      untrack(() => initialData || {}),
      zod(examControlsSchema as any),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zod(examControlsSchema as any),
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

  // Ensure rows match examTypes and serology
  $effect(() => {
    const currentRows = untrack(() => $form.rows);
    const serologyKeys = Object.keys(serologyMap);
    const allTypes = [...examTypes, ...serologyKeys];

    if (currentRows.length === 0) {
      // Initialize rows from examTypes and serology
      $form.rows = allTypes.map((type) => ({
        id: type,
        label: type,
        values: {},
      }));
    } else {
      // Merge/Ensure all types exist
      const existingIds = new Set(currentRows.map((r:any) => r.id));
      const missing = allTypes.filter((t) => !existingIds.has(t));
      if (missing.length > 0) {
        const newRows = missing.map((type) => ({
          id: type,
          label: type,
          values: {},
        }));
        $form.rows = [...currentRows, ...newRows];
      }
    }
  });

  function updateCell(rowId: string, month: string, value: string) {
    const row = $form.rows.find((r: any) => r.id === rowId);
    if (row) {
      row.values[month] = value;
      $form.rows = [...$form.rows]; // Trigger update
    }
  }
</script>

{#snippet inputCell(rowId: string, month: string, val: string)}
  <td class="border border-black p-0 h-8 min-w-15">
    <input
      type="text"
      value={val || ""}
      oninput={(e) =>
        updateCell(rowId, month, (e.currentTarget as HTMLInputElement).value)}
      class="w-full h-full text-center text-xs bg-transparent outline-none focus:bg-blue-50 p-1"
    />
  </td>
{/snippet}

<div class="form-container-wide">
  <header class="form-header mb-6">
    <h2 class="h2-text">Control de Examenes</h2>
    {#if $form.updatedAt}
      <p class="small-text">
        Actualizado: {new Date($form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </header>

  <form method="POST" use:enhance>
    <FormSectionCard
      title="Control de Examenes"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="overflow-x-auto border-2 border-black">
        <table class="w-full border-collapse min-w-250">
          <thead>
            <tr class="bg-gray-200">
              <th
                class="border border-black p-2 text-[10px] font-bold w-40 sticky left-0 bg-gray-200 z-10 text-left"
              >
                TIPO DE EXAMEN
              </th>
              {#each months as month}
                <th
                  class="border border-black p-1 text-[9px] font-bold w-20 uppercase"
                >
                  {month}
                </th>
              {/each}
            </tr>
            <tr class="bg-gray-100">
              <th
                class="border border-black p-1 text-[10px] font-bold sticky left-0 bg-gray-100 z-10 text-center italic"
              >
              </th>
              <th colspan="12" class="border border-black bg-gray-50"></th>
            </tr>
          </thead>
          <tbody>
            {#each $form.rows as row, i}
              <tr
                class="hover:bg-blue-50 group h-8 {i % 2 === 0
                  ? 'bg-white'
                  : 'bg-gray-100'}"
              >
                <td
                  class="border border-black px-2 py-1 text-[10px] font-bold sticky left-0 group-hover:bg-blue-50 z-10 {i %
                    2 ===
                  0
                    ? 'bg-white'
                    : 'bg-gray-100'}"
                >
                  {row.label}
                </td>
                {#each months as month}
                  {@render inputCell(row.id, month, row.values[month])}
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
</div>

<style>
  @media print {
    .sticky {
      position: static !important;
    }
    .overflow-x-auto {
      overflow: visible !important;
    }
    th {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>
