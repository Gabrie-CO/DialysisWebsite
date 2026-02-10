<script lang="ts">
  import { untrack } from "svelte";
  // --- TYPES ---
  interface MonitoringRow {
    id: number;
    hora: string;
    bp: string; // Sanguineo BP
    hr: string; // Cardio HR
    bfr: string; // Veloc Flujo Sangre
    dfr: string; // % Flujo Dializado
    ap: string; // Presion Arterial AP
    vp: string; // Presion Venosa VP
    fluidos: string; // Fluidos Removidos
    heparina: string;
    ufr: string; // Ultra Filtracion %
    temp: string;
    bvplp: string;
    accesos: string;
    enfermera: string;
    iniciales: string;
  }

  interface FormState {
    // Header
    patientCode: string;
    patientName: string;
    fileNo: string;
    date: string;
    turn: string;
    time: string;
    treatmentType: string;
    updatedAt?: string;

    // Vitals (Grid)
    vitals: {
      bp: {
        prevSit: string;
        prevStand: string;
        preSit: string;
        preStand: string;
        postSit: string;
        postStand: string;
      };
      weight: { pre: string; post: string };
    };

    // Session Info
    cubicle: string;
    clinic: string;
    txTime: string; // Hora tratamiento (Duration)
    startTime: string;
    endTime: string;
    machineNo: string;
    hospitalVisit: boolean | null; // Visito hospital
    dataCollection: boolean | null; // Coleccion datos

    // Pre-Eval
    preEval: {
      temp: { initial: string; post: string; initials: string };
      resp: { initial: string; post: string; initials: string };
      ct: { initial: string; post: string; initials: string };
      cardiac: { initial: string; post: string; initials: string };
      edema: { initial: string; post: string; initials: string };
      mental: { initial: string; post: string; initials: string };
      mobility: { initial: string; post: string; initials: string };
      access: { initial: string; post: string; initials: string };
    };

    // Machine Checks
    machine: {
      reuse: boolean; // Maquinaria y avaluo reutilizar
      conductive: string; // Conductiva Maquina manual
      ph: string;
      temp: string;
      alarmTest: boolean;
      airOn: boolean;
      ufSystem: boolean;
      positiveTest: boolean;
      negativeResidual: boolean;
      dialyzerCode: string;
    };

    // Staff / Allergy
    notes: string;
    allergy: string;
    staff: {
      titular1: { name: string; initials: string };
      titular2: { name: string; initials: string };
      nephrologist: string;
    };

    // Orders
    heparin: {
      type: string;
      initialUnitsPump: string;
      unitsHr: string;
      pumpInclusion: boolean;
      endTime: string;
    };
    dialysis: {
      dialyzer: string;
      dfr: string;
      bfr: string;
      txTime: string;
      type: string; // Dialisis (std)
      k: string;
      ca: string;
      bicarb: string;
      sodium: string;
      ufProfile: string;
      maxUfr: string;
      dialyzerStd: string;
      comments: string;
    };

    // Access / Needles
    access: {
      arterial: {
        gauge: string;
        size: string;
        pressure: string;
        detention: string;
        bleeding: string;
      };
      venous: {
        gauge: string;
        size: string;
        pressure: string;
        detention: string;
        bleeding: string;
      };
      catheterPlacedBy: string;
    };

    // Monitoring Grid
    monitoring: MonitoringRow[];

    // Footer
    seals: { venous: string; arterial: string };
    footerNotes: { medical: string; nursing: string };
    drafters: { name1: string; name2: string };
  }

  let { initialData = {}, onSave } = $props<{
    initialData?: Partial<FormState>;
    onSave: (data: FormState) => void;
  }>();

  // --- STATE ---
  let form = $state<FormState>({
    patientCode: "",
    patientName: "",
    fileNo: "",
    date: "",
    turn: "",
    time: "",
    treatmentType: "",
    vitals: {
      bp: {
        prevSit: "",
        prevStand: "",
        preSit: "",
        preStand: "",
        postSit: "",
        postStand: "",
      },
      weight: { pre: "", post: "" },
    },
    cubicle: "",
    clinic: "",
    txTime: "",
    startTime: "",
    endTime: "",
    machineNo: "",
    hospitalVisit: null,
    dataCollection: null,
    preEval: {
      temp: { initial: "", post: "", initials: "" },
      resp: { initial: "", post: "", initials: "" },
      ct: { initial: "", post: "", initials: "" },
      cardiac: { initial: "", post: "", initials: "" },
      edema: { initial: "", post: "", initials: "" },
      mental: { initial: "", post: "", initials: "" },
      mobility: { initial: "", post: "", initials: "" },
      access: { initial: "", post: "", initials: "" },
    },
    machine: {
      reuse: false,
      conductive: "",
      ph: "",
      temp: "",
      alarmTest: false,
      airOn: false,
      ufSystem: false,
      positiveTest: false,
      negativeResidual: false,
      dialyzerCode: "",
    },
    notes: "",
    allergy: "",
    staff: {
      titular1: { name: "", initials: "" },
      titular2: { name: "", initials: "" },
      nephrologist: "",
    },
    heparin: {
      type: "",
      initialUnitsPump: "",
      unitsHr: "",
      pumpInclusion: false,
      endTime: "",
    },
    dialysis: {
      dialyzer: "",
      dfr: "",
      bfr: "",
      txTime: "",
      type: "",
      k: "",
      ca: "",
      bicarb: "",
      sodium: "",
      ufProfile: "",
      maxUfr: "",
      dialyzerStd: "",
      comments: "",
    },
    access: {
      arterial: {
        gauge: "",
        size: "",
        pressure: "",
        detention: "",
        bleeding: "",
      },
      venous: {
        gauge: "",
        size: "",
        pressure: "",
        detention: "",
        bleeding: "",
      },
      catheterPlacedBy: "",
    },
    monitoring: Array.from({ length: 12 }, (_, i) => ({
      id: i,
      hora: "",
      bp: "",
      hr: "",
      bfr: "",
      dfr: "",
      ap: "",
      vp: "",
      fluidos: "",
      heparina: "",
      ufr: "",
      temp: "",
      bvplp: "",
      accesos: "",
      enfermera: "",
      iniciales: "",
    })),
    seals: { venous: "", arterial: "" },
    footerNotes: { medical: "", nursing: "" },
    drafters: { name1: "", name2: "" },
    ...untrack(() => initialData),
  });

  $effect(() => {
    form = {
      patientCode: "",
      patientName: "",
      fileNo: "",
      date: "",
      turn: "",
      time: "",
      treatmentType: "",
      vitals: {
        bp: {
          prevSit: "",
          prevStand: "",
          preSit: "",
          preStand: "",
          postSit: "",
          postStand: "",
          ...initialData.vitals?.bp,
        },
        weight: { pre: "", post: "", ...initialData.vitals?.weight },
        ...initialData.vitals,
      },
      cubicle: "",
      clinic: "",
      txTime: "",
      startTime: "",
      endTime: "",
      machineNo: "",
      hospitalVisit: null,
      dataCollection: null,
      preEval: {
        temp: {
          initial: "",
          post: "",
          initials: "",
          ...initialData.preEval?.temp,
        },
        resp: {
          initial: "",
          post: "",
          initials: "",
          ...initialData.preEval?.resp,
        },
        ct: { initial: "", post: "", initials: "", ...initialData.preEval?.ct },
        cardiac: {
          initial: "",
          post: "",
          initials: "",
          ...initialData.preEval?.cardiac,
        },
        edema: {
          initial: "",
          post: "",
          initials: "",
          ...initialData.preEval?.edema,
        },
        mental: {
          initial: "",
          post: "",
          initials: "",
          ...initialData.preEval?.mental,
        },
        mobility: {
          initial: "",
          post: "",
          initials: "",
          ...initialData.preEval?.mobility,
        },
        access: {
          initial: "",
          post: "",
          initials: "",
          ...initialData.preEval?.access,
        },
        ...initialData.preEval,
      },
      machine: {
        reuse: false,
        conductive: "",
        ph: "",
        temp: "",
        alarmTest: false,
        airOn: false,
        ufSystem: false,
        positiveTest: false,
        negativeResidual: false,
        dialyzerCode: "",
        ...initialData.machine,
      },
      notes: "",
      allergy: "",
      staff: {
        titular1: { name: "", initials: "", ...initialData.staff?.titular1 },
        titular2: { name: "", initials: "", ...initialData.staff?.titular2 },
        nephrologist: "",
        ...initialData.staff,
      },
      heparin: {
        type: "",
        initialUnitsPump: "",
        unitsHr: "",
        pumpInclusion: false,
        endTime: "",
        ...initialData.heparin,
      },
      dialysis: {
        dialyzer: "",
        dfr: "",
        bfr: "",
        txTime: "",
        type: "",
        k: "",
        ca: "",
        bicarb: "",
        sodium: "",
        ufProfile: "",
        maxUfr: "",
        dialyzerStd: "",
        comments: "",
        ...initialData.dialysis,
      },
      access: {
        arterial: {
          gauge: "",
          size: "",
          pressure: "",
          detention: "",
          bleeding: "",
          ...initialData.access?.arterial,
        },
        venous: {
          gauge: "",
          size: "",
          pressure: "",
          detention: "",
          bleeding: "",
          ...initialData.access?.venous,
        },
        catheterPlacedBy: "",
        ...initialData.access,
      },
      monitoring:
        initialData.monitoring ||
        Array.from({ length: 12 }, (_, i) => ({
          id: i,
          hora: "",
          bp: "",
          hr: "",
          bfr: "",
          dfr: "",
          ap: "",
          vp: "",
          fluidos: "",
          heparina: "",
          ufr: "",
          temp: "",
          bvplp: "",
          accesos: "",
          enfermera: "",
          iniciales: "",
        })),
      seals: { venous: "", arterial: "", ...initialData.seals },
      footerNotes: { medical: "", nursing: "", ...initialData.footerNotes },
      drafters: { name1: "", name2: "", ...initialData.drafters },
      ...initialData,
    };
  });
