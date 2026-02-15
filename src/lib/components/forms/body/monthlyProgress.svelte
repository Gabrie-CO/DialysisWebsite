<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { monthlyProgressSchema } from "$lib/schemas/monthlyProgressSchema";
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
    initialData?: Partial<z.infer<typeof monthlyProgressSchema>>;
    patientId: string;
    onSave: (data: z.infer<typeof monthlyProgressSchema>) => void;
  }>();

  // Initialize Superform in SPA mode
  const { form, enhance } = superForm(
    defaults(
      // @ts-ignore
      untrack(() => initialData || {}),
      zod(monthlyProgressSchema as any),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zod(monthlyProgressSchema as any),
      onUpdate: async ({ form }) => {
        if (form.valid) {
          onSave(form.data);
        }
      },
    },
  );

  // Sync initialData when it changes
  $effect(() => {
    if (initialData) {
      const currentForm = untrack(() => $form);
      // @ts-ignore
      form.set({ ...currentForm, ...initialData });
    }
  });

  const yesNoOptions = [
    { value: true, label: "SI" },
    { value: false, label: "NO" },
  ];

  const functionalOptions = [
    { value: "funcional", label: "Funcional" },
    { value: "disfuncional", label: "Disfuncional" },
  ];

  const typeOptions = [
    { value: "Normal", label: "Normal" },
    { value: "Disminuido", label: "Disminuido" },
  ];
</script>

