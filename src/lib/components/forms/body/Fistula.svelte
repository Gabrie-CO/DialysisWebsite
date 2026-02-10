<script lang="ts">
  // --- TYPES ---
  type TrafficColor = "red" | "yellow" | "green" | null;

  interface CheckItem {
    active: boolean | null; // null = unchecked, true = Si, false = No
  }

  interface FormState {
    patientName: string;
    age: string;
    statusColor: TrafficColor;
    fistulaType: {
      autologous: boolean;
      prosthetic: boolean;
    };
    checks: {
      mature: CheckItem;
      stenosisYuxta: CheckItem;
      accessoryVeins: CheckItem;
      stenosisProximal: CheckItem;
    };
    observation: string;
    updatedAt?: string;
  }

  let { initialData = {}, onSave } = $props<{
    initialData?: Partial<FormState>;
    onSave: (data: FormState) => void;
  }>();

  // --- STATE ---
  let form = $state<FormState>({
    patientName: "",
    age: "",
    statusColor: null,
    fistulaType: {
      autologous: false,
      prosthetic: false,
    },
    checks: {
      mature: { active: null },
      stenosisYuxta: { active: null },
      accessoryVeins: { active: null },
      stenosisProximal: { active: null },
    },
    observation: "",
    ...initialData,
  });

  $effect(() => {
    form = {
      patientName: "",
      age: "",
      statusColor: null,
      fistulaType: {
        autologous: false,
        prosthetic: false,
        ...initialData.fistulaType,
      },
      checks: {
        mature: { active: null, ...initialData.checks?.mature },
        stenosisYuxta: { active: null, ...initialData.checks?.stenosisYuxta },
        accessoryVeins: { active: null, ...initialData.checks?.accessoryVeins },
        stenosisProximal: {
          active: null,
          ...initialData.checks?.stenosisProximal,
        },
        ...initialData.checks,
      },
      observation: "",
      ...initialData,
    };
  });

  // --- LOGIC ---
  // Helper to handle the "Si/No" logic where checking one unchecks the other visually
  // but logically we store a tri-state (true/false/null)
  function setCheck(key: keyof FormState["checks"], value: boolean) {
    form.checks[key].active = value;
  }
</script>

{#snippet colorCheck(color: TrafficColor, cssColor: string)}
  <div class="flex items-center gap-2">
    <div
      class={`w-5 h-5 rounded-full border border-gray-400 ${cssColor}`}
    ></div>
    <input
      type="checkbox"
      class="w-6 h-6 border-2 border-gray-600 appearance-none checked:bg-gray-800 checked:after:content-['✓'] checked:after:text-white checked:after:flex checked:after:justify-center"
      checked={form.statusColor === color}
      onchange={() => (form.statusColor = color)}
    />
  </div>
{/snippet}

{#snippet tableRow(
  title: string,
  desc: string,
  checkedState: boolean | null,
  updateFn: (v: boolean) => void,
)}
  <tr class="border-b border-black">
    <td class="border-r border-black p-2 w-1/3 align-top bg-gray-100">
      <div class="font-bold text-xs uppercase mb-2 italic">{title}</div>
      <div class="flex justify-between items-center px-2">
        <label class="flex items-center gap-2 cursor-pointer font-bold text-sm">
          Si
          <input
            type="checkbox"
            checked={checkedState === true}
            onchange={() => updateFn(true)}
            class="w-5 h-5 border border-black appearance-none checked:bg-black"
          />
        </label>
        <label class="flex items-center gap-2 cursor-pointer font-bold text-sm">
          No
          <input
            type="checkbox"
            checked={checkedState === false}
            onchange={() => updateFn(false)}
            class="w-5 h-5 border border-black appearance-none checked:bg-black"
          />
        </label>
      </div>
    </td>
    <td
      class="p-2 text-[11px] leading-tight italic font-serif text-gray-800 align-middle"
    >
      {desc}
    </td>
  </tr>
{/snippet}

