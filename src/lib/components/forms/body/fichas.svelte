<script lang="ts">
  let { initialData = {}, onSave } = $props<{
    initialData?: Record<string, number[]> & { updatedAt?: string };
    onSave: (data: Record<string, number[]>) => void;
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

  // --- STATE ---
  // Local state to track checkboxes: { [year]: Set<id> }
  let checkedState = $state<Record<string, Set<number>>>({});

  // Initialize state from initialData
  $effect(() => {
    const newState: Record<string, Set<number>> = {};
    years.forEach((year) => {
      const yearStr = year.toString();
      const existingIds = initialData[yearStr] || [];
      newState[yearStr] = new Set(existingIds);
    });
    checkedState = newState;
  });

  function toggle(year: number, id: number, value: boolean) {
    const yearStr = year.toString();
    const currentSet = new Set(checkedState[yearStr] || []);
    if (value) {
      currentSet.add(id);
    } else {
      currentSet.delete(id);
    }
    checkedState[yearStr] = currentSet;
  }

  function handleSave() {
    // Convert Sets back to arrays for storage
    const dataToSave: Record<string, number[]> = {};
    Object.entries(checkedState).forEach(([year, set]) => {
      dataToSave[year] = Array.from(set);
    });
    onSave(dataToSave);
  }
</script>

{#snippet checkboxCell(year: number, id: number)}
  <td class="border border-gray-200 p-0 h-full relative">
    <label
      class="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
    >
      <input
        type="checkbox"
        class="form-checkbox"
        checked={checkedState[year.toString()]?.has(id) || false}
        onchange={(e) => toggle(year, id, e.currentTarget.checked)}
      />
    </label>
  </td>
{/snippet}

<div class="form-container">
  <div class="mb-6">
    <h2 class="form-title">Control de Fichas (Checklists)</h2>
    <p class="form-subtitle">Validación Anual</p>
    {#if initialData.updatedAt}
      <p class="text-[10px] text-gray-400 mt-1 text-center">
        Actualizado: {new Date(initialData.updatedAt).toLocaleString()}
      </p>
    {/if}
  </div>

  <div class="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-200">
          <th
            class="border-r border-gray-200 p-3 w-12 text-center text-xs font-bold text-gray-500"
            >N°</th
          >
          <th
            class="border-r border-gray-200 p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
            >FICHAS</th
          >
          {#each years as year}
            <th
              class="border-r border-gray-200 p-3 w-20 text-center text-xs font-bold text-gray-700 bg-gray-100/50 last:border-r-0"
            >
              {year}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each LABELS as row}
          <tr
            class="h-12 border-b border-gray-200 last:border-0 hover:bg-gray-50/50 transition-colors"
          >
            <td
              class="border-r border-gray-200 text-center text-xs text-gray-500 font-medium"
            >
              {row.id}
            </td>

            <td
              class="border-r border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 leading-tight"
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

  <div class="form-save-btn">
    <button onclick={handleSave} class="form-btn-primary">
      Save Changes
    </button>
  </div>
</div>
