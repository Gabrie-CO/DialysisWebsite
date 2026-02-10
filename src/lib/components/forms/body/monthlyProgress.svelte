<script lang="ts">
  import { untrack } from "svelte";
  interface FormState {
    meta: {
      month: string;
      fileNumber: string; // Expediente
      doctorSignature: string;
      updatedAt?: string;
    };
    patient: {
      name: string;
      admission: {
        active: boolean | null; // Si/No
        dateIn: string;
        dateOut: string;
      };
      diagnosis: string;
    };
    generalStatus: {
      transfusions: {
        active: boolean | null;
        count: string;
      };
      interdialyticGain: string;
      generalState: string;
      appetite: string;
      residualDiuresis: {
        active: boolean | null; // Si/No
        type: string; // 'Normal' or 'Disminuido'
      };
    };
    comorbidities: {
      // Left Column
      hypotension: boolean | null;
      hypertension: boolean | null;
      pruritus: boolean | null;
      precordialPain: boolean | null;
      hypoglycemia: boolean | null;
      headache: boolean | null;
      // Right Column
      lumbalgia: boolean | null;
      cramps: boolean | null;
      nausea: boolean | null; // Nauseas / Vomitos
      pyrogenicCrisis: boolean | null;
      bacteremia: boolean | null;
      // Text
      treatment: string;
      other: string;
    };
    access: {
      fav: string; // 'autologa' | 'protesica'
      cvc: string; // 'permacath' | 'temporal'
      functionality: string; // 'funcional' | 'disfuncional'
      exam: string;
    };
    dialysisParams: {
      volemia: boolean | null; // Si/No (Adecuado?)
      anemia: boolean | null;
      nutrition: boolean | null;
      metabolism: boolean | null;
      lipids: boolean | null;
      ktv: boolean | null;
    };
    currentTreatment: {
      vitamins: string;
      epo: string;
      iron: string;
      carnitine: string;
      antihypertensives: string;
      others: string;
    };
    prescription: {
      time: string;
      filter: string;
      buffer: string; // Tampon
      sodium: string;
      qb: string;
      qd: string;
      dryWeight: string;
      anticoagulation: string;
      conductivity: string;
      ktvTarget: string;
      temperature: string;
    };
  }

  let { initialData = {}, onSave } = $props<{
    initialData?: Partial<FormState>;
    onSave: (data: FormState) => void;
  }>();

  let form = $state<FormState>({
    meta: {
      month: "",
      fileNumber: "", // Expediente
      doctorSignature: "",
    },
    patient: {
      name: "",
      admission: {
        active: null, // Si/No
        dateIn: "",
        dateOut: "",
      },
      diagnosis: "",
    },
    generalStatus: {
      transfusions: {
        active: null,
        count: "",
      },
      interdialyticGain: "",
      generalState: "",
      appetite: "",
      residualDiuresis: {
        active: null, // Si/No
        type: "", // 'Normal' or 'Disminuido'
      },
    },
    comorbidities: {
      // Left Column
      hypotension: null,
      hypertension: null,
      pruritus: null,
      precordialPain: null,
      hypoglycemia: null,
      headache: null,
      // Right Column
      lumbalgia: null,
      cramps: null,
      nausea: null, // Nauseas / Vomitos
      pyrogenicCrisis: null,
      bacteremia: null,
      // Text
      treatment: "",
      other: "",
    },
    access: {
      fav: "", // 'autologa' | 'protesica'
      cvc: "", // 'permacath' | 'temporal'
      functionality: "", // 'funcional' | 'disfuncional'
      exam: "",
    },
    dialysisParams: {
      volemia: null, // Si/No (Adecuado?)
      anemia: null,
      nutrition: null,
      metabolism: null,
      lipids: null,
      ktv: null,
    },
    currentTreatment: {
      vitamins: "",
      epo: "",
      iron: "",
      carnitine: "",
      antihypertensives: "",
      others: "",
    },
    prescription: {
      time: "",
      filter: "",
      buffer: "", // Tampon
      sodium: "",
      qb: "",
      qd: "",
      dryWeight: "",
      anticoagulation: "",
      conductivity: "",
      ktvTarget: "",
      temperature: "",
    },
    ...untrack(() => initialData),
  });

  $effect(() => {
    form = {
      meta: {
        month: "",
        fileNumber: "",
        doctorSignature: "",
        ...initialData.meta,
      },
      patient: {
        name: "",
        admission: {
          active: null,
          dateIn: "",
          dateOut: "",
          ...initialData.patient?.admission,
        },
        diagnosis: "",
        ...initialData.patient,
      },
      generalStatus: {
        transfusions: {
          active: null,
          count: "",
          ...initialData.generalStatus?.transfusions,
        },
        interdialyticGain: "",
        generalState: "",
        appetite: "",
        residualDiuresis: {
          active: null,
          type: "",
          ...initialData.generalStatus?.residualDiuresis,
        },
        ...initialData.generalStatus,
      },
      comorbidities: {
        hypotension: null,
        hypertension: null,
        pruritus: null,
        precordialPain: null,
        hypoglycemia: null,
        headache: null,
        lumbalgia: null,
        cramps: null,
        nausea: null,
        pyrogenicCrisis: null,
        bacteremia: null,
        treatment: "",
        other: "",
        ...initialData.comorbidities,
      },
      access: {
        fav: "",
        cvc: "",
        functionality: "",
        exam: "",
        ...initialData.access,
      },
      dialysisParams: {
        volemia: null,
        anemia: null,
        nutrition: null,
        metabolism: null,
        lipids: null,
        ktv: null,
        ...initialData.dialysisParams,
      },
      currentTreatment: {
        vitamins: "",
        epo: "",
        iron: "",
        carnitine: "",
        antihypertensives: "",
        others: "",
        ...initialData.currentTreatment,
      },
      prescription: {
        time: "",
        filter: "",
        buffer: "",
        sodium: "",
        qb: "",
        qd: "",
        dryWeight: "",
        anticoagulation: "",
        conductivity: "",
        ktvTarget: "",
        temperature: "",
        ...initialData.prescription,
      },
      // svelte-ignore state_referenced_locally
      ...initialData,
    };
  });
