<script lang="ts">
  import { untrack } from "svelte";
  // UI Components
  import TextInput from "../ui/TextInput.svelte";
  import DateInput from "../ui/DateInput.svelte";
  import RadioGroup from "../ui/RadioGroup.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import TableInput from "../ui/TableInput.svelte";
  import FormSectionCard from "../../ui/FormSectionCard.svelte";
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

  let {
    initialData = {},
    patientId,
    onSave,
  } = $props<{
    initialData?: Partial<FormState>;
    patientId: string;
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

{#snippet gridInput(value: string, update: (v: string) => void)}
  <input
    type="text"
    {value}
    oninput={(e) => update((e.currentTarget as HTMLInputElement).value)}
    class="form-input bg-transparent h-full text-center text-[10px] p-0.5 border-transparent focus:border-blue-500 focus:bg-white rounded-none shadow-none transition-colors"
  />
{/snippet}

<div class="form-container">
  <header class="form-header mb-6">
    <h2 class="h2-text">Hoja de Tratamiento de Hemodiálisis</h2>
    {#if form.updatedAt}
      <p class="small-text">
        Actualizado: {new Date(form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </header>

  <FormSectionCard
    title="Datos de la Sesión"
    data={form}
    patientId={patientId || ""}
  >
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      <div class="col-span-1 md:col-span-2">
        <TextInput label="Código Paciente" bind:value={form.patientCode} />
      </div>
      <div class="col-span-1 md:col-span-4">
        <TextInput
          label="Nombre Completo de Paciente"
          bind:value={form.patientName}
        />
      </div>
      <div class="col-span-1">
        <TextInput label="Ficha No." bind:value={form.fileNo} />
      </div>
      <div class="col-span-1 md:col-span-2">
        <DateInput label="Fecha" bind:value={form.date} />
      </div>
      <div class="col-span-1">
        <span class="form-label mb-1">Turno / Hora</span>
        <div class="flex gap-1">
          <input
            class="form-input h-9 text-sm"
            bind:value={form.turn}
            placeholder="Turno"
          />
          <input
            class="form-input h-9 text-sm"
            bind:value={form.time}
            placeholder="Hora"
          />
        </div>
      </div>
      <div class="col-span-1 md:col-span-2">
        <TextInput
          label="Tipo de Tratamiento"
          bind:value={form.treatmentType}
        />
      </div>
    </div>
  </FormSectionCard>

  <FormSectionCard title="Vitales" data={form} patientId={patientId || ""}>
    <div class="border border-gray-300 mb-4">
      <table class="w-full text-center text-xs">
        <thead class="bg-gray-200 text-gray-800 font-bold uppercase">
          <tr>
            <th class="p-2 text-left">Vitales</th>
            <th colspan="2" class="p-2 border-l border-gray-200">Previo</th>
            <th colspan="2" class="p-2 border-l border-gray-200">Antes</th>
            <th colspan="2" class="p-2 border-l border-gray-200">Después</th>
          </tr>
          <tr class="text-[10px] bg-gray-100 border-t border-gray-300">
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
              <input
                class="form-input h-8 text-xs text-center p-1"
                bind:value={form.vitals.bp.prevSit}
              />
            </td>
            <td class="p-1">
              <input
                class="form-input h-8 text-xs text-center p-1"
                bind:value={form.vitals.bp.prevStand}
              />
            </td>
            <td class="p-1 border-l border-gray-100">
              <input
                class="form-input h-8 text-xs text-center p-1"
                bind:value={form.vitals.bp.preSit}
              />
            </td>
            <td class="p-1">
              <input
                class="form-input h-8 text-xs text-center p-1"
                bind:value={form.vitals.bp.preStand}
              />
            </td>
            <td class="p-1 border-l border-gray-100">
              <input
                class="form-input h-8 text-xs text-center p-1"
                bind:value={form.vitals.bp.postSit}
              />
            </td>
            <td class="p-1">
              <input
                class="form-input h-8 text-xs text-center p-1"
                bind:value={form.vitals.bp.postStand}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200"
    >
      <div>
        <TextInput label="PESO: Algunos" bind:value={form.vitals.weight.pre} />
      </div>
      <div>
        <TextInput label="PESO: Despues" bind:value={form.vitals.weight.post} />
      </div>
    </div>
  </FormSectionCard>

  <FormSectionCard
    title="Información de Sesión"
    data={form}
    patientId={patientId || ""}
  >
    <div class="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
      <TextInput label="Cubiculo" bind:value={form.cubicle} />
      <TextInput label="Clinica" bind:value={form.clinic} />
      <TextInput label="Hora Tratamiento" bind:value={form.txTime} />
      <TextInput label="Maquina #" bind:value={form.machineNo} />
      <TextInput label="Hora Inicio" bind:value={form.startTime} />
      <TextInput label="Hora Finalizado" bind:value={form.endTime} />
    </div>

    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
      <RadioGroup
        label="Visitó usted un hospital antes del último tratamiento:"
        row
        name="hospitalVisit"
        options={[
          { value: true, label: "SI" },
          { value: false, label: "NO" },
        ]}
        bind:value={form.hospitalVisit}
      />
      <RadioGroup
        label="Colección de datos del paciente:"
        row
        name="dataCollection"
        options={[
          { value: true, label: "SI" },
          { value: false, label: "NO" },
        ]}
        bind:value={form.dataCollection}
      />
    </div>
  </FormSectionCard>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
    <div class="col-span-12 md:col-span-6">
      <FormSectionCard
        title="Pre-Evaluo"
        data={form}
        patientId={patientId || ""}
      >
        <div class="border border-gray-300">
          <table class="w-full text-center text-xs">
            <thead class="bg-gray-200 text-gray-800 font-bold uppercase">
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
                <tr
                  class="border-t border-gray-300 even:bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <td class="p-2 text-left font-medium text-gray-700"
                    >{row.l}</td
                  >
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
      </FormSectionCard>
    </div>

    <div class="col-span-12 md:col-span-6">
      <FormSectionCard
        title="Maquinaria"
        data={form}
        patientId={patientId || ""}
      >
        <div
          class="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-3"
        >
          <Checkbox
            label="Maquinaria y avaluo reutilizar"
            bind:checked={form.machine.reuse}
          />

          <div class="grid grid-cols-2 gap-4">
            <TextInput
              label="Conductiva Manual"
              bind:value={form.machine.conductive}
            />
            <TextInput label="pH Maquina" bind:value={form.machine.ph} />
            <TextInput label="Temp. Iniciales" bind:value={form.machine.temp} />
          </div>

          <div class="grid grid-cols-2 gap-y-2">
            <Checkbox
              label="Test Alarma Pasar"
              bind:checked={form.machine.alarmTest}
            />
            <Checkbox
              label="Aire Encendido SI"
              bind:checked={form.machine.airOn}
            />
            <Checkbox
              label="Sistema UF Pasar"
              bind:checked={form.machine.ufSystem}
            />
            <Checkbox
              label="Test Presencia Positiva"
              bind:checked={form.machine.positiveTest}
            />
            <Checkbox
              label="Test Residual Negativo"
              bind:checked={form.machine.negativeResidual}
            />
          </div>

          <TextInput
            label="Código Dializador"
            bind:value={form.machine.dialyzerCode}
          />

          <div class="pt-3 border-t border-gray-200 mt-2 space-y-3">
            <div class="text-red-600">
              <TextInput label="ALERGIA" bind:value={form.allergy} />
            </div>
            <TextInput label="NOTAS" bind:value={form.notes} />

            <div class="grid grid-cols-2 gap-2">
              <div>
                <span class="form-label text-xs mb-1">Titular 1</span>
                <div class="flex gap-1">
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
                </div>
              </div>
              <div>
                <span class="form-label text-xs mb-1">Titular 2</span>
                <div class="flex gap-1">
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
              </div>
            </div>
            <TextInput label="Nefrologo" bind:value={form.staff.nephrologist} />
          </div>
        </div>
      </FormSectionCard>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
    <div class="col-span-12 md:col-span-4">
      <FormSectionCard
        title="Ordenes de Heparina"
        data={form}
        patientId={patientId || ""}
      >
        <div
          class="border border-gray-200 rounded-lg p-4 bg-gray-50/50 space-y-3"
        >
          <TextInput label="Tipo" bind:value={form.heparin.type} />
          <TextInput
            label="Unid. Inicial Bomba"
            bind:value={form.heparin.initialUnitsPump}
          />
          <TextInput label="Unidades/Hr" bind:value={form.heparin.unitsHr} />
          <Checkbox
            label="Inclusión bomba"
            bind:checked={form.heparin.pumpInclusion}
          />
          <TextInput label="Hora Finalizo" bind:value={form.heparin.endTime} />
        </div>
      </FormSectionCard>
    </div>

    <div class="col-span-12 md:col-span-8">
      <FormSectionCard
        title="Ordenes de Diálisis"
        data={form}
        patientId={patientId || ""}
      >
        <div class="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <TextInput label="Dializador" bind:value={form.dialysis.dialyzer} />
            <TextInput label="DFR" bind:value={form.dialysis.dfr} />
            <TextInput label="BFR" bind:value={form.dialysis.bfr} />
            <TextInput label="TX Tiempo" bind:value={form.dialysis.txTime} />
          </div>

          <div
            class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 border-t border-gray-200 pt-3"
          >
            <TextInput label="Diálisis std" bind:value={form.dialysis.type} />
            <TextInput label="K" bind:value={form.dialysis.k} />
            <TextInput label="Ca" bind:value={form.dialysis.ca} />
            <TextInput label="Bicarbonato" bind:value={form.dialysis.bicarb} />
            <TextInput label="Sodio Mod" bind:value={form.dialysis.sodium} />
          </div>

          <div class="grid grid-cols-3 gap-4 border-t border-gray-200 pt-3">
            <TextInput
              label="UF Profiling"
              bind:value={form.dialysis.ufProfile}
            />
            <TextInput label="Max UFR" bind:value={form.dialysis.maxUfr} />
            <TextInput
              label="Dializador std"
              bind:value={form.dialysis.dialyzerStd}
            />
          </div>
          <div class="mt-4">
            <TextInput
              label="Acceso a ordenes y comentarios"
              bind:value={form.dialysis.comments}
            />
          </div>
        </div>
      </FormSectionCard>
    </div>
  </div>

  <div class="col-span-12 mb-6">
    <FormSectionCard title="Accesos" data={form} patientId={patientId || ""}>
      <div class="border border-gray-300 bg-gray-50/50">
        <div
          class="grid grid-cols-6 gap-2 text-xs font-bold uppercase p-2 bg-gray-200 text-gray-800 border-b border-gray-300 text-center"
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
            <input
              class="form-input h-9 text-sm"
              bind:value={form.access.arterial.gauge}
            />
            <input
              class="form-input h-9 text-sm"
              bind:value={form.access.arterial.size}
            />
            <input
              class="form-input h-9 text-sm"
              bind:value={form.access.arterial.pressure}
            />
            <input
              class="form-input h-9 text-sm"
              bind:value={form.access.arterial.detention}
            />
            <input
              class="form-input h-9 text-sm"
              bind:value={form.access.arterial.bleeding}
            />
          </div>
          <div
            class="grid grid-cols-6 gap-2 items-center border-t border-gray-100 pt-2"
          >
            <div class="font-bold pl-2 text-xs">VENOSA</div>
            <input
              class="form-input h-9 text-sm"
              bind:value={form.access.venous.gauge}
            />
            <input
              class="form-input h-9 text-sm"
              bind:value={form.access.venous.size}
            />
            <input
              class="form-input h-9 text-sm"
              bind:value={form.access.venous.pressure}
            />
            <input
              class="form-input h-9 text-sm"
              bind:value={form.access.venous.detention}
            />
            <input
              class="form-input h-9 text-sm"
              bind:value={form.access.venous.bleeding}
            />
          </div>
        </div>
        <div class="p-4 border-t border-gray-200 bg-white">
          <div class="max-w-md">
            <TextInput
              label="Catéter colocado por"
              bind:value={form.access.catheterPlacedBy}
            />
          </div>
        </div>
      </div>
    </FormSectionCard>
  </div>

  <div class="col-span-12 mb-6">
    <FormSectionCard title="Monitoreo" data={form} patientId={patientId || ""}>
      <div class="border border-gray-300">
        <div class="overflow-x-auto">
          <table class="w-full text-center text-[10px] min-w-[1000px]">
            <thead class="bg-gray-200 text-gray-800 font-bold uppercase">
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
                <th class="p-2 border-r border-gray-200"
                  >UFR %<br />Ultra Fil.</th
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
                <tr
                  class="h-8 border-t border-gray-300 even:bg-gray-100 hover:bg-gray-200 transition-colors"
                >
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
                    {@render gridInput(
                      row.enfermera,
                      (v) => (row.enfermera = v),
                    )}
                  </td>
                  <td class="h-8 p-0">
                    {@render gridInput(
                      row.iniciales,
                      (v) => (row.iniciales = v),
                    )}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </FormSectionCard>
  </div>

  <div class="col-span-12">
    <FormSectionCard
      title="Notas y Firmas"
      data={form}
      patientId={patientId || ""}
    >
      <div
        class="grid grid-cols-12 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200"
      >
        <div class="col-span-12 mb-2">
          <div class="text-xs font-bold uppercase text-gray-700 mb-2">
            Sellos de Heparina CVC:
          </div>
          <div class="flex flex-wrap gap-4 items-center">
            <div class="flex gap-2 items-center">
              <span class="text-xs font-medium text-gray-600"
                >Ramal Venoso:</span
              >
              <input
                class="form-input h-8 w-20 text-center text-xs"
                bind:value={form.seals.venous}
              />
            </div>
            <div class="flex gap-2 items-center">
              <span class="text-xs font-medium text-gray-600"
                >Ramal Arterial:</span
              >
              <input
                class="form-input h-8 w-20 text-center text-xs"
                bind:value={form.seals.arterial}
              />
            </div>
          </div>
        </div>

        <div class="col-span-12 md:col-span-6">
          <label class="form-label text-xs mb-1">
            Indicaciones / Comentarios / Notas - Médico
            <textarea
              class="form-textarea h-24 text-xs resize-none w-full form-input"
              bind:value={form.footerNotes.medical}
            ></textarea>
          </label>

          <div class="mt-2 flex gap-2 items-end">
            <span class="text-[10px] font-bold text-gray-500 uppercase"
              >Firma:</span
            >
            <TextInput label="" bind:value={form.drafters.name1} />
          </div>
        </div>

        <div class="col-span-12 md:col-span-6">
          <label class="form-label text-xs mb-1">
            Indicaciones / Comentarios / Notas - Enfermería
            <textarea
              class="form-textarea h-24 text-xs resize-none w-full form-input"
              bind:value={form.footerNotes.nursing}
            ></textarea>
          </label>

          <div class="mt-2 flex gap-2 items-end">
            <span class="text-[10px] font-bold text-gray-500 uppercase"
              >Firma:</span
            >
            <TextInput label="" bind:value={form.drafters.name2} />
          </div>
        </div>
      </div>
    </FormSectionCard>
  </div>

  <div class="form-save-btn pt-4 flex justify-end">
    <button
      onclick={() => onSave(form)}
      class="bg-blue-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
    >
      Guardar
    </button>
  </div>
</div>
