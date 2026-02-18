<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { clinicalHistory2Schema } from "$lib/schemas/clinicalHistory2Schema";
  import type { z } from "zod";
  import { untrack } from "svelte";

  // UI Components
  import TextInput from "../ui/TextInput.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import FormSectionCard from "../../ui/FormSectionCard.svelte";
  import DateInput from "../ui/DateInput.svelte";

  let {
    initialData = {},
    patientId,
    onSave,
  } = $props<{
    initialData?: Partial<z.infer<typeof clinicalHistory2Schema>>;
    patientId: string;
    onSave: (data: z.infer<typeof clinicalHistory2Schema>) => void;
  }>();

  // Initialize Superform
  const { form, enhance } = superForm(
    defaults(
      // @ts-ignore
      untrack(() => initialData || {}),
      zod(clinicalHistory2Schema as any),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zod(clinicalHistory2Schema as any),
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

  function updateViral(status: boolean) {
    // @ts-ignore
    $form.viral.updated = status;
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
      class="form-input-line text-blue-900 pb-0 w-full"
    />
  </div>
{/snippet}

<div class="form-container-wide">
  <header class="form-header mb-6">
    <h2 class="h2-text">Historia Clínica</h2>
    {#if $form.updatedAt}
      <p class="small-text">
        Actualizado: {new Date($form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </header>

  <form method="POST" use:enhance class="mt-6 space-y-6">
    <!-- General Data -->


    <!-- ERC-5 -->
    <FormSectionCard
      title="ERC-5 (Etiologia Asociada)"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
        <Checkbox
          label="Enfermedad Glomerular Diabética"
          bind:checked={$form.etiology.diabetes}
        />
        <Checkbox
          label="Glumerulonefritis"
          bind:checked={$form.etiology.glomerulonephritis}
        />
        <Checkbox
          label="Nefropatía Hipertensiva"
          bind:checked={$form.etiology.hypertension}
        />
        <Checkbox
          label="Glomerulopatia Primaria Con Hipertensión"
          bind:checked={$form.etiology.primaryGlomerulo}
        />
        <div class="col-span-2">
          <Checkbox
            label="Enfermedad Renal Vascular Isquémica"
            bind:checked={$form.etiology.ischemic}
          />
        </div>

        <Checkbox
          label="Nefropatía Lupica"
          bind:checked={$form.etiology.lupus}
        />
        <Checkbox
          label="Nefropatía Mesoamericana"
          bind:checked={$form.etiology.mesoamerican}
        />

        <div class="flex gap-4">
          <Checkbox label="ERPAD" bind:checked={$form.etiology.erpad} />
          <Checkbox
            label="Etiología No Determinada"
            bind:checked={$form.etiology.undetermined}
          />
        </div>

        <Checkbox
          label="Nefropatía Obstructiva"
          bind:checked={$form.etiology.obstructive}
        />
        <Checkbox
          label="Hiperplasia Prostática Benigna"
          bind:checked={$form.etiology.prostatic}
        />

        <div class="flex gap-4">
          <Checkbox
            label="Nefrolitiasis"
            bind:checked={$form.etiology.nephrolithiasis}
          />
          <Checkbox
            label="Preclampsia"
            bind:checked={$form.etiology.preeclampsia}
          />
        </div>

        <div class="col-span-3 flex items-center gap-2">
          <Checkbox label="Otra" bind:checked={$form.etiology.other} />
          <input
            bind:value={$form.etiology.otherText}
            class="border-b border-black w-full"
            disabled={!$form.etiology.other}
          />
        </div>
      </div>
    </FormSectionCard>

    <!-- Hemodialysis Dose -->
    <FormSectionCard
      title="Dosis de Hemodiálisis"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="grid grid-cols-12 gap-x-4 gap-y-2">
        <div class="col-span-5">
          <TextInput label="Frecuencia Semanal" bind:value={$form.frequency} />
        </div>
        <div class="col-span-3">
          <TextInput
            label="v/s. Tiempo Sesión"
            bind:value={$form.sessionTime}
          />
        </div>
        <div class="col-span-1 italic text-sm self-end">hrs</div>
        <div class="col-span-3">
          <TextInput label="Membrana" bind:value={$form.membrane} />
        </div>

        <div class="col-span-6">
          <TextInput
            label="Anticoagulación con Heparina"
            bind:value={$form.anticoagulation}
          />
        </div>
        <div class="col-span-1 italic text-sm self-end">u</div>

        <div class="col-span-6 flex items-end gap-2">
          <span class="italic text-sm text-gray-700 font-bold whitespace-nowrap"
            >Peso Seco Estimado (</span
          >
          <input
            bind:value={$form.dryWeight}
            class="w-16 border-b border-black text-center outline-none"
          />
          <span class="italic text-sm text-gray-700 font-bold">) Kg</span>

          <span class="italic text-sm text-gray-700 ml-4 whitespace-nowrap"
            >a estimar 10ml/kg/hra.</span
          >
          <input
            type="text"
            bind:value={$form.heparinDose}
            class="w-20 border-b border-black text-center outline-none"
          />
        </div>
      </div>
    </FormSectionCard>

    <!-- Vascular Access -->
    <FormSectionCard
      title="Acceso Vascular"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="flex items-center gap-4 mb-2 p-2 rounded">
        <Checkbox
          label="Cat. Temporal"
          bind:checked={$form.access.tempCatheter}
        />
        <Checkbox
          label="Cat. Tunelizado"
          bind:checked={$form.access.tunneledCatheter}
        />
        <Checkbox label="FAV" bind:checked={$form.access.fav} />

        <div class="flex-1">
          <TextInput
            label="Observacion"
            bind:value={$form.access.observation}
          />
        </div>
      </div>
    </FormSectionCard>

    <!-- Viral Panel -->
    <FormSectionCard
      title="Panel Viral"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="flex items-center gap-2 mb-4 text-sm font-bold p-2 rounded">
        <span>HBsAg (</span>
        <input
          bind:value={$form.viral.hbsag}
          class="w-8 text-center border-b border-gray-400 bg-transparent"
        />
        <span>)</span>

        <span class="ml-4">Ac VHC (</span>
        <input
          bind:value={$form.viral.acvhc}
          class="w-8 text-center border-b border-gray-400 bg-transparent"
        />
        <span>)</span>

        <span class="ml-4">VIH (</span>
        <input
          bind:value={$form.viral.vih}
          class="w-8 text-center border-b border-gray-400 bg-transparent"
        />
        <span>)</span>

        <span class="ml-8 uppercase not-italic">Actualizado</span>
        <label class="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            checked={$form.viral.updated === true}
            onclick={() => updateViral(true)}
          /> SI
        </label>
        <label class="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            checked={$form.viral.updated === false}
            onclick={() => updateViral(false)}
          /> NO
        </label>
      </div>
    </FormSectionCard>

    <!-- Current Illness History -->
    <FormSectionCard
      title="Historia de la Enfermedad Actual"
      data={$form}
      patientId={patientId || ""}
    >
      <textarea
        class="form-input w-full min-h-[100px]"
        bind:value={$form.currentIllness}
        placeholder="Escriba aquí..."
      ></textarea>
    </FormSectionCard>

    <!-- Background -->
    <FormSectionCard
      title="Antecedentes"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="space-y-4">
        <div>
          <h4 class="font-bold text-xs uppercase mb-1 text-gray-700">
            Patologicos Personales
          </h4>
          <textarea
            class="form-input w-full min-h-[100px]"
            bind:value={$form.personalPathology}
            placeholder="..."
          ></textarea>
        </div>
        <div>
          <h4 class="font-bold text-xs uppercase mb-1 text-gray-700">
            Familiares
          </h4>
          <textarea
            class="form-input w-full min-h-[100px]"
            bind:value={$form.familyHistory}
            placeholder="..."
          ></textarea>
        </div>
        <div>
          <h4 class="font-bold text-xs uppercase mb-1 text-gray-700">
            Quirurigcos
          </h4>
          <textarea
            class="form-input w-full min-h-[100px]"
            bind:value={$form.surgicalHistory}
            placeholder="..."
          ></textarea>
        </div>
      </div>
    </FormSectionCard>

    <!-- Physical Exam -->
    <FormSectionCard
      title="Examen Fisico"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="grid grid-cols-12 gap-x-4 gap-y-2 items-end mt-2">
        <div class="col-span-8">
          <TextInput label="MUCOSAS" bind:value={$form.exam.mucosas} />
        </div>
        <div class="col-span-4">
          <TextInput label="TCS" bind:value={$form.exam.tcs} />
        </div>

        <div class="col-span-8">
          <TextInput
            label="V/RESPIRATORIO"
            bind:value={$form.exam.respiratory}
          />
        </div>
        <div class="col-span-4 flex items-end gap-2">
          <span class="font-bold text-xs">FR:</span>
          <input
            bind:value={$form.exam.fr}
            class="w-16 border-b border-black text-center"
          />
          <span class="text-xs">por min.</span>
        </div>

        <div class="col-span-6">
          <TextInput
            label="A/CARDIOVASCULAR"
            bind:value={$form.exam.cardiovascular}
          />
        </div>
        <div class="col-span-3 flex items-end gap-2">
          <span class="font-bold text-xs">TA:</span>
          <input
            bind:value={$form.exam.ta}
            class="w-full border-b border-black text-center"
          />
          <span class="text-xs">mmHg</span>
        </div>
        <div class="col-span-3 flex items-end gap-2">
          <span class="font-bold text-xs">FC:</span>
          <input
            bind:value={$form.exam.fc}
            class="w-full border-b border-black text-center"
          />
          <span class="text-xs">por min.</span>
        </div>

        <div class="col-span-12">
          <TextInput label="ABDOMEN" bind:value={$form.exam.abdomen} />
        </div>
        <div class="col-span-12">
          <TextInput label="S.N.C." bind:value={$form.exam.snc} />
        </div>

        <div class="col-span-6 flex items-end gap-2">
          <span class="font-bold text-xs uppercase"
            >Funcion Renal Residual:</span
          >
          <input
            bind:value={$form.exam.residualRenal}
            class="w-full border-b border-black"
          />
          <span class="text-xs font-bold">CC</span>
          <input
            bind:value={$form.exam.cc}
            class="w-16 border-b border-black"
          />
        </div>
      </div>
    </FormSectionCard>

    <!-- Pharmacology -->
    <FormSectionCard
      title="Farmacología"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="grid grid-cols-2 gap-4">
        <TextInput
          label="Eritropoyetina"
          bind:value={$form.meds.erythropoietin}
        />
        <TextInput label="CaCO3" bind:value={$form.meds.caco3} />
        <TextInput
          label="Sulfato Ferroso"
          bind:value={$form.meds.ferrousSulfate}
        />
        <TextInput label="Acido Fólico" bind:value={$form.meds.folicAcid} />
        <div class="col-span-2">
          <TextInput label="Otros" bind:value={$form.meds.other} />
        </div>
      </div>
    </FormSectionCard>

    <!-- Observations -->
    <FormSectionCard
      title="Observaciones"
      data={$form}
      patientId={patientId || ""}
    >
      <textarea
        class="form-input w-full min-h-[100px]"
        bind:value={$form.observations}
        placeholder="Observaciones adicionales..."
      ></textarea>
    </FormSectionCard>

    <!-- Labs Table -->
    <FormSectionCard
      title="Laboratorio"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="overflow-x-auto border border-black p-2 rounded">
        <table class="w-full text-center text-xs">
          <thead>
            <tr class="font-bold bg-gray-100">
              <th class="p-1 border">HB</th>
              <th class="p-1 border">HTO</th>
              <th class="p-1 border">LEUCO</th>
              <th class="p-1 border">PLAQ</th>
              <th class="p-1 border">NA</th>
              <th class="p-1 border">K</th>
              <th class="p-1 border">CALCIO</th>
              <th class="p-1 border">FOSFORO</th>
              <th class="p-1 border">PROD. PC</th>
              <th class="p-1 border">PTH</th>
              <th class="p-1 border">ALB.</th>
              <th class="p-1 border">GLUCOSA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {#each Object.keys($form.labs) as key}
                <td class="p-1 border">
                  <input
                    bind:value={$form.labs[key]}
                    class="w-full text-center outline-none bg-transparent"
                  />
                </td>
              {/each}
            </tr>
          </tbody>
        </table>
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