</script>

// --- SNIPPETS --- // A reusable Yes/No Toggle that mimics the box style //
{#snippet yesNo(
  label: string,
  value: boolean | null,
  setFn: (v: boolean) => void,
)}
  <div
    class="flex items-center justify-between text-xs py-2 border-b border-gray-100 last:border-0"
  >
    <span class="font-medium text-gray-700">{label}</span>
    <div class="flex gap-3">
      <label class="flex items-center gap-1 cursor-pointer">
        <span class="text-[10px]">SI</span>
        <input
          type="radio"
          name={label}
          checked={value === true}
          onclick={() => setFn(true)}
          class="form-checkbox h-4 w-4"
        />
      </label>
      <label class="flex items-center gap-1 cursor-pointer">
        <span class="text-[10px]">NO</span>
        <input
          type="radio"
          name={label}
          checked={value === false}
          onclick={() => setFn(false)}
          class="form-checkbox h-4 w-4"
        />
      </label>
    </div>
  </div>
{/snippet}

{#snippet lineInput(
  label: string,
  value: string,
  setValue: (v: string) => void,
)}
  <label class="flex flex-col gap-1 w-full">
    <span class="form-label text-xs">{label}</span>
    <input
      type="text"
      {value}
      oninput={(e) => setValue((e.currentTarget as HTMLInputElement).value)}
      class="form-input"
    />
  </label>
{/snippet}
<div class="form-container">
  <div class="form-save-btn">
    <button onclick={() => onSave(form)} class="form-btn-primary">
      Guardar
    </button>
  </div>

  <header class="form-header">
    <div>
      <h1 class="form-title">Evolución Mensual</h1>
    </div>
    <div class="text-right">
      <h2 class="text-lg font-bold text-gray-800">
        Diálisis de Honduras S.A. de C.V.
      </h2>
      <p class="text-xs font-bold text-gray-500">Desde 1999</p>
      <p class="form-subtitle">Brindando calidad de vida</p>
      {#if form.meta.updatedAt}
        <p class="text-[10px] text-gray-400 mt-1">
          Actualizado: {new Date(form.meta.updatedAt).toLocaleString()}
        </p>
      {/if}
    </div>
  </header>

  <div class="grid grid-cols-12 gap-6 mb-8 border-b border-gray-100 pb-8">
    <label class="col-span-12 md:col-span-6 block">
      <span class="form-label">Nombre</span>
      <input bind:value={form.patient.name} class="form-input" />
    </label>
    <label class="col-span-6 md:col-span-3 block">
      <span class="form-label">Mes</span>
      <input bind:value={form.meta.month} class="form-input" />
    </label>
    <label class="col-span-6 md:col-span-3 block">
      <span class="form-label">Expediente</span>
      <input bind:value={form.meta.fileNumber} class="form-input" />
    </label>

    <div class="col-span-12 md:col-span-5 flex flex-col gap-2">
      <span class="form-label">Ingresos</span>
      <div class="flex items-center gap-4 h-10">
        <label class="form-checkbox-label"
          ><input
            type="radio"
            bind:group={form.patient.admission.active}
            value={true}
            class="form-checkbox"
          /> SI</label
        >
        <label class="form-checkbox-label"
          ><input
            type="radio"
            bind:group={form.patient.admission.active}
            value={false}
            class="form-checkbox"
          /> NO</label
        >
      </div>
      <label class="mt-2 block">
        <span class="form-label">Fecha de Ingreso</span>
        <input
          type="date"
          bind:value={form.patient.admission.dateIn}
          class="form-input"
        />
      </label>
    </div>
    <label class="col-span-12 md:col-span-7 block">
      <span class="form-label">Fecha de Egreso</span>
      <input
        type="date"
        bind:value={form.patient.admission.dateOut}
        class="form-input"
      />
    </label>

    <label class="col-span-12 block">
      <span class="form-label">Diagnósticos</span>
      <input bind:value={form.patient.diagnosis} class="form-input" />
    </label>
  </div>

  <div class="grid grid-cols-12 gap-6 mb-8 border-b border-gray-100 pb-8">
    <div class="col-span-12 md:col-span-6">
      <label class="form-label"
        >Transfusiones <div class="flex items-center gap-4 mb-2">
          <label class="form-checkbox-label"
            ><input
              type="radio"
              bind:group={form.generalStatus.transfusions.active}
              value={true}
              class="form-checkbox"
            /> SI</label
          >
          <label class="form-checkbox-label"
            ><input
              type="radio"
              bind:group={form.generalStatus.transfusions.active}
              value={false}
              class="form-checkbox"
            /> NO</label
          >
        </div>
        <label class="block">
          <span class="form-label text-xs">Número</span>
          <input
            bind:value={form.generalStatus.transfusions.count}
            class="form-input w-24"
          />
        </label>
      </label>
    </div>
    <label class="col-span-12 md:col-span-6 block">
      <span class="form-label">Ganancias Promedio Interdiálisis</span>
      <input
        bind:value={form.generalStatus.interdialyticGain}
        class="form-input"
      />
    </label>

    <div class="col-span-12 md:col-span-6 grid grid-cols-2 gap-4">
      <label class="block">
        <span class="form-label">Estado General</span>
        <input
          bind:value={form.generalStatus.generalState}
          class="form-input"
        />
      </label>
      <label class="block">
        <span class="form-label">Apetito</span>
        <input bind:value={form.generalStatus.appetite} class="form-input" />
      </label>
    </div>

    <div class="col-span-12 md:col-span-6">
      <span class="form-label">Diuresis Residual</span>
      <div class="flex items-center gap-4 mb-2">
        <label class="form-checkbox-label"
          ><input
            type="radio"
            bind:group={form.generalStatus.residualDiuresis.active}
            value={true}
            class="form-checkbox"
          /> SI</label
        >
        <label class="form-checkbox-label"
          ><input
            type="radio"
            bind:group={form.generalStatus.residualDiuresis.active}
            value={false}
            class="form-checkbox"
          /> NO</label
        >
      </div>
      <div class="flex gap-4">
        <label class="flex items-center gap-2"
          ><input
            type="radio"
            bind:group={form.generalStatus.residualDiuresis.type}
            value="Normal"
            class="form-checkbox"
          /> Normal</label
        >
        <label class="flex items-center gap-2"
          ><input
            type="radio"
            bind:group={form.generalStatus.residualDiuresis.type}
            value="Disminuido"
            class="form-checkbox"
          /> Disminuido</label
        >
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-6 mb-8 border-b border-gray-100 pb-8">
    <div class="col-span-12 md:col-span-6">
      <h3 class="form-section-title mb-4">Comorbilidad Interdialftica</h3>
      <div class="space-y-2">
        {@render yesNo(
          "HIPOTENSIÓN ARTERIAL",
          form.comorbidities.hypotension,
          (v) => (form.comorbidities.hypotension = v),
        )}
        {@render yesNo(
          "HIPERTENSIÓN ARTERIAL",
          form.comorbidities.hypertension,
          (v) => (form.comorbidities.hypertension = v),
        )}
        {@render yesNo(
          "PRURITO",
          form.comorbidities.pruritus,
          (v) => (form.comorbidities.pruritus = v),
        )}
        {@render yesNo(
          "DOLOR PRECORDIAL",
          form.comorbidities.precordialPain,
          (v) => (form.comorbidities.precordialPain = v),
        )}
        {@render yesNo(
          "HIPOGLUCEMIA",
          form.comorbidities.hypoglycemia,
          (v) => (form.comorbidities.hypoglycemia = v),
        )}
        {@render yesNo(
          "CEFALEA",
          form.comorbidities.headache,
          (v) => (form.comorbidities.headache = v),
        )}
        {@render yesNo(
          "LUMBALGIA",
          form.comorbidities.lumbalgia,
          (v) => (form.comorbidities.lumbalgia = v),
        )}
        {@render yesNo(
          "CALAMBRES",
          form.comorbidities.cramps,
          (v) => (form.comorbidities.cramps = v),
        )}
        {@render yesNo(
          "NAUSEAS / VÓMITOS",
          form.comorbidities.nausea,
          (v) => (form.comorbidities.nausea = v),
        )}
        {@render yesNo(
          "CRISIS PIRÓGENAS",
          form.comorbidities.pyrogenicCrisis,
          (v) => (form.comorbidities.pyrogenicCrisis = v),
        )}
        {@render yesNo(
          "BACTEREMIA",
          form.comorbidities.bacteremia,
          (v) => (form.comorbidities.bacteremia = v),
        )}
      </div>

      <div class="mt-6 pt-4 border-t border-gray-100 space-y-4">
        <div>
          <label class="form-label"
            >Tratamiento <input
              bind:value={form.comorbidities.treatment}
              class="form-input"
            />
          </label>
        </div>
        <div>
          <label class="form-label"
            >Otros
            <input bind:value={form.comorbidities.other} class="form-input" />
          </label>
        </div>
      </div>
    </div>

    <div class="col-span-12 md:col-span-6">
      <h3 class="form-section-title mb-4">Acceso Vascular</h3>
      <div class="space-y-6">
        <div>
          <label class="form-label mb-2"
            >FAV
            <div class="grid grid-cols-2 gap-2">
              <label class="form-checkbox-label"
                ><input
                  type="radio"
                  bind:group={form.access.fav}
                  value="autologa"
                  class="form-checkbox"
                /> Autóloga</label
              >
              <label class="form-checkbox-label"
                ><input
                  type="radio"
                  bind:group={form.access.fav}
                  value="protesica"
                  class="form-checkbox"
                /> Protésica</label
              >
            </div>
          </label>
        </div>

        <div>
          <label class="form-label mb-2"
            >CVC <div class="grid grid-cols-2 gap-2">
              <label class="form-checkbox-label"
                ><input
                  type="radio"
                  bind:group={form.access.cvc}
                  value="permacath"
                  class="form-checkbox"
                /> Permacath</label
              >
              <label class="form-checkbox-label"
                ><input
                  type="radio"
                  bind:group={form.access.cvc}
                  value="temporal"
                  class="form-checkbox"
                /> Temporal</label
              >
            </div>
          </label>
        </div>

        <div>
          <label class="form-label mb-2"
            >Funcionamiento <div class="grid grid-cols-2 gap-2">
              <label class="form-checkbox-label"
                ><input
                  type="radio"
                  bind:group={form.access.functionality}
                  value="funcional"
                  class="form-checkbox"
                /> Funcional</label
              >
              <label class="form-checkbox-label"
                ><input
                  type="radio"
                  bind:group={form.access.functionality}
                  value="disfuncional"
                  class="form-checkbox"
                /> Disfuncional</label
              >
            </div>
          </label>
        </div>

        <div>
          <label class="form-label"
            >Examen Físico del Acceso Vascular
            <input bind:value={form.access.exam} class="form-input" />
          </label>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-6 mb-8 border-b border-gray-100 pb-8">
    <div class="col-span-12 md:col-span-6">
      <h3 class="form-section-title mb-4">Parámetros de Diálisis</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2 border-r border-gray-100 pr-4">
          {@render yesNo(
            "CONTROL DE VOLEMMIA: Adecuado?",
            form.dialysisParams.volemia,
            (v) => (form.dialysisParams.volemia = v),
          )}
          {@render yesNo(
            "CONTROL DE ANEMIA: Adecuado?",
            form.dialysisParams.anemia,
            (v) => (form.dialysisParams.anemia = v),
          )}
          {@render yesNo(
            "ESTADO NUTRICIONAL: Adecuado?",
            form.dialysisParams.nutrition,
            (v) => (form.dialysisParams.nutrition = v),
          )}
        </div>
        <div class="space-y-2">
          {@render yesNo(
            "METABOLISMO P/Ca: Adecuado?",
            form.dialysisParams.metabolism,
            (v) => (form.dialysisParams.metabolism = v),
          )}
          {@render yesNo(
            "PERFIL LÍPIDO: Adecuado?",
            form.dialysisParams.lipids,
            (v) => (form.dialysisParams.lipids = v),
          )}
          {@render yesNo(
            "KT/V: Adecuado?",
            form.dialysisParams.ktv,
            (v) => (form.dialysisParams.ktv = v),
          )}
        </div>
      </div>
    </div>

    <div class="col-span-12 md:col-span-6">
      <h3 class="form-section-title mb-4">Tratamiento Actual</h3>
      <div class="grid grid-cols-2 gap-4">
        {@render lineInput(
          "VITAMINAS",
          form.currentTreatment.vitamins,
          (v) => (form.currentTreatment.vitamins = v),
        )}
        {@render lineInput(
          "EPO",
          form.currentTreatment.epo,
          (v) => (form.currentTreatment.epo = v),
        )}
        {@render lineInput(
          "HIERRO IV",
          form.currentTreatment.iron,
          (v) => (form.currentTreatment.iron = v),
        )}
        {@render lineInput(
          "LEVOCARNITINA",
          form.currentTreatment.carnitine,
          (v) => (form.currentTreatment.carnitine = v),
        )}
        {@render lineInput(
          "ANTIHIPERTENSIVOS",
          form.currentTreatment.antihypertensives,
          (v) => (form.currentTreatment.antihypertensives = v),
        )}
        {@render lineInput(
          "OTROS",
          form.currentTreatment.others,
          (v) => (form.currentTreatment.others = v),
        )}
      </div>
    </div>
  </div>

  <div class="mb-8">
    <h3 class="form-section-title mb-4">Prescripción de Hemodiálisis</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-4">
        {@render lineInput(
          "TIEMPO",
          form.prescription.time,
          (v) => (form.prescription.time = v),
        )}
        {@render lineInput(
          "FILTRO",
          form.prescription.filter,
          (v) => (form.prescription.filter = v),
        )}
        {@render lineInput(
          "TAMPON",
          form.prescription.buffer,
          (v) => (form.prescription.buffer = v),
        )}
        {@render lineInput(
          "SODIO",
          form.prescription.sodium,
          (v) => (form.prescription.sodium = v),
        )}
        <div class="flex items-end gap-2">
          <label class="form-label mb-0 w-12"
            >Qb
            <input
              bind:value={form.prescription.qb}
              class="form-input flex-1"
            />
            <span class="text-xs text-gray-500 mb-2">ml/min</span>
          </label>
        </div>
        <div class="flex items-end gap-2">
          <label class="form-label mb-0 w-12"
            >Qd
            <input
              bind:value={form.prescription.qd}
              class="form-input flex-1"
            />
            <span class="text-xs text-gray-500 mb-2">ml/min</span>
          </label>
        </div>
      </div>

      <div class="space-y-4">
        {@render lineInput(
          "PESO SECO",
          form.prescription.dryWeight,
          (v) => (form.prescription.dryWeight = v),
        )}
        {@render lineInput(
          "ANTIGUAGULACIÓN",
          form.prescription.anticoagulation,
          (v) => (form.prescription.anticoagulation = v),
        )}
        {@render lineInput(
          "CONDUCTIVIDAD",
          form.prescription.conductivity,
          (v) => (form.prescription.conductivity = v),
        )}
        {@render lineInput(
          "KT/V (t) (1.4)",
          form.prescription.ktvTarget,
          (v) => (form.prescription.ktvTarget = v),
        )}
        {@render lineInput(
          "TEMPERATURA",
          form.prescription.temperature,
          (v) => (form.prescription.temperature = v),
        )}
      </div>
    </div>
  </div>

  <div class="mt-12 text-center border-t border-gray-100 pt-8">
    <div class="inline-block border-t border-black px-12 pt-2">
      <p class="text-sm font-bold uppercase text-gray-700">
        Firma y Sello Médico
      </p>
    </div>
  </div>
</div>