</script>

{#snippet lineInput(
  value: string,
  update: (v: string) => void,
  placeholder: string = "",
)}
  <input
    type="text"
    {value}
    oninput={(e) => update((e.currentTarget as HTMLInputElement).value)}
    class="form-input h-9 text-sm"
    {placeholder}
  />
{/snippet}

{#snippet gridInput(value: string, update: (v: string) => void)}
  <input
    type="text"
    {value}
    oninput={(e) => update((e.currentTarget as HTMLInputElement).value)}
    class="form-input h-full text-center text-[10px] p-0.5 border-gray-200 focus:border-blue-500 rounded-none shadow-none"
  />
{/snippet}

{#snippet checkInput(label: string, checked: boolean, toggle: () => void)}
  <label class="form-checkbox-label">
    <input
      type="checkbox"
      {checked}
      onchange={toggle}
      class="form-checkbox h-3 w-3"
    />
    <span class="text-[10px] uppercase font-bold text-gray-700">{label}</span>
  </label>
{/snippet}

<div class="form-container-wide">
  <div class="form-save-btn">
    <button
      onclick={() => onSave(form)}
      class="bg-blue-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
    >
      Guardar
    </button>
  </div>
  <div class="mb-4">
    <header class="form-header mb-6">
      <div class="flex-1 text-center">
        <h1 class="form-title text-xl mb-0">
          Hoja de Tratamiento de Hemodiálisis
        </h1>
        {#if form.updatedAt}
          <p class="text-[10px] text-gray-400 mt-1">
            Actualizado: {new Date(form.updatedAt).toLocaleString()}
          </p>
        {/if}
      </div>
    </header>

    <div
      class="grid grid-cols-12 gap-4 text-xs border border-gray-200 rounded-lg p-4 bg-gray-50/50"
    >
      <div class="col-span-2">
        <label class="form-label text-[10px] uppercase mb-1"
          >Código Paciente
          {@render lineInput(form.patientCode, (v) => (form.patientCode = v))}
        </label>
      </div>
      <div class="col-span-4">
        <label class="form-label text-[10px] uppercase mb-1"
          >Nombre Completo de Paciente
          {@render lineInput(form.patientName, (v) => (form.patientName = v))}
        </label>
      </div>
      <div class="col-span-1">
        <label class="form-label text-[10px] uppercase mb-1"
          >Ficha No.
          {@render lineInput(form.fileNo, (v) => (form.fileNo = v))}
        </label>
      </div>
      <div class="col-span-2">
        <label class="form-label text-[10px] uppercase mb-1"
          >Fecha
          <input
            type="date"
            bind:value={form.date}
            class="form-input h-9 text-sm"
          />
        </label>
      </div>
      <div class="col-span-1">
        <label class="form-label text-[10px] uppercase mb-1"
          >Turno / Hora
          <div class="flex gap-1">
            {@render lineInput(form.turn, (v) => (form.turn = v))}
            {@render lineInput(form.time, (v) => (form.time = v))}
          </div>
        </label>
      </div>
      <div class="col-span-2">
        <label class="form-label text-[10px] uppercase mb-1"
          >Tipo de Tratamiento
          {@render lineInput(
            form.treatmentType,
            (v) => (form.treatmentType = v),
          )}
        </label>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-6 mb-6">
    <div class="col-span-12 md:col-span-5">
      <h3 class="form-section-title mb-2">Vitales</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <table class="w-full text-center text-xs">
          <thead class="bg-gray-100 text-gray-700 font-bold uppercase">
            <tr>
              <th class="p-2 text-left">Vitales</th>
              <th colspan="2" class="p-2 border-l border-gray-200">Previo</th>
              <th colspan="2" class="p-2 border-l border-gray-200">Antes</th>
              <th colspan="2" class="p-2 border-l border-gray-200">Después</th>
            </tr>
            <tr class="text-[10px] bg-gray-50 border-t border-gray-200">
              <th class="p-1"></th>
              <th class="p-1 border-l border-gray-200">Sentado</th>
              <th class="p-1">Parado</th>
              <th class="p-1 border-l border-gray-200">Sentado</th>
              <th class="p-1">Parado</th>
              <th class="p-1 border-l border-gray-200">Sentado</th>
              <th class="p-1">Parado</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-gray-100">
              <td class="p-2 text-left font-bold text-gray-700">Presión</td>
              <td class="p-1 border-l border-gray-100">
                {@render lineInput(
                  form.vitals.bp.prevSit,
                  (v) => (form.vitals.bp.prevSit = v),
                )}
              </td>
              <td class="p-1">
                {@render lineInput(
                  form.vitals.bp.prevStand,
                  (v) => (form.vitals.bp.prevStand = v),
                )}
              </td>
              <td class="p-1 border-l border-gray-100">
                {@render lineInput(
                  form.vitals.bp.preSit,
                  (v) => (form.vitals.bp.preSit = v),
                )}
              </td>
              <td class="p-1">
                {@render lineInput(
                  form.vitals.bp.preStand,
                  (v) => (form.vitals.bp.preStand = v),
                )}
              </td>
              <td class="p-1 border-l border-gray-100">
                {@render lineInput(
                  form.vitals.bp.postSit,
                  (v) => (form.vitals.bp.postSit = v),
                )}
              </td>
              <td class="p-1">
                {@render lineInput(
                  form.vitals.bp.postStand,
                  (v) => (form.vitals.bp.postStand = v),
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200"
      >
        <div>
          <label class="form-label text-xs mb-1">
            PESO: Algunos <input
              class="form-input h-9 text-sm"
              bind:value={form.vitals.weight.pre}
            />
            />
          </label>
        </div>
        <div>
          <label class="form-label text-xs mb-1"
            >PESO: Despues
            <input
              class="form-input h-9 text-sm"
              bind:value={form.vitals.weight.post}
            />
          </label>
        </div>
      </div>
    </div>

    <div class="col-span-12 md:col-span-7">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="form-label text-xs mb-1"
            >Cubiculo {@render lineInput(
              form.cubicle,
              (v) => (form.cubicle = v),
            )}</label
          >
        </div>
        <div>
          <label class="form-label text-xs mb-1"
            >Clinica {@render lineInput(
              form.clinic,
              (v) => (form.clinic = v),
            )}</label
          >
        </div>
        <div>
          <label class="form-label text-xs mb-1"
            >Hora Tratamiento {@render lineInput(
              form.txTime,
              (v) => (form.txTime = v),
            )}</label
          >
        </div>
        <div>
          <label class="form-label text-xs mb-1"
            >Maquina # {@render lineInput(
              form.machineNo,
              (v) => (form.machineNo = v),
            )}</label
          >
        </div>
        <div>
          <label class="form-label text-xs mb-1"
            >Hora Inicio {@render lineInput(
              form.startTime,
              (v) => (form.startTime = v),
            )}</label
          >
        </div>
        <div>
          <label class="form-label text-xs mb-1"
            >Hora Finalizado {@render lineInput(
              form.endTime,
              (v) => (form.endTime = v),
            )}</label
          >
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
        <div class="flex justify-between items-center">
          <span class="text-xs font-medium text-gray-700"
            >Visitó usted un hospital antes del último tratamiento:</span
          >
          <div class="flex gap-4">
            <label class="form-checkbox-label">
              <input
                type="radio"
                checked={form.hospitalVisit === true}
                onclick={() => (form.hospitalVisit = true)}
                class="form-checkbox"
              /> SI
            </label>
            <label class="form-checkbox-label">
              <input
                type="radio"
                checked={form.hospitalVisit === false}
                onclick={() => (form.hospitalVisit = false)}
                class="form-checkbox"
              /> NO
            </label>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs font-medium text-gray-700"
            >Colección de datos del paciente:</span
          >
          <div class="flex gap-4">
            <label class="form-checkbox-label">
              <input
                type="radio"
                checked={form.dataCollection === true}
                onclick={() => (form.dataCollection = true)}
                class="form-checkbox"
              /> SI
            </label>
            <label class="form-checkbox-label">
              <input
                type="radio"
                checked={form.dataCollection === false}
                onclick={() => (form.dataCollection = false)}
                class="form-checkbox"
              /> NO
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-6 mb-6">
    <div class="col-span-12 md:col-span-6">
      <h3 class="form-section-title mb-2">Pre-Evaluo</h3>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="w-full text-center text-xs">
          <thead class="bg-gray-100 text-gray-700 font-bold uppercase">
            <tr>
              <th class="p-2 text-left">Evaluación</th>
              <th class="p-2 border-l border-gray-200">Hora</th>
              <th class="p-2 border-l border-gray-200">Inicial</th>
              <th class="p-2 border-l border-gray-200">Post</th>
              <th class="p-2 border-l border-gray-200">Iniciales</th>
            </tr>
          </thead>
          <tbody>
            {#each [{ k: "temp", l: "Temperatura" }, { k: "resp", l: "Resp" }, { k: "ct", l: "CT" }, { k: "cardiac", l: "Cardiaco" }, { k: "edema", l: "Edema" }, { k: "mental", l: "Mental" }, { k: "mobility", l: "Movilidad" }, { k: "access", l: "Acceso" }] as row}
              {@const key = row.k as keyof typeof form.preEval}
              <tr class="border-t border-gray-100">
                <td class="p-2 text-left font-medium text-gray-700">{row.l}</td>
                <td class="p-1 border-l border-gray-100">
                  <input class="form-input h-8 text-xs text-center p-1" />
                </td>
                <td class="p-1 border-l border-gray-100">
                  <input
                    class="form-input h-8 text-xs text-center p-1"
                    bind:value={form.preEval[key].initial}
                  />
                </td>
                <td class="p-1 border-l border-gray-100">
                  <input
                    class="form-input h-8 text-xs text-center p-1"
                    bind:value={form.preEval[key].post}
                  />
                </td>
                <td class="p-1 border-l border-gray-100">
                  <input
                    class="form-input h-8 text-xs text-center p-1"
                    bind:value={form.preEval[key].initials}
                  />
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <div class="col-span-12 md:col-span-6">
      <h3 class="form-section-title mb-2">Maquinaria</h3>
      <div
        class="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-3"
      >
        {@render checkInput(
          "Maquinaria y avaluo reutilizar",
          form.machine.reuse,
          () => (form.machine.reuse = !form.machine.reuse),
        )}

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="form-label text-xs mb-1"
              >Conductiva Manual
              {@render lineInput(
                form.machine.conductive,
                (v) => (form.machine.conductive = v),
              )}</label
            >
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >pH Maquina
              {@render lineInput(form.machine.ph, (v) => (form.machine.ph = v))}
            </label>
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >Temp. Iniciales
              {@render lineInput(
                form.machine.temp,
                (v) => (form.machine.temp = v),
              )}
            </label>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-y-2">
          {@render checkInput(
            "Test Alarma Pasar",
            form.machine.alarmTest,
            () => (form.machine.alarmTest = !form.machine.alarmTest),
          )}
          {@render checkInput(
            "Aire Encendido SI",
            form.machine.airOn,
            () => (form.machine.airOn = !form.machine.airOn),
          )}
          {@render checkInput(
            "Sistema UF Pasar",
            form.machine.ufSystem,
            () => (form.machine.ufSystem = !form.machine.ufSystem),
          )}
          {@render checkInput(
            "Test Presencia Positiva",
            form.machine.positiveTest,
            () => (form.machine.positiveTest = !form.machine.positiveTest),
          )}
          {@render checkInput(
            "Test Residual Negativo",
            form.machine.negativeResidual,
            () =>
              (form.machine.negativeResidual = !form.machine.negativeResidual),
          )}
        </div>

        <div>
          <label class="form-label text-xs mb-1"
            >Código Dializador
            {@render lineInput(
              form.machine.dialyzerCode,
              (v) => (form.machine.dialyzerCode = v),
            )}
          </label>
        </div>

        <div class="pt-3 border-t border-gray-200 mt-2 space-y-3">
          <div>
            <label class="form-label text-xs mb-1 text-red-600"
              >ALERGIA
              {@render lineInput(form.allergy, (v) => (form.allergy = v))}
            </label>
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >NOTAS {@render lineInput(
                form.notes,
                (v) => (form.notes = v),
              )}</label
            >
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="form-label text-xs mb-1"
                >Titular 1
                <input
                  placeholder="Nombre"
                  class="form-input h-9 text-xs flex-1"
                  bind:value={form.staff.titular1.name}
                />
                <input
                  placeholder="Ini"
                  class="form-input h-9 text-xs w-12 text-center"
                  bind:value={form.staff.titular1.initials}
                />
              </label>
            </div>

            <div>
              <label class="form-label text-xs mb-1"
                >Titular 2 <div class="flex gap-1">
                  <input
                    placeholder="Nombre"
                    class="form-input h-9 text-xs flex-1"
                    bind:value={form.staff.titular2.name}
                  />
                  <input
                    placeholder="Ini"
                    class="form-input h-9 text-xs w-12 text-center"
                    bind:value={form.staff.titular2.initials}
                  />
                </div>
              </label>
            </div>
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >Nefrologo {@render lineInput(
                form.staff.nephrologist,
                (v) => (form.staff.nephrologist = v),
              )}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-6 mb-6">
    <div class="col-span-12 md:col-span-4">
      <h3 class="form-section-title mb-2">Ordenes de Heparina</h3>
      <div
        class="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-3"
      >
        <div>
          <label class="form-label text-xs mb-1"
            >Tipo {@render lineInput(
              form.heparin.type,
              (v) => (form.heparin.type = v),
            )}</label
          >
        </div>
        <div>
          <label class="form-label text-xs mb-1"
            >Unid. Inicial Bomba
            {@render lineInput(
              form.heparin.initialUnitsPump,
              (v) => (form.heparin.initialUnitsPump = v),
            )}
          </label>
        </div>
        <div>
          <label class="form-label text-xs mb-1"
            >Unidades/Hr {@render lineInput(
              form.heparin.unitsHr,
              (v) => (form.heparin.unitsHr = v),
            )}
          </label>
        </div>
        {@render checkInput(
          "Inclusión bomba",
          form.heparin.pumpInclusion,
          () => (form.heparin.pumpInclusion = !form.heparin.pumpInclusion),
        )}
        <div>
          <label class="form-label text-xs mb-1"
            >Hora Finalizo
            {@render lineInput(
              form.heparin.endTime,
              (v) => (form.heparin.endTime = v),
            )}
          </label>
        </div>
      </div>
    </div>

    <div class="col-span-12 md:col-span-8">
      <h3 class="form-section-title mb-2">Ordenes de Diálisis</h3>
      <div class="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label class="form-label text-xs mb-1"
              >Dializador {@render lineInput(
                form.dialysis.dialyzer,
                (v) => (form.dialysis.dialyzer = v),
              )}
            </label>
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >DFR {@render lineInput(
                form.dialysis.dfr,
                (v) => (form.dialysis.dfr = v),
              )}
            </label>
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >BFR {@render lineInput(
                form.dialysis.bfr,
                (v) => (form.dialysis.bfr = v),
              )}
            </label>
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >TX Tiempo
              {@render lineInput(
                form.dialysis.txTime,
                (v) => (form.dialysis.txTime = v),
              )}</label
            >
          </div>
        </div>

        <div
          class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 border-t border-gray-200 pt-3"
        >
          <div>
            <label class="form-label text-xs mb-1"
              >Diálisis std {@render lineInput(
                form.dialysis.type,
                (v) => (form.dialysis.type = v),
              )}
            </label>
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >K
              {@render lineInput(form.dialysis.k, (v) => (form.dialysis.k = v))}
            </label>
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >Ca
              {@render lineInput(
                form.dialysis.ca,
                (v) => (form.dialysis.ca = v),
              )}
            </label>
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >Bicarbonato {@render lineInput(
                form.dialysis.bicarb,
                (v) => (form.dialysis.bicarb = v),
              )}
            </label>
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >Sodio Mod
              {@render lineInput(
                form.dialysis.sodium,
                (v) => (form.dialysis.sodium = v),
              )}
            </label>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 border-t border-gray-200 pt-3">
          <div>
            <label class="form-label text-xs mb-1"
              >UF Profiling
              {@render lineInput(
                form.dialysis.ufProfile,
                (v) => (form.dialysis.ufProfile = v),
              )}
            </label>
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >Max UFR {@render lineInput(
                form.dialysis.maxUfr,
                (v) => (form.dialysis.maxUfr = v),
              )}
            </label>
          </div>
          <div>
            <label class="form-label text-xs mb-1"
              >Dializador std
              {@render lineInput(
                form.dialysis.dialyzerStd,
                (v) => (form.dialysis.dialyzerStd = v),
              )}
            </label>
          </div>
        </div>
        <div class="mt-4">
          <label class="form-label text-xs mb-1"
            >Acceso a ordenes y comentarios {@render lineInput(
              form.dialysis.comments,
              (v) => (form.dialysis.comments = v),
            )}
          </label>
        </div>
      </div>
    </div>
  </div>

  <div class="mb-6">
    <h3 class="form-section-title mb-2">Accesos</h3>
    <div
      class="border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50"
    >
      <div
        class="grid grid-cols-6 gap-2 text-xs font-bold uppercase p-2 bg-gray-100 border-b border-gray-200 text-center"
      >
        <div class="text-left pl-2">Tipo</div>
        <div>Calibre Aguja</div>
        <div>Tamaño Aguja</div>
        <div>Presión de Pie</div>
        <div>Detención</div>
        <div>Sangrado</div>
      </div>

      <div class="p-2 space-y-2">
        <div class="grid grid-cols-6 gap-2 items-center">
          <div class="font-bold pl-2 text-xs">ARTERIAL</div>
          {@render lineInput(
            form.access.arterial.gauge,
            (v) => (form.access.arterial.gauge = v),
          )}
          {@render lineInput(
            form.access.arterial.size,
            (v) => (form.access.arterial.size = v),
          )}
          {@render lineInput(
            form.access.arterial.pressure,
            (v) => (form.access.arterial.pressure = v),
          )}
          {@render lineInput(
            form.access.arterial.detention,
            (v) => (form.access.arterial.detention = v),
          )}
          {@render lineInput(
            form.access.arterial.bleeding,
            (v) => (form.access.arterial.bleeding = v),
          )}
        </div>
        <div
          class="grid grid-cols-6 gap-2 items-center border-t border-gray-100 pt-2"
        >
          <div class="font-bold pl-2 text-xs">VENOSA</div>
          {@render lineInput(
            form.access.venous.gauge,
            (v) => (form.access.venous.gauge = v),
          )}
          {@render lineInput(
            form.access.venous.size,
            (v) => (form.access.venous.size = v),
          )}
          {@render lineInput(
            form.access.venous.pressure,
            (v) => (form.access.venous.pressure = v),
          )}
          {@render lineInput(
            form.access.venous.detention,
            (v) => (form.access.venous.detention = v),
          )}
          {@render lineInput(
            form.access.venous.bleeding,
            (v) => (form.access.venous.bleeding = v),
          )}
        </div>
      </div>
      <div class="p-4 border-t border-gray-200 bg-white">
        <div class="max-w-md">
          <label class="form-label text-xs mb-1"
            >Catéter colocado por
            {@render lineInput(
              form.access.catheterPlacedBy,
              (v) => (form.access.catheterPlacedBy = v),
            )}
          </label>
        </div>
      </div>
    </div>
  </div>

  <div class="col-span-12 mb-6">
    <h3 class="form-section-title mb-2">Monitoreo</h3>
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-center text-[10px] min-w-200">
          <thead class="bg-gray-100 text-gray-700 font-bold uppercase">
            <tr>
              <th class="p-2 border-r border-gray-200 w-16">Hora</th>
              <th class="p-2 border-r border-gray-200">Sanguineo<br />BP</th>
              <th class="p-2 border-r border-gray-200">Cardio<br />HR</th>
              <th class="p-2 border-r border-gray-200"
                >Veloc Flujo<br />Sangre BFR</th
              >
              <th class="p-2 border-r border-gray-200"
                >% Flujo<br />Dializado DFR</th
              >
              <th class="p-2 border-r border-gray-200 bg-blue-50/50"
                >Presion<br />Arterial AP</th
              >
              <th class="p-2 border-r border-gray-200 bg-blue-50/50"
                >Presion<br />Venosa VP</th
              >
              <th class="p-2 border-r border-gray-200"
                >Fluidos<br />Removidos</th
              >
              <th class="p-2 border-r border-gray-200">Heparina</th>
              <th class="p-2 border-r border-gray-200">UFR %<br />Ultra Fil.</th
              >
              <th class="p-2 border-r border-gray-200">Temp</th>
              <th class="p-2 border-r border-gray-200">BVP/LP</th>
              <th class="p-2 border-r border-gray-200">Accesos</th>
              <th class="p-2 border-r border-gray-200 w-24"
                >Nombre<br />Enfermera</th
              >
              <th class="p-2 w-10">Ini</th>
            </tr>
          </thead>
          <tbody>
            {#each form.monitoring as row}
              <tr class="h-8 border-t border-gray-100 hover:bg-gray-50">
                <td class="border-r border-gray-100 h-8 p-0">
                  {@render gridInput(row.hora, (v) => (row.hora = v))}
                </td>
                <td class="border-r border-gray-100 h-8 p-0">
                  {@render gridInput(row.bp, (v) => (row.bp = v))}
                </td>
                <td class="border-r border-gray-100 h-8 p-0">
                  {@render gridInput(row.hr, (v) => (row.hr = v))}
                </td>
                <td class="border-r border-gray-100 h-8 p-0">
                  {@render gridInput(row.bfr, (v) => (row.bfr = v))}
                </td>
                <td class="border-r border-gray-100 h-8 p-0">
                  {@render gridInput(row.dfr, (v) => (row.dfr = v))}
                </td>
                <td class="border-r border-gray-100 bg-blue-50/30 h-8 p-0">
                  {@render gridInput(row.ap, (v) => (row.ap = v))}
                </td>
                <td class="border-r border-gray-100 bg-blue-50/30 h-8 p-0">
                  {@render gridInput(row.vp, (v) => (row.vp = v))}
                </td>
                <td class="border-r border-gray-100 h-8 p-0">
                  {@render gridInput(row.fluidos, (v) => (row.fluidos = v))}
                </td>
                <td class="border-r border-gray-100 h-8 p-0">
                  {@render gridInput(row.heparina, (v) => (row.heparina = v))}
                </td>
                <td class="border-r border-gray-100 h-8 p-0">
                  {@render gridInput(row.ufr, (v) => (row.ufr = v))}
                </td>
                <td class="border-r border-gray-100 h-8 p-0">
                  {@render gridInput(row.temp, (v) => (row.temp = v))}
                </td>
                <td class="border-r border-gray-100 h-8 p-0">
                  {@render gridInput(row.bvplp, (v) => (row.bvplp = v))}
                </td>
                <td class="border-r border-gray-100 h-8 p-0">
                  {@render gridInput(row.accesos, (v) => (row.accesos = v))}
                </td>
                <td class="border-r border-gray-100 h-8 p-0">
                  {@render gridInput(row.enfermera, (v) => (row.enfermera = v))}
                </td>
                <td class="h-8 p-0">
                  {@render gridInput(row.iniciales, (v) => (row.iniciales = v))}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div
    class="grid grid-cols-12 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200"
  >
    <div class="col-span-12 flex flex-wrap gap-4 items-center mb-2">
      <span class="text-xs font-bold uppercase text-gray-700"
        >Sellos de Heparina CVC:</span
      >
      <div class="flex gap-2 items-center">
        <span class="text-xs font-medium text-gray-600">Ramal Venoso:</span>
        <input
          class="form-input h-8 w-20 text-center text-xs"
          bind:value={form.seals.venous}
        />
      </div>
      <div class="flex gap-2 items-center">
        <span class="text-xs font-medium text-gray-600">Ramal Arterial:</span>
        <input
          class="form-input h-8 w-20 text-center text-xs"
          bind:value={form.seals.arterial}
        />
      </div>
    </div>

    <div class="col-span-12 md:col-span-6">
      <label class="form-label text-xs mb-1"
        >Indicaciones / Comentarios / Notas - Médico <textarea
          class="form-textarea h-24 text-xs resize-none"
          bind:value={form.footerNotes.medical}
        ></textarea>
      </label>

      <div class="mt-2 flex gap-2 items-end">
        <span class="text-[10px] font-bold text-gray-500 uppercase">Firma:</span
        >
        {@render lineInput(
          form.drafters.name1,
          (v) => (form.drafters.name1 = v),
        )}
      </div>
    </div>

    <div class="col-span-12 md:col-span-6">
      <label class="form-label text-xs mb-1"
        >Indicaciones / Comentarios / Notas - Enfermería <textarea
          class="form-textarea h-24 text-xs resize-none"
          bind:value={form.footerNotes.nursing}
        ></textarea></label
      >

      <div class="mt-2 flex gap-2 items-end">
        <span class="text-[10px] font-bold text-gray-500 uppercase">Firma:</span
        >
        {@render lineInput(
          form.drafters.name2,
          (v) => (form.drafters.name2 = v),
        )}
      </div>
    </div>
  </div>
</div>
