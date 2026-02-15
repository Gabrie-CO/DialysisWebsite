<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { clinicHistorySchema } from "$lib/schemas/clinicHistorySchema";
  import type { z } from "zod";
  import { untrack } from "svelte";

  // UI Components
  import TextInput from "../ui/TextInput.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import RadioGroup from "../ui/RadioGroup.svelte";
  import DateInput from "../ui/DateInput.svelte";
  import FormSectionCard from "../../ui/FormSectionCard.svelte";

  let {
    initialData = {},
    patientId,
    onSave,
  } = $props<{
    initialData?: Partial<z.infer<typeof clinicHistorySchema>>;
    patientId: string;
    onSave: (data: z.infer<typeof clinicHistorySchema>) => void;
  }>();

  // Initialize Superform
  const { form, enhance } = superForm(
    defaults(
      // @ts-ignore
      untrack(() => initialData || {}),
      zod(clinicHistorySchema as any),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zod(clinicHistorySchema as any),
      onUpdate: async ({ form }) => {
        if (form.valid) {
          onSave(form.data);
        }
      },
    },
  );

  // Sync initialData
  $effect(() => {
    if (initialData) {
      const currentForm = untrack(() => $form);
      // @ts-ignore
      form.set({ ...currentForm, ...initialData });
    }
  });

  const ageOptions = [
    { value: "18-20 años", label: "18-20 años" },
    { value: "21-30 años", label: "21-30 años" },
    { value: "31-40 años", label: "31-40 años" },
    { value: "41-50 años", label: "41-50 años" },
    { value: "51-60 años", label: "51-60 años" },
    { value: ">61 años", label: ">61 años" },
  ];

  const timeHdOptions = [
    { value: "< 1 año", label: "< 1 año" },
    { value: "1 - 5 años", label: "1 - 5 años" },
    { value: "6 - 10 años", label: "6 - 10 años" },
    { value: "11 - 15 años", label: "11 - 15 años" },
    { value: "16 - 20 años", label: "16 - 20 años" },
    { value: "> 21 años", label: "> 21 años" },
  ];

  const sexOptions = [
    { value: "Masculino", label: "Masculino" },
    { value: "Femenino", label: "Femenino" },
  ];

  const hemostasisOptions = [
    { value: "5-10", label: "5-10 min" },
    { value: ">10", label: ">10 min" },
  ];

  const aneurysmOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: ">3", label: ">3" },
  ];

  function addFollowUp() {
    $form.followUp = [...$form.followUp, { date: "", obs: "" }];
  }
</script>

{#snippet sectionTitle(text: string)}
  <h3
    class="font-bold text-gray-800 border-b border-gray-400 mt-6 mb-4 pb-1 uppercase text-sm"
  >
    {text}
  </h3>
{/snippet}

{#snippet yesNo(
  label: string,
  value: boolean | null,
  setFn: (v: boolean) => void,
)}
  <div class="flex items-center justify-between py-1">
    <span class="text-sm font-medium text-gray-700">{label}</span>
    <div class="flex gap-4">
      <label class="flex items-center gap-1 cursor-pointer">
        <input
          type="radio"
          name={label + Math.random()}
          checked={value === true}
          onclick={() => setFn(true)}
          class="form-checkbox h-4 w-4"
        />
        <span class="text-xs">SI</span>
      </label>
      <label class="flex items-center gap-1 cursor-pointer">
        <input
          type="radio"
          name={label + Math.random()}
          checked={value === false}
          onclick={() => setFn(false)}
          class="form-checkbox h-4 w-4"
        />
        <span class="text-xs">NO</span>
      </label>
    </div>
  </div>
{/snippet}

