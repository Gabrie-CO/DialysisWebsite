<script lang="ts">
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
    class="w-full border-b border-gray-400 outline-none bg-transparent px-1 text-xs focus:border-blue-800"
    {placeholder}
  />
{/snippet}

{#snippet gridInput(value: string, update: (v: string) => void)}
  <input
    type="text"
    {value}
    oninput={(e) => update((e.currentTarget as HTMLInputElement).value)}
    class="w-full h-full text-center bg-transparent outline-none text-[10px] p-0.5 border-none focus:bg-blue-50"
  />
{/snippet}

{#snippet checkInput(label: string, checked: boolean, toggle: () => void)}
  <label class="flex items-center gap-1 cursor-pointer whitespace-nowrap">
    <input
      type="checkbox"
      {checked}
      onchange={toggle}
      class="w-3 h-3 border-gray-500 rounded-none accent-black"
    />
    <span class="text-[10px] uppercase font-bold text-gray-700">{label}</span>
  </label>
{/snippet}

<div
  class="max-w-300 mx-auto p-4 bg-white shadow-xl font-sans text-gray-900 print:shadow-none print:max-w-none print:p-0"
>
  <div class="border-b-2 border-black pb-2 mb-2">
    <h1
      class="text-xl font-bold uppercase text-center mb-4 tracking-widest text-blue-900"
    >
      Hoja de Tratamiento de Hemodiálisis
    </h1>

    <div class="grid grid-cols-12 gap-4 text-xs">
      <div class="col-span-2">
        <label class="block font-bold text-[9px] uppercase"
          >Código Paciente</label
        >
        {@render lineInput(form.patientCode, (v) => (form.patientCode = v))}
      </div>
      <div class="col-span-4">
        <label class="block font-bold text-[9px] uppercase"
          >Nombre Completo de Paciente</label
        >
        {@render lineInput(form.patientName, (v) => (form.patientName = v))}
      </div>
      <div class="col-span-1">
        <label class="block font-bold text-[9px] uppercase">Ficha No.</label>
        {@render lineInput(form.fileNo, (v) => (form.fileNo = v))}
      </div>
      <div class="col-span-2">
        <label class="block font-bold text-[9px] uppercase">Fecha</label>
        <input
          type="date"
          bind:value={form.date}
          class="w-full border-b border-gray-400 bg-transparent"
        />
      </div>
      <div class="col-span-1">
        <label class="block font-bold text-[9px] uppercase">Turno / Hora</label>
        <div class="flex gap-1">
          {@render lineInput(form.turn, (v) => (form.turn = v))}
          {@render lineInput(form.time, (v) => (form.time = v))}
        </div>
      </div>
      <div class="col-span-2">
        <label class="block font-bold text-[9px] uppercase"
          >Tipo de Tratamiento</label
        >
        {@render lineInput(form.treatmentType, (v) => (form.treatmentType = v))}
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-4 mb-2 border-b border-black pb-2">
    <div class="col-span-5">
      <h3 class="font-bold text-xs bg-gray-200 px-1 mb-1">VITALES</h3>
      <table class="w-full text-center text-xs border-collapse">
        <thead>
          <tr class="text-[9px] uppercase font-bold text-gray-500">
            <th class="text-left">Vitales</th>
            <th colspan="2" class="border-b border-gray-400">Previo</th>
            <th colspan="2" class="border-b border-gray-400 bg-gray-50"
              >Antes</th
            >
            <th colspan="2" class="border-b border-gray-400">Después</th>
          </tr>
          <tr class="text-[9px] uppercase">
            <th></th>
            <th>Sentado</th><th>Parado</th>
            <th class="bg-gray-50">Sentado</th><th class="bg-gray-50">Parado</th
            >
            <th>Sentado</th><th>Parado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left font-bold">Presión</td>
            <td
              >{@render lineInput(
                form.vitals.bp.prevSit,
                (v) => (form.vitals.bp.prevSit = v),
              )}</td
            >
            <td
              >{@render lineInput(
                form.vitals.bp.prevStand,
                (v) => (form.vitals.bp.prevStand = v),
              )}</td
            >
            <td class="bg-gray-50"
              >{@render lineInput(
                form.vitals.bp.preSit,
                (v) => (form.vitals.bp.preSit = v),
              )}</td
            >
            <td class="bg-gray-50"
              >{@render lineInput(
                form.vitals.bp.preStand,
                (v) => (form.vitals.bp.preStand = v),
              )}</td
            >
            <td
              >{@render lineInput(
                form.vitals.bp.postSit,
                (v) => (form.vitals.bp.postSit = v),
              )}</td
            >
            <td
              >{@render lineInput(
                form.vitals.bp.postStand,
                (v) => (form.vitals.bp.postStand = v),
              )}</td
            >
          </tr>
        </tbody>
      </table>
      <div class="flex gap-4 mt-2 text-xs">
        <div class="flex items-end gap-2">
          <span class="font-bold">PESO: Antes</span>
          <input
            class="w-12 border-b border-black text-center"
            bind:value={form.vitals.weight.pre}
          />
        </div>
        <div class="flex items-end gap-2">
          <span class="font-bold">Despues</span>
          <input
            class="w-12 border-b border-black text-center"
            bind:value={form.vitals.weight.post}
          />
        </div>
      </div>
    </div>

    <div class="col-span-7 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
      <div class="flex gap-2">
        <span class="font-bold">Cubiculo:</span>
        {@render lineInput(form.cubicle, (v) => (form.cubicle = v))}
      </div>
      <div class="flex gap-2">
        <span class="font-bold">Clinica:</span>
        {@render lineInput(form.clinic, (v) => (form.clinic = v))}
      </div>

      <div class="flex gap-2">
        <span class="font-bold">Hora Tratamiento:</span>
        {@render lineInput(form.txTime, (v) => (form.txTime = v))}
      </div>
      <div class="flex gap-2">
        <span class="font-bold">Maquina #:</span>
        {@render lineInput(form.machineNo, (v) => (form.machineNo = v))}
      </div>

      <div class="flex gap-2">
        <span class="font-bold">Hora Inicio:</span>
        {@render lineInput(form.startTime, (v) => (form.startTime = v))}
      </div>
      <div class="flex gap-2">
        <span class="font-bold">Hora Finalizado:</span>
        {@render lineInput(form.endTime, (v) => (form.endTime = v))}
      </div>

      <div class="col-span-2 mt-2 space-y-1">
        <div class="flex justify-between">
          <span>Visitó usted un hospital antes del último tratamiento:</span>
          <div class="flex gap-2">
            <label
              ><input
                type="radio"
                checked={form.hospitalVisit === true}
                onclick={() => (form.hospitalVisit = true)}
              /> SI</label
            >
            <label
              ><input
                type="radio"
                checked={form.hospitalVisit === false}
                onclick={() => (form.hospitalVisit = false)}
              /> NO</label
            >
          </div>
        </div>
        <div class="flex justify-between">
          <span>Colección de datos del paciente:</span>
          <div class="flex gap-2">
            <label
              ><input
                type="radio"
                checked={form.dataCollection === true}
                onclick={() => (form.dataCollection = true)}
              /> SI</label
            >
            <label
              ><input
                type="radio"
                checked={form.dataCollection === false}
                onclick={() => (form.dataCollection = false)}
              /> NO</label
            >
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-4 mb-2 border-b border-black pb-2">
    <div class="col-span-6 border-r border-gray-300 pr-2">
      <h3 class="font-bold text-xs bg-gray-200 px-1 mb-1">PRE-EVALUO</h3>
      <table class="w-full text-center text-[10px] border-collapse">
        <thead>
          <tr class="font-bold uppercase text-gray-500 border-b">
            <th class="text-left w-20">Evaluación</th>
            <th>Hora</th><th>Inicial</th><th>Post</th><th>Iniciales</th>
          </tr>
        </thead>
        <tbody>
          {#each [{ k: "temp", l: "Temperatura" }, { k: "resp", l: "Resp" }, { k: "ct", l: "CT" }, { k: "cardiac", l: "Cardiaco" }, { k: "edema", l: "Edema" }, { k: "mental", l: "Mental" }, { k: "mobility", l: "Movilidad" }, { k: "access", l: "Acceso" }] as row}
            {@const key = row.k as keyof typeof form.preEval}
            <tr>
              <td class="text-left font-bold">{row.l}</td>
              <td>
                <input
                  class="w-full text-center bg-transparent border-b border-dotted"
                />
              </td>
              <td>
                <input
                  class="w-full text-center bg-transparent border-b border-dotted"
                  bind:value={form.preEval[key].initial}
                />
              </td>
              <td>
                <input
                  class="w-full text-center bg-transparent border-b border-dotted"
                  bind:value={form.preEval[key].post}
                />
              </td>
              <td>
                <input
                  class="w-full text-center bg-transparent border-b border-dotted"
                  bind:value={form.preEval[key].initials}
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="col-span-6 pl-2">
      <h3 class="font-bold text-xs bg-gray-200 px-1 mb-1">MAQUINARIA</h3>
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
        {@render checkInput(
          "Maquinaria y avaluo reutilizar",
          form.machine.reuse,
          () => (form.machine.reuse = !form.machine.reuse),
        )}

        <div class="flex items-end gap-1">
          <span class="font-bold">Conductiva Manual:</span>
          {@render lineInput(
            form.machine.conductive,
            (v) => (form.machine.conductive = v),
          )}
        </div>
        <div class="flex items-end gap-1">
          <span class="font-bold">pH Maquina:</span>
          {@render lineInput(form.machine.ph, (v) => (form.machine.ph = v))}
        </div>
        <div class="flex items-end gap-1">
          <span class="font-bold">Temp. Iniciales:</span>
          {@render lineInput(form.machine.temp, (v) => (form.machine.temp = v))}
        </div>

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

        <div class="col-span-2 flex items-end gap-1 mt-1">
          <span class="font-bold">Código Dializador:</span>
          {@render lineInput(
            form.machine.dialyzerCode,
            (v) => (form.machine.dialyzerCode = v),
          )}
        </div>
      </div>

      <div class="mt-2 pt-2 border-t border-gray-300">
        <div class="flex gap-2 items-end mb-1">
          <span class="font-bold text-[10px] text-red-600">ALERGIA:</span>
          {@render lineInput(form.allergy, (v) => (form.allergy = v))}
        </div>
        <div class="flex gap-2 items-end mb-1">
          <span class="font-bold text-[10px]">NOTAS:</span>
          {@render lineInput(form.notes, (v) => (form.notes = v))}
        </div>
        <div class="flex gap-2 text-[10px]">
          <input
            placeholder="Nombre Titular"
            class="flex-1 border-b"
            bind:value={form.staff.titular1.name}
          />
          <input
            placeholder="Ini"
            class="w-8 border-b text-center"
            bind:value={form.staff.titular1.initials}
          />
          <input
            placeholder="Nombre Titular"
            class="flex-1 border-b"
            bind:value={form.staff.titular2.name}
          />
          <input
            placeholder="Ini"
            class="w-8 border-b text-center"
            bind:value={form.staff.titular2.initials}
          />
        </div>
        <div class="flex gap-2 text-[10px] mt-1">
          <span class="font-bold">Nefrologo:</span>
          {@render lineInput(
            form.staff.nephrologist,
            (v) => (form.staff.nephrologist = v),
          )}
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-12 gap-2 mb-2 border-b border-black pb-2">
    <div class="col-span-4 border-r border-gray-300 pr-2">
      <h3 class="font-bold text-xs bg-gray-200 px-1 mb-1">
        ORDENES DE HEPARINA
      </h3>
      <div class="space-y-1 text-[10px]">
        <div class="flex gap-2">
          <span class="font-bold w-24">Tipo:</span>
          {@render lineInput(form.heparin.type, (v) => (form.heparin.type = v))}
        </div>
        <div class="flex gap-2">
          <span class="font-bold w-24">Unid. Inicial Bomba:</span>
          {@render lineInput(
            form.heparin.initialUnitsPump,
            (v) => (form.heparin.initialUnitsPump = v),
          )}
        </div>
        <div class="flex gap-2">
          <span class="font-bold w-24">Unidades/Hr:</span>
          {@render lineInput(
            form.heparin.unitsHr,
            (v) => (form.heparin.unitsHr = v),
          )}
        </div>
        <div class="flex gap-2 items-center">
          <span class="font-bold w-24">Inclusión bomba:</span>
          <input
            type="checkbox"
            checked={form.heparin.pumpInclusion}
            onclick={() =>
              (form.heparin.pumpInclusion = !form.heparin.pumpInclusion)}
          />
        </div>
        <div class="flex gap-2">
          <span class="font-bold w-24">Hora Finalizo:</span>
          {@render lineInput(
            form.heparin.endTime,
            (v) => (form.heparin.endTime = v),
          )}
        </div>
      </div>
    </div>

    <div class="col-span-8 pl-2">
      <h3 class="font-bold text-xs bg-gray-200 px-1 mb-1">
        ORDENES DE DIÁLISIS
      </h3>
      <div class="grid grid-cols-4 gap-2 text-[10px] mb-2">
        <label
          >Dializador: {@render lineInput(
            form.dialysis.dialyzer,
            (v) => (form.dialysis.dialyzer = v),
          )}</label
        >
        <label
          >DFR: {@render lineInput(
            form.dialysis.dfr,
            (v) => (form.dialysis.dfr = v),
          )}</label
        >
        <label
          >BFR: {@render lineInput(
            form.dialysis.bfr,
            (v) => (form.dialysis.bfr = v),
          )}</label
        >
        <label
          >TX Tiempo: {@render lineInput(
            form.dialysis.txTime,
            (v) => (form.dialysis.txTime = v),
          )}</label
        >
      </div>

      <div class="grid grid-cols-5 gap-2 text-[10px] mb-2 border-t pt-1">
        <label
          >Diálisis std: {@render lineInput(
            form.dialysis.type,
            (v) => (form.dialysis.type = v),
          )}</label
        >
        <label
          >K: {@render lineInput(
            form.dialysis.k,
            (v) => (form.dialysis.k = v),
          )}</label
        >
        <label
          >Ca: {@render lineInput(
            form.dialysis.ca,
            (v) => (form.dialysis.ca = v),
          )}</label
        >
        <label
          >Bicarbonato: {@render lineInput(
            form.dialysis.bicarb,
            (v) => (form.dialysis.bicarb = v),
          )}</label
        >
        <label
          >Sodio Mod: {@render lineInput(
            form.dialysis.sodium,
            (v) => (form.dialysis.sodium = v),
          )}</label
        >
      </div>

      <div class="grid grid-cols-3 gap-2 text-[10px] border-t pt-1">
        <label
          >UF Profiling: {@render lineInput(
            form.dialysis.ufProfile,
            (v) => (form.dialysis.ufProfile = v),
          )}</label
        >
        <label
          >Max UFR: {@render lineInput(
            form.dialysis.maxUfr,
            (v) => (form.dialysis.maxUfr = v),
          )}</label
        >
        <label
          >Dializador std: {@render lineInput(
            form.dialysis.dialyzerStd,
            (v) => (form.dialysis.dialyzerStd = v),
          )}</label
        >
      </div>
      <div class="mt-1 text-[10px] flex gap-2">
        <span class="font-bold whitespace-nowrap"
          >Acceso a ordenes y comentarios:</span
        >
        {@render lineInput(
          form.dialysis.comments,
          (v) => (form.dialysis.comments = v),
        )}
      </div>
    </div>
  </div>

  <div class="mb-2 border border-black p-1">
    <div
      class="grid grid-cols-6 gap-2 text-[10px] text-center font-bold uppercase mb-1"
    >
      <div class="text-left pl-2">Tipo</div>
      <div>Calibre Aguja</div>
      <div>Tamaño Aguja</div>
      <div>Presión de Pie</div>
      <div>Detención</div>
      <div>Sangrado</div>
    </div>

    <div class="grid grid-cols-6 gap-2 text-[10px] mb-1">
      <div class="font-bold pl-2">ARTERIAL</div>
      <div>
        {@render lineInput(
          form.access.arterial.gauge,
          (v) => (form.access.arterial.gauge = v),
        )}
      </div>
      <div>
        {@render lineInput(
          form.access.arterial.size,
          (v) => (form.access.arterial.size = v),
        )}
      </div>
      <div>
        {@render lineInput(
          form.access.arterial.pressure,
          (v) => (form.access.arterial.pressure = v),
        )}
      </div>
      <div>
        {@render lineInput(
          form.access.arterial.detention,
          (v) => (form.access.arterial.detention = v),
        )}
      </div>
      <div>
        {@render lineInput(
          form.access.arterial.bleeding,
          (v) => (form.access.arterial.bleeding = v),
        )}
      </div>
    </div>

    <div class="grid grid-cols-6 gap-2 text-[10px] mb-1">
      <div class="font-bold pl-2">VENOSA</div>
      <div>
        {@render lineInput(
          form.access.venous.gauge,
          (v) => (form.access.venous.gauge = v),
        )}
      </div>
      <div>
        {@render lineInput(
          form.access.venous.size,
          (v) => (form.access.venous.size = v),
        )}
      </div>
      <div>
        {@render lineInput(
          form.access.venous.pressure,
          (v) => (form.access.venous.pressure = v),
        )}
      </div>
      <div>
        {@render lineInput(
          form.access.venous.detention,
          (v) => (form.access.venous.detention = v),
        )}
      </div>
      <div>
        {@render lineInput(
          form.access.venous.bleeding,
          (v) => (form.access.venous.bleeding = v),
        )}
      </div>
    </div>

    <div class="mt-1 text-[10px] flex gap-2">
      <span class="font-bold">Catéter colocado por:</span>
      {@render lineInput(
        form.access.catheterPlacedBy,
        (v) => (form.access.catheterPlacedBy = v),
      )}
    </div>
  </div>

  <div class="overflow-x-auto border-2 border-black mb-2">
    <table class="w-full text-center border-collapse min-w-225">
      <thead>
        <tr
          class="bg-gray-200 text-[9px] uppercase font-bold text-gray-800 leading-tight"
        >
          <th class="border border-gray-400 p-1 w-12">Hora</th>
          <th class="border border-gray-400 p-1">Sanguineo<br />BP</th>
          <th class="border border-gray-400 p-1">Cardio<br />HR</th>
          <th class="border border-gray-400 p-1">Veloc Flujo<br />Sangre BFR</th
          >
          <th class="border border-gray-400 p-1">% Flujo<br />Dializado DFR</th>
          <th class="border border-gray-400 p-1 bg-blue-50"
            >Presion<br />Arterial AP</th
          >
          <th class="border border-gray-400 p-1 bg-blue-50"
            >Presion<br />Venosa VP</th
          >
          <th class="border border-gray-400 p-1">Fluidos<br />Removidos</th>
          <th class="border border-gray-400 p-1">Heparina</th>
          <th class="border border-gray-400 p-1">UFR %<br />Ultra Fil.</th>
          <th class="border border-gray-400 p-1">Temp</th>
          <th class="border border-gray-400 p-1">BVP/LP</th>
          <th class="border border-gray-400 p-1">Accesos</th>
          <th class="border border-gray-400 p-1 w-24">Nombre<br />Enfermera</th>
          <th class="border border-gray-400 p-1 w-8">Ini</th>
        </tr>
      </thead>
      <tbody>
        {#each form.monitoring as row}
          <tr class="h-6 border-b border-gray-300 hover:bg-blue-50">
            <td class="border-r border-gray-300"
              >{@render gridInput(row.hora, (v) => (row.hora = v))}</td
            >
            <td class="border-r border-gray-300"
              >{@render gridInput(row.bp, (v) => (row.bp = v))}</td
            >
            <td class="border-r border-gray-300"
              >{@render gridInput(row.hr, (v) => (row.hr = v))}</td
            >
            <td class="border-r border-gray-300"
              >{@render gridInput(row.bfr, (v) => (row.bfr = v))}</td
            >
            <td class="border-r border-gray-300"
              >{@render gridInput(row.dfr, (v) => (row.dfr = v))}</td
            >
            <td class="border-r border-gray-300 bg-gray-50"
              >{@render gridInput(row.ap, (v) => (row.ap = v))}</td
            >
            <td class="border-r border-gray-300 bg-gray-50"
              >{@render gridInput(row.vp, (v) => (row.vp = v))}</td
            >
            <td class="border-r border-gray-300"
              >{@render gridInput(row.fluidos, (v) => (row.fluidos = v))}</td
            >
            <td class="border-r border-gray-300"
              >{@render gridInput(row.heparina, (v) => (row.heparina = v))}</td
            >
            <td class="border-r border-gray-300"
              >{@render gridInput(row.ufr, (v) => (row.ufr = v))}</td
            >
            <td class="border-r border-gray-300"
              >{@render gridInput(row.temp, (v) => (row.temp = v))}</td
            >
            <td class="border-r border-gray-300"
              >{@render gridInput(row.bvplp, (v) => (row.bvplp = v))}</td
            >
            <td class="border-r border-gray-300"
              >{@render gridInput(row.accesos, (v) => (row.accesos = v))}</td
            >
            <td class="border-r border-gray-300"
              >{@render gridInput(
                row.enfermera,
                (v) => (row.enfermera = v),
              )}</td
            >
            <td
              >{@render gridInput(
                row.iniciales,
                (v) => (row.iniciales = v),
              )}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="grid grid-cols-12 gap-4 text-xs">
    <div class="col-span-12 flex gap-4 bg-gray-100 p-1 mb-2">
      <span class="font-bold uppercase">Sellos de Heparina CVC:</span>
      <div class="flex gap-2 items-center">
        <span class="font-bold">Ramal Venoso:</span>
        <input
          class="w-16 border-b border-black bg-transparent"
          bind:value={form.seals.venous}
        />
      </div>
      <div class="flex gap-2 items-center">
        <span class="font-bold">Ramal Arterial:</span>
        <input
          class="w-16 border-b border-black bg-transparent"
          bind:value={form.seals.arterial}
        />
      </div>
    </div>

    <div class="col-span-6 border border-gray-400 p-2 min-h-20">
      <span class="font-bold block text-[10px] uppercase mb-1"
        >Indicaciones / Comentarios / Notas - Médico</span
      >
      <textarea
        class="w-full h-16 bg-transparent outline-none resize-none"
        bind:value={form.footerNotes.medical}
      ></textarea>
    </div>

    <div class="col-span-6 border border-gray-400 p-2 min-h-20">
      <span class="font-bold block text-[10px] uppercase mb-1"
        >Indicaciones / Comentarios / Notas - Enfermería</span
      >
      <textarea
        class="w-full h-16 bg-transparent outline-none resize-none"
        bind:value={form.footerNotes.nursing}
      ></textarea>
    </div>

    <div class="col-span-6 flex gap-2 items-end mt-2">
      <span class="font-bold text-[10px]">Nombre de quien redacta:</span>
      {@render lineInput(form.drafters.name1, (v) => (form.drafters.name1 = v))}
    </div>
    <div class="col-span-6 flex gap-2 items-end mt-2">
      <span class="font-bold text-[10px]">Nombre de quien redacta:</span>
      {@render lineInput(form.drafters.name2, (v) => (form.drafters.name2 = v))}
    </div>
  </div>
</div>
