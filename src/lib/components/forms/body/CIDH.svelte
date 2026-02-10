<script lang="ts">
  import { untrack } from "svelte";
  // --- TYPES ---
  interface AccessData {
    active: boolean;
    date: string;
    unknownDate: boolean;
  }

  interface SymptomData {
    active: boolean;
    start: string;
    char: string;
    desc?: string;
  }

  interface FormData {
    patient: {
      firstName: string;
      lastName: string;
      gender: string;
      dob: string;
      clinic: string;
      cubicle: string;
      eventDate: string;
      address: string;
      manager: string;
      diseases: { dm: boolean; hta: boolean };
    };
    access: {
      fistula: AccessData;
      graft: AccessData;
      permCatheter: AccessData;
      tempCatheter: AccessData;
    };
    nursing: {
      fever: boolean;
      chills: boolean;
      cough: boolean;
      hypotension: boolean;
      pus: boolean;
      cellulitis: boolean;
      wound: boolean;
      other: string;
      signature: string;
      [key: string]: boolean | string; // Index signature for loop access
    };
    medical: {
      symptoms: {
        general: SymptomData;
        fever: SymptomData;
        cough: SymptomData;
        sputum: SymptomData;
        dyspnea: SymptomData;
        sweats: SymptomData;
        upperResp: SymptomData;
        other: SymptomData;
      };
      diagnosis: {
        vascularInfection: boolean;
        pneumonia: boolean;
        cellulitis: boolean;
        uti: boolean;
        cold: boolean;
        tb: boolean;
        diabeticFoot: boolean;
        other: string;
        [key: string]: boolean | string;
      };
      tests: {
        bloodCulture: boolean;
        urineCulture: boolean;
        hemogram: boolean;
        other: string;
        [key: string]: boolean | string;
      };
      referral: {
        sent: boolean;
        where: string;
        followUp: string;
      };
      signature: string;
    };
    followUp: {
      date: string;
      hospitalized: boolean;
      result: {
        hemoculture: boolean;
        positive: boolean;
        negative: boolean;
        pathogen: { staphAureus: boolean; other: string };
        sensitivity: { vancomycin: boolean; other: string };
      };
      treatmentStart: {
        ivVancomycin: boolean;
        dose: string;
        everyXDays: string;
      };
      logs: Array<{
        date: string;
        patientBrought: boolean;
        doseIndicated: string;
        doseOtherIndicated: string;
        doseAdmin: string;
        doseOtherAdmin: string;
        route: string;
        comment: string;
      }>;
      outcomes: {
        completed: string | null;
        abandoned: string | null;
        whyAbandoned: string;
        continuingFever: string | null;
        referredAgain: string | null;
        finalComment: string;
      };
    };
    updatedAt?: string;
  }

  let { initialData = {}, onSave } = $props<{
    initialData?: Partial<FormData>;
    onSave: (data: FormData) => void;
  }>();

  let formData = $state<FormData>({
    patient: {
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      clinic: "",
      cubicle: "",
      eventDate: "",
      address: "",
      manager: "",
      diseases: { dm: false, hta: false },
    },
    access: {
      fistula: { active: false, date: "", unknownDate: false },
      graft: { active: false, date: "", unknownDate: false },
      permCatheter: { active: false, date: "", unknownDate: false },
      tempCatheter: { active: false, date: "", unknownDate: false },
    },
    nursing: {
      fever: false,
      chills: false,
      cough: false,
      hypotension: false,
      pus: false,
      cellulitis: false,
      wound: false,
      other: "",
      signature: "",
    },
    medical: {
      symptoms: {
        general: { active: false, start: "", char: "" },
        fever: { active: false, start: "", char: "" },
        cough: { active: false, start: "", char: "" },
        sputum: { active: false, start: "", char: "" },
        dyspnea: { active: false, start: "", char: "" },
        sweats: { active: false, start: "", char: "" },
        upperResp: { active: false, start: "", char: "" },
        other: { active: false, start: "", char: "", desc: "" },
      },
      diagnosis: {
        vascularInfection: false,
        pneumonia: false,
        cellulitis: false,
        uti: false,
        cold: false,
        tb: false,
        diabeticFoot: false,
        other: "",
      },
      tests: {
        bloodCulture: false,
        urineCulture: false,
        hemogram: false,
        other: "",
      },
      referral: {
        sent: false,
        where: "",
        followUp: "same",
      },
      signature: "",
    },
    followUp: {
      date: "",
      hospitalized: false,
      result: {
        hemoculture: false,
        positive: false,
        negative: false,
        pathogen: { staphAureus: false, other: "" },
        sensitivity: { vancomycin: false, other: "" },
      },
      treatmentStart: {
        ivVancomycin: false,
        dose: "",
        everyXDays: "",
      },
      logs: Array.from({ length: 10 }, () => ({
        date: "",
        patientBrought: false,
        doseIndicated: "1g",
        doseOtherIndicated: "",
        doseAdmin: "1g",
        doseOtherAdmin: "",
        route: "IV",
        comment: "",
      })),
      outcomes: {
        completed: null,
        abandoned: null,
        whyAbandoned: "",
        continuingFever: null,
        referredAgain: null,
        finalComment: "",
      },
    },
    ...untrack(() => initialData),
  });

  $effect(() => {
    formData = {
      patient: {
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        clinic: "",
        cubicle: "",
        eventDate: "",
        address: "",
        manager: "",
        diseases: { dm: false, hta: false },
        ...initialData.patient,
      },
      access: {
        fistula: { active: false, date: "", unknownDate: false },
        graft: { active: false, date: "", unknownDate: false },
        permCatheter: { active: false, date: "", unknownDate: false },
        tempCatheter: { active: false, date: "", unknownDate: false },
        ...initialData.access,
      },
      nursing: {
        fever: false,
        chills: false,
        cough: false,
        hypotension: false,
        pus: false,
        cellulitis: false,
        wound: false,
        other: "",
        signature: "",
        ...initialData.nursing,
      },
      medical: {
        symptoms: {
          general: { active: false, start: "", char: "" },
          fever: { active: false, start: "", char: "" },
          cough: { active: false, start: "", char: "" },
          sputum: { active: false, start: "", char: "" },
          dyspnea: { active: false, start: "", char: "" },
          sweats: { active: false, start: "", char: "" },
          upperResp: { active: false, start: "", char: "" },
          other: { active: false, start: "", char: "", desc: "" },
          ...initialData.medical?.symptoms,
        },
        diagnosis: {
          vascularInfection: false,
          pneumonia: false,
          cellulitis: false,
          uti: false,
          cold: false,
          tb: false,
          diabeticFoot: false,
          other: "",
          ...initialData.medical?.diagnosis,
        },
        tests: {
          bloodCulture: false,
          urineCulture: false,
          hemogram: false,
          other: "",
          ...initialData.medical?.tests,
        },
        referral: {
          sent: false,
          where: "",
          followUp: "same",
          ...initialData.medical?.referral,
        },
        signature: "",
        ...initialData.medical,
      },
      followUp: {
        date: "",
        hospitalized: false,
        result: {
          hemoculture: false,
          positive: false,
          negative: false,
          pathogen: { staphAureus: false, other: "" },
          sensitivity: { vancomycin: false, other: "" },
          ...initialData.followUp?.result,
        },
        treatmentStart: {
          ivVancomycin: false,
          dose: "",
          everyXDays: "",
          ...initialData.followUp?.treatmentStart,
        },
        logs:
          initialData.followUp?.logs ||
          Array.from({ length: 10 }, () => ({
            date: "",
            patientBrought: false,
            doseIndicated: "1g",
            doseOtherIndicated: "",
            doseAdmin: "1g",
            doseOtherAdmin: "",
            route: "IV",
            comment: "",
          })),
        outcomes: {
          completed: null,
          abandoned: null,
          whyAbandoned: "",
          continuingFever: null,
          referredAgain: null,
          finalComment: "",
          ...initialData.followUp?.outcomes,
        },
        ...initialData.followUp,
      },
      ...initialData,
    };
  });

  // Define strict types for the arrays to avoid "implicitly has 'any' type" errors
  const accessTypes = [
    { key: "fistula", label: "Fistula" },
    { key: "graft", label: "Injerto" },
    { key: "permCatheter", label: "Catéter Permanente" },
    { key: "tempCatheter", label: "Catéter Temporal" },
  ] as const;

  const symptomsList = [
    { k: "general", l: "Malestar general" },
    { k: "fever", l: "Fiebre" },
    { k: "cough", l: "Tos" },
    { k: "sputum", l: "Expectoración" },
    { k: "dyspnea", l: "Disnea" },
    { k: "sweats", l: "Sudoración Nocturna" },
    { k: "upperResp", l: "Resp. Superior (odinofagia, etc)" },
  ] as const;
