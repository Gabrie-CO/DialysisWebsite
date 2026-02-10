<script lang="ts">
  // --- TYPES ---
  interface FormState {
    // Header
    exp: string;
    date: string;
    startDateHD: string;

    // Demographics
    name: string;
    age: string;
    sex: string;
    civilStatus: string;
    occupation: string;
    birthPlace: string;
    birthDate: string;
    residence: string;
    phone: string;

    // Etiology (ERC-5)
    etiology: {
      diabetes: boolean;
      glomerulonephritis: boolean;
      hypertension: boolean;
      primaryGlomerulo: boolean;
      ischemic: boolean;
      lupus: boolean;
      mesoamerican: boolean;
      erpad: boolean; // Enfermedad Renal Poliquistica? (Acronym from form)
      undetermined: boolean;
      obstructive: boolean;
      prostatic: boolean;
      nephrolithiasis: boolean;
      preeclampsia: boolean;
      other: boolean;
      otherText: string;
    };

    // Dialysis Dosing
    frequency: string;
    sessionTime: string;
    membrane: string;
    anticoagulation: string;
    dryWeight: string;
    heparinDose: string; // 'a estimar 10ml/kg/hra' check or value? The form implies a value or check. I'll use text.

    // Vascular Access
    access: {
      tempCatheter: boolean;
      tunneledCatheter: boolean;
      fav: boolean;
      observation: string;
    };

    // Viral Panel
    viral: {
      hbsag: string;
      acvhc: string;
      vih: string;
      updated: boolean | null; // Si/No
    };

    // History Text Blocks
    currentIllness: string;
    personalPathology: string;
    familyHistory: string;
    surgicalHistory: string;

    // Physical Exam
    exam: {
      mucosas: string;
      tcs: string;
      respiratory: string;
      fr: string;
      cardiovascular: string;
      ta: string; // Blood pressure
      fc: string; // Heart rate
      abdomen: string;
      snc: string;
      residualRenal: string;
      cc: string; // quantity
    };

    // Pharmacology
    meds: {
      erythropoietin: string;
      caco3: string;
      ferrousSulfate: string;
      folicAcid: string;
      other: string;
    };
    observations: string;

    // Labs
    labs: {
      hb: string;
      hto: string;
      leuco: string;
      plaq: string;
      na: string;
      k: string;
      calcio: string;
      fosforo: string;
      productoPC: string;
      pth: string;
      albumina: string;
      glucosa: string;
    };
    updatedAt?: string;
  }

  let { initialData = {}, onSave } = $props<{
    initialData?: Partial<FormState>;
    onSave: (data: FormState) => void;
  }>();

  // --- STATE ---
  let form = $state<FormState>({
    exp: "",
    date: "",
    startDateHD: "",
    name: "",
    age: "",
    sex: "",
    civilStatus: "",
    occupation: "",
    birthPlace: "",
    birthDate: "",
    residence: "",
    phone: "",
    etiology: {
      diabetes: false,
      glomerulonephritis: false,
      hypertension: false,
      primaryGlomerulo: false,
      ischemic: false,
      lupus: false,
      mesoamerican: false,
      erpad: false,
      undetermined: false,
      obstructive: false,
      prostatic: false,
      nephrolithiasis: false,
      preeclampsia: false,
      other: false,
      otherText: "",
    },
    frequency: "",
    sessionTime: "",
    membrane: "",
    anticoagulation: "",
    dryWeight: "",
    heparinDose: "",
    access: {
      tempCatheter: false,
      tunneledCatheter: false,
      fav: false,
      observation: "",
    },
    viral: { hbsag: "", acvhc: "", vih: "", updated: null },
    currentIllness: "",
    personalPathology: "",
    familyHistory: "",
    surgicalHistory: "",
    exam: {
      mucosas: "",
      tcs: "",
      respiratory: "",
      fr: "",
      cardiovascular: "",
      ta: "",
      fc: "",
      abdomen: "",
      snc: "",
      residualRenal: "",
      cc: "",
    },
    meds: {
      erythropoietin: "",
      caco3: "",
      ferrousSulfate: "",
      folicAcid: "",
      other: "",
    },
    observations: "",
    labs: {
      hb: "",
      hto: "",
      leuco: "",
      plaq: "",
      na: "",
      k: "",
      calcio: "",
      fosforo: "",
      productoPC: "",
      pth: "",
      albumina: "",
      glucosa: "",
    },
    ...initialData,
  });

  $effect(() => {
    form = {
      exp: "",
      date: "",
      startDateHD: "",
      name: "",
      age: "",
      sex: "",
      civilStatus: "",
      occupation: "",
      birthPlace: "",
      birthDate: "",
      residence: "",
      phone: "",
      etiology: {
        diabetes: false,
        glomerulonephritis: false,
        hypertension: false,
        primaryGlomerulo: false,
        ischemic: false,
        lupus: false,
        mesoamerican: false,
        erpad: false,
        undetermined: false,
        obstructive: false,
        prostatic: false,
        nephrolithiasis: false,
        preeclampsia: false,
        other: false,
        otherText: "",
      },
      frequency: "",
      sessionTime: "",
      membrane: "",
      anticoagulation: "",
      dryWeight: "",
      heparinDose: "",
      access: {
        tempCatheter: false,
        tunneledCatheter: false,
        fav: false,
        observation: "",
      },
      viral: { hbsag: "", acvhc: "", vih: "", updated: null },
      currentIllness: "",
      personalPathology: "",
      familyHistory: "",
      surgicalHistory: "",
      exam: {
        mucosas: "",
        tcs: "",
        respiratory: "",
        fr: "",
        cardiovascular: "",
        ta: "",
        fc: "",
        abdomen: "",
        snc: "",
        residualRenal: "",
        cc: "",
      },
      meds: {
        erythropoietin: "",
        caco3: "",
        ferrousSulfate: "",
        folicAcid: "",
        other: "",
      },
      observations: "",
      labs: {
        hb: "",
        hto: "",
        leuco: "",
        plaq: "",
        na: "",
        k: "",
        calcio: "",
        fosforo: "",
        productoPC: "",
        pth: "",
        albumina: "",
        glucosa: "",
      },
      ...initialData,
    };
  });

  function handleSave() {
    onSave(form);
  }
