<script lang="ts">
  import { untrack } from "svelte";

  // --- TYPES ---
  interface FormState {
    name: string;
    antibiotic: string;
    dose: string;
    route: string;
    pps: "negative" | "positive" | null;
    startDate: string;
    endDate: string;
    observations: string;
    updatedAt?: string;
  }

  let { initialData = {}, onSave } = $props<{
    initialData?: Partial<FormState>;
    onSave: (data: FormState) => void;
  }>();

  // --- STATE ---
  let form = $state<FormState>({
    name: "",
    antibiotic: "",
    dose: "",
    route: "",
    pps: null,
    startDate: "",
    endDate: "",
    observations: "",
    ...untrack(() => initialData),
  });

  $effect(() => {
    form = {
      name: "",
      antibiotic: "",
      dose: "",
      route: "",
      pps: null,
      startDate: "",
      endDate: "",
      observations: "",
      ...initialData,
    };
  });

  function handleSave() {
    onSave(form);
  }
</script>

{#snippet lineInput(
  label: string,
  value: string,
  update: (v: string) => void,
  type: string = "text",
)}
  <label class="block mb-3">
    <span class="form-label">{label}</span>
    <input
      {type}
      {value}
      oninput={(e) => update((e.currentTarget as HTMLInputElement).value)}
      class="form-input"
    />
  </label>
{/snippet}

<div class="form-container">
  <header class="form-header">
    <div class="flex items-center gap-4 w-full">
      <div
        class="w-12 h-12 shrink-0 border border-gray-300 rounded-full flex items-center justify-center bg-gray-50 text-[8px] text-center p-1 text-gray-500"
      >
        Logo<br />Comité
      </div>
      <div class="w-full text-center">
        <h1 class="form-title mb-0 underline decoration-1 underline-offset-4">
          Comité de Infecciones
        </h1>
        {#if form.updatedAt}
          <p class="text-[10px] text-gray-400 mt-1">
            Actualizado: {new Date(form.updatedAt).toLocaleString()}
          </p>
        {/if}
      </div>
    </div>
  </header>

  <div class="space-y-1">
    {@render lineInput("Nombre", form.name, (v) => (form.name = v))}
    {@render lineInput(
      "Antibiótico",
      form.antibiotic,
      (v) => (form.antibiotic = v),
    )}
    {@render lineInput("Dosis", form.dose, (v) => (form.dose = v))}
    {@render lineInput(
      "Vía de Administración",
      form.route,
      (v) => (form.route = v),
    )}

    <div class="flex items-center gap-4 mb-4 mt-2">
      <span class="form-label mb-0">PPS:</span>

      <div class="flex items-center gap-2">
        <label class="form-checkbox-label">
          <input
            type="checkbox"
            checked={form.pps === "negative"}
            onchange={() => (form.pps = "negative")}
            class="form-checkbox"
          /> -
        </label>
      </div>

      <div class="flex items-center gap-2">
        <label class="form-checkbox-label">
          <input
            type="checkbox"
            checked={form.pps === "positive"}
            onchange={() => (form.pps = "positive")}
            class="form-checkbox"
          /> +
        </label>
      </div>
    </div>

    {@render lineInput(
      "Fecha de Inicio",
      form.startDate,
      (v) => (form.startDate = v),
      "date",
    )}
    {@render lineInput(
      "Fecha de Finalización",
      form.endDate,
      (v) => (form.endDate = v),
      "date",
    )}

    <div class="mt-4">
      <label class="form-label"
        >Observaciones <textarea
          bind:value={form.observations}
          class="form-textarea h-32"
          rows="4"
        ></textarea>
        ></label
      >
    </div>

    <div class="form-save-btn">
      <button onclick={handleSave} class="form-btn-primary"> Guardar </button>
    </div>
  </div>
</div>