<div class="form-container">
  <div class="form-save-btn">
    <button onclick={() => onSave(form)} class="w-full h-full">
      Guardar
    </button>
  </div>

  <header class="form-header">
    <div class="flex items-center justify-center gap-4 w-full">
      <div class="relative w-12 h-10">
        <div class="absolute inset-0 bg-red-100 rounded-full opacity-50"></div>
        <div class="absolute top-1 left-3 text-red-800 font-bold text-xl">
          Kidney
        </div>
      </div>
      <div class="text-center">
        <h1 class="form-title mb-0">Diálisis de Honduras S.A.</h1>
        <div class="form-subtitle">Brindando calidad de vida</div>
        {#if form.updatedAt}
          <p class="text-[10px] text-gray-400 mt-1">
            Actualizado: {new Date(form.updatedAt).toLocaleString()}
          </p>
        {/if}
      </div>
    </div>
  </header>

  <div class="grid grid-cols-12 gap-2 mb-4 items-center">
    <div class="col-span-8 flex items-end gap-1">
      <label class="form-label mb-0 whitespace-nowrap"
        >Nombre del paciente</label
      >
      <input
        type="text"
        bind:value={form.patientName}
        class="form-input-line"
      />
    </div>

    <div class="col-span-4 flex items-end gap-1">
      <label class="form-label mb-0">Edad</label>
      <input type="text" bind:value={form.age} class="form-input-line" />
    </div>
  </div>

  <div class="grid grid-cols-12 gap-2 mb-4">
    <div class="col-span-9 space-y-2">
      <div class="flex items-center gap-2">
        <span class="font-bold text-gray-600 text-sm w-32"
          >Fistula Autologa</span
        >
        <input
          type="checkbox"
          bind:checked={form.fistulaType.autologous}
          class="w-6 h-6 border border-gray-500 appearance-none checked:bg-gray-800"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="font-bold text-gray-600 text-sm w-32"
          >Fistula Protésica</span
        >
        <input
          type="checkbox"
          bind:checked={form.fistulaType.prosthetic}
          class="w-6 h-6 border border-gray-500 appearance-none checked:bg-gray-800"
        />
      </div>
    </div>

    <div class="col-span-3 flex flex-col gap-2 items-end pr-2">
      {@render colorCheck("red", "bg-red-500")}
      {@render colorCheck("yellow", "bg-yellow-400")}
      {@render colorCheck("green", "bg-green-600")}
    </div>
  </div>

  <div class="border-2 border-black mb-2">
    <div
      class="bg-gray-200 text-center font-bold text-xs py-1 border-b border-black uppercase"
    >
      Madurez de la Fístula arteriovenosa y Exploracion Física
    </div>
    <table class="w-full border-collapse">
      <tbody>
        {@render tableRow(
          "FISTULA MADURA",
          "Vena Facilmente comprensible. Thrill prominente en el anastomosis y presente en el trayecto. Colapso de la vena tras la estenosis.",
          form.checks.mature.active,
          (v) => setCheck("mature", v),
        )}

        {@render tableRow(
          "ESTENOSIS YUXTAANASTOMICA",
          "Pulso prominente en la anastomosis. Thrill disminuido. Escaso desarrollo de la vena tras la estenosis. Presencia del pulso debil tras la compresion de la vena de salida.",
          form.checks.stenosisYuxta.active,
          (v) => setCheck("stenosisYuxta", v),
        )}

        {@render tableRow(
          "VENAS ACCESORIAS",
          "Visualizables en la inspeccion. Presencia de thrill en su trayecto. Persistencia de thrill tras la compresion de la vena de salida.",
          form.checks.accessoryVeins.active,
          (v) => setCheck("accessoryVeins", v),
        )}

        {@render tableRow(
          "ESTENOSIS VENA PROXIMAL",
          "Trayeto de la vena hiperpulsatil. Ausencia de colapso al elevar la extremidad. Edema de la extremidad.",
          form.checks.stenosisProximal.active,
          (v) => setCheck("stenosisProximal", v),
        )}
      </tbody>
    </table>

    <div class="border-t border-black min-h-20 bg-gray-100 p-2">
      <label class="font-bold text-sm block text-gray-700 mb-1"
        >Observacion:</label
      >
      <textarea
        bind:value={form.observation}
        class="w-full h-16 bg-transparent outline-none resize-none text-sm text-gray-900 leading-snug"
      ></textarea>
    </div>
  </div>
</div>
