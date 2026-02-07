<script lang="ts">

  // Svelte 5 Runes
  // 1. Define Interfaces to satisfy TypeScript
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
  }

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

{#snippet checkbox(label: string, obj: any, k: string)}
  <div class="flex items-center gap-2">
    <input type="checkbox" id={k} bind:checked={obj[k]} class="h-4 w-4" />
    <label for={k} class="text-sm">{label}</label>
  </div>
{/snippet}

{#snippet sectionHeader(title: string)}
  <div class="mt-6 mb-2 border-b-2 border-gray-400 pb-1">
    <h3 class="font-bold text-gray-700 uppercase">{title}</h3>
  </div>
{/snippet}

<div
  class="max-w-4xl mx-auto p-8 bg-white shadow-xl text-gray-800 font-sans text-sm print:shadow-none print:max-w-none"
>
  <header class="text-center mb-6 border-b-4 border-blue-900 pb-4">
    <h1 class="text-2xl font-bold text-blue-900">Diálisis de Honduras S.A.</h1>
    <p class="text-xs tracking-widest uppercase">Brindando calidad de vida</p>
    <h2 class="text-4xl font-serif mt-2 text-gray-600">CIDH</h2>
    <p class="font-bold uppercase mt-1">
      Comité de Infectologia de Dialisis de Honduras
    </p>
  </header>

  <div class="grid grid-cols-2 gap-4">
    <div class="col-span-2 md:col-span-1">
      <label class="block font-bold">Nombre del Paciente:</label>
      <input
        type="text"
        bind:value={formData.patient.firstName}
        class="w-full border-b border-gray-400 outline-none"
      />
    </div>
    <div class="col-span-2 md:col-span-1">
      <label class="block font-bold">Apellidos:</label>
      <input
        type="text"
        bind:value={formData.patient.lastName}
        class="w-full border-b border-gray-400 outline-none"
      />
    </div>

    <div class="flex gap-4">
      <span class="font-bold">Género:</span>
      <label
        ><input type="radio" value="F" bind:group={formData.patient.gender} /> F</label
      >
      <label
        ><input type="radio" value="M" bind:group={formData.patient.gender} /> M</label
      >
    </div>

    <div>
      <label class="font-bold">Fecha Nac:</label>
      <input
        type="date"
        bind:value={formData.patient.dob}
        class="border-b border-gray-400 outline-none ml-2"
      />
    </div>

    <div class="col-span-2 grid grid-cols-4 gap-2">
      <div>
        <label>Clínica:</label><input
          bind:value={formData.patient.clinic}
          class="w-full border-b"
        />
      </div>
      <div>
        <label>Cubículo:</label><input
          bind:value={formData.patient.cubicle}
          class="w-full border-b"
        />
      </div>
      <div>
        <label>Fecha Evento:</label><input
          type="date"
          bind:value={formData.patient.eventDate}
          class="w-full border-b"
        />
      </div>
      <div class="flex items-end gap-2">
        <span class="text-xs font-bold">Enfermedades:</span>
        <label class="text-xs"
          ><input type="checkbox" bind:checked={formData.patient.diseases.dm} />
          DM</label
        >
        <label class="text-xs"
          ><input
            type="checkbox"
            bind:checked={formData.patient.diseases.hta}
          /> HTA</label
        >
      </div>
    </div>
  </div>

  {@render sectionHeader("Tipo de Acceso")}
  <div class="border p-2 bg-gray-50">
    <div class="grid grid-cols-12 gap-2 text-xs font-bold border-b mb-2">
      <div class="col-span-4">Tipo</div>
      <div class="col-span-4">Fecha en que se Realiza</div>
      <div class="col-span-4 text-center">Fecha Desconocida</div>
    </div>
    {#each accessTypes as item}
      <div class="grid grid-cols-12 gap-2 items-center mb-1">
        <div class="col-span-4">
          {@render checkbox(item.label, formData.access[item.key], "active")}
        </div>
        <div class="col-span-4">
          <input
            type="date"
            bind:value={formData.access[item.key].date}
            class="w-full border-b bg-transparent"
            disabled={!formData.access[item.key].active}
          />
        </div>
        <div class="col-span-4 text-center">
          <input
            type="checkbox"
            bind:checked={formData.access[item.key].unknownDate}
            disabled={!formData.access[item.key].active}
          />
        </div>
      </div>
    {/each}
  </div>

  {@render sectionHeader("Datos de Enfermería")}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    <div class="space-y-1">
      {@render checkbox("Fiebre ≥ 38 axilar", formData.nursing, "fever")}
      {@render checkbox("Escalofríos", formData.nursing, "chills")}
      {@render checkbox("Tos", formData.nursing, "cough")}
      {@render checkbox(
        "Caída de presión arterial (hipotensión súbita)",
        formData.nursing,
        "hypotension",
      )}
    </div>
    <div class="space-y-1">
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
      <div class="flex items-center gap-1">
        <span class="text-sm">Otros:</span>
        <input bind:value={formData.nursing.other} class="border-b w-full" />
      </div>
    </div>
  </div>

  {@render sectionHeader("Datos del Medico (Semiología)")}
  <div class="border p-2">
    <div class="grid grid-cols-12 gap-2 text-xs font-bold border-b mb-2">
      <div class="col-span-4">Síntomas</div>
      <div class="col-span-3">Fecha Inicio</div>
      <div class="col-span-5">Característica</div>
    </div>
    {#each symptomsList as sym}
      <div
        class="grid grid-cols-12 gap-2 items-center mb-1 border-b border-dotted pb-1"
      >
        <div class="col-span-4">
          {@render checkbox(sym.l, formData.medical.symptoms[sym.k], "active")}
        </div>
        <div class="col-span-3">
          <input
            type="date"
            bind:value={formData.medical.symptoms[sym.k].start}
            class="w-full text-xs"
          />
        </div>
        <div class="col-span-5">
          <input
            type="text"
            bind:value={formData.medical.symptoms[sym.k].char}
            class="w-full border-b border-gray-200"
          />
        </div>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-2 gap-8 mt-4">
    <div>
      <h4 class="font-bold underline mb-2">Impresión Diagnostica:</h4>
      <div class="grid grid-cols-1 gap-1">
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
        <div class="flex gap-1">
          <span>Otros:</span>
          <input
            bind:value={formData.medical.diagnosis.other}
            class="border-b w-full"
          />
        </div>
      </div>
    </div>
    <div>
      <h4 class="font-bold underline mb-2">Pruebas Enviadas:</h4>
      <div class="grid grid-cols-2 gap-2">
        {@render checkbox(
          "Hemocultivo",
          formData.medical.tests,
          "bloodCulture",
        )}
        {@render checkbox("Urocultivo", formData.medical.tests, "urineCulture")}
        {@render checkbox("Hemograma", formData.medical.tests, "hemogram")}
        <div class="flex gap-1 col-span-2">
          <span>Otras:</span>
          <input
            bind:value={formData.medical.tests.other}
            class="border-b w-full"
          />
        </div>
      </div>

      <div class="mt-4 border-t pt-2">
        <div class="flex gap-4 items-center">
          <span class="font-bold">Se refiere:</span>
          <label
            ><input
              type="radio"
              value={true}
              bind:group={formData.medical.referral.sent}
            /> SI</label
          >
          <label
            ><input
              type="radio"
              value={false}
              bind:group={formData.medical.referral.sent}
            /> NO</label
          >
          <input
            placeholder="Donde"
            bind:value={formData.medical.referral.where}
            class="border-b"
          />
        </div>
      </div>
    </div>
  </div>

  <div
    class="mt-12 pt-8 border-t-8 border-double border-gray-300 break-before-page"
  >
    {@render sectionHeader("HOJA DE SEGUIMIENTO")}

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="flex gap-2">
        <label>Fecha de seguimiento:</label>
        <input
          type="date"
          bind:value={formData.followUp.date}
          class="border-b"
        />
      </div>
      <div class="flex gap-4">
        <label>Paciente Hospitalizado:</label>
        <label
          ><input
            type="radio"
            value={true}
            bind:group={formData.followUp.hospitalized}
          /> SI</label
        >
        <label
          ><input
            type="radio"
            value={false}
            bind:group={formData.followUp.hospitalized}
          /> NO</label
        >
      </div>
    </div>

    <div class="bg-gray-50 p-3 border rounded mb-4">
      <div class="font-bold mb-2">Resultado:</div>
      <div class="flex gap-4 flex-wrap">
        <label class="flex items-center gap-1"
          ><input
            type="checkbox"
            bind:checked={formData.followUp.result.hemoculture}
          /> Hemocultivo</label
        >
        <label class="flex items-center gap-1"
          ><input
            type="checkbox"
            bind:checked={formData.followUp.result.positive}
          /> Positivo</label
        >
        <label class="flex items-center gap-1"
          ><input
            type="checkbox"
            bind:checked={formData.followUp.result.negative}
          /> Negativo</label
        >
      </div>

      <div class="mt-2 border-t pt-2">
        <span class="font-bold block text-xs uppercase text-gray-500"
          >Agente Patógeno Cultivado</span
        >
        <div class="flex gap-4">
          <label
            ><input
              type="checkbox"
              bind:checked={formData.followUp.result.pathogen.staphAureus}
            /> Staphylococcus Aureus</label
          >
          <div class="flex gap-1 flex-1">
            <span>Otros:</span>
            <input
              bind:value={formData.followUp.result.pathogen.other}
              class="border-b w-full bg-transparent"
            />
          </div>
        </div>
      </div>

      <div class="mt-2 border-t pt-2">
        <span class="font-bold block text-xs uppercase text-gray-500"
          >Sensibilidad Antibiótica</span
        >
        <div class="flex gap-4">
          <label
            ><input
              type="checkbox"
              bind:checked={formData.followUp.result.sensitivity.vancomycin}
            /> Vancomicina</label
          >
          <div class="flex gap-1 flex-1">
            <span>Otros:</span>
            <input
              bind:value={formData.followUp.result.sensitivity.other}
              class="border-b w-full bg-transparent"
            />
          </div>
        </div>
      </div>

      <div class="mt-2 flex gap-4 items-center bg-blue-50 p-2">
        <span class="font-bold">Inicio tratamiento IV con Vancomicina:</span>
        <label
          ><input
            type="radio"
            value={false}
            bind:group={formData.followUp.treatmentStart.ivVancomycin}
          /> NO</label
        >
        <label
          ><input
            type="radio"
            value={true}
            bind:group={formData.followUp.treatmentStart.ivVancomycin}
          /> SI</label
        >
        <input
          placeholder="dosis"
          bind:value={formData.followUp.treatmentStart.dose}
          class="border-b w-20"
        />
        <div class="flex items-center gap-1">
          <span>cada</span>
          <input
            bind:value={formData.followUp.treatmentStart.everyXDays}
            class="border-b w-10 text-center"
          />
          <span>días</span>
        </div>
      </div>
    </div>

    <h4 class="font-bold bg-gray-200 p-1">
      Tratamiento (Registro de Administración)
    </h4>
    <div class="overflow-x-auto">
      <table class="w-full text-xs border-collapse border border-gray-400">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-1">Fechas De Admin</th>
            <th class="border p-1">Paciente Lo Trajo</th>
            <th class="border p-1">Dosis Indicada</th>
            <th class="border p-1">Dosis Administrada</th>
            <th class="border p-1">Vía</th>
            <th class="border p-1">Comentario</th>
          </tr>
        </thead>
        <tbody>
          {#each formData.followUp.logs as row}
            <tr class="hover:bg-gray-50">
              <td class="border p-1"
                ><input type="date" bind:value={row.date} class="w-full" /></td
              >
              <td class="border p-1 text-center">
                <label
                  ><input
                    type="radio"
                    value={true}
                    bind:group={row.patientBrought}
                  /> SI</label
                >
                <label
                  ><input
                    type="radio"
                    value={false}
                    bind:group={row.patientBrought}
                  /> NO</label
                >
              </td>
              <td class="border p-1">
                <div class="flex gap-1 flex-wrap">
                  <label
                    ><input
                      type="radio"
                      value="1g"
                      bind:group={row.doseIndicated}
                    /> 1g</label
                  >
                  <label
                    ><input
                      type="radio"
                      value="0.5g"
                      bind:group={row.doseIndicated}
                    /> 0.5g</label
                  >
                  <label
                    ><input
                      type="radio"
                      value="other"
                      bind:group={row.doseIndicated}
                    /> Otro</label
                  >
                </div>
              </td>
              <td class="border p-1">
                <div class="flex gap-1 flex-wrap">
                  <label
                    ><input
                      type="radio"
                      value="1g"
                      bind:group={row.doseAdmin}
                    /> 1g</label
                  >
                  <label
                    ><input
                      type="radio"
                      value="0.5g"
                      bind:group={row.doseAdmin}
                    /> 0.5g</label
                  >
                  <label
                    ><input
                      type="radio"
                      value="other"
                      bind:group={row.doseAdmin}
                    /> Otro</label
                  >
                </div>
              </td>
              <td class="border p-1">
                <label
                  ><input type="radio" value="IV" bind:group={row.route} /> IV</label
                >
                <label
                  ><input type="radio" value="VO" bind:group={row.route} /> VO</label
                >
              </td>
              <td class="border p-1"
                ><input
                  type="text"
                  bind:value={row.comment}
                  class="w-full border-b border-dotted"
                /></td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="mt-6 space-y-3">
      <div class="flex justify-between border-b pb-1">
        <span>¿Paciente completo todas las dosis de su tratamiento?</span>
        <div class="space-x-4">
          <label
            ><input
              type="radio"
              value="SI"
              bind:group={formData.followUp.outcomes.completed}
            /> SI</label
          >
          <label
            ><input
              type="radio"
              value="NO"
              bind:group={formData.followUp.outcomes.completed}
            /> NO</label
          >
        </div>
      </div>

      <div class="flex items-center gap-4 border-b pb-1">
        <span>¿Paciente abandono su Tratamiento?</span>
        <div class="space-x-2">
          <label
            ><input
              type="radio"
              value="SI"
              bind:group={formData.followUp.outcomes.abandoned}
            /> SI</label
          >
          <label
            ><input
              type="radio"
              value="NO"
              bind:group={formData.followUp.outcomes.abandoned}
            /> NO</label
          >
        </div>
        <div class="flex-1 flex gap-2">
          <span>¿Por qué?</span>
          <input
            bind:value={formData.followUp.outcomes.whyAbandoned}
            class="flex-1 border-b"
          />
        </div>
      </div>

      <div class="flex justify-between border-b pb-1">
        <span>¿Continúa manifestando Fiebre?</span>
        <div class="space-x-4">
          <label
            ><input
              type="radio"
              value="SI"
              bind:group={formData.followUp.outcomes.continuingFever}
            /> SI</label
          >
          <label
            ><input
              type="radio"
              value="NO"
              bind:group={formData.followUp.outcomes.continuingFever}
            /> NO</label
          >
        </div>
      </div>

      <div class="flex justify-between border-b pb-1">
        <span>¿Fue necesario volver a referir al paciente?</span>
        <div class="space-x-4">
          <label
            ><input
              type="radio"
              value="SI"
              bind:group={formData.followUp.outcomes.referredAgain}
            /> SI</label
          >
          <label
            ><input
              type="radio"
              value="NO"
              bind:group={formData.followUp.outcomes.referredAgain}
            /> NO</label
          >
        </div>
      </div>

      <div class="mt-4">
        <label class="font-bold">Comentario Final:</label>
        <textarea
          bind:value={formData.followUp.outcomes.finalComment}
          class="w-full border p-2 h-20"
        ></textarea>
      </div>
    </div>

    <div class="mt-8 pt-8 border-t border-black text-right">
      <span class="inline-block border-t border-black px-8 pt-1"
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