<div class="form-container">
  <header class="form-header mb-6">
    <h2 class="h2-text">Evolución Mensual</h2>
    {#if $form.meta.updatedAt}
      <p class="small-text">
        Actualizado: {new Date($form.meta.updatedAt).toLocaleString()}
      </p>
    {/if}
  </header>

  <form method="POST" use:enhance class="space-y-8">
    <!-- Header Fields -->
    <FormSectionCard
      title="Datos del Paciente"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div class="md:col-span-6">
          <TextInput label="Nombre" bind:value={$form.patient.name} />
        </div>
        <div class="md:col-span-3">
          <TextInput label="Mes" bind:value={$form.meta.month} />
        </div>
        <div class="md:col-span-3">
          <TextInput label="Expediente" bind:value={$form.meta.fileNumber} />
        </div>

        <div class="md:col-span-5 flex flex-col gap-2">
          <span class="form-label mb-0">Ingresos</span>
          <RadioGroup
            row
            name="admissionActive"
            options={yesNoOptions}
            bind:value={$form.patient.admission.active}
          />
          <DateInput
            label="Fecha de Ingreso"
            bind:value={$form.patient.admission.dateIn}
          />
        </div>

        <div class="md:col-span-7">
          <DateInput
            label="Fecha de Egreso"
            bind:value={$form.patient.admission.dateOut}
          />
        </div>

        <div class="md:col-span-12">
          <TextInput
            label="Diagnósticos"
            bind:value={$form.patient.diagnosis}
          />
        </div>
      </div>
    </FormSectionCard>

    <!-- General Status -->
    <FormSectionCard
      title="Estado General"
      data={$form}
      patientId={patientId || ""}
    >
      <div
        class="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-gray-100"
      >
        <div class="md:col-span-6">
          <div class="mb-2">
            <span class="form-label">Transfusiones</span>
            <RadioGroup
              row
              name="transfusionsActive"
              options={yesNoOptions}
              bind:value={$form.generalStatus.transfusions.active}
            />
          </div>
          <TextInput
            label="Número"
            bind:value={$form.generalStatus.transfusions.count}
          />
        </div>
        <div class="md:col-span-6">
          <TextInput
            label="Ganancias Promedio Interdiálisis"
            bind:value={$form.generalStatus.interdialyticGain}
          />
        </div>
        <div class="md:col-span-6 grid grid-cols-2 gap-4">
          <TextInput
            label="Estado General"
            bind:value={$form.generalStatus.generalState}
          />
          <TextInput
            label="Apetito"
            bind:value={$form.generalStatus.appetite}
          />
        </div>
        <div class="md:col-span-6">
          <span class="form-label">Diuresis Residual</span>
          <div class="flex flex-col gap-2">
            <RadioGroup
              row
              name="residualDiuresisActive"
              options={yesNoOptions}
              bind:value={$form.generalStatus.residualDiuresis.active}
            />
            <RadioGroup
              row
              name="residualDiuresisType"
              options={typeOptions}
              bind:value={$form.generalStatus.residualDiuresis.type}
            />
          </div>
        </div>
      </div>
    </FormSectionCard>

    <!-- Comorbilidad -->
    <FormSectionCard
      title="Comorbilidad y Acceso"
      data={$form}
      patientId={patientId || ""}
    >
      <div
        class="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-gray-100"
      >
        <div class="md:col-span-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">HIPOTENSIÓN ARTERIAL</span>
              <RadioGroup
                row
                name="hypotension"
                options={yesNoOptions}
                bind:value={$form.comorbidities.hypotension}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">HIPERTENSIÓN ARTERIAL</span>
              <RadioGroup
                row
                name="hypertension"
                options={yesNoOptions}
                bind:value={$form.comorbidities.hypertension}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">PRURITO</span>
              <RadioGroup
                row
                name="pruritus"
                options={yesNoOptions}
                bind:value={$form.comorbidities.pruritus}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">DOLOR PRECORDIAL</span>
              <RadioGroup
                row
                name="precordialPain"
                options={yesNoOptions}
                bind:value={$form.comorbidities.precordialPain}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">HIPOGLUCEMIA</span>
              <RadioGroup
                row
                name="hypoglycemia"
                options={yesNoOptions}
                bind:value={$form.comorbidities.hypoglycemia}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">CEFALEA</span>
              <RadioGroup
                row
                name="headache"
                options={yesNoOptions}
                bind:value={$form.comorbidities.headache}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">LUMBALGIA</span>
              <RadioGroup
                row
                name="lumbalgia"
                options={yesNoOptions}
                bind:value={$form.comorbidities.lumbalgia}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">CALAMBRES</span>
              <RadioGroup
                row
                name="cramps"
                options={yesNoOptions}
                bind:value={$form.comorbidities.cramps}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">NAUSEAS / VÓMITOS</span>
              <RadioGroup
                row
                name="nausea"
                options={yesNoOptions}
                bind:value={$form.comorbidities.nausea}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">CRISIS PIRÓGENAS</span>
              <RadioGroup
                row
                name="pyrogenicCrisis"
                options={yesNoOptions}
                bind:value={$form.comorbidities.pyrogenicCrisis}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">BACTEREMIA</span>
              <RadioGroup
                row
                name="bacteremia"
                options={yesNoOptions}
                bind:value={$form.comorbidities.bacteremia}
              />
            </div>
          </div>

          <div class="mt-6 space-y-4">
            <TextInput
              label="Tratamiento"
              bind:value={$form.comorbidities.treatment}
            />
            <TextInput label="Otros" bind:value={$form.comorbidities.other} />
          </div>
        </div>

        <div class="md:col-span-6">
          <h3 class="form-section-title mb-4">Acceso Vascular</h3>
          <div class="space-y-6">
            <div>
              <span class="form-label">FAV</span>
              <RadioGroup
                row
                name="fav"
                options={[
                  { value: "autologa", label: "Autóloga" },
                  { value: "protesica", label: "Protésica" },
                ]}
                bind:value={$form.access.fav}
              />
            </div>
            <div>
              <span class="form-label">CVC</span>
              <RadioGroup
                row
                name="cvc"
                options={[
                  { value: "permacath", label: "Permacath" },
                  { value: "temporal", label: "Temporal" },
                ]}
                bind:value={$form.access.cvc}
              />
            </div>
            <div>
              <span class="form-label">Funcionamiento</span>
              <RadioGroup
                row
                name="functionality"
                options={functionalOptions}
                bind:value={$form.access.functionality}
              />
            </div>
            <TextInput
              label="Examen Físico del Acceso Vascular"
              bind:value={$form.access.exam}
            />
          </div>
        </div>
      </div>
    </FormSectionCard>

    <!-- Dialysis Params & Treatment -->
    <FormSectionCard
      title="Parámetros y Tratamiento"
      data={$form}
      patientId={patientId || ""}
    >
      <div
        class="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6 border-b border-gray-100"
      >
        <div class="md:col-span-6">
          <h3 class="form-section-title mb-4">Parámetros de Diálisis</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium"
                >CONTROL DE VOLEMMIA: Adecuado?</span
              >
              <RadioGroup
                row
                name="volemia"
                options={yesNoOptions}
                bind:value={$form.dialysisParams.volemia}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium"
                >CONTROL DE ANEMIA: Adecuado?</span
              >
              <RadioGroup
                row
                name="anemia"
                options={yesNoOptions}
                bind:value={$form.dialysisParams.anemia}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium"
                >ESTADO NUTRICIONAL: Adecuado?</span
              >
              <RadioGroup
                row
                name="nutrition"
                options={yesNoOptions}
                bind:value={$form.dialysisParams.nutrition}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium"
                >METABOLISMO P/Ca: Adecuado?</span
              >
              <RadioGroup
                row
                name="metabolism"
                options={yesNoOptions}
                bind:value={$form.dialysisParams.metabolism}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">PERFIL LÍPIDO: Adecuado?</span>
              <RadioGroup
                row
                name="lipids"
                options={yesNoOptions}
                bind:value={$form.dialysisParams.lipids}
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">KT/V: Adecuado?</span>
              <RadioGroup
                row
                name="ktv"
                options={yesNoOptions}
                bind:value={$form.dialysisParams.ktv}
              />
            </div>
          </div>
        </div>

        <div class="md:col-span-6">
          <h3 class="form-section-title mb-4">Tratamiento Actual</h3>
          <div class="grid grid-cols-2 gap-4">
            <TextInput
              label="VITAMINAS"
              bind:value={$form.currentTreatment.vitamins}
            />
            <TextInput label="EPO" bind:value={$form.currentTreatment.epo} />
            <TextInput
              label="HIERRO IV"
              bind:value={$form.currentTreatment.iron}
            />
            <TextInput
              label="LEVOCARNITINA"
              bind:value={$form.currentTreatment.carnitine}
            />
            <TextInput
              label="ANTIHIPERTENSIVOS"
              bind:value={$form.currentTreatment.antihypertensives}
            />
            <TextInput
              label="OTROS"
              bind:value={$form.currentTreatment.others}
            />
          </div>
        </div>
      </div>
    </FormSectionCard>

    <!-- Prescription -->
    <FormSectionCard
      title="Prescripción de Hemodiálisis"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <TextInput label="TIEMPO" bind:value={$form.prescription.time} />
          <TextInput label="FILTRO" bind:value={$form.prescription.filter} />
          <TextInput label="TAMPON" bind:value={$form.prescription.buffer} />
          <TextInput label="SODIO" bind:value={$form.prescription.sodium} />
          <div class="flex items-end gap-2">
            <div class="flex-1">
              <TextInput label="Qb" bind:value={$form.prescription.qb} />
            </div>
            <span class="text-xs text-gray-500 mb-3">ml/min</span>
          </div>
          <div class="flex items-end gap-2">
            <div class="flex-1">
              <TextInput label="Qd" bind:value={$form.prescription.qd} />
            </div>
            <span class="text-xs text-gray-500 mb-3">ml/min</span>
          </div>
        </div>

        <div class="space-y-4">
          <TextInput
            label="PESO SECO"
            bind:value={$form.prescription.dryWeight}
          />
          <TextInput
            label="ANTIGUAGULACIÓN"
            bind:value={$form.prescription.anticoagulation}
          />
          <TextInput
            label="CONDUCTIVIDAD"
            bind:value={$form.prescription.conductivity}
          />
          <TextInput
            label="KT/V META"
            bind:value={$form.prescription.ktvTarget}
          />
          <TextInput
            label="TEMPERATURA"
            bind:value={$form.prescription.temperature}
          />
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

  <div class="mt-12 text-center border-t border-gray-100 pt-8">
    <div class="inline-block border-t border-black px-12 pt-2">
      <p class="text-sm font-bold uppercase text-gray-700">
        Firma y Sello Médico
      </p>
    </div>
  </div>
</div>
