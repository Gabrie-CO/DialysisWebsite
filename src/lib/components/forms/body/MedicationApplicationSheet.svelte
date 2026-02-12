<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { medicationSchema } from "$lib/schemas/medicationSchema";
  import type { z } from "zod";
  import { untrack } from "svelte";

  import TextInput from "../ui/TextInput.svelte";

  let { initialData = {}, onSave } = $props<{
    initialData?: Partial<z.infer<typeof medicationSchema>>;
    onSave: (data: z.infer<typeof medicationSchema>) => void;
  }>();

  // Initialize Superform in SPA mode
  const { form, enhance } = superForm(
    defaults(
      // @ts-ignore
      untrack(() => initialData || {}),
      zod(medicationSchema as any),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zod(medicationSchema as any),
      onUpdate: async ({ form }) => {
        if (form.valid) {
          onSave(form.data);
        }
      },
    },
  );

  // Sync initialData
  // Sync initialData
  $effect(() => {
    if (initialData) {
      const currentForm = untrack(() => $form);
      // Create a new object to modify before setting form
      // @ts-ignore
      const newData = { ...currentForm, ...initialData };

      // Ensure rows exist
      if (!newData.rows || newData.rows.length === 0) {
        newData.rows = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          medication: "",
          date: "",
          route: "" as const,
          indications: "",
          dose: "",
          time: "",
          doctorSign: "",
          nurseSign: "",
        }));
      }

      // @ts-ignore
      form.set(newData);
    }
  });

  function addRow() {
    const nextId = ($form.rows?.length || 0) + 1;
    $form.rows = [
      ...$form.rows,
      {
        id: nextId,
        medication: "",
        date: "",
        route: "",
        indications: "",
        dose: "",
        time: "",
        doctorSign: "",
        nurseSign: "",
      },
    ];
  }
</script>

{#snippet textCell(
  value: string,
  update: (v: string) => void,
  placeholder: string = "",
)}
  <div class="h-full w-full relative">
    <input
      type="text"
      {value}
      oninput={(e) => update((e.currentTarget as HTMLInputElement).value)}
      class="w-full h-full p-2 bg-transparent outline-none text-xs text-center border-none focus:bg-blue-50"
      {placeholder}
    />
  </div>
{/snippet}

{#snippet dateCell(value: string, update: (v: string) => void)}
  <div class="h-full w-full relative">
    <input
      type="date"
      {value}
      oninput={(e) => update((e.currentTarget as HTMLInputElement).value)}
      class="w-full h-full p-1 bg-transparent outline-none text-[10px] text-center border-none focus:bg-blue-50"
    />
  </div>
{/snippet}

<div class="form-container-wide">
  <div class="form-save-btn">
    <button onclick={() => onSave($form)} class="w-full h-full">
      Guardar
    </button>
  </div>

  <header class="form-header mb-6">
    <h2 class="h2-text">Hoja de Aplicación de Medicamentos</h2>
    {#if $form.updatedAt}
      <p class="small-text">
        Actualizado: {new Date($form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </header>

  <form method="POST" use:enhance>
    <div class="form-section-card mb-6">
      <div class="form-section-title"><h3>Datos del Paciente</h3></div>
      <div class="w-full">
        <TextInput label="Nombre del Paciente" bind:value={$form.patientName} />
      </div>
    </div>

    <div class="form-section-card">
      <div class="form-section-title"><h3>Aplicación de Medicamentos</h3></div>
      <div class="border-2 border-black overflow-x-auto">
        <table class="w-full border-collapse min-w-225">
          <thead>
            <tr
              class="bg-gray-200 text-xs font-bold text-center divide-x divide-black border-b border-black"
            >
              <th class="p-2 w-10">N.</th>
              <th class="p-2 w-48">MEDICAMENTO</th>
              <th class="p-2 w-24">FECHA</th>
              <th class="p-2 w-24">
                VÍA<br />
                <span class="text-[9px] font-normal">(V.O, I.V., S.C.)</span>
              </th>
              <th class="p-2 w-64">INDICACIONES O<br />COMENTARIOS</th>
              <th class="p-2 w-20">DOSIS</th>
              <th class="p-2 w-20">HORA</th>
              <th class="p-2 w-40">FIRMA Y SELLO<br />MÉDICO</th>
              <th class="p-2 w-40">NOMBRE Y FIRMA<br />ENFERMERÍA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-400">
            {#each $form.rows as row, i}
              <tr class="divide-x divide-gray-400 hover:bg-gray-50 h-16">
                <td
                  class="text-center font-bold text-gray-500 text-xs bg-gray-100"
                >
                  {row.id}
                </td>

                <td>
                  {@render textCell(
                    row.medication,
                    (v) => ($form.rows[i].medication = v),
                  )}
                </td>

                <td>
                  {@render dateCell(row.date, (v) => ($form.rows[i].date = v))}
                </td>

                <td class="p-0">
                  <select
                    bind:value={$form.rows[i].route}
                    class="w-full h-full bg-transparent outline-none text-xs text-center border-none appearance-none focus:bg-blue-50 p-2 cursor-pointer"
                  >
                    <option value=""></option>
                    <option value="IV">I.V.</option>
                    <option value="VO">V.O.</option>
                    <option value="SC">S.C.</option>
                    <option value="IM">I.M.</option>
                  </select>
                </td>

                <td>
                  <textarea
                    bind:value={$form.rows[i].indications}
                    class="w-full h-full p-1 bg-transparent outline-none text-xs resize-none focus:bg-blue-50"
                  ></textarea>
                </td>

                <td>
                  {@render textCell(row.dose, (v) => ($form.rows[i].dose = v))}
                </td>

                <td>
                  <input
                    type="time"
                    bind:value={$form.rows[i].time}
                    class="w-full h-full p-1 bg-transparent outline-none text-xs text-center border-none focus:bg-blue-50"
                  />
                </td>

                <td>
                  {@render textCell(
                    row.doctorSign,
                    (v) => ($form.rows[i].doctorSign = v),
                  )}
                </td>

                <td>
                  {@render textCell(
                    row.nurseSign,
                    (v) => ($form.rows[i].nurseSign = v),
                  )}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-4 print:hidden text-center">
      <button
        type="button"
        onclick={addRow}
        class="bg-blue-900 text-white px-6 py-2 rounded shadow hover:bg-blue-800 transition text-sm font-bold"
      >
        + Agregar Fila
      </button>
    </div>
  </form>
</div>

<style>
  /* Print Adjustments to ensure the table borders are crisp */
  @media print {
    .print\:hidden {
      display: none;
    }

    /* Force background colors to print for the header row */
    th {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>
