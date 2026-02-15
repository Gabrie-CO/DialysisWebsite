<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { cidhZodSchema } from "$lib/schemas/cidhZodSchema";
  import type { z } from "zod";
  import { untrack } from "svelte";

  // UI Components
  import TextInput from "../ui/TextInput.svelte";
  import DateInput from "../ui/DateInput.svelte";
  import RadioGroup from "../ui/RadioGroup.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import TableInput from "../ui/TableInput.svelte";
  import FormSectionCard from "../../ui/FormSectionCard.svelte";

  let { initialData, patientId, onSave } = $props<{
    initialData?: Partial<z.infer<typeof cidhZodSchema>>;
    patientId: string;
    onSave: (data: z.infer<typeof cidhZodSchema>) => void;
  }>();

  // Initialize Superform in SPA mode
  const { form, enhance, errors } = superForm(
    defaults(
      // @ts-ignore - defaults expects exact match but we handle partials
      untrack(() => initialData || {}),
      zod(cidhZodSchema as any),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zod(cidhZodSchema as any),
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

  // Helper for access table rows
  const accessRows = [
    { key: "fistula", label: "Fistula" },
    { key: "graft", label: "Injerto" },
    { key: "permCatheter", label: "Catéter Permanente" },
    { key: "tempCatheter", label: "Catéter Temporal" },
  ];

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

<div class="form-container">
  <header class="form-header mb-6">
    <h2 class="h2-text">CIDH</h2>
    {#if $form.updatedAt}
      <p class="small-text">
        Actualizado: {new Date($form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </header>

  <form method="POST" use:enhance class="space-y-8">
    <!-- SECTION 2: TIPO DE ACCESO (Table) -->
    <FormSectionCard
      title="Tipo de Acceso"
      data={$form}
      patientId={patientId || ""}
    >
      <TableInput
        columns={[
          { header: "Tipo" },
          { header: "Activo" },
          { header: "Fecha" },
          { header: "Fecha Desconocida" },
        ]}
      >
        {#each accessRows as row}
          {@const accessKey = row.key as keyof typeof $form.access}
          <tr>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >{row.label}</td
            >
            <td class="px-6 py-4 whitespace-nowrap">
              <Checkbox
                label=""
                bind:checked={$form.access[accessKey].active}
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <DateInput
                disabled={!$form.access[accessKey].active}
                bind:value={$form.access[accessKey].date}
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <Checkbox
                label=""
                bind:checked={$form.access[accessKey].unknownDate}
              />
            </td>
          </tr>
        {/each}
      </TableInput>
    </FormSectionCard>

    <!-- SECTION 3: DATOS DE ENFERMERÍA -->
    <FormSectionCard
      title="Datos de Enfermería"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Checkbox
          label="Fiebre ≥ 38 axilar"
          bind:checked={$form.nursing.fever}
        />
        <Checkbox label="Escalofríos" bind:checked={$form.nursing.chills} />
        <Checkbox label="Tos" bind:checked={$form.nursing.cough} />
        <Checkbox
          label="Caída de presión arterial"
          bind:checked={$form.nursing.hypotension}
        />
        <Checkbox
          label="Piel del Acceso (pus, enrojecimiento)"
          bind:checked={$form.nursing.pus}
        />
        <Checkbox
          label="Celulitis (piel enrojecida, caliente)"
          bind:checked={$form.nursing.cellulitis}
        />
        <Checkbox
          label="Herida sin relación al acceso"
          bind:checked={$form.nursing.wound}
        />
        <TextInput label="Otros" bind:value={$form.nursing.other} />
      </div>
    </FormSectionCard>

    <!-- SECTION 4: DATOS DEL MEDICO -->
    <FormSectionCard
      title="Datos del Medico (Semiología)"
      data={$form}
      patientId={patientId || ""}
    >
      <TableInput
        columns={[
          { header: "Síntoma" },
          { header: "Presente" },
          { header: "Fecha Inicio" },
          { header: "Característica" },
        ]}
      >
        {#each symptomsList as sym}
          {@const symKey = sym.k as keyof typeof $form.medical.symptoms}
          <tr>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {sym.l}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <Checkbox
                label=""
                bind:checked={$form.medical.symptoms[symKey].active}
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <DateInput
                bind:value={$form.medical.symptoms[symKey].start}
                disabled={!$form.medical.symptoms[symKey].active}
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <TextInput
                bind:value={$form.medical.symptoms[symKey].char}
                disabled={!$form.medical.symptoms[symKey].active}
              />
            </td>
          </tr>
        {/each}
      </TableInput>

      <div class="mt-6">
        <h4 class="font-medium text-gray-700 border-b pb-1">
          Impresión Diagnostica
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <Checkbox
            label="Infección del Acceso Vascular"
            bind:checked={$form.medical.diagnosis.vascularInfection}
          />
          <Checkbox
            label="Neumonía"
            bind:checked={$form.medical.diagnosis.pneumonia}
          />
          <Checkbox
            label="Celulitis"
            bind:checked={$form.medical.diagnosis.cellulitis}
          />
          <Checkbox
            label="Infección Tracto Urinario"
            bind:checked={$form.medical.diagnosis.uti}
          />
          <Checkbox
            label="Resfriado común / Gripe"
            bind:checked={$form.medical.diagnosis.cold}
          />
          <Checkbox
            label="Tuberculosis"
            bind:checked={$form.medical.diagnosis.tb}
          />
          <Checkbox
            label="Pie Diabético"
            bind:checked={$form.medical.diagnosis.diabeticFoot}
          />
          <TextInput label="Otros" bind:value={$form.medical.diagnosis.other} />
        </div>
      </div>
      <div class="mt-6">
        <h4 class="font-medium text-gray-700 mb-2 border-b pb-1">
          Pruebas Enviadas
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox
            label="Hemocultivo"
            bind:checked={$form.medical.tests.bloodCulture}
          />
          <Checkbox
            label="Urocultivo"
            bind:checked={$form.medical.tests.urineCulture}
          />
          <Checkbox
            label="Hemograma"
            bind:checked={$form.medical.tests.hemogram}
          />
          <TextInput label="Otras" bind:value={$form.medical.tests.other} />
        </div>

        <div class="mt-4 pt-4 border-t">
          <RadioGroup
            label="Se refiere"
            row
            name="referral"
            options={[
              { value: true, label: "SI" },
              { value: false, label: "NO" },
            ]}
            bind:value={$form.medical.referral.sent}
          />
          {#if $form.medical.referral.sent}
            <TextInput
              label="Donde..."
              bind:value={$form.medical.referral.where}
            />
          {/if}
        </div>
      </div>
    </FormSectionCard>

    <!-- SECTION 5: HOJA DE SEGUIMIENTO -->
    <FormSectionCard
      title="HOJA DE SEGUIMIENTO"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="form-divider-grid">
        <!-- LEFT COL -->
        <div class="form-col-divider-left">
          <div class="flex gap-4">
            <DateInput
              label="Fecha de seguimiento"
              bind:value={$form.followUp.date}
            />
            <RadioGroup
              label="Hospitalizado"
              row
              name="hosp"
              options={[
                { value: true, label: "SI" },
                { value: false, label: "NO" },
              ]}
              bind:value={$form.followUp.hospitalized}
            />
          </div>

          <span class="block font-medium mb-2">Resultado</span>
          <div class="grid grid-cols-3 gap-2 mb-2">
            <Checkbox
              label="Hemocultivo"
              bind:checked={$form.followUp.result.hemoculture}
            />
            <Checkbox
              label="Positivo"
              bind:checked={$form.followUp.result.positive}
            />
            <Checkbox
              label="Negativo"
              bind:checked={$form.followUp.result.negative}
            />
          </div>

          <div class="mt-2">
            <span class="text-sm font-medium">Agente Patógeno</span>
            <div class="flex gap-4 mt-1">
              <Checkbox
                label="Staphylococcus Aureus"
                bind:checked={$form.followUp.result.pathogen.staphAureus}
              />
              <TextInput
                placeholder="Otros"
                bind:value={$form.followUp.result.pathogen.other}
              />
            </div>
          </div>
        </div>

        <!-- RIGHT COL (Outcomes) -->
        <div class="form-col-divider-right">
          <h4 class="font-medium text-gray-700">Resultados del tratamiento</h4>
          <RadioGroup
            label="Completó tratamiento"
            row
            name="completed"
            options={[
              { value: "SI", label: "SI" },
              { value: "NO", label: "NO" },
            ]}
            bind:value={$form.followUp.outcomes.completed}
          />

          <div>
            <RadioGroup
              label="Abandonó tratamiento"
              row
              name="abandoned"
              options={[
                { value: "SI", label: "SI" },
                { value: "NO", label: "NO" },
              ]}
              bind:value={$form.followUp.outcomes.abandoned}
            />
            {#if $form.followUp.outcomes.abandoned === "SI"}
              <TextInput
                label="Por qué?"
                bind:value={$form.followUp.outcomes.whyAbandoned}
              />
            {/if}
          </div>

          <RadioGroup
            label="Persiste con picos febriles"
            row
            name="fever_cont"
            options={[
              { value: "SI", label: "SI" },
              { value: "NO", label: "NO" },
            ]}
            bind:value={$form.followUp.outcomes.continuingFever}
          />
        </div>
        <div class="form-col-full">
          <TextInput
            label="Comentario Final"
            bind:value={$form.followUp.outcomes.finalComment}
          />
        </div>
      </div>
    </FormSectionCard>

    <div class="form-save-btn">
      <button type="submit" class="form-button"> Guardar </button>
    </div>
  </form>
</div>
