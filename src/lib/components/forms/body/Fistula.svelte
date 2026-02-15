<script lang="ts">
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { fistulaSchema } from "$lib/schemas/fistulaSchema";
  import type { z } from "zod";
  import { untrack } from "svelte";

  // UI Components
  import TextInput from "../ui/TextInput.svelte";
  import Checkbox from "../ui/Checkbox.svelte";
  import TableInput from "../ui/TableInput.svelte";
  import FormSectionCard from "../../ui/FormSectionCard.svelte";

  let {
    initialData = {},
    patientId,
    onSave,
  } = $props<{
    initialData?: Partial<z.infer<typeof fistulaSchema>>;
    patientId: string;
    onSave: (data: z.infer<typeof fistulaSchema>) => void;
  }>();

  // Initialize Superform in SPA mode
  const { form, enhance } = superForm(
    defaults(
      // @ts-ignore
      untrack(() => initialData || {}),
      zod(fistulaSchema as any),
    ),
    {
      SPA: true,
      dataType: "json",
      validators: zod(fistulaSchema as any),
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

  // Helper for 3-state logic (Si/No/Null)
  // mapped to active: boolean | null
  function setCheck(key: keyof typeof $form.checks, value: boolean) {
    if ($form.checks[key].active === value) {
      // Toggle off if clicking same
      $form.checks[key].active = null;
    } else {
      $form.checks[key].active = value;
    }
  }

  const checkRows = [
    {
      key: "mature",
      title: "FISTULA MADURA",
      desc: "Vena Facilmente comprensible. Thrill prominente en el anastomosis y presente en el trayecto. Colapso de la vena tras la estenosis.",
    },
    {
      key: "stenosisYuxta",
      title: "ESTENOSIS YUXTAANASTOMICA",
      desc: "Pulso prominente en la anastomosis. Thrill disminuido. Escaso desarrollo de la vena tras la estenosis. Presencia del pulso debil tras la compresion de la vena de salida.",
    },
    {
      key: "accessoryVeins",
      title: "VENAS ACCESORIAS",
      desc: "Visualizables en la inspeccion. Presencia de thrill en su trayecto. Persistencia de thrill tras la compresion de la vena de salida.",
    },
    {
      key: "stenosisProximal",
      title: "ESTENOSIS VENA PROXIMAL",
      desc: "Trayeto de la vena hiperpulsatil. Ausencia de colapso al elevar la extremidad. Edema de la extremidad.",
    },
  ] as const;
</script>

{#snippet colorCheck(color: "red" | "yellow" | "green", cssColor: string)}
  <div class="flex items-center gap-2">
    <div
      class={`w-5 h-5 rounded-full border border-gray-400 ${cssColor}`}
    ></div>
    <input
      type="checkbox"
      class="w-6 h-6 border-2 border-gray-600 appearance-none rounded-full checked:bg-gray-800 checked:after:content-['✓'] checked:after:text-white checked:after:flex checked:after:justify-center"
      checked={$form.statusColor === color}
      onchange={() => ($form.statusColor = color)}
    />
  </div>
{/snippet}

<div class="form-container">
  <header class="form-header mb-6">
    <h2 class="h2-text">Control de Fístula</h2>
    {#if $form.updatedAt}
      <p class="small-text">
        Actualizado: {new Date($form.updatedAt).toLocaleString()}
      </p>
    {/if}
  </header>

  <form method="POST" use:enhance class="space-y-6">
    <FormSectionCard
      title="Datos del Paciente"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2">
          <TextInput
            label="Nombre del paciente"
            bind:value={$form.patientName}
          />
        </div>
        <div>
          <TextInput label="Edad" bind:value={$form.age} />
        </div>
      </div>
    </FormSectionCard>

    <FormSectionCard
      title="Tipo de Fístula"
      data={$form}
      patientId={patientId || ""}
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div class="md:col-span-2 flex gap-8">
          <Checkbox
            label="Fistula Autologa"
            bind:checked={$form.fistulaType.autologous}
          />
          <Checkbox
            label="Fistula Protésica"
            bind:checked={$form.fistulaType.prosthetic}
          />
        </div>
        <div
          class="flex flex-col gap-2 items-end md:items-start pl-4 border-l border-gray-200"
        >
          {@render colorCheck("red", "bg-red-500")}
          {@render colorCheck("yellow", "bg-yellow-400")}
          {@render colorCheck("green", "bg-green-600")}
        </div>
      </div>
    </FormSectionCard>

    <FormSectionCard
      title="Madurez de la Fístula arteriovenosa y Exploracion Física"
      data={$form}
      patientId={patientId || ""}
    >
      <table class="min-w-full divide-y divide-gray-200">
        <tbody class="bg-white divide-y divide-gray-200">
          {#each checkRows as row}
            {@const key = row.key as keyof typeof $form.checks}
            <tr>
              <td
                class="table-input-th w-1/3 bg-gray-50 border-r border-gray-200"
              >
                <div class="font-bold text-xs uppercase mb-2 italic">
                  {row.title}
                </div>
                <div class="flex justify-between items-center px-2">
                  <label
                    class="flex items-center gap-2 cursor-pointer font-bold text-sm"
                  >
                    Si
                    <input
                      type="checkbox"
                      checked={$form.checks[key].active === true}
                      onchange={() => setCheck(key, true)}
                      class="w-5 h-5 border border-black appearance-none checked:bg-black"
                    />
                  </label>
                  <label
                    class="flex items-center gap-2 cursor-pointer font-bold text-sm"
                  >
                    No
                    <input
                      type="checkbox"
                      checked={$form.checks[key].active === false}
                      onchange={() => setCheck(key, false)}
                      class="w-5 h-5 border border-black appearance-none checked:bg-black"
                    />
                  </label>
                </div>
              </td>
              <td class="p-4 text-xs italic text-gray-800">
                {row.desc}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="p-4 bg-gray-50 border-t border-gray-200">
        <TextInput
          label="Observacion"
          bind:value={$form.observation}
          placeholder="Observaciones..."
        />
      </div>
    </FormSectionCard>

    <div class="form-save-btn">
      <button type="submit" class="form-button"> Guardar </button>
    </div>
  </form>
</div>
