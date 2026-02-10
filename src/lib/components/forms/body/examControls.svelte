<script lang="ts">
  import { untrack } from "svelte";
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

  interface ExamRow {
    id: string;
    label: string;
    values: Record<string, string>;
  }

  interface FormState {
    patient: {
      name: string;
      age: string;
      fileNumber: string;
      year: string;
    };
    serology: {
      hepB: SerologyStatus;
      hepC: SerologyStatus;
      vih: SerologyStatus;
      tb: SerologyStatus;
    };
    rows: ExamRow[];
    updatedAt?: string;
  }

  let { initialData = {}, onSave } = $props<{
    initialData?: Partial<FormState>;
    onSave: (data: FormState) => void;
  }>();

  // --- STATE ---
  let form = $state<FormState>({
    patient: {
      name: "",
      age: "",
      fileNumber: "",
      year: new Date().getFullYear().toString(),
    },
    serology: {
      hepB: null,
      hepC: null,
      vih: null,
      tb: null,
    },
    rows: [
      { id: "hb", label: "HB", values: {} },
      { id: "htc", label: "HTC", values: {} },
      { id: "leu", label: "LEU", values: {} },
      { id: "plaqueta", label: "PLAQUETA", values: {} },
      { id: "glucosa", label: "GLUCOSA", values: {} },
      { id: "urea", label: "UREA", values: {} },
      { id: "creatinina", label: "CREATININA", values: {} },
      { id: "acido_urico", label: "ACIDO URICO", values: {} },
      { id: "albumina", label: "ALBUMINA", values: {} },
      { id: "colesterol", label: "COLESTEROL", values: {} },
      { id: "trigliceridos", label: "TRIGLICERIDOS", values: {} },
      { id: "sodio", label: "SODIO", values: {} },
      { id: "potasio", label: "POTASIO", values: {} },
      { id: "fosfatasa", label: "FOSFATASA / ALCALINA", values: {} },
      { id: "calcio", label: "CALCIO", values: {} },
      { id: "fosforo", label: "FOSFORO", values: {} },
      { id: "hierro", label: "NIVELES HIERRO", values: {} },

      // Serology Rows
      { id: "hepb", label: "HEP B", values: {} },
      { id: "hepc", label: "HEP C", values: {} },
      { id: "vih", label: "VIH", values: {} },
      { id: "tb", label: "TB", values: {} },

      { id: "pth", label: "PTH", values: {} },
      { id: "ktv", label: "KTV", values: {} },
    ],
    ...untrack(() => initialData),
  });

  $effect(() => {
    form = {
      patient: {
        name: "",
        age: "",
        fileNumber: "",
        year: new Date().getFullYear().toString(),
        ...initialData.patient,
      },
      serology: {
        hepB: null,
        hepC: null,
        vih: null,
        tb: null,
        ...initialData.serology,
      },
      rows: initialData.rows || [
        { id: "hb", label: "HB", values: {} },
        { id: "htc", label: "HTC", values: {} },
        { id: "leu", label: "LEU", values: {} },
        { id: "plaqueta", label: "PLAQUETA", values: {} },
        { id: "glucosa", label: "GLUCOSA", values: {} },
        { id: "urea", label: "UREA", values: {} },
        { id: "creatinina", label: "CREATININA", values: {} },
        { id: "acido_urico", label: "ACIDO URICO", values: {} },
        { id: "albumina", label: "ALBUMINA", values: {} },
        { id: "colesterol", label: "COLESTEROL", values: {} },
        { id: "trigliceridos", label: "TRIGLICERIDOS", values: {} },
        { id: "sodio", label: "SODIO", values: {} },
        { id: "potasio", label: "POTASIO", values: {} },
        { id: "fosfatasa", label: "FOSFATASA / ALCALINA", values: {} },
        { id: "calcio", label: "CALCIO", values: {} },
        { id: "fosforo", label: "FOSFORO", values: {} },
        { id: "hierro", label: "NIVELES HIERRO", values: {} },
        { id: "hepb", label: "HEP B", values: {} },
        { id: "hepc", label: "HEP C", values: {} },
        { id: "vih", label: "VIH", values: {} },
        { id: "tb", label: "TB", values: {} },
        { id: "pth", label: "PTH", values: {} },
        { id: "ktv", label: "KTV", values: {} },
      ],
      ...initialData,
    };
  });

  // --- LOGIC ---
  function setSerology(
    key: keyof FormState["serology"],
    status: SerologyStatus,
  ) {
    form.serology[key] = status;
  }

  function updateCell(rowId: string, month: string, value: string) {
    const row = form.rows.find((r) => r.id === rowId);
    if (row) {
      row.values[month] = value;
    }
  }

  function isSerologyRow(
    id: string,
  ): id is keyof FormState["serology"] | string {
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
  <div class="form-save-btn">
    <button onclick={() => onSave(form)} class="w-full h-full">
      Guardar
    </button>
  </div>

  <header class="form-header">
    <div class="flex items-center gap-3">
      <div class="relative w-12 h-10 shrink-0">
        <div
          class="absolute inset-0 bg-red-800 rounded-full opacity-20 rotate-45 transform scale-x-75"
        ></div>
        <div
          class="absolute inset-0 border-2 border-blue-900 rounded-full transform -rotate-12 scale-75"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-bold text-blue-900"
        >
          DH
        </div>
      </div>
      <div class="flex flex-col">
        <h1 class="form-title mb-0 leading-none">Diálisis de Honduras S.A.</h1>
        <span class="form-subtitle mt-0.5">Brindando calidad de vida</span>
      </div>
    </div>
    <div class="text-right hidden sm:block">
      <div class="text-xs text-gray-400 font-mono">FORM-DH-2025</div>
      {#if form.updatedAt}
        <p class="text-[10px] text-gray-400 mt-1">
          Actualizado: {new Date(form.updatedAt).toLocaleString()}
        </p>
      {/if}
    </div>
  </header>

  <div
    class="grid grid-cols-12 gap-4 items-end bg-blue-50/50 p-3 rounded border border-blue-100 mb-4"
  >
    <div class="col-span-12 md:col-span-5">
      <label class="form-label"
        >Nombre del Paciente <input
          type="text"
          bind:value={form.patient.name}
          class="form-input-line font-semibold"
        />
      </label>
    </div>
    <div class="col-span-6 md:col-span-2">
      <label class="form-label"
        >Edad <input
          type="text"
          bind:value={form.patient.age}
          class="form-input-line font-semibold text-center"
        />
      </label>
    </div>
    <div class="col-span-6 md:col-span-3">
      <label class="form-label"
        >No. Expediente
        <input
          type="text"
          bind:value={form.patient.fileNumber}
          class="form-input-line font-semibold text-center"
        />
      </label>
    </div>
    <div class="col-span-6 md:col-span-2">
      <label class="form-label"
        >Año <input
          type="text"
          bind:value={form.patient.year}
          class="form-input-line font-semibold text-center"
        />
      </label>
    </div>
  </div>
</div>

<div class="form-section">
  <h2
    class="form-section-title text-center tracking-widest inline-block w-full"
  >
    Control de Examenes
  </h2>
</div>

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
      {#each form.rows as row}
        <tr class="hover:bg-gray-50 group h-8">
          <td
            class="border border-black px-2 py-1 text-[10px] font-bold sticky left-0 bg-white group-hover:bg-gray-50 z-10"
          >
            {row.label}
          </td>

          {#if isSerologyRow(row.id)}
            <td colspan="12" class="border border-black p-0 bg-gray-50/30">
              {#if row.id === "hepb"}
                {@render serologyControl("Hep B", form.serology.hepB, (v) =>
                  setSerology("hepB", v),
                )}
              {:else if row.id === "hepc"}
                {@render serologyControl("Hep C", form.serology.hepC, (v) =>
                  setSerology("hepC", v),
                )}
              {:else if row.id === "vih"}
                {@render serologyControl("VIH", form.serology.vih, (v) =>
                  setSerology("vih", v),
                )}
              {:else if row.id === "tb"}
                {@render serologyControl("TB", form.serology.tb, (v) =>
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
