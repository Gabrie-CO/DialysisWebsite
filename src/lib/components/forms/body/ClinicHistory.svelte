<script lang="ts">
  // --- TYPES ---
  // Defining types to avoid TypeScript errors
  type RadioState = string;

  interface FormState {
    general: {
      name: string;
      occupation: string;
      date: string;
    };
    history: {
      ageRange: RadioState;
      sex: RadioState;
      comorbidities: {
        hta: boolean;
        dm2: boolean;
        cardiopathy: boolean;
        other: string;
      };
      timeInHd: RadioState;
      accessType: {
        favAutologous: boolean;
        favProsthetic: boolean;
        cvcPermanent: boolean;
        cvcTemporal: boolean;
        other: string;
      };
      placementDate: {
        exact: string;
        approx: string;
        dontRemember: boolean;
      };
      location: {
        radioCephalicL: boolean;
        radioCephalicR: boolean;
        brachialL: boolean;
        brachialR: boolean;
        subclavianL: boolean;
        subclavianR: boolean;
        femoralL: boolean;
        femoralR: boolean;
        jugularL: boolean;
        jugularR: boolean;
      };
      functionality: {
        arterial: boolean;
        venous: boolean;
        both: boolean;
      };
      dysfunction: {
        mechanicalObstruction: {
          active: boolean;
          type: "partial" | "total" | null;
        };
        clots: boolean;
        fibrin: boolean;
        kinking: boolean; // Acodamiento
        other: string;
      };
      seals: {
        heparin: boolean;
        duralock: boolean;
      };
      thrombolysis: {
        active: boolean | null; // Si/No
        count: string;
        timeAgo: string;
      };
      previousAV: RadioState; // 1AV, 2AV, etc
      previousLocation: {
        femoral: boolean;
        jugular: boolean;
        subclavian: boolean;
        fav: boolean;
      };
    };
    physicalExam: {
      inspection: {
        skinIntact: boolean;
        hematoma: boolean;
        shinySkin: boolean;
        ecchymosis: boolean;
        redness: boolean;
        collaterals: boolean;
        flatSpots: boolean;
        edema: boolean;
        cyanosis: boolean;
        aneurysms: boolean;
      };
      palpation: {
        tempChanges: boolean;
        thrillSoft: boolean;
        thrillPulsatile: boolean;
      };
      auscultation: {
        murmurSoft: boolean;
        murmurPathological: boolean;
      };
      matureCharacteristics: {
        hemostasisTime: "5-10" | ">10" | null;
        stenosis: boolean | null;
        aneurysms: "1" | "2" | ">3" | null;
        stealSyndrome: boolean | null;
        tortuous: boolean | null;
        thrombosis: {
          active: boolean; // Si/No
          type: "partial" | "total" | null;
        };
        siteRotation: boolean | null;
      };
      observations: string;
    };
    followUp: Array<{ date: string; obs: string }>;
    updatedAt?: string;
  }

  let { initialData = {}, onSave } = $props<{
    initialData?: Partial<FormState>;
    onSave: (data: FormState) => void;
  }>();

  // --- STATE ---
  let form = $state<FormState>({
    general: { name: "", occupation: "", date: "" },
    history: {
      ageRange: "",
      sex: "",
      comorbidities: { hta: false, dm2: false, cardiopathy: false, other: "" },
      timeInHd: "",
      accessType: {
        favAutologous: false,
        favProsthetic: false,
        cvcPermanent: false,
        cvcTemporal: false,
        other: "",
      },
      placementDate: { exact: "", approx: "", dontRemember: false },
      location: {
        radioCephalicL: false,
        radioCephalicR: false,
        brachialL: false,
        brachialR: false,
        subclavianL: false,
        subclavianR: false,
        femoralL: false,
        femoralR: false,
        jugularL: false,
        jugularR: false,
      },
      functionality: { arterial: false, venous: false, both: false },
      dysfunction: {
        mechanicalObstruction: { active: false, type: null },
        clots: false,
        fibrin: false,
        kinking: false,
        other: "",
      },
      seals: { heparin: false, duralock: false },
      thrombolysis: { active: null, count: "", timeAgo: "" },
      previousAV: "",
      previousLocation: {
        femoral: false,
        jugular: false,
        subclavian: false,
        fav: false,
      },
    },
    physicalExam: {
      inspection: {
        skinIntact: false,
        hematoma: false,
        shinySkin: false,
        ecchymosis: false,
        redness: false,
        collaterals: false,
        flatSpots: false,
        edema: false,
        cyanosis: false,
        aneurysms: false,
      },
      palpation: {
        tempChanges: false,
        thrillSoft: false,
        thrillPulsatile: false,
      },
      auscultation: { murmurSoft: false, murmurPathological: false },
      matureCharacteristics: {
        hemostasisTime: null,
        stenosis: null,
        aneurysms: null,
        stealSyndrome: null,
        tortuous: null,
        thrombosis: { active: false, type: null },
        siteRotation: null,
      },
      observations: "",
    },
    followUp: [
      { date: "", obs: "" },
      { date: "", obs: "" },
      { date: "", obs: "" },
    ],
    ...initialData,
  });

  $effect(() => {
    form = {
      general: { name: "", occupation: "", date: "", ...initialData.general },
      history: {
        ageRange: "",
        sex: "",
        comorbidities: {
          hta: false,
          dm2: false,
          cardiopathy: false,
          other: "",
          ...initialData.history?.comorbidities,
        },
        timeInHd: "",
        accessType: {
          favAutologous: false,
          favProsthetic: false,
          cvcPermanent: false,
          cvcTemporal: false,
          other: "",
          ...initialData.history?.accessType,
        },
        placementDate: {
          exact: "",
          approx: "",
          dontRemember: false,
          ...initialData.history?.placementDate,
        },
        location: {
          radioCephalicL: false,
          radioCephalicR: false,
          brachialL: false,
          brachialR: false,
          subclavianL: false,
          subclavianR: false,
          femoralL: false,
          femoralR: false,
          jugularL: false,
          jugularR: false,
          ...initialData.history?.location,
        },
        functionality: {
          arterial: false,
          venous: false,
          both: false,
          ...initialData.history?.functionality,
        },
        dysfunction: {
          mechanicalObstruction: {
            active: false,
            type: null,
            ...initialData.history?.dysfunction?.mechanicalObstruction,
          },
          clots: false,
          fibrin: false,
          kinking: false,
          other: "",
          ...initialData.history?.dysfunction,
        },
        seals: {
          heparin: false,
          duralock: false,
          ...initialData.history?.seals,
        },
        thrombolysis: {
          active: null,
          count: "",
          timeAgo: "",
          ...initialData.history?.thrombolysis,
        },
        previousAV: "",
        previousLocation: {
          femoral: false,
          jugular: false,
          subclavian: false,
          fav: false,
          ...initialData.history?.previousLocation,
        },
        ...initialData.history,
      },
      physicalExam: {
        inspection: {
          skinIntact: false,
          hematoma: false,
          shinySkin: false,
          ecchymosis: false,
          redness: false,
          collaterals: false,
          flatSpots: false,
          edema: false,
          cyanosis: false,
          aneurysms: false,
          ...initialData.physicalExam?.inspection,
        },
        palpation: {
          tempChanges: false,
          thrillSoft: false,
          thrillPulsatile: false,
          ...initialData.physicalExam?.palpation,
        },
        auscultation: {
          murmurSoft: false,
          murmurPathological: false,
          ...initialData.physicalExam?.auscultation,
        },
        matureCharacteristics: {
          hemostasisTime: null,
          stenosis: null,
          aneurysms: null,
          stealSyndrome: null,
          tortuous: null,
          thrombosis: {
            active: false,
            type: null,
            ...initialData.physicalExam?.matureCharacteristics?.thrombosis,
          },
          siteRotation: null,
          ...initialData.physicalExam?.matureCharacteristics,
        },
        observations: "",
        ...initialData.physicalExam,
      },
      followUp: initialData.followUp || [
        { date: "", obs: "" },
        { date: "", obs: "" },
        { date: "", obs: "" },
      ],
      ...initialData,
    };
  });