</script>

{#snippet lineInput(
  label: string,
  value: string,
  update: (v: string) => void,
  widthClass: string = "w-full",
  labelClass: string = "font-bold text-xs uppercase whitespace-nowrap",
)}
  <div class={`flex items-end gap-1 ${widthClass}`}>
    {#if label}
      <span class={labelClass}>{label}:</span>
    {/if}
    <input
      type="text"
      {value}
      oninput={(e) => update((e.currentTarget as HTMLInputElement).value)}
      class="form-input-line text-blue-900 pb-0"
    />
  </div>
{/snippet}

{#snippet checkbox(
  label: string,
  checked: boolean,
  onChange: (v: boolean) => void,
)}
  <label class="flex items-center gap-1 cursor-pointer">
    <span class="text-[10px] leading-tight font-bold text-gray-800"
      >{label}</span
    >
    <input
      type="checkbox"
      {checked}
      onchange={(e) => onChange(e.currentTarget.checked)}
      class="w-4 h-4 border border-black appearance-none checked:bg-gray-800 shrink-0"
    />
  </label>
{/snippet}

{#snippet sectionHeader(title: string)}
  <div class="mt-4 mb-1">
    <h3 class="font-bold text-sm uppercase text-gray-700">{title}</h3>
    <div class="h-px bg-gray-400 w-full"></div>
  </div>
{/snippet}
{#snippet linedText(
  value: string,
  update: (v: string) => void,
  rows: number = 3,
)}
  <div class="w-full relative mt-1" style={`height: ${rows * 24}px`}>
    <textarea
      {value}
      oninput={(e) => update((e.currentTarget as HTMLTextAreaElement).value)}
      class="w-full h-full bg-transparent outline-none resize-none text-sm leading-6 text-blue-900"
      style="background-image: repeating-linear-gradient(transparent, transparent 23px, #9ca3af 23px, #9ca3af 24px); line-height: 24px; padding-top: 2px;"
    ></textarea>
  </div>
{/snippet}
<div class="form-container-wide">
  <div class="form-save-btn">
    <button onclick={() => onSave(form)} class="w-full h-full">
      Guardar
    </button>
  </div>

  <header
    class="form-header flex-col items-center text-center border-b-2 border-black pb-4"
  >
    <h1 class="form-title scale-x-110 mb-2">Diálisis de Honduras S.A.</h1>
    <div class="w-2/3 mx-auto border-t border-black my-1"></div>
    <p class="form-subtitle mb-4">Brindando calidad de vida</p>

    <h2
      class="text-xl font-bold font-serif uppercase underline decoration-double underline-offset-4 text-blue-900"
    >
      Historia Clinica
    </h2>
    {#if form.updatedAt}
      <p class="text-[10px] text-gray-400 mt-1">
        Actualizado: {new Date(form.updatedAt).toLocaleString()}
      </p>
    {/if}

    <div class="flex justify-center gap-12 mt-4 text-sm font-bold w-full">
      <div class="flex items-end gap-2 w-48">
        <span>Exp.</span>
        <input
          bind:value={form.exp}
          class="form-input-line text-center border-black border-dashed"
        />
      </div>
      <div class="flex items-end gap-2 w-48">
        <span>Fecha:</span>
        <input
          type="date"
          bind:value={form.date}
          class="form-input-line text-center border-black"
        />
      </div>
    </div>
    <div class="flex justify-end mt-2 w-full">
      <div class="flex items-end gap-2 w-64 text-xs font-bold">
        <span>FECHA DE INICIO DE 1ra. HD:</span>
        <input
          type="date"
          bind:value={form.startDateHD}
          class="form-input-line flex-1 border-black"
        />
      </div>
    </div>
  </header>

  <div class="grid grid-cols-12 gap-x-4 gap-y-2 mb-6">
    <div class="col-span-8">
      {@render lineInput("NOMBRE", form.name, (v) => (form.name = v))}
    </div>
    <div class="col-span-4">
      {@render lineInput("SEXO", form.sex, (v) => (form.sex = v))}
    </div>

    <div class="col-span-2">
      {@render lineInput("EDAD", form.age, (v) => (form.age = v))}
    </div>
    <div class="col-span-5">
      {@render lineInput(
        "ESTADO CIVIL",
        form.civilStatus,
        (v) => (form.civilStatus = v),
      )}
    </div>
    <div class="col-span-5">
      {@render lineInput(
        "OCUPACION",
        form.occupation,
        (v) => (form.occupation = v),
      )}
    </div>

    <div class="col-span-6">
      {@render lineInput(
        "LUGAR DE NACIMIENTO",
        form.birthPlace,
        (v) => (form.birthPlace = v),
      )}
    </div>
    <div class="col-span-6">
      {@render lineInput(
        "FECHA DE NACIMIENTO",
        form.birthDate,
        (v) => (form.birthDate = v),
      )}
    </div>

    <div class="col-span-8">
      {@render lineInput(
        "LUGAR DE RESIDENCIA",
        form.residence,
        (v) => (form.residence = v),
      )}
    </div>
    <div class="col-span-4">
      {@render lineInput("TELEFONO", form.phone, (v) => (form.phone = v))}
    </div>
  </div>

  <div class="border-t border-black pt-2 mb-4">
    <h3 class="text-center font-bold uppercase text-sm">ERC-5</h3>
    <h4 class="text-center font-bold uppercase text-xs mb-2">
      Etiologia Asociada
    </h4>

    <div class="grid grid-cols-3 gap-x-4 gap-y-1">
      {@render checkbox(
        "Enfermedad Glomerular Diabética",
        form.etiology.diabetes,
        (v) => (form.etiology.diabetes = v),
      )}
      {@render checkbox(
        "Glumerulonefritis",
        form.etiology.glomerulonephritis,
        (v) => (form.etiology.glomerulonephritis = v),
      )}
      {@render checkbox(
        "Nefropatía Hipertensiva",
        form.etiology.hypertension,
        (v) => (form.etiology.hypertension = v),
      )}

      {@render checkbox(
        "Glomerulopatia Primaria Con Hipertensión",
        form.etiology.primaryGlomerulo,
        (v) => (form.etiology.primaryGlomerulo = v),
      )}
      <div class="col-span-2">
        {@render checkbox(
          "Enfermedad Renal Vascular Isquémica",
          form.etiology.ischemic,
          (v) => (form.etiology.ischemic = v),
        )}
      </div>

      {@render checkbox(
        "Nefropatía Lupica",
        form.etiology.lupus,
        (v) => (form.etiology.lupus = v),
      )}
      {@render checkbox(
        "Nefropatía Mesoamericana",
        form.etiology.mesoamerican,
        (v) => (form.etiology.mesoamerican = v),
      )}
      <div class="flex gap-4">
        {@render checkbox(
          "ERPAD",
          form.etiology.erpad,
          (v) => (form.etiology.erpad = v),
        )}
        {@render checkbox(
          "Etiología No Determinada",
          form.etiology.undetermined,
          (v) => (form.etiology.undetermined = v),
        )}
      </div>

      {@render checkbox(
        "Nefropatía Obstructiva",
        form.etiology.obstructive,
        (v) => (form.etiology.obstructive = v),
      )}
      {@render checkbox(
        "Hiperplasia Prostática Benigna",
        form.etiology.prostatic,
        (v) => (form.etiology.prostatic = v),
      )}
      <div class="flex gap-4">
        {@render checkbox(
          "Nefrolitiasis",
          form.etiology.nephrolithiasis,
          (v) => (form.etiology.nephrolithiasis = v),
        )}
        {@render checkbox(
          "Preclampsia",
          form.etiology.preeclampsia,
          (v) => (form.etiology.preeclampsia = v),
        )}
      </div>

      <div class="col-span-3 flex items-center gap-2">
        {@render checkbox(
          "Otra",
          form.etiology.other,
          (v) => (form.etiology.other = v),
        )}
        <input
          bind:value={form.etiology.otherText}
          class="border-b border-black w-full"
          disabled={!form.etiology.other}
        />
      </div>
    </div>
  </div>

  <div class="mb-4">
    <h3 class="font-bold italic text-sm mb-1">Dosis de Hemodiálisis:</h3>
    <div class="grid grid-cols-12 gap-x-4 gap-y-2">
      <div class="col-span-5">
        {@render lineInput(
          "Frecuencia Semanal",
          form.frequency,
          (v) => (form.frequency = v),
          "w-full",
          "italic text-sm text-gray-700",
        )}
      </div>
      <div class="col-span-3">
        {@render lineInput(
          "v/s. Tiempo Sesión",
          form.sessionTime,
          (v) => (form.sessionTime = v),
          "w-full",
          "italic text-sm text-gray-700",
        )}
      </div>
      <div class="col-span-1 italic text-sm self-end">hrs</div>
      <div class="col-span-3">
        {@render lineInput(
          "Membrana",
          form.membrane,
          (v) => (form.membrane = v),
          "w-full",
          "italic text-sm text-gray-700",
        )}
      </div>

      <div class="col-span-6">
        {@render lineInput(
          "Anticoagulación con Heparina",
          form.anticoagulation,
          (v) => (form.anticoagulation = v),
          "w-full",
          "italic text-sm text-gray-700",
        )}
      </div>
      <div class="col-span-1 italic text-sm self-end">u</div>

      <div class="col-span-6 flex items-end gap-2">
        <span class="italic text-sm text-gray-700 font-bold whitespace-nowrap"
          >Peso Seco Estimado (</span
        >
        <input
          bind:value={form.dryWeight}
          class="w-16 border-b border-black text-center outline-none"
        />
        <span class="italic text-sm text-gray-700 font-bold">) Kg</span>

        <span class="italic text-sm text-gray-700 ml-4 whitespace-nowrap"
          >a estimar 10ml/kg/hra.</span
        >
        <input
          type="checkbox"
          checked={form.heparinDose === "checked"}
          onchange={(e) =>
            (form.heparinDose = e.currentTarget.checked ? "checked" : "")}
          class="w-4 h-4 border border-black ml-2"
        />
      </div>
    </div>
  </div>

  <div class="flex items-center gap-4 mb-2 bg-gray-50 p-1">
    <span class="font-bold italic text-sm text-gray-700">Acceso Vascular:</span>
    {@render checkbox(
      "Cat. Temporal",
      form.access.tempCatheter,
      (v) => (form.access.tempCatheter = v),
    )}
    {@render checkbox(
      "Cat. Tunelizado",
      form.access.tunneledCatheter,
      (v) => (form.access.tunneledCatheter = v),
    )}
    {@render checkbox("FAV", form.access.fav, (v) => (form.access.fav = v))}
    {@render lineInput(
      "Observacion",
      form.access.observation,
      (v) => (form.access.observation = v),
      "flex-1",
      "italic text-sm text-gray-700 font-bold",
    )}
  </div>

  <div
    class="flex items-center gap-2 mb-4 text-sm font-bold italic text-gray-700 bg-gray-100 p-2"
  >
    <span>Panel Viral:</span>

    <span>HBsAg (</span>
    <input
      bind:value={form.viral.hbsag}
      class="w-8 text-center border-b border-gray-400 bg-transparent"
    />
    <span>)</span>

    <span class="ml-4">Ac VHC (</span>
    <input
      bind:value={form.viral.acvhc}
      class="w-8 text-center border-b border-gray-400 bg-transparent"
    />
    <span>)</span>

    <span class="ml-4">VIH (</span>
    <input
      bind:value={form.viral.vih}
      class="w-8 text-center border-b border-gray-400 bg-transparent"
    />
    <span>)</span>

    <span class="ml-8 uppercase not-italic">Actualizado</span>
    <label class="flex items-center gap-1"
      ><input
        type="radio"
        checked={form.viral.updated === true}
        onclick={() => (form.viral.updated = true)}
      /> SI</label
    >
    <label class="flex items-center gap-1"
      ><input
        type="radio"
        checked={form.viral.updated === false}
        onclick={() => (form.viral.updated = false)}
      /> NO</label
    >
  </div>

  <div class="mb-8">
    <h3 class="font-bold uppercase text-sm text-gray-700">
      Historia de la Enfermedad Actual:
    </h3>
    {@render linedText(
      form.currentIllness,
      (v) => (form.currentIllness = v),
      6,
    )}
  </div>

  <div class="border-t-4 border-double border-gray-300 my-8"></div>

  <div class="space-y-4 mb-6">
    <div>
      {@render sectionHeader("Antecedentes Patologicos Personales:")}
      {@render linedText(
        form.personalPathology,
        (v) => (form.personalPathology = v),
        3,
      )}
    </div>
    <div>
      {@render sectionHeader("Antecedentes Familiares:")}
      {@render linedText(
        form.familyHistory,
        (v) => (form.familyHistory = v),
        2,
      )}
    </div>
    <div>
      {@render sectionHeader("Antecedentes Quirurgicos:")}
      {@render linedText(
        form.surgicalHistory,
        (v) => (form.surgicalHistory = v),
        2,
      )}
    </div>
  </div>

  <div class="mb-6">
    {@render sectionHeader("Examen Fisico:")}

    <div class="grid grid-cols-12 gap-x-4 gap-y-1 items-end mt-2">
      <div class="col-span-8">
        {@render lineInput(
          "MUCOSAS",
          form.exam.mucosas,
          (v) => (form.exam.mucosas = v),
        )}
      </div>
      <div class="col-span-4">
        {@render lineInput("TCS", form.exam.tcs, (v) => (form.exam.tcs = v))}
      </div>

      <div class="col-span-8">
        {@render lineInput(
          "V/RESPIRATORIO",
          form.exam.respiratory,
          (v) => (form.exam.respiratory = v),
        )}
      </div>
      <div class="col-span-4 flex items-end gap-2">
        <span class="font-bold text-xs">FR:</span>
        <input
          bind:value={form.exam.fr}
          class="w-16 border-b border-black text-center"
        />
        <span class="text-xs">por min.</span>
      </div>

      <div class="col-span-6">
        {@render lineInput(
          "A/CARDIOVASCULAR",
          form.exam.cardiovascular,
          (v) => (form.exam.cardiovascular = v),
        )}
      </div>
      <div class="col-span-3 flex items-end gap-2">
        <span class="font-bold text-xs">TA:</span>
        <input
          bind:value={form.exam.ta}
          class="w-full border-b border-black text-center"
        />
        <span class="text-xs">mmHg</span>
      </div>
      <div class="col-span-3 flex items-end gap-2">
        <span class="font-bold text-xs">FC:</span>
        <input
          bind:value={form.exam.fc}
          class="w-full border-b border-black text-center"
        />
        <span class="text-xs">por min.</span>
      </div>

      <div class="col-span-12">
        {@render lineInput(
          "ABDOMEN",
          form.exam.abdomen,
          (v) => (form.exam.abdomen = v),
        )}
      </div>
      <div class="col-span-12">
        {@render lineInput("S.N.C.", form.exam.snc, (v) => (form.exam.snc = v))}
      </div>

      <div class="col-span-6 flex items-end gap-2">
        <span class="font-bold text-xs uppercase">Funcion Renal Residual:</span>
        <input
          bind:value={form.exam.residualRenal}
          class="w-full border-b border-black"
        />
        <span class="text-xs font-bold">CC</span>
        <input bind:value={form.exam.cc} class="w-16 border-b border-black" />
      </div>
    </div>
  </div>

  <div class="mb-6">
    {@render sectionHeader("Tratamiento Farmacologico:")}
    <h4 class="font-bold underline text-xs mb-2">COMBO RENAL</h4>

    <div class="grid grid-cols-2 gap-x-8 gap-y-2">
      {@render lineInput(
        "ERITROPOYETINA",
        form.meds.erythropoietin,
        (v) => (form.meds.erythropoietin = v),
      )}
      {@render lineInput(
        "CaCo3",
        form.meds.caco3,
        (v) => (form.meds.caco3 = v),
      )}
      {@render lineInput(
        "SULFATO FERROSO",
        form.meds.ferrousSulfate,
        (v) => (form.meds.ferrousSulfate = v),
      )}
      {@render lineInput(
        "ACIDO FOLICO",
        form.meds.folicAcid,
        (v) => (form.meds.folicAcid = v),
      )}
    </div>
    <div class="mt-2">
      {@render lineInput("=", form.meds.other, (v) => (form.meds.other = v))}
    </div>

    <div class="mt-4">
      {@render lineInput(
        "Observaciones",
        form.observations,
        (v) => (form.observations = v),
      )}
    </div>
  </div>

  <div class="mb-12">
    {@render sectionHeader("LABORATORIO")}
    <div class="grid grid-cols-12 gap-y-3 gap-x-1 mt-2 text-xs items-end">
      <div class="col-span-4 flex items-end">
        <span class="font-bold italic mr-1">HB</span>
        <input
          bind:value={form.labs.hb}
          class="border-b border-black w-full text-center"
        />
        <span class="ml-1 text-[10px]">g/dl</span>
      </div>
      <div class="col-span-3 flex items-end">
        <span class="font-bold italic mr-1">HTO</span>
        <input
          bind:value={form.labs.hto}
          class="border-b border-black w-full text-center"
        />
        <span class="ml-1 text-[10px]">%</span>
      </div>
      <div class="col-span-5 flex items-end">
        <span class="font-bold italic mr-1">LEUCO</span>
        <input
          bind:value={form.labs.leuco}
          class="border-b border-black w-full text-center"
        />
        <span class="ml-1 text-[10px]">c/m3m</span>
        <span class="font-bold italic ml-2 mr-1">PLAQ</span>
        <input
          bind:value={form.labs.plaq}
          class="border-b border-black w-full text-center"
        />
        <span class="ml-1 text-[10px]">c/mm3</span>
      </div>

      <div class="col-span-3 flex items-end">
        <span class="font-bold italic mr-1">NA</span>
        <input
          bind:value={form.labs.na}
          class="border-b border-black w-full text-center"
        />
        <span class="ml-1 text-[10px]">mmol/l</span>
      </div>
      <div class="col-span-2 flex items-end">
        <span class="font-bold italic mr-1">K</span>
        <input
          bind:value={form.labs.k}
          class="border-b border-black w-full text-center"
        />
        <span class="ml-1 text-[10px]">mmol/l</span>
      </div>
      <div class="col-span-3 flex items-end">
        <span class="font-bold italic mr-1">CALCIO</span>
        <input
          bind:value={form.labs.calcio}
          class="border-b border-black w-full text-center"
        />
        <span class="ml-1 text-[10px]">Mg/dl</span>
      </div>
      <div class="col-span-4 flex items-end">
        <span class="font-bold italic mr-1">FOSFORO</span>
        <input
          bind:value={form.labs.fosforo}
          class="border-b border-black w-full text-center"
        />
        <span class="ml-1 text-[10px]">Mg/dl</span>
        <span class="font-bold italic ml-1 mr-1">PRODUCTO P/C</span>
        <input
          bind:value={form.labs.productoPC}
          class="border-b border-black w-full text-center"
        />
      </div>

      <div class="col-span-4 flex items-end">
        <span class="font-bold italic mr-1">PTH</span>
        <input
          bind:value={form.labs.pth}
          class="border-b border-black w-full text-center"
        />
      </div>
      <div class="col-span-4 flex items-end">
        <span class="font-bold italic mr-1">ALBUMINA</span>
        <input
          bind:value={form.labs.albumina}
          class="border-b border-black w-full text-center"
        />
      </div>
      <div class="col-span-4 flex items-end">
        <span class="font-bold italic mr-1">GLUCOSA</span>
        <input
          bind:value={form.labs.glucosa}
          class="border-b border-black w-full text-center"
        />
      </div>
    </div>
  </div>

  <div class="mt-6 flex justify-end print:hidden">
    <!-- Save button moved to top -->
  </div>

  <div class="text-center mt-12">
    <div class="inline-block px-12 border-t border-black">
      <span class="font-bold text-sm uppercase">Medico</span>
    </div>
  </div>
</div>
