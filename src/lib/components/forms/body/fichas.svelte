<script lang="ts">
  // --- TYPES ---
  interface FichaRow {
    id: number;
    label: string;
    y2023: boolean;
    y2024: boolean;
    y2025: boolean;
  }

  interface FormState {
    rows: FichaRow[];
  }

  // --- STATE ---
  let form = $state<FormState>({
    rows: [
      {
        id: 1,
        label: "Historias Clínicas Correctas",
        y2023: false,
        y2024: false,
        y2025: false,
      },
      {
        id: 2,
        label: "Exámenes Complementarios y de Imagen",
        y2023: false,
        y2024: false,
        y2025: false,
      },
      {
        id: 3,
        label: "Consentimiento Informado",
        y2023: false,
        y2024: false,
        y2025: false,
      },
      {
        id: 4,
        label: "Acta de Compromiso (Derechos y Deberes del Px)",
        y2023: false,
        y2024: false,
        y2025: false,
      },
      {
        id: 5,
        label: "Documento de Hospital de Referencia",
        y2023: false,
        y2024: false,
        y2025: false,
      },
      {
        id: 6,
        label: "Ficha de Ingreso",
        y2023: false,
        y2024: false,
        y2025: false,
      },
      {
        id: 7,
        label: "Serología Actualizada (6 meses)",
        y2023: false,
        y2024: false,
        y2025: false,
      },
      {
        id: 8,
        label: "Resumen del Mes",
        y2023: false,
        y2024: false,
        y2025: false,
      },
      {
        id: 9,
        label: "Llenado Correcto de Enfermería",
        y2023: false,
        y2024: false,
        y2025: false,
      },
      {
        id: 10,
        label: "Firma y Sello del Medico",
        y2023: false,
        y2024: false,
        y2025: false,
      },
      {
        id: 11,
        label: "Evaluación Diaria del Paciente",
        y2023: false,
        y2024: false,
        y2025: false,
      },
      {
        id: 12,
        label: "Se cumplen Indicaciones Medicas",
        y2023: false,
        y2024: false,
        y2025: false,
      },
      {
        id: 13,
        label: "Referencias",
        y2023: false,
        y2024: false,
        y2025: false,
      },
    ],
  });
</script>

{#snippet checkboxCell(checked: boolean, onChange: (v: boolean) => void)}
  <td class="border border-black p-0 h-full relative">
    <label
      class="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-gray-100"
    >
      <input
        type="checkbox"
        class="w-5 h-5 accent-blue-900 cursor-pointer"
        {checked}
        onchange={(e) => onChange(e.currentTarget.checked)}
      />
    </label>
  </td>
{/snippet}

<div
  class="max-w-xl mx-auto p-4 bg-white shadow-xl font-sans text-gray-900 print:shadow-none print:max-w-none"
>
  <div class="border-2 border-black">
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-100 border-b-2 border-black">
          <th class="border-r border-black p-2 w-10 text-center font-bold"
            >N°</th
          >
          <th
            class="border-r border-black p-2 text-left font-bold uppercase tracking-wide"
            >FICHAS</th
          >
          <th
            class="border-r border-black p-1 w-12 text-center font-bold text-sm bg-gray-200"
            >2023</th
          >
          <th
            class="border-r border-black p-1 w-12 text-center font-bold text-sm bg-gray-200"
            >2024</th
          >
          <th class="p-1 w-12 text-center font-bold text-sm bg-gray-200"
            >2025</th
          >
        </tr>
      </thead>
      <tbody>
        {#each form.rows as row}
          <tr class="h-10 border-b border-black last:border-0">
            <td class="border-r border-black text-center font-bold text-sm">
              {row.id}
            </td>

            <td
              class="border-r border-black px-3 py-1 text-sm font-medium leading-tight"
            >
              {row.label}
            </td>

            {@render checkboxCell(row.y2023, (v) => (row.y2023 = v))}
            {@render checkboxCell(row.y2024, (v) => (row.y2024 = v))}
            {@render checkboxCell(row.y2025, (v) => (row.y2025 = v))}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
