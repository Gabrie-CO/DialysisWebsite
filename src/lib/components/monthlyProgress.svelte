<script>
  let form = $state({
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
  });
</script>


{#snippet yesNo(label, value, setFn)}
  <div
    class="flex items-center justify-between text-xs py-1 border-b border-gray-100 last:border-0"
  >
    <span class="font-semibold text-gray-700">{label}</span>
    <div class="flex gap-2">
      <label class="flex items-center gap-1 cursor-pointer">
        <span class="text-[10px]">SI</span>
        <input
          type="radio"
          name={label}
          checked={value === true}
          onclick={() => setFn(true)}
          class="accent-blue-800"
        />
      </label>
      <label class="flex items-center gap-1 cursor-pointer">
        <span class="text-[10px]">NO</span>
        <input
          type="radio"
          name={label}
          checked={value === false}
          onclick={() => setFn(false)}
          class="accent-blue-800"
        />
      </label>
    </div>
  </div>
{/snippet}

// Simple Line Input
{#snippet lineInput(label, value, setValue)}
  <div class="flex items-center gap-2 w-full">
    <span class="font-bold text-xs whitespace-nowrap">{label}:</span>
    <input
      type="text"
      {value}
      oninput={(e) => setValue(e.target.value)}
      class="w-full border-b border-gray-400 focus:border-blue-600 outline-none text-sm bg-transparent"
    />
  </div>
{/snippet}

<div
  class="max-w-4xl mx-auto bg-white p-6 shadow-xl border border-gray-200 font-sans text-gray-800 print:shadow-none print:max-w-none"
>
  <header
    class="flex justify-between items-center border-b-2 border-black pb-2 mb-4"
  >
    <div>
      <h1 class="text-xl font-bold uppercase tracking-wide">
        Evolución Mensual
      </h1>
    </div>
    <div class="text-right">
      <h2 class="text-lg font-bold text-blue-900">
        Diálisis de Honduras S.A. de C.V.
      </h2>
      <p class="text-xs font-bold text-gray-500">Desde 1999</p>
      <p class="text-xs uppercase tracking-widest">Brindando calidad de vida</p>
    </div>
  </header>

  <div
    class="grid grid-cols-12 gap-x-4 gap-y-2 text-xs mb-2 border-b border-black pb-2"
  >
    <div class="col-span-6 flex gap-2">
      <span class="font-bold">NOMBRE:</span>
      <input
        bind:value={form.patient.name}
        class="flex-1 border-b border-gray-400 outline-none"
      />
    </div>
    <div class="col-span-3 flex gap-2">
      <span class="font-bold">MES:</span>
      <input
        bind:value={form.meta.month}
        class="flex-1 border-b border-gray-400 outline-none"
      />
    </div>
    <div class="col-span-3 flex gap-2">
      <span class="font-bold">EXPEDIENTE:</span>
      <input
        bind:value={form.meta.fileNumber}
        class="flex-1 border-b border-gray-400 outline-none"
      />
    </div>

    <div class="col-span-5 flex items-center gap-2">
      <span class="font-bold">INGRESOS:</span>
      <label class="flex gap-1"
        ><input
          type="radio"
          bind:group={form.patient.admission.active}
          value={true}
        /> SI</label
      >
      <label class="flex gap-1"
        ><input
          type="radio"
          bind:group={form.patient.admission.active}
          value={false}
        /> NO</label
      >
      <span class="font-bold ml-2">FECHA DE INGRESO:</span>
      <input
        type="date"
        bind:value={form.patient.admission.dateIn}
        class="border-b border-gray-400 outline-none w-24"
      />
    </div>
    <div class="col-span-7 flex gap-2">
      <span class="font-bold">FECHA DE EGRESO:</span>
      <input
        type="date"
        bind:value={form.patient.admission.dateOut}
        class="flex-1 border-b border-gray-400 outline-none"
      />
    </div>

    <div class="col-span-12 flex gap-2">
      <span class="font-bold">DIAGNOSTICOS:</span>
      <input
        bind:value={form.patient.diagnosis}
        class="flex-1 border-b border-gray-400 outline-none"
      />
    </div>
  </div>

  <div
    class="grid grid-cols-12 gap-x-4 gap-y-2 text-xs mb-2 border-b border-black pb-2"
  >
    <div class="col-span-6 flex items-center gap-2">
      <span class="font-bold">TRANSFUSIONES:</span>
      <label class="flex gap-1"
        ><input
          type="radio"
          bind:group={form.generalStatus.transfusions.active}
          value={true}
        /> SI</label
      >
      <label class="flex gap-1"
        ><input
          type="radio"
          bind:group={form.generalStatus.transfusions.active}
          value={false}
        /> NO</label
      >
      <span class="font-bold ml-2">NÚMERO:</span>
      <input
        bind:value={form.generalStatus.transfusions.count}
        class="w-16 border-b border-gray-400 outline-none"
      />
    </div>
    <div class="col-span-6"></div>
    <div class="col-span-7 flex gap-2">
      <span class="font-bold">GANANCIAS PROMEDIO INTERDIÁLISIS:</span>
      <input
        bind:value={form.generalStatus.interdialyticGain}
        class="flex-1 border-b border-gray-400 outline-none"
      />
    </div>
    <div class="col-span-5 flex items-center gap-2 justify-end">
      <span class="font-bold">DIURESIS RESIDUAL:</span>
      <label class="flex gap-1"
        ><input
          type="radio"
          bind:group={form.generalStatus.residualDiuresis.active}
          value={true}
        /> SI</label
      >
      <label class="flex gap-1"
        ><input
          type="radio"
          bind:group={form.generalStatus.residualDiuresis.active}
          value={false}
        /> NO</label
      >
    </div>

    <div class="col-span-7 flex gap-2">
      <span class="font-bold">ESTADO GENERAL:</span>
      <input
        bind:value={form.generalStatus.generalState}
        class="flex-1 border-b border-gray-400 outline-none"
      />
      <span class="font-bold">APETITO:</span>
      <input
        bind:value={form.generalStatus.appetite}
        class="w-24 border-b border-gray-400 outline-none"
      />
    </div>
    <div class="col-span-5 flex items-center gap-4 justify-end">
      <label class="flex gap-1"
        ><input
          type="radio"
          bind:group={form.generalStatus.residualDiuresis.type}
          value="Normal"
        /> NORMAL</label
      >
      <label class="flex gap-1"
        ><input
          type="radio"
          bind:group={form.generalStatus.residualDiuresis.type}
          value="Disminuido"
        /> DISMINUIDO</label
      >
    </div>
  </div>

  <div class="border border-black mb-2">
    <div
      class="bg-gray-200 text-center text-xs font-bold border-b border-black"
    >
      COMORBILIDAD INTERDIALITICA
    </div>
    <div class="grid grid-cols-2 text-xs">
      <div class="border-r border-black p-1 space-y-1">
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
      </div>
      <div class="p-1 space-y-1">
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
    </div>
    <div class="border-t border-black p-2 text-xs space-y-2">
      <div class="flex gap-2">
        <span class="font-bold">TRATAMIENTO:</span>
        <input
          bind:value={form.comorbidities.treatment}
          class="flex-1 border-b border-gray-400 outline-none"
        />
      </div>
      <div class="flex gap-2">
        <span class="font-bold">OTROS:</span>
        <input
          bind:value={form.comorbidities.other}
          class="flex-1 border-b border-gray-400 outline-none"
        />
      </div>
    </div>
  </div>

  <div class="border-b border-black pb-2 mb-2 text-xs">
    <div class="grid grid-cols-12 gap-2 mb-1">
      <div class="col-span-2 font-bold pt-1">ACCESO VASCULAR:</div>

      <div class="col-span-5 grid grid-cols-2 gap-2">
        <span class="font-bold">FAV:</span>
        <div class="flex flex-col">
          <label class="flex justify-between items-center"
            >Autóloga <input
              type="radio"
              bind:group={form.access.fav}
              value="autologa"
              class="ml-2"
            /></label
          >
          <label class="flex justify-between items-center"
            >Protésica <input
              type="radio"
              bind:group={form.access.fav}
              value="protesica"
              class="ml-2"
            /></label
          >
        </div>
      </div>

      <div class="col-span-5 grid grid-cols-2 gap-2">
        <span class="font-bold">CVC:</span>
        <div class="flex flex-col">
          <label class="flex justify-between items-center"
            >Permacath <input
              type="radio"
              bind:group={form.access.cvc}
              value="permacath"
              class="ml-2"
            /></label
          >
          <label class="flex justify-between items-center"
            >Temporal <input
              type="radio"
              bind:group={form.access.cvc}
              value="temporal"
              class="ml-2"
            /></label
          >
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4 mb-2">
      <span class="font-bold">FUNCIONAMIENTO:</span>
      <label class="flex items-center gap-1"
        >Funcional <input
          type="radio"
          bind:group={form.access.functionality}
          value="funcional"
          class="border border-black"
        /></label
      >
      <label class="flex items-center gap-1"
        >Disfuncional <input
          type="radio"
          bind:group={form.access.functionality}
          value="disfuncional"
          class="border border-black"
        /></label
      >
    </div>

    <div class="flex gap-2">
      <span class="font-bold">EXAMEN FISICO DEL ACCESO VASCULAR:</span>
      <input
        bind:value={form.access.exam}
        class="flex-1 border-b border-gray-400 outline-none"
      />
    </div>
  </div>

  <div class="border border-black mb-2">
    <div
      class="bg-gray-200 text-center text-xs font-bold border-b border-black"
    >
      PARAMETROS DE DIALISIS
    </div>
    <div class="grid grid-cols-2 text-xs">
      <div class="border-r border-black p-1 space-y-1">
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
      <div class="p-1 space-y-1">
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

  <div class="border-t border-black pt-1 mb-2">
    <div
      class="bg-gray-200 text-center text-xs font-bold border-y border-black mb-1"
    >
      TRATAMIENTO ACTUAL
    </div>
    <div class="space-y-1 text-xs">
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

  <div class="border-t border-black pt-1 mb-4">
    <div
      class="bg-gray-200 text-center text-xs font-bold border-y border-black mb-2"
    >
      PRESCRIPCIÓN DE HEMODIÁLISIS
    </div>
    <div class="grid grid-cols-2 gap-8 text-xs">
      <div class="space-y-1">
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
          <span class="font-bold w-12">Qb:</span>
          <input
            bind:value={form.prescription.qb}
            class="flex-1 border-b border-gray-400 outline-none"
          />
          <span class="text-gray-500">ml/min</span>
        </div>
        <div class="flex items-end gap-2">
          <span class="font-bold w-12">Qd:</span>
          <input
            bind:value={form.prescription.qd}
            class="flex-1 border-b border-gray-400 outline-none"
          />
          <span class="text-gray-500">ml/min</span>
        </div>
      </div>

      <div class="space-y-1">
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

  <div class="mt-16 text-center">
    <div class="inline-block border-t border-black px-12 pt-2">
      <p class="text-sm font-bold">FIRMA Y SELLO MÉDICO</p>
    </div>
  </div>
</div>