<div class="form-container-wide">
  <header class="form-header mb-6">
    <h2 class="h2-text">
      Historia Clínica del Acceso Vascular para Hemodiálisis
    </h2>
    {#if $form.updatedAt}
      <p class="small-text">
        Actualizado: {new Date($form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </header>

  <FormSectionCard
    title="I. Datos Generales"
    data={$form}
    patientId={patientId || ""}
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TextInput label="Nombre del paciente" bind:value={$form.general.name} />
      <TextInput label="Ocupación" bind:value={$form.general.occupation} />
      <DateInput label="Fecha" bind:value={$form.general.date} />
    </div>
  </FormSectionCard>

  <form method="POST" use:enhance>
    <div class="mb-8">
      <h2 class="font-bold text-lg mb-2">II. Historia Clínica:</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-6">
          <FormSectionCard
            title="1. Edad: Seleccionar la que corresponda"
            data={$form}
            patientId={patientId || ""}
          >
            <RadioGroup
              name="age"
              options={ageOptions}
              bind:value={$form.history.ageRange}
            />
          </FormSectionCard>

          <FormSectionCard
            title="3. Comorbilidades"
            data={$form}
            patientId={patientId || ""}
          >
            <div class="space-y-2">
              <Checkbox
                label="HTA"
                bind:checked={$form.history.comorbidities.hta}
              />
              <Checkbox
                label="Dm2"
                bind:checked={$form.history.comorbidities.dm2}
              />
              <Checkbox
                label="Cardiopatía"
                bind:checked={$form.history.comorbidities.cardiopathy}
              />
              <div class="flex items-center gap-2">
                <span class="text-sm">Otros:</span>
                <input
                  type="text"
                  bind:value={$form.history.comorbidities.other}
                  class="form-input-line flex-1"
                />
              </div>
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="5. Tipo de acceso vascular"
            data={$form}
            patientId={patientId || ""}
          >
            <div class="space-y-2">
              <Checkbox
                label="FAV autóloga"
                bind:checked={$form.history.accessType.favAutologous}
              />
              <Checkbox
                label="FAV protésica"
                bind:checked={$form.history.accessType.favProsthetic}
              />
              <Checkbox
                label="CVC permanente"
                bind:checked={$form.history.accessType.cvcPermanent}
              />
              <Checkbox
                label="CVC temporal"
                bind:checked={$form.history.accessType.cvcTemporal}
              />
              <div class="flex items-center gap-2">
                <span class="text-sm">Otros:</span>
                <input
                  type="text"
                  bind:value={$form.history.accessType.other}
                  class="form-input-line flex-1"
                />
              </div>
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="7. Ubicación del acceso vascular"
            data={$form}
            patientId={patientId || ""}
          >
            <div class="grid grid-cols-1 gap-1">
              <Checkbox
                label="FAV radio cefálica izquierda"
                bind:checked={$form.history.location.radioCephalicL}
              />
              <Checkbox
                label="FAV radio cefálica derecha"
                bind:checked={$form.history.location.radioCephalicR}
              />
              <Checkbox
                label="FAV braquial izquierda"
                bind:checked={$form.history.location.brachialL}
              />
              <Checkbox
                label="FAV braquial derecha"
                bind:checked={$form.history.location.brachialR}
              />
              <Checkbox
                label="CVC subclavio izquierdo"
                bind:checked={$form.history.location.subclavianL}
              />
              <Checkbox
                label="CVC subclavio derecho"
                bind:checked={$form.history.location.subclavianR}
              />
              <Checkbox
                label="CVC femoral izquierdo"
                bind:checked={$form.history.location.femoralL}
              />
              <Checkbox
                label="CVC femoral derecho"
                bind:checked={$form.history.location.femoralR}
              />
              <Checkbox
                label="CVC yugular derecho"
                bind:checked={$form.history.location.jugularR}
              />
              <Checkbox
                label="CVC yugular izquierdo"
                bind:checked={$form.history.location.jugularL}
              />
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="10. Sellos de CVC"
            data={$form}
            patientId={patientId || ""}
          >
            <div class="flex gap-6">
              <Checkbox
                label="Heparina"
                bind:checked={$form.history.seals.heparin}
              />
              <Checkbox
                label="Duralock"
                bind:checked={$form.history.seals.duralock}
              />
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="11. Trombólisis intraluminal con estreptoquinasa"
            data={$form}
            patientId={patientId || ""}
          >
            <div class="space-y-4">
              <div class="flex items-center gap-4">
                <label class="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    checked={$form.history.thrombolysis.active === true}
                    onclick={() => ($form.history.thrombolysis.active = true)}
                    class="form-checkbox"
                  />
                  <span class="text-sm">Si</span>
                </label>
                <label class="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    checked={$form.history.thrombolysis.active === false}
                    onclick={() => ($form.history.thrombolysis.active = false)}
                    class="form-checkbox"
                  />
                  <span class="text-sm">No</span>
                </label>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <TextInput
                  label="¿Cuántas veces?"
                  bind:value={$form.history.thrombolysis.count}
                />
                <TextInput
                  label="¿Hace cuánto?"
                  bind:value={$form.history.thrombolysis.timeAgo}
                />
              </div>
            </div>
          </FormSectionCard>
        </div>

        <div class="space-y-6">
          <FormSectionCard
            title="2. Sexo"
            data={$form}
            patientId={patientId || ""}
          >
            <RadioGroup
              name="sex"
              options={sexOptions}
              bind:value={$form.history.sex}
            />
          </FormSectionCard>

          <FormSectionCard
            title="4. Tiempo de recibir HD"
            data={$form}
            patientId={patientId || ""}
          >
            <RadioGroup
              name="timehd"
              options={timeHdOptions}
              bind:value={$form.history.timeInHd}
            />
          </FormSectionCard>

          <FormSectionCard
            title="6. Fecha de colocación del acceso vascular"
            data={$form}
            patientId={patientId || ""}
          >
            <div class="space-y-4">
              <DateInput
                label="Fecha exacta"
                bind:value={$form.history.placementDate.exact}
              />
              <TextInput
                label="Tiempo aproximado"
                bind:value={$form.history.placementDate.approx}
              />
              <Checkbox
                label="No recuerda"
                bind:checked={$form.history.placementDate.dontRemember}
              />
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="8. Funcionalidad del AV-CVC"
            data={$form}
            patientId={patientId || ""}
          >
            <div class="space-y-2">
              <Checkbox
                label="Ramal arterial"
                bind:checked={$form.history.functionality.arterial}
              />
              <Checkbox
                label="Ramal venoso"
                bind:checked={$form.history.functionality.venous}
              />
              <Checkbox
                label="Ambos ramales"
                bind:checked={$form.history.functionality.both}
              />
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="9. Disfuncionalidad de AV-CVC"
            data={$form}
            patientId={patientId || ""}
          >
            <div class="space-y-3">
              <div class="flex flex-col gap-2">
                <Checkbox
                  label="Obstrucción mecánica"
                  bind:checked={
                    $form.history.dysfunction.mechanicalObstruction.active
                  }
                />
                {#if $form.history.dysfunction.mechanicalObstruction.active}
                  <div class="pl-6 flex gap-4">
                    <label class="flex items-center gap-1 text-sm"
                      ><input
                        type="radio"
                        value="partial"
                        bind:group={
                          $form.history.dysfunction.mechanicalObstruction.type
                        }
                        class="form-checkbox"
                      /> Parcial</label
                    >
                    <label class="flex items-center gap-1 text-sm"
                      ><input
                        type="radio"
                        value="total"
                        bind:group={
                          $form.history.dysfunction.mechanicalObstruction.type
                        }
                        class="form-checkbox"
                      /> Total</label
                    >
                  </div>
                {/if}
              </div>
              <div class="pl-4 border-l-2 border-gray-100 space-y-2">
                <Checkbox
                  label="Coágulos"
                  bind:checked={$form.history.dysfunction.clots}
                />
                <Checkbox
                  label="Fibrina"
                  bind:checked={$form.history.dysfunction.fibrin}
                />
                <Checkbox
                  label="Acodamiento"
                  bind:checked={$form.history.dysfunction.kinking}
                />
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm">Otros:</span>
                <input
                  type="text"
                  bind:value={$form.history.dysfunction.other}
                  class="form-input-line flex-1"
                />
              </div>
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="12. Historias previos de AV"
            data={$form}
            patientId={patientId || ""}
          >
            <TextInput
              label="Número de accesos previos"
              bind:value={$form.history.previousAV}
              placeholder="Ej. 1AV, 2AV"
            />
          </FormSectionCard>

          <FormSectionCard
            title="13. Ubicación anterior"
            data={$form}
            patientId={patientId || ""}
          >
            <div class="grid grid-cols-2 gap-2">
              <Checkbox
                label="Femoral"
                bind:checked={$form.history.previousLocation.femoral}
              />
              <Checkbox
                label="Yugular"
                bind:checked={$form.history.previousLocation.jugular}
              />
              <Checkbox
                label="Subclavio"
                bind:checked={$form.history.previousLocation.subclavian}
              />
              <Checkbox
                label="FAV"
                bind:checked={$form.history.previousLocation.fav}
              />
            </div>
          </FormSectionCard>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="font-bold text-lg mb-4">III. Examen Físico:</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Inspection -->
        <!-- Inspection -->
        <FormSectionCard
          title="Inspección"
          data={$form}
          patientId={patientId || ""}
        >
          <div class="space-y-1">
            {@render yesNo(
              "Piel Intacta",
              $form.physicalExam.inspection.skinIntact,
              (v) => ($form.physicalExam.inspection.skinIntact = v),
            )}
            {@render yesNo(
              "Hematoma",
              $form.physicalExam.inspection.hematoma,
              (v) => ($form.physicalExam.inspection.hematoma = v),
            )}
            {@render yesNo(
              "Piel Brillante",
              $form.physicalExam.inspection.shinySkin,
              (v) => ($form.physicalExam.inspection.shinySkin = v),
            )}
            {@render yesNo(
              "Equimosis",
              $form.physicalExam.inspection.ecchymosis,
              (v) => ($form.physicalExam.inspection.ecchymosis = v),
            )}
            {@render yesNo(
              "Enrojecimiento",
              $form.physicalExam.inspection.redness,
              (v) => ($form.physicalExam.inspection.redness = v),
            )}
            {@render yesNo(
              "Colaterales",
              $form.physicalExam.inspection.collaterals,
              (v) => ($form.physicalExam.inspection.collaterals = v),
            )}
            {@render yesNo(
              "Zonas Planas",
              $form.physicalExam.inspection.flatSpots,
              (v) => ($form.physicalExam.inspection.flatSpots = v),
            )}
            {@render yesNo(
              "Edema",
              $form.physicalExam.inspection.edema,
              (v) => ($form.physicalExam.inspection.edema = v),
            )}
            {@render yesNo(
              "Cianosis",
              $form.physicalExam.inspection.cyanosis,
              (v) => ($form.physicalExam.inspection.cyanosis = v),
            )}
            {@render yesNo(
              "Aneurismas",
              $form.physicalExam.inspection.aneurysms,
              (v) => ($form.physicalExam.inspection.aneurysms = v),
            )}
          </div>
        </FormSectionCard>

        <!-- Palpation & Auscultation -->
        <div class="space-y-6">
          <FormSectionCard
            title="Palpación"
            data={$form}
            patientId={patientId || ""}
          >
            <div class="space-y-1">
              {@render yesNo(
                "Cambios de temperatura",
                $form.physicalExam.palpation.tempChanges,
                (v) => ($form.physicalExam.palpation.tempChanges = v),
              )}
              {@render yesNo(
                "Thrill Blando",
                $form.physicalExam.palpation.thrillSoft,
                (v) => ($form.physicalExam.palpation.thrillSoft = v),
              )}
              {@render yesNo(
                "Thrill Pulsatil",
                $form.physicalExam.palpation.thrillPulsatile,
                (v) => ($form.physicalExam.palpation.thrillPulsatile = v),
              )}
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="Auscultación"
            data={$form}
            patientId={patientId || ""}
          >
            <div class="space-y-1">
              {@render yesNo(
                "Soplo Blando",
                $form.physicalExam.auscultation.murmurSoft,
                (v) => ($form.physicalExam.auscultation.murmurSoft = v),
              )}
              {@render yesNo(
                "Soplo Rudo/Patológico",
                $form.physicalExam.auscultation.murmurPathological,
                (v) => ($form.physicalExam.auscultation.murmurPathological = v),
              )}
            </div>
          </FormSectionCard>
        </div>

        <!-- Mature Characteristics -->
        <FormSectionCard
          title="Características de Madurez"
          data={$form}
          patientId={patientId || ""}
        >
          <div class="space-y-4">
            <div>
              <span class="text-sm font-medium">Tiempo de hemostasia:</span>
              <RadioGroup
                name="hemostasis"
                options={hemostasisOptions}
                bind:value={
                  $form.physicalExam.matureCharacteristics.hemostasisTime
                }
              />
            </div>

            {@render yesNo(
              "Estenosis",
              $form.physicalExam.matureCharacteristics.stenosis,
              (v) => ($form.physicalExam.matureCharacteristics.stenosis = v),
            )}

            <div>
              <span class="text-sm font-medium">Aneurismas:</span>
              <RadioGroup
                name="aneurysms_char"
                options={aneurysmOptions}
                bind:value={$form.physicalExam.matureCharacteristics.aneurysms}
              />
            </div>

            {@render yesNo(
              "Sindrome de robo",
              $form.physicalExam.matureCharacteristics.stealSyndrome,
              (v) =>
                ($form.physicalExam.matureCharacteristics.stealSyndrome = v),
            )}
            {@render yesNo(
              "Trayecto tortuoso",
              $form.physicalExam.matureCharacteristics.tortuous,
              (v) => ($form.physicalExam.matureCharacteristics.tortuous = v),
            )}
            {@render yesNo(
              "Rotación de sitio",
              $form.physicalExam.matureCharacteristics.siteRotation,
              (v) =>
                ($form.physicalExam.matureCharacteristics.siteRotation = v),
            )}

            <div class="mt-2">
              <span class="text-sm font-medium">Trombosis:</span>
              <div class="flex items-center gap-4 mt-1">
                <label class="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    bind:checked={
                      $form.physicalExam.matureCharacteristics.thrombosis.active
                    }
                    class="form-checkbox"
                  />
                  <span class="text-xs">Si</span>
                </label>
                {#if $form.physicalExam.matureCharacteristics.thrombosis.active}
                  <div class="flex gap-2">
                    <label class="flex items-center gap-1 text-xs"
                      ><input
                        type="radio"
                        value="partial"
                        bind:group={
                          $form.physicalExam.matureCharacteristics.thrombosis
                            .type
                        }
                      /> Parcial</label
                    >
                    <label class="flex items-center gap-1 text-xs"
                      ><input
                        type="radio"
                        value="total"
                        bind:group={
                          $form.physicalExam.matureCharacteristics.thrombosis
                            .type
                        }
                      /> Total</label
                    >
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </FormSectionCard>
      </div>

      <div class="mt-6">
        <TextInput
          label="Observaciones"
          bind:value={$form.physicalExam.observations}
        />
      </div>
    </div>

    <FormSectionCard
      title="IV. Seguimiento (Solo si ocurre un evento)"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="relative overflow-x-auto border border-gray-300 rounded">
        <table class="w-full text-sm text-left">
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-300"
          >
            <tr>
              <th class="px-4 py-2 w-32">Fecha</th>
              <th class="px-4 py-2">Observación</th>
            </tr>
          </thead>
          <tbody>
            {#each $form.followUp as row, i}
              <tr class="bg-white border-b border-gray-200">
                <td class="px-4 py-2 border-r border-gray-200">
                  <input
                    type="date"
                    bind:value={$form.followUp[i].date}
                    class="w-full outline-none bg-transparent"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    type="text"
                    bind:value={$form.followUp[i].obs}
                    class="w-full outline-none bg-transparent"
                    placeholder="Escriba aquí..."
                  />
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        <div class="p-2 bg-gray-50 flex justify-center">
          <button
            type="button"
            onclick={addFollowUp}
            class="text-blue-700 hover:text-blue-900 text-xs font-bold"
            >+ Agregar Fila</button
          >
        </div>
      </div>
    </FormSectionCard>
    <div class="form-save-btn pt-4 flex justify-end">
      <button
        type="submit"
        class="bg-blue-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Guardar
      </button>
    </div>
  </form>
</div>