</script>

{#snippet sectionTitle(text: string)}
  <h3
    class="font-bold text-gray-800 border-b border-gray-400 mt-4 mb-2 pb-1 uppercase text-sm"
  >
    {text}
  </h3>
{/snippet}

{#snippet checkbox(
  label: string,
  checked: boolean,
  onChange: (v: boolean) => void,
)}
  <label class="flex items-start gap-2 cursor-pointer">
    <input
      type="checkbox"
      class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      {checked}
      onchange={(e) => onChange(e.currentTarget.checked)}
    />
    <span class="text-sm leading-tight text-gray-700">{label}</span>
  </label>
{/snippet}

{#snippet radioGroup(
  name: string,
  options: string[],
  selected: string,
  onChange: (v: string) => void,
)}
  <div class="space-y-1">
    {#each options as opt}
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          {name}
          value={opt}
          checked={selected === opt}
          onchange={(e) => onChange(e.currentTarget.value)}
          class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span class="text-sm text-gray-700">{opt}</span>
      </label>
    {/each}
  </div>
{/snippet}

{#snippet yesNo(
  label: string,
  value: boolean | null,
  onChange: (v: boolean) => void,
)}
  <div class="flex items-center gap-4">
    <span class="text-sm font-semibold">{label}</span>
    <div class="flex gap-2">
      <label class="flex items-center gap-1 text-sm"
        ><input
          type="radio"
          name={label}
          checked={value === true}
          onchange={() => onChange(true)}
        /> Sí</label
      >
      <label class="flex items-center gap-1 text-sm"
        ><input
          type="radio"
          name={label}
          checked={value === false}
          onchange={() => onChange(false)}
        /> No</label
      >
    </div>
  </div>
{/snippet}

