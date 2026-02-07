<script lang="ts">
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
  }

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
  });
</script>

{#snippet lineInput(
  label: string,
  value: string,
  update: (v: string) => void,
  type: string = "text",
)}
  <div class="flex items-end gap-2 w-full mb-3">
    <span class="font-bold text-gray-700 uppercase whitespace-nowrap text-sm"
      >{label}:</span
    >
    <input
      {type}
      {value}
      oninput={(e) => update((e.currentTarget as HTMLInputElement).value)}
      class="w-full border-b border-gray-600 outline-none bg-transparent px-1 text-sm text-blue-900 font-medium pb-0.5"
    />
  </div>
{/snippet}

<div
  class="max-w-md mx-auto p-6 bg-white shadow-xl border border-gray-300 font-sans print:shadow-none print:border-none"
>
  <header class="flex items-start gap-3 mb-6">
    <div
      class="w-12 h-12 shrink-0 border border-gray-300 rounded-full flex items-center justify-center bg-gray-50 text-[8px] text-center p-1 text-gray-500"
    >
      Logo<br />Comité
    </div>
    <div class="w-full pt-2">
      <h1
        class="font-serif font-bold text-lg text-center uppercase underline decoration-1 underline-offset-4 text-gray-800 tracking-wide"
      >
        Comité de Infecciones
      </h1>
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
      <span class="font-bold text-gray-700 uppercase text-sm">PPS:</span>

      <div class="flex items-center gap-2">
        <span class="font-bold text-xl leading-none">-</span>
        <label class="cursor-pointer relative">
          <input
            type="checkbox"
            checked={form.pps === "negative"}
            onchange={() => (form.pps = "negative")}
            class="peer appearance-none w-8 h-6 border border-black bg-transparent"
          />
          <div
            class="hidden peer-checked:flex absolute inset-0 items-center justify-center pointer-events-none font-bold text-blue-900"
          >
            ✓
          </div>
        </label>
      </div>

      <div class="flex items-center gap-2">
        <span class="font-bold text-xl leading-none">+</span>
        <label class="cursor-pointer relative">
          <input
            type="checkbox"
            checked={form.pps === "positive"}
            onchange={() => (form.pps = "positive")}
            class="peer appearance-none w-8 h-6 border border-black bg-transparent"
          />
          <div
            class="hidden peer-checked:flex absolute inset-0 items-center justify-center pointer-events-none font-bold text-blue-900"
          >
            ✓
          </div>
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
      <span class="font-bold text-gray-700 uppercase text-sm block mb-1"
        >Observaciones:</span
      >
      <div class="relative w-full">
        <textarea
          bind:value={form.observations}
          class="w-full bg-transparent outline-none text-sm leading-8 resize-none text-blue-900 font-medium"
          style="background-image: repeating-linear-gradient(transparent, transparent 31px, #4b5563 31px, #4b5563 32px); line-height: 32px; padding-top: 4px;"
          rows="4"
        ></textarea>
      </div>
    </div>
  </div>
</div>
