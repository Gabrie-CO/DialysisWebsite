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
  <td class="table-td-checkbox">
    <label class="table-checkbox-label">
      <input
        type="checkbox"
        class="form-checkbox"
        checked={checkedState[year.toString()]?.has(id) || false}
        onchange={(e) => toggle(year, id, e.currentTarget.checked)}
      />
    </label>
  </td>
{/snippet}

<div class="form-background">
  <div class="mb-6">
    <h2 class="form-title">Control de Fichas (Checklists)</h2>
    <p class="form-subtitle">Validación Anual</p>
    {#if initialData.updatedAt}
      <p class="text-[10px] text-gray-400 mt-1 text-center">
        Actualizado: {new Date(initialData.updatedAt).toLocaleString()}
      </p>
    {/if}
  </div>

  <div class="table-container">
    <table class="table-standard">
      <thead>
        <tr class="table-header-row">
          <th class="table-th w-12">N°</th>
          <th class="table-th-left">FICHAS</th>
          {#each years as year}
            <th class="table-th-year">
              {year}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each LABELS as row}
          <tr class="table-row">
            <td class="table-td-id">
              {row.id}
            </td>

            <td class="table-td-label">
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
    <button onclick={handleSave} class="form-button"> Save Changes </button>
  </div>
</div>