<div class="form-container-wide">
  <div class="form-save-btn">
    <button onclick={() => onSave(form)} class="w-full h-full">
      Guardar
    </button>
  </div>

  <header class="form-header justify-center relative py-4">
    <h1 class="form-title underline text-center w-full">
      Historia Clínica del Acceso Vascular para Hemodiálisis
    </h1>
    {#if form.updatedAt}
      <p class="text-[10px] text-gray-400 mt-1 absolute right-0 top-0 pr-4">
        Actualizado: {new Date(form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </header>

  <div class="mb-6">
    <h2 class="font-bold text-lg mb-2">I. Datos Generales:</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label class="block">
        <span class="font-bold text-sm">Nombre del paciente:</span>
        <input
          type="text"
          bind:value={form.general.name}
          class="w-full border-b border-gray-400 outline-none bg-transparent"
        />
      </label>
      <label class="block">
        <span class="font-bold text-sm">Ocupación:</span>
        <input
          type="text"
          bind:value={form.general.occupation}
          class="w-full border-b border-gray-400 outline-none bg-transparent"
        />
      </label>
      <label class="block md:col-span-2">
        <span class="font-bold text-sm">Fecha:</span>
        <input
          type="date"
          bind:value={form.general.date}
          class="border-b border-gray-400 outline-none bg-transparent ml-2"
        />
      </label>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="space-y-6">
      <div>
        {@render sectionTitle("1. Edad: Seleccionar la que corresponda")}
        {@render radioGroup(
          "age",
          [
            "18-20 años",
            "21-30 años",
            "31-40 años",
            "41-50 años",
            "51-60 años",
            ">61 años",
          ],
          form.history.ageRange,
          (v) => (form.history.ageRange = v),
        )}
      </div>

      <div>
        {@render sectionTitle("5. Tipo de acceso vascular")}
        <div class="space-y-1">
          {@render checkbox(
            "FAV autóloga",
            form.history.accessType.favAutologous,
            (v) => (form.history.accessType.favAutologous = v),
          )}
          {@render checkbox(
            "FAV protésica",
            form.history.accessType.favProsthetic,
            (v) => (form.history.accessType.favProsthetic = v),
          )}
          {@render checkbox(
            "CVC permanente",
            form.history.accessType.cvcPermanent,
            (v) => (form.history.accessType.cvcPermanent = v),
          )}
          {@render checkbox(
            "CVC temporal",
            form.history.accessType.cvcTemporal,
            (v) => (form.history.accessType.cvcTemporal = v),
          )}
          <label class="flex items-center gap-2 text-sm mt-1">
            <input
              type="checkbox"
              checked={form.history.accessType.other.length > 0}
              disabled
            />
            Otros:
            <input
              bind:value={form.history.accessType.other}
              class="border-b border-gray-400 w-full outline-none"
            />
          </label>
        </div>
      </div>

      <div>
        {@render sectionTitle("7. Ubicación del acceso vascular")}
        <div class="space-y-1">
          {@render checkbox(
            "FAV radio cefálica izquierda",
            form.history.location.radioCephalicL,
            (v) => (form.history.location.radioCephalicL = v),
          )}
          {@render checkbox(
            "FAV radio cefálica derecha",
            form.history.location.radioCephalicR,
            (v) => (form.history.location.radioCephalicR = v),
          )}
          {@render checkbox(
            "FAV braquial izquierda",
            form.history.location.brachialL,
            (v) => (form.history.location.brachialL = v),
          )}
          {@render checkbox(
            "FAV braquial derecha",
            form.history.location.brachialR,
            (v) => (form.history.location.brachialR = v),
          )}
          {@render checkbox(
            "CVC subclavio izquierdo",
            form.history.location.subclavianL,
            (v) => (form.history.location.subclavianL = v),
          )}
          {@render checkbox(
            "CVC subclavio derecho",
            form.history.location.subclavianR,
            (v) => (form.history.location.subclavianR = v),
          )}
          {@render checkbox(
            "CVC femoral izquierdo",
            form.history.location.femoralL,
            (v) => (form.history.location.femoralL = v),
          )}
          {@render checkbox(
            "CVC femoral derecho",
            form.history.location.femoralR,
            (v) => (form.history.location.femoralR = v),
          )}
          {@render checkbox(
            "CVC yugular derecho",
            form.history.location.jugularR,
            (v) => (form.history.location.jugularR = v),
          )}
          {@render checkbox(
            "CVC yugular izquierdo",
            form.history.location.jugularL,
            (v) => (form.history.location.jugularL = v),
          )}
        </div>
      </div>

      <div>
        {@render sectionTitle("10. Sellos de CVC")}
        <div class="flex gap-4">
          {@render checkbox(
            "Heparina",
            form.history.seals.heparin,
            (v) => (form.history.seals.heparin = v),
          )}
          {@render checkbox(
            "Duralock",
            form.history.seals.duralock,
            (v) => (form.history.seals.duralock = v),
          )}
        </div>
      </div>

      <div>
        {@render sectionTitle(
          "11. Trombólisis intraluminal con estreptoquinasa",
        )}
        <div class="flex gap-4 mb-2">
          <label class="flex items-center gap-1 text-sm"
            ><input
              type="radio"
              name="thrombo"
              checked={form.history.thrombolysis.active === true}
              onchange={() => (form.history.thrombolysis.active = true)}
            /> Si</label
          >
          <label class="flex items-center gap-1 text-sm"
            ><input
              type="radio"
              name="thrombo"
              checked={form.history.thrombolysis.active === false}
              onchange={() => (form.history.thrombolysis.active = false)}
            /> No</label
          >
        </div>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <label class="block"
            >¿Cuántas veces? <input
              bind:value={form.history.thrombolysis.count}
              class="border-b w-16"
            /></label
          >
          <label class="block"
            >¿Hace cuánto? <input
              bind:value={form.history.thrombolysis.timeAgo}
              class="border-b w-full"
            /></label
          >
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          {@render sectionTitle("2. Sexo")}
          {@render radioGroup(
            "sex",
            ["Masculino", "Femenino"],
            form.history.sex,
            (v) => (form.history.sex = v),
          )}
        </div>
        <div>
          {@render sectionTitle("4. Tiempo de recibir HD")}
          {@render radioGroup(
            "timehd",
            [
              "< 1 año",
              "1 - 5 años",
              "6 - 10 años",
              "11 - 15 años",
              "16 - 20 años",
              "> 21 años",
            ],
            form.history.timeInHd,
            (v) => (form.history.timeInHd = v),
          )}
        </div>
      </div>

      <div>
        {@render sectionTitle("3. Comorbilidades")}
        <div class="space-y-1">
          {@render checkbox(
            "HTA",
            form.history.comorbidities.hta,
            (v) => (form.history.comorbidities.hta = v),
          )}
          {@render checkbox(
            "Dm2",
            form.history.comorbidities.dm2,
            (v) => (form.history.comorbidities.dm2 = v),
          )}
          {@render checkbox(
            "Cardiopatía",
            form.history.comorbidities.cardiopathy,
            (v) => (form.history.comorbidities.cardiopathy = v),
          )}
          <label class="flex items-center gap-2 text-sm mt-1">
            <input
              type="checkbox"
              checked={form.history.comorbidities.other.length > 0}
              disabled
            />
            Otros:
            <input
              bind:value={form.history.comorbidities.other}
              class="border-b border-gray-400 w-24 outline-none"
            />
          </label>
        </div>
      </div>

      <div>
        {@render sectionTitle("6. Fecha de colocación del acceso vascular")}
        <div class="space-y-2 text-sm">
          <label class="flex items-end gap-2">
            <input
              type="date"
              bind:value={form.history.placementDate.exact}
              class="border-b w-32"
            /> Fecha exacta
          </label>
          <label class="flex items-end gap-2">
            <input
              type="text"
              bind:value={form.history.placementDate.approx}
              class="border-b w-32"
            /> Tiempo aproximado
          </label>
          {@render checkbox(
            "No recuerda",
            form.history.placementDate.dontRemember,
            (v) => (form.history.placementDate.dontRemember = v),
          )}
        </div>
      </div>

      <div>
        {@render sectionTitle("8. Funcionalidad del AV-CVC")}
        <div class="space-y-1">
          {@render checkbox(
            "Ramal arterial",
            form.history.functionality.arterial,
            (v) => (form.history.functionality.arterial = v),
          )}
          {@render checkbox(
            "Ramal venoso",
            form.history.functionality.venous,
            (v) => (form.history.functionality.venous = v),
          )}
          {@render checkbox(
            "Ambos ramales",
            form.history.functionality.both,
            (v) => (form.history.functionality.both = v),
          )}
        </div>
      </div>

      <div>
        {@render sectionTitle("9. Disfuncionalidad de AV-CVC")}
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-sm">
            {@render checkbox(
              "Obstrucción mecánica",
              form.history.dysfunction.mechanicalObstruction.active,
              (v) =>
                (form.history.dysfunction.mechanicalObstruction.active = v),
            )}
            <div class="flex gap-2 ml-2">
              <label class="flex items-center gap-1"
                ><input
                  type="radio"
                  name="obs_type"
                  checked={form.history.dysfunction.mechanicalObstruction
                    .type === "partial"}
                  onchange={() =>
                    (form.history.dysfunction.mechanicalObstruction.type =
                      "partial")}
                  disabled={!form.history.dysfunction.mechanicalObstruction
                    .active}
                /> Parcial</label
              >
              <label class="flex items-center gap-1"
                ><input
                  type="radio"
                  name="obs_type"
                  checked={form.history.dysfunction.mechanicalObstruction
                    .type === "total"}
                  onchange={() =>
                    (form.history.dysfunction.mechanicalObstruction.type =
                      "total")}
                  disabled={!form.history.dysfunction.mechanicalObstruction
                    .active}
                /> Total</label
              >
            </div>
          </div>
          <div class="pl-6 space-y-1 border-l-2 border-gray-100 ml-1">
            {@render checkbox(
              "Coágulos",
              form.history.dysfunction.clots,
              (v) => (form.history.dysfunction.clots = v),
            )}
            {@render checkbox(
              "Fibrina",
              form.history.dysfunction.fibrin,
              (v) => (form.history.dysfunction.fibrin = v),
            )}
            {@render checkbox(
              "Acodamiento",
              form.history.dysfunction.kinking,
              (v) => (form.history.dysfunction.kinking = v),
            )}
          </div>
          <label class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.history.dysfunction.other.length > 0}
              disabled
            />
            Otro tipo. Especifique:
            <input
              bind:value={form.history.dysfunction.other}
              class="border-b w-full"
            />
          </label>
        </div>
      </div>

      <div>
        {@render sectionTitle("12. A V anteriores")}
        <div class="flex gap-2 mb-2">
          {#each ["1AV", "2AV", "3AV", ">4AV"] as opt}
            <label class="flex items-center gap-1 text-sm"
              ><input
                type="radio"
                name="prev_av"
                value={opt}
                bind:group={form.history.previousAV}
              />
              {opt}</label
            >
          {/each}
        </div>
        <h4 class="font-bold text-xs mt-2">
          13. Si ha tenido > 4 AV especifique ubicación
        </h4>
        <div class="grid grid-cols-2 gap-1 mt-1">
          {@render checkbox(
            "Femoral",
            form.history.previousLocation.femoral,
            (v) => (form.history.previousLocation.femoral = v),
          )}
          {@render checkbox(
            "Subclavio",
            form.history.previousLocation.subclavian,
            (v) => (form.history.previousLocation.subclavian = v),
          )}
          {@render checkbox(
            "Yugular",
            form.history.previousLocation.jugular,
            (v) => (form.history.previousLocation.jugular = v),
          )}
          {@render checkbox(
            "FAV",
            form.history.previousLocation.fav,
            (v) => (form.history.previousLocation.fav = v),
          )}
        </div>
      </div>
    </div>
  </div>

  <div class="break-before-page mt-12 pt-8 border-t-4 border-black">
    <h2 class="font-bold text-lg mb-4">II. Examen Físico</h2>

    <div class="space-y-4">
      <div class="flex gap-2 items-start">
        <span class="font-bold text-sm w-32 shrink-0">1. Inspección:</span>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 w-full">
          {@render checkbox(
            "Piel integra",
            form.physicalExam.inspection.skinIntact,
            (v) => (form.physicalExam.inspection.skinIntact = v),
          )}
          {@render checkbox(
            "Hematoma",
            form.physicalExam.inspection.hematoma,
            (v) => (form.physicalExam.inspection.hematoma = v),
          )}
          {@render checkbox(
            "Piel brillante",
            form.physicalExam.inspection.shinySkin,
            (v) => (form.physicalExam.inspection.shinySkin = v),
          )}
          {@render checkbox(
            "Equimosis",
            form.physicalExam.inspection.ecchymosis,
            (v) => (form.physicalExam.inspection.ecchymosis = v),
          )}
          {@render checkbox(
            "Enrojecimiento",
            form.physicalExam.inspection.redness,
            (v) => (form.physicalExam.inspection.redness = v),
          )}
          {@render checkbox(
            "Venas colaterales",
            form.physicalExam.inspection.collaterals,
            (v) => (form.physicalExam.inspection.collaterals = v),
          )}
          {@render checkbox(
            "Puntos Planos",
            form.physicalExam.inspection.flatSpots,
            (v) => (form.physicalExam.inspection.flatSpots = v),
          )}
          {@render checkbox(
            "Edema",
            form.physicalExam.inspection.edema,
            (v) => (form.physicalExam.inspection.edema = v),
          )}
          {@render checkbox(
            "Cianosis",
            form.physicalExam.inspection.cyanosis,
            (v) => (form.physicalExam.inspection.cyanosis = v),
          )}
          {@render checkbox(
            "Aneurismas",
            form.physicalExam.inspection.aneurysms,
            (v) => (form.physicalExam.inspection.aneurysms = v),
          )}
        </div>
      </div>

      <div class="flex gap-2 items-start">
        <span class="font-bold text-sm w-32 shrink-0">2. Palpación:</span>
        <div class="flex gap-6 flex-wrap w-full">
          {@render checkbox(
            "Cambios de temperatura",
            form.physicalExam.palpation.tempChanges,
            (v) => (form.physicalExam.palpation.tempChanges = v),
          )}
          {@render checkbox(
            "Thrill suave y continuo",
            form.physicalExam.palpation.thrillSoft,
            (v) => (form.physicalExam.palpation.thrillSoft = v),
          )}
          {@render checkbox(
            "Thrill pulsátil",
            form.physicalExam.palpation.thrillPulsatile,
            (v) => (form.physicalExam.palpation.thrillPulsatile = v),
          )}
        </div>
      </div>

      <div class="flex gap-2 items-start">
        <span class="font-bold text-sm w-32 shrink-0">3. Auscultación:</span>
        <div class="flex gap-6 flex-wrap w-full">
          {@render checkbox(
            "Soplo suave y continuo",
            form.physicalExam.auscultation.murmurSoft,
            (v) => (form.physicalExam.auscultation.murmurSoft = v),
          )}
          {@render checkbox(
            "Soplo patológico",
            form.physicalExam.auscultation.murmurPathological,
            (v) => (form.physicalExam.auscultation.murmurPathological = v),
          )}
        </div>
      </div>

      <div>
        <span class="font-bold text-sm block mb-2"
          >4. Características de FAV madura:</span
        >
        <div class="ml-4 space-y-2 text-sm">
          <div class="flex items-center gap-4">
            <span class="w-40">• Tiempo de hemostasia:</span>
            <label class="flex items-center gap-1"
              ><input
                type="radio"
                name="hemo"
                checked={form.physicalExam.matureCharacteristics
                  .hemostasisTime === "5-10"}
                onchange={() =>
                  (form.physicalExam.matureCharacteristics.hemostasisTime =
                    "5-10")}
              /> 5-10 minutos</label
            >
            <label class="flex items-center gap-1"
              ><input
                type="radio"
                name="hemo"
                checked={form.physicalExam.matureCharacteristics
                  .hemostasisTime === ">10"}
                onchange={() =>
                  (form.physicalExam.matureCharacteristics.hemostasisTime =
                    ">10")}
              /> > 10 minutos</label
            >
          </div>

          <div class="flex items-center gap-4">
            <span class="w-40">• Estenosis</span>
            {@render yesNo(
              "estenosis",
              form.physicalExam.matureCharacteristics.stenosis,
              (v) => (form.physicalExam.matureCharacteristics.stenosis = v),
            )}
          </div>

          <div class="flex items-center gap-4">
            <span class="w-40">• Aneurismas</span>
            <label class="flex items-center gap-1"
              ><input
                type="radio"
                name="aneu"
                value="1"
                bind:group={form.physicalExam.matureCharacteristics.aneurysms}
              /> 1</label
            >
            <label class="flex items-center gap-1"
              ><input
                type="radio"
                name="aneu"
                value="2"
                bind:group={form.physicalExam.matureCharacteristics.aneurysms}
              /> 2</label
            >
            <label class="flex items-center gap-1"
              ><input
                type="radio"
                name="aneu"
                value=">3"
                bind:group={form.physicalExam.matureCharacteristics.aneurysms}
              /> >3</label
            >
          </div>

          <div class="flex items-center gap-4">
            <span class="w-40">• Síndrome de robo</span>
            {@render yesNo(
              "robo",
              form.physicalExam.matureCharacteristics.stealSyndrome,
              (v) =>
                (form.physicalExam.matureCharacteristics.stealSyndrome = v),
            )}
          </div>

          <div class="flex items-center gap-4">
            <span class="w-40">• Tortuosa</span>
            {@render yesNo(
              "tortuosa",
              form.physicalExam.matureCharacteristics.tortuous,
              (v) => (form.physicalExam.matureCharacteristics.tortuous = v),
            )}
          </div>

          <div class="flex items-center gap-4">
            <span class="w-40">• Trombosis</span>
            {@render checkbox(
              "Sí, Parcial",
              form.physicalExam.matureCharacteristics.thrombosis.type ===
                "partial",
              () => {
                form.physicalExam.matureCharacteristics.thrombosis.active = true;
                form.physicalExam.matureCharacteristics.thrombosis.type =
                  "partial";
              },
            )}
            {@render checkbox(
              "Total",
              form.physicalExam.matureCharacteristics.thrombosis.type ===
                "total",
              () => {
                form.physicalExam.matureCharacteristics.thrombosis.active = true;
                form.physicalExam.matureCharacteristics.thrombosis.type =
                  "total";
              },
            )}
            {@render checkbox(
              "No",
              form.physicalExam.matureCharacteristics.thrombosis.active ===
                false,
              () => {
                form.physicalExam.matureCharacteristics.thrombosis.active = false;
                form.physicalExam.matureCharacteristics.thrombosis.type = null;
              },
            )}
          </div>

          <div class="flex items-center gap-4">
            <span class="w-40">• Rotación de sitios:</span>
            {@render yesNo(
              "rotacion",
              form.physicalExam.matureCharacteristics.siteRotation,
              (v) => (form.physicalExam.matureCharacteristics.siteRotation = v),
            )}
          </div>
        </div>
      </div>

      <div class="mt-4">
        <label class="block">
          <span class="block font-bold text-sm mb-1">OBSERVACIONES:</span>
          <textarea
            bind:value={form.physicalExam.observations}
            class="w-full border border-gray-300 rounded p-2 h-20 bg-gray-50"
          ></textarea>
        </label>
      </div>
    </div>

    <div class="mt-8 border-t-2 border-gray-300 pt-4">
      <h2 class="text-center font-bold text-lg mb-4 uppercase">
        Seguimiento de Acceso Vascular
      </h2>
      <div class="space-y-4">
        {#each form.followUp as item}
          <div class="border-2 border-gray-800 p-2 rounded">
            <label class="block mb-2">
              <span class="font-bold">Fecha:</span>
              <input
                type="date"
                bind:value={item.date}
                class="border-b border-gray-400 outline-none ml-2"
              />
            </label>
            <label class="block">
              <span class="font-bold block">Observaciones:</span>
              <textarea
                bind:value={item.obs}
                class="w-full bg-transparent outline-none h-16 resize-none border-b border-dotted border-gray-300"
              ></textarea>
            </label>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
