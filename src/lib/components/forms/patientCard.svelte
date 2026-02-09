<script lang="ts">
  import { z } from "zod";

  // --- TYPES ---
  interface FormState {
    date: string;
    name: string;
    age: string;
    weight: string;

    // Checkboxes
    elderly80_90: boolean; // Ancianos 80-90 años
    malnutrition: boolean; // Desnutrición
    preservedDiuresis: boolean; // Diuresis Conservada

    // Dialysis Params
    time: string; // Tiempo
    qd: string;
    qb: string;
    ktvt: string;
    filter: string; // Filtro

    observations: string;
    signature: string;
  }

  // --- STATE ---
  let form = $state<FormState>({
    date: "",
    name: "",
    age: "",
    weight: "",
    elderly80_90: false,
    malnutrition: false,
    preservedDiuresis: false,
    time: "",
    qd: "",
    qb: "",
    ktvt: "",
    filter: "",
    observations: "",
    signature: "",
  });
</script>

{#snippet lineInput(
  label: string,
  value: string,
  update: (v: string) => void,
  widthClass: string = "w-full",
)}
  <div class={`flex items-end gap-1 ${widthClass}`}>
    <span class="font-bold text-gray-700 whitespace-nowrap text-lg"
      >{label}</span
    >
    <input
      type="text"
      {value}
      oninput={(e) => update((e.currentTarget as HTMLInputElement).value)}
      class="w-full border-b border-black outline-none bg-transparent px-1 font-medium text-blue-900 pb-0"
    />
  </div>
{/snippet}

{#snippet boxCheck(checked: boolean, toggle: () => void)}
  <div
    class="w-6 h-6 border border-black cursor-pointer flex items-center justify-center shrink-0 bg-white"
    onclick={toggle}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === "Enter" && toggle()}
  >
    {#if checked}
      <span class="text-black font-bold text-lg leading-none">✓</span>
    {/if}
  </div>
{/snippet}

<div
  class="max-w-md mx-auto p-6 bg-white shadow-xl border border-gray-300 font-sans text-gray-800 print:shadow-none print:border-none"
>
  <header class="flex justify-center mb-6">
    <div class="relative">
      <div class="flex items-center gap-2 justify-center">
        <div class="relative w-8 h-8">
          <div
            class="absolute inset-0 bg-red-800 rounded-full opacity-30 rotate-45 scale-x-75"
          ></div>
          <div
            class="absolute inset-0 border-2 border-red-900 rounded-full -rotate-12 scale-75"
          ></div>
        </div>
        <div>
          <h1
            class="font-bold text-xl text-blue-900 uppercase leading-none tracking-tight"
          >
            Diálisis de Honduras S.A.
          </h1>
          <div class="w-full h-0.5 bg-red-800 my-0.5 opacity-50"></div>
          <p
            class="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] text-center"
          >
            Brindando calidad de vida
          </p>
        </div>
      </div>
    </div>
  </header>

  <div class="space-y-3">
    <div>
      {@render lineInput("Fecha", form.date, (v) => (form.date = v), "w-1/2")}
    </div>

    <div>
      {@render lineInput("Nombre", form.name, (v) => (form.name = v))}
    </div>

    <div class="flex gap-4">
      {@render lineInput("Edad", form.age, (v) => (form.age = v), "w-1/3")}
      {@render lineInput(
        "Peso",
        form.weight,
        (v) => (form.weight = v),
        "w-1/2",
      )}
    </div>

    <div class="mt-4 grid grid-cols-[1.2fr_0.8fr] gap-y-3 gap-x-2 items-end">
      <div class="flex items-start gap-2">
        <div class="flex flex-col leading-tight">
          <span class="font-bold text-lg text-gray-700"
            >Ancianos 80-90 años</span
          >
          <span class="font-bold text-sm text-gray-700 text-center">(OMS)</span>
        </div>
        <div class="mt-1">
          {@render boxCheck(
            form.elderly80_90,
            () => (form.elderly80_90 = !form.elderly80_90),
          )}
        </div>
      </div>
      <div class="flex items-end gap-1">
        <span class="font-bold text-gray-700 text-lg">Tiempo:</span>
        <input
          bind:value={form.time}
          class="w-full border-b border-black outline-none bg-transparent"
        />
      </div>

      <div class="flex items-center justify-between pr-8">
        <span class="font-bold text-lg text-gray-700">Desnutrición</span>
        {@render boxCheck(
          form.malnutrition,
          () => (form.malnutrition = !form.malnutrition),
        )}
      </div>
      <div class="flex items-end gap-1">
        <span class="font-bold text-gray-700 text-lg">Qd:</span>
        <input
          bind:value={form.qd}
          class="w-full border-b border-black outline-none bg-transparent"
        />
      </div>

      <div class="flex items-center justify-between pr-8">
        <span class="font-bold text-lg text-gray-700">Diuresis Conservada</span>
        {@render boxCheck(
          form.preservedDiuresis,
          () => (form.preservedDiuresis = !form.preservedDiuresis),
        )}
      </div>
      <div class="flex items-end gap-1">
        <span class="font-bold text-gray-700 text-lg">Qb:</span>
        <input
          bind:value={form.qb}
          class="w-full border-b border-black outline-none bg-transparent"
        />
      </div>
    </div>

    <div class="flex gap-4 mt-2">
      {@render lineInput("KT/v T:", form.ktvt, (v) => (form.ktvt = v), "w-1/2")}
      {@render lineInput(
        "Filtro:",
        form.filter,
        (v) => (form.filter = v),
        "w-1/2",
      )}
    </div>

    <div class="mt-4">
      <span class="font-bold text-lg text-gray-700">Observaciones:</span>
      <div class="w-full">
        <textarea
          bind:value={form.observations}
          rows="2"
          class="w-full bg-transparent outline-none resize-none text-blue-900 border-b border-black leading-8"
          style="background-image: linear-gradient(transparent 31px, black 32px); background-size: 100% 32px; line-height: 32px;"
        ></textarea>
      </div>
    </div>

    <div class="mt-12 pt-4">
      <div class="flex items-end gap-2">
        <span class="font-bold text-gray-700 text-lg">Firma y Sello:</span>
        <div class="flex-1 border-b border-black h-6"></div>
      </div>
    </div>
  </div>
</div>
