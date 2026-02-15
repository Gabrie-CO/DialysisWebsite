<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { examControlsSchema } from "$lib/schemas/examControlsSchema";
  import type { z } from "zod";
  import { untrack } from "svelte";

  // UI Components
  import TextInput from "../ui/TextInput.svelte";
  import FormSectionCard from "../../ui/FormSectionCard.svelte";

  // --- TYPES ---
  type SerologyStatus = "pos" | "neg" | null;

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

  // --- LOGIC ---
  function setSerology(
    key: keyof typeof $form.serology,
    status: SerologyStatus,
  ) {
    // @ts-ignore
    $form.serology[key] = status;
  }

  function updateCell(rowId: string, month: string, value: string) {
    const row = $form.rows.find((r: any) => r.id === rowId);
    if (row) {
      row.values[month] = value;
      $form.rows = [...$form.rows]; // Trigger update
    }
  }

  function isSerologyRow(id: string): boolean {
    return ["hepb", "hepc", "vih", "tb"].includes(id);
  }
</script>

{#snippet serologyControl(
  label: string,
  value: SerologyStatus,
  onUpdate: (s: SerologyStatus) => void,
)}
  <div class="flex items-center justify-center h-full w-full">
    <div class="flex rounded overflow-hidden border border-gray-400 h-6">
      <label
        class="cursor-pointer flex items-center justify-center px-4 transition-colors border-r border-gray-400"
        class:bg-red-100={value === "pos"}
        class:bg-white={value !== "pos"}
        class:hover:bg-red-50={value !== "pos"}
      >
        <input
          type="radio"
          name={label}
          checked={value === "pos"}
          onclick={() => onUpdate("pos")}
          class="hidden"
        />
        <span
          class="text-[9px] font-bold"
          class:text-red-800={value === "pos"}
          class:text-gray-400={value !== "pos"}>POSITIVO (+)</span
        >
      </label>

      <label
        class="cursor-pointer flex items-center justify-center px-4 transition-colors"
        class:bg-green-100={value === "neg"}
        class:bg-white={value !== "neg"}
        class:hover:bg-green-50={value !== "neg"}
      >
        <input
          type="radio"
          name={label}
          checked={value === "neg"}
          onclick={() => onUpdate("neg")}
          class="hidden"
        />
        <span
          class="text-[9px] font-bold"
          class:text-green-800={value === "neg"}
          class:text-gray-400={value !== "neg"}>NEGATIVO (-)</span
        >
      </label>
    </div>
  </div>
{/snippet}

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
      title="Datos del Paciente"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="grid grid-cols-12 gap-4 items-end p-3">
        <div class="col-span-12 md:col-span-5">
          <TextInput
            label="Nombre del Paciente"
            bind:value={$form.patient.name}
          />
        </div>
        <div class="col-span-6 md:col-span-2">
          <TextInput label="Edad" bind:value={$form.patient.age} />
        </div>
        <div class="col-span-6 md:col-span-3">
          <TextInput
            label="No. Expediente"
            bind:value={$form.patient.fileNumber}
          />
        </div>
        <div class="col-span-6 md:col-span-2">
          <TextInput label="Año" bind:value={$form.patient.year} />
        </div>
      </div>
    </FormSectionCard>

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
                NOMBRE DEL PACIENTE
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
                TIPO DE EXAMEN
              </th>
              <th colspan="12" class="border border-black bg-gray-50"></th>
            </tr>
          </thead>
          <tbody>
            {#each $form.rows as row}
              <tr class="hover:bg-gray-50 group h-8">
                <td
                  class="border border-black px-2 py-1 text-[10px] font-bold sticky left-0 bg-white group-hover:bg-gray-50 z-10"
                >
                  {row.label}
                </td>

                {#if isSerologyRow(row.id)}
                  <td
                    colspan="12"
                    class="border border-black p-0 bg-gray-50/30"
                  >
                    {#if row.id === "hepb"}
                      {@render serologyControl(
                        "Hep B",
                        $form.serology.hepB,
                        (v) => setSerology("hepB", v),
                      )}
                    {:else if row.id === "hepc"}
                      {@render serologyControl(
                        "Hep C",
                        $form.serology.hepC,
                        (v) => setSerology("hepC", v),
                      )}
                    {:else if row.id === "vih"}
                      {@render serologyControl("VIH", $form.serology.vih, (v) =>
                        setSerology("vih", v),
                      )}
                    {:else if row.id === "tb"}
                      {@render serologyControl("TB", $form.serology.tb, (v) =>
                        setSerology("tb", v),
                      )}
                    {/if}
                  </td>
                {:else}
                  {#each months as month}
                    {@render inputCell(row.id, month, row.values[month])}
                  {/each}
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </FormSectionCard>

    <div class="form-save-btn mt-4">
      <button type="submit" class="form-button"> Guardar </button>
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