</script>

{#snippet textInput(
  label: string,
  obj: any,
  k: string,
  placeholder: string = "",
)}
  <div>
    <label class="form-label">
      {label}
      <input type="text" bind:value={obj[k]} class="form-input" {placeholder} />
    </label>
  </div>
{/snippet}

{#snippet dateInput(label: string, obj: any, k: string)}
  <div>
    <label class="form-label">
      {label}
      <input type="date" bind:value={obj[k]} class="form-input" />
    </label>
  </div>
{/snippet}

{#snippet checkbox(label: string, obj: any, k: string)}
  <div class="form-checkbox-label">
    <input type="checkbox" bind:checked={obj[k]} class="form-checkbox" />
    <label class="text-sm font-medium text-gray-700 cursor-pointer"
      >{label}</label
    >
  </div>
{/snippet}

{#snippet radioGroup(
  label: string,
  obj: any,
  k: string,
  options: { value: any; label: string }[],
)}
  <div class="space-y-1">
    {#if label}
      <span class="font-bold text-sm text-gray-700">{label}:</span>
    {/if}
    <div class="flex gap-4">
      {#each options as option}
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={obj[k] === option.value}
            onclick={() => (obj[k] = option.value)}
            name={k}
            class="form-radio"
          />
          <span class="text-sm">{option.label}</span>
        </label>
      {/each}
    </div>
  </div>
{/snippet}

{#snippet sectionHeader(title: string)}
  <div class="form-section">
    <h3 class="form-section-title">{title}</h3>
  </div>
{/snippet}

{#snippet textarea(
  label: string,
  obj: any,
  k: string,
  placeholder: string = "",
  rows: number = 3,
)}
  <div>
    <label class="form-label">
      {label}
      <textarea
        bind:value={obj[k]}
        class="form-input resize-none"
        {rows}
        {placeholder}
      ></textarea>
    </label>
  </div>
{/snippet}

<div class="form-container">
  <div class="form-save-btn">
    <button onclick={() => onSave(formData)} class="form-btn-primary">
      Guardar
    </button>
  </div>

  <header class="form-header">
    <div>
      <h1 class="form-title">Diálisis de Honduras S.A. de C.V.</h1>
      <p class="form-subtitle">Brindando calidad de vida</p>
    </div>
    <div class="text-right">
      <h2 class="text-2xl font-serif text-gray-600">CIDH</h2>
      <p class="text-xs font-bold uppercase text-gray-500">
        Comité de Infectologia
      </p>
      {#if formData.updatedAt}
        <p class="text-[10px] text-gray-400 mt-1">
          Actualizado: {new Date(formData.updatedAt).toLocaleString()}
        </p>
      {/if}
    </div>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    {@render textInput("Nombre del Paciente", formData.patient, "firstName")}
    {@render textInput("Apellidos", formData.patient, "lastName")}

    {@render radioGroup("Género", formData.patient, "gender", [
      { value: "F", label: "F" },
      { value: "M", label: "M" },
    ])}

    {@render dateInput("Fecha Nacimiento", formData.patient, "dob")}

    <div class="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
      {@render textInput("Clínica", formData.patient, "clinic")}
      {@render textInput("Cubículo", formData.patient, "cubicle")}
      {@render dateInput("Fecha Evento", formData.patient, "eventDate")}

      <div class="flex flex-col justify-end pb-2">
        <span class="text-xs font-bold mb-2">Enfermedades:</span>
        <div class="flex gap-4">
          {@render checkbox("DM", formData.patient.diseases, "dm")}
          {@render checkbox("HTA", formData.patient.diseases, "hta")}
        </div>
      </div>
    </div>
  </div>

  {@render sectionHeader("Tipo de Acceso")}
  <div class="border border-gray-200 rounded-lg p-4 bg-gray-50/50 mb-6">
    <div
      class="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2 mb-2"
    >
      <div class="col-span-4">Tipo</div>
      <div class="col-span-4">Fecha en que se Realiza</div>
      <div class="col-span-4 text-center">Fecha Desconocida</div>
    </div>
    {#each accessTypes as item}
      <div class="grid grid-cols-12 gap-4 items-center mb-2 last:mb-0">
        <div class="col-span-4">
          {@render checkbox(item.label, formData.access[item.key], "active")}
        </div>
        <div class="col-span-4">
          <input
            type="date"
            bind:value={formData.access[item.key].date}
            class="form-input text-xs"
            disabled={!formData.access[item.key].active}
          />
        </div>
        <div class="col-span-4 text-center flex justify-center">
          <input
            type="checkbox"
            bind:checked={formData.access[item.key].unknownDate}
            class="form-checkbox"
            disabled={!formData.access[item.key].active}
          />
        </div>
      </div>
    {/each}
  </div>

  {@render sectionHeader("Datos de Enfermería")}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div class="space-y-2">
      {@render checkbox("Fiebre ≥ 38 axilar", formData.nursing, "fever")}
      {@render checkbox("Escalofríos", formData.nursing, "chills")}
      {@render checkbox("Tos", formData.nursing, "cough")}
      {@render checkbox(
        "Caída de presión arterial (hipotensión súbita)",
        formData.nursing,
        "hypotension",
      )}
    </div>
    <div class="space-y-2">
      {@render checkbox(
        "Piel del Acceso (pus, enrojecimiento)",
        formData.nursing,
        "pus",
      )}
      {@render checkbox(
        "Celulitis (piel enrojecida, caliente)",
        formData.nursing,
        "cellulitis",
      )}
      {@render checkbox(
        "Herida sin relación al acceso",
        formData.nursing,
        "wound",
      )}
      <div class="flex flex-col">
        <label class="form-label text-xs"
          >Otros <input
            bind:value={formData.nursing.other}
            class="form-input"
          />
        </label>
      </div>
    </div>
  </div>

  {@render sectionHeader("Datos del Medico (Semiología)")}
  <div class="border border-gray-200 rounded-lg p-4 bg-gray-50/50 mb-6">
    <div
      class="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-2 mb-2"
    >
      <div class="col-span-4">Síntomas</div>
      <div class="col-span-3">Fecha Inicio</div>
      <div class="col-span-5">Característica</div>
    </div>
    {#each symptomsList as sym}
      <div
        class="grid grid-cols-12 gap-4 items-center mb-2 last:mb-0 border-b border-gray-100 last:border-0 pb-2 last:pb-0"
      >
        <div class="col-span-4">
          {@render checkbox(sym.l, formData.medical.symptoms[sym.k], "active")}
        </div>
        <div class="col-span-3">
          <input
            type="date"
            bind:value={formData.medical.symptoms[sym.k].start}
            class="form-input text-xs"
          />
        </div>
        <div class="col-span-5">
          <input
            type="text"
            bind:value={formData.medical.symptoms[sym.k].char}
            class="form-input text-xs"
            placeholder="Características..."
          />
        </div>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 mb-8">
    <div>
      <h4 class="form-label text-base border-b border-gray-100 pb-2 mb-4">
        Impresión Diagnostica
      </h4>
      <div class="space-y-2">
        {@render checkbox(
          "Infección del Acceso Vascular",
          formData.medical.diagnosis,
          "vascularInfection",
        )}
        {@render checkbox("Neumonía", formData.medical.diagnosis, "pneumonia")}
        {@render checkbox(
          "Celulitis",
          formData.medical.diagnosis,
          "cellulitis",
        )}
        {@render checkbox(
          "Infección Tracto Urinario",
          formData.medical.diagnosis,
          "uti",
        )}
        {@render checkbox(
          "Resfriado común / Gripe",
          formData.medical.diagnosis,
          "cold",
        )}
        {@render checkbox("Tuberculosis", formData.medical.diagnosis, "tb")}
        {@render checkbox(
          "Pie Diabético",
          formData.medical.diagnosis,
          "diabeticFoot",
        )}

        {@render textInput("Otros", formData.medical.diagnosis, "other")}
      </div>
    </div>
    <div>
      <h4 class="form-label text-base border-b border-gray-100 pb-2 mb-4">
        Impresión Diagnostica
      </h4>
      <div class="space-y-2">
        {@render checkbox(
          "Infección del Acceso Vascular",
          formData.medical.diagnosis,
          "vascularInfection",
        )}
        {@render checkbox("Neumonía", formData.medical.diagnosis, "pneumonia")}
        {@render checkbox(
          "Celulitis",
          formData.medical.diagnosis,
          "cellulitis",
        )}
        {@render checkbox(
          "Infección Tracto Urinario",
          formData.medical.diagnosis,
          "uti",
        )}
        {@render checkbox(
          "Resfriado común / Gripe",
          formData.medical.diagnosis,
          "cold",
        )}
        {@render checkbox("Tuberculosis", formData.medical.diagnosis, "tb")}
        {@render checkbox(
          "Pie Diabético",
          formData.medical.diagnosis,
          "diabeticFoot",
        )}

        {@render textInput("Otros", formData.medical.diagnosis, "other")}
      </div>
    </div>
    <div>
      <h4 class="form-label text-base border-b border-gray-100 pb-2 mb-4">
        Pruebas Enviadas
      </h4>
      <div class="space-y-2">
        {@render checkbox(
          "Hemocultivo",
          formData.medical.tests,
          "bloodCulture",
        )}
        {@render checkbox("Urocultivo", formData.medical.tests, "urineCulture")}
        {@render checkbox("Hemograma", formData.medical.tests, "hemogram")}

        {@render textInput("Otras", formData.medical.tests, "other")}
      </div>

      <div class="mt-6 pt-4 border-t border-gray-100">
        {@render radioGroup("Se refiere", formData.medical.referral, "sent", [
          { value: true, label: "SI" },
          { value: false, label: "NO" },
        ])}
        {@render textInput("", formData.medical.referral, "where", "Donde...")}
      </div>
    </div>
  </div>

  <div class="mt-12 pt-8 border-t border-gray-200 break-before-page">
    {@render sectionHeader("HOJA DE SEGUIMIENTO")}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {@render dateInput("Fecha de seguimiento", formData.followUp, "date")}

      {@render radioGroup(
        "Paciente Hospitalizado",
        formData.followUp,
        "hospitalized",
        [
          { value: true, label: "SI" },
          { value: false, label: "NO" },
        ],
      )}
    </div>

    <div class="border border-gray-200 rounded-lg p-4 bg-gray-50/50 mb-6">
      <div class="font-bold text-gray-700 mb-2">Resultado</div>
      <div class="flex gap-4 flex-wrap mb-4">
        {@render checkbox(
          "Hemocultivo",
          formData.followUp.result,
          "hemoculture",
        )}
        {@render checkbox("Positivo", formData.followUp.result, "positive")}
        {@render checkbox("Negativo", formData.followUp.result, "negative")}
      </div>

      <div class="mt-4 border-t border-gray-200 pt-3">
        <span class="font-bold block text-xs uppercase text-gray-500 mb-2"
          >Agente Patógeno Cultivado</span
        >
        <div class="flex gap-6 items-start">
          {@render checkbox(
            "Staphylococcus Aureus",
            formData.followUp.result.pathogen,
            "staphAureus",
          )}
          <div class="flex flex-col flex-1">
            {@render textInput(
              "Otros",
              formData.followUp.result.pathogen,
              "other",
            )}
          </div>
        </div>
      </div>

      <div class="mt-4 border-t border-gray-200 pt-3">
        <span class="font-bold block text-xs uppercase text-gray-500 mb-2"
          >Sensibilidad Antibiótica</span
        >
        <div class="flex gap-6 items-start">
          {@render checkbox(
            "Vancomicina",
            formData.followUp.result.sensitivity,
            "vancomycin",
          )}
          <div class="flex flex-col flex-1">
            {@render textInput(
              "Otros",
              formData.followUp.result.sensitivity,
              "other",
            )}
          </div>
        </div>
      </div>

      <div
        class="mt-4 flex gap-4 items-center bg-blue-50/50 p-3 rounded-lg border border-blue-100"
      >
        <div class="flex items-center gap-4">
          {@render radioGroup(
            "Inicio tratamiento IV con Vancomicina",
            formData.followUp.treatmentStart,
            "ivVancomycin",
            [
              { value: false, label: "NO" },
              { value: true, label: "SI" },
            ],
          )}
        </div>
        <input
          placeholder="dosis"
          bind:value={formData.followUp.treatmentStart.dose}
          class="form-input w-24"
        />
        <div class="flex items-center gap-2">
          <span>cada</span>
          <input
            bind:value={formData.followUp.treatmentStart.everyXDays}
            class="form-input w-16 text-center"
          />
          <span>días</span>
        </div>
      </div>
    </div>

    <h4 class="form-section-title bg-gray-50 p-2 rounded">
      Tratamiento (Registro de Administración)
    </h4>
    <div class="table-container mb-6">
      <table class="table-standard text-xs">
        <thead>
          <tr class="table-header-row">
            <th class="table-th-left">Fechas De Admin</th>
            <th class="table-th-left">Paciente Lo Trajo</th>
            <th class="table-th-left">Dosis Indicada</th>
            <th class="table-th-left">Dosis Administrada</th>
            <th class="table-th-left">Vía</th>
            <th class="table-th-left">Comentario</th>
          </tr>
        </thead>
        <tbody>
          {#each formData.followUp.logs as row}
            <tr class="table-row">
              <td class="p-2"
                ><input
                  type="date"
                  bind:value={row.date}
                  class="form-input text-xs"
                /></td
              >
              <td class="p-2 text-center">
                <div class="flex gap-2 justify-center">
                  <label class="flex items-center gap-1"
                    ><input
                      type="radio"
                      value={true}
                      bind:group={row.patientBrought}
                      class="form-checkbox h-3 w-3"
                    /> SI</label
                  >
                  <label class="flex items-center gap-1"
                    ><input
                      type="radio"
                      value={false}
                      bind:group={row.patientBrought}
                      class="form-checkbox h-3 w-3"
                    /> NO</label
                  >
                </div>
              </td>
              <td class="p-2">
                <div class="flex gap-2 flex-wrap">
                  <label class="flex items-center gap-1"
                    ><input
                      type="radio"
                      value="1g"
                      bind:group={row.doseIndicated}
                      class="form-checkbox h-3 w-3"
                    /> 1g</label
                  >
                  <label class="flex items-center gap-1"
                    ><input
                      type="radio"
                      value="0.5g"
                      bind:group={row.doseIndicated}
                      class="form-checkbox h-3 w-3"
                    /> 0.5g</label
                  >
                  <label class="flex items-center gap-1"
                    ><input
                      type="radio"
                      value="other"
                      bind:group={row.doseIndicated}
                      class="form-checkbox h-3 w-3"
                    /> Otro</label
                  >
                </div>
              </td>
              <td class="p-2">
                <div class="flex gap-2 flex-wrap">
                  <label class="flex items-center gap-1"
                    ><input
                      type="radio"
                      value="1g"
                      bind:group={row.doseAdmin}
                      class="form-checkbox h-3 w-3"
                    /> 1g</label
                  >
                  <label class="flex items-center gap-1"
                    ><input
                      type="radio"
                      value="0.5g"
                      bind:group={row.doseAdmin}
                      class="form-checkbox h-3 w-3"
                    /> 0.5g</label
                  >
                  <label class="flex items-center gap-1"
                    ><input
                      type="radio"
                      value="other"
                      bind:group={row.doseAdmin}
                      class="form-checkbox h-3 w-3"
                    /> Otro</label
                  >
                </div>
              </td>
              <td class="p-2">
                <div class="flex gap-2">
                  <label class="flex items-center gap-1"
                    ><input
                      type="radio"
                      value="IV"
                      bind:group={row.route}
                      class="form-checkbox h-3 w-3"
                    /> IV</label
                  >
                  <label class="flex items-center gap-1"
                    ><input
                      type="radio"
                      value="VO"
                      bind:group={row.route}
                      class="form-checkbox h-3 w-3"
                    /> VO</label
                  >
                </div>
              </td>
              <td class="p-2"
                ><input
                  type="text"
                  bind:value={row.comment}
                  class="form-input text-xs"
                /></td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="mt-6 space-y-4">
      <div
        class="flex justify-between items-center border-b border-gray-100 pb-2"
      >
        <div class="flex gap-4 items-center">
          {@render radioGroup(
            "¿Paciente completo todas las dosis de su tratamiento?",
            formData.followUp.outcomes,
            "completed",
            [
              { value: "SI", label: "SI" },
              { value: "NO", label: "NO" },
            ],
          )}
        </div>
      </div>

      <div class="flex flex-col gap-2 border-b border-gray-100 pb-2">
        <div class="flex justify-between items-center">
          {@render radioGroup(
            "¿Paciente abandono su Tratamiento?",
            formData.followUp.outcomes,
            "abandoned",
            [
              { value: "SI", label: "SI" },
              { value: "NO", label: "NO" },
            ],
          )}
        </div>
        <div class="flex items-center gap-4 mt-2">
          {@render textInput(
            "¿Por qué?",
            formData.followUp.outcomes,
            "whyAbandoned",
          )}
        </div>
      </div>

      <div
        class="flex justify-between items-center border-b border-gray-100 pb-2"
      >
        {@render radioGroup(
          "¿Continúa manifestando Fiebre?",
          formData.followUp.outcomes,
          "continuingFever",
          [
            { value: "SI", label: "SI" },
            { value: "NO", label: "NO" },
          ],
        )}
      </div>

      <div
        class="flex justify-between items-center border-b border-gray-100 pb-2"
      >
        {@render radioGroup(
          "¿Fue necesario volver a referir al paciente?",
          formData.followUp.outcomes,
          "referredAgain",
          [
            { value: "SI", label: "SI" },
            { value: "NO", label: "NO" },
          ],
        )}
      </div>

      <div class="mt-4">
        {@render textarea(
          "Comentario Final",
          formData.followUp.outcomes,
          "finalComment",
        )}
      </div>
    </div>

    <div class="mt-8 pt-8 border-t border-gray-200 text-right">
      <span
        class="inline-block border-t border-black px-8 pt-1 text-sm font-bold uppercase"
        >Firma del Medico</span
      >
    </div>
  </div>
</div>

<style>
  input[type="checkbox"],
  input[type="radio"] {
    cursor: pointer;
  }
  input:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
</style>
