<script lang="ts">
  // --- TYPES ---
  type Route = "IV" | "VO" | "SC" | "IM" | "";

  interface MedicationRow {
    id: number;
    medication: string;
    date: string;
    route: Route;
    indications: string; // Indicaciones o Comentarios
    dose: string;
    time: string;
    doctorSign: string; // Firma y Sello Médico
    nurseSign: string; // Nombre y Firma Enfermería
  }

  interface FormState {
    patientName: string;
    rows: MedicationRow[];
  }

  // --- STATE ---
  // Initialize with 10 rows (The image shows 8, but 10 fills a page better)
  let form = $state<FormState>({
    patientName: "",
    rows: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      medication: "",
      date: "",
      route: "",
      indications: "",
      dose: "",
      time: "",
      doctorSign: "",
      nurseSign: "",
    })),
  });

  // --- LOGIC ---
  // Helper to add a new row if needed
  function addRow() {
    const nextId = form.rows.length + 1;
    form.rows.push({
      id: nextId,
      medication: "",
      date: "",
      route: "",
      indications: "",
      dose: "",
      time: "",
      doctorSign: "",
      nurseSign: "",
    });
  }
</script>

{#snippet textCell(
  value: string,
  update: (v: string) => void,
  placeholder: string = "",
)}
  <div class="h-full w-full relative">
    <input
      type="text"
      {value}
      oninput={(e) => update((e.currentTarget as HTMLInputElement).value)}
      class="w-full h-full p-2 bg-transparent outline-none text-xs text-center border-none focus:bg-blue-50"
      {placeholder}
    />
  </div>
{/snippet}

{#snippet dateCell(value: string, update: (v: string) => void)}
  <div class="h-full w-full relative">
    <input
      type="date"
      {value}
      oninput={(e) => update((e.currentTarget as HTMLInputElement).value)}
      class="w-full h-full p-1 bg-transparent outline-none text-[10px] text-center border-none focus:bg-blue-50"
    />
  </div>
{/snippet}

<div
  class="max-w-300 mx-auto p-8 bg-white shadow-xl text-gray-800 font-sans print:shadow-none print:max-w-none print:p-2 landscape:w-full"
>
  <header
    class="flex justify-between items-center border-b-2 border-black pb-4 mb-6"
  >
    <div class="flex items-center gap-4">
      <div
        class="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xl"
      >
        DH
      </div>
      <div>
        <h1 class="text-xl font-bold text-blue-900 uppercase">
          Diálisis de Honduras S.A. de C.V.
        </h1>
        <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Brindando calidad de vida
        </p>
      </div>
    </div>
    <div class="text-right">
      <h2
        class="text-xl font-bold uppercase tracking-wide border-2 border-gray-800 px-4 py-1"
      >
        Hoja de Aplicación de Medicamentos
      </h2>
    </div>
  </header>

  <div
    class="mb-6 flex items-end gap-4 bg-gray-50 p-4 border border-gray-200 rounded"
  >
    <label class="w-full">
      <span class="font-bold text-sm text-gray-600 uppercase"
        >Nombre del Paciente:</span
      >
      <input
        type="text"
        bind:value={form.patientName}
        class="w-full text-lg border-b-2 border-gray-400 bg-transparent outline-none focus:border-blue-800 px-1 py-1"
        placeholder="Ingrese nombre completo..."
      />
    </label>
  </div>

  <div class="border-2 border-black overflow-x-auto">
    <table class="w-full border-collapse min-w-225">
      <thead>
        <tr
          class="bg-gray-200 text-xs font-bold text-center divide-x divide-black border-b border-black"
        >
          <th class="p-2 w-10">N.</th>
          <th class="p-2 w-48">MEDICAMENTO</th>
          <th class="p-2 w-24">FECHA</th>
          <th class="p-2 w-24">
            VÍA<br />
            <span class="text-[9px] font-normal">(V.O, I.V., S.C.)</span>
          </th>
          <th class="p-2 w-64">INDICACIONES O<br />COMENTARIOS</th>
          <th class="p-2 w-20">DOSIS</th>
          <th class="p-2 w-20">HORA</th>
          <th class="p-2 w-40">FIRMA Y SELLO<br />MÉDICO</th>
          <th class="p-2 w-40">NOMBRE Y FIRMA<br />ENFERMERÍA</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-400">
        {#each form.rows as row (row.id)}
          <tr class="divide-x divide-gray-400 hover:bg-gray-50 h-16">
            <td class="text-center font-bold text-gray-500 text-xs bg-gray-100">
              {row.id}
            </td>

            <td>
              {@render textCell(row.medication, (v) => (row.medication = v))}
            </td>

            <td>
              {@render dateCell(row.date, (v) => (row.date = v))}
            </td>

            <td class="p-0">
              <select
                bind:value={row.route}
                class="w-full h-full bg-transparent outline-none text-xs text-center border-none appearance-none focus:bg-blue-50 p-2 cursor-pointer"
              >
                <option value=""></option>
                <option value="IV">I.V.</option>
                <option value="VO">V.O.</option>
                <option value="SC">S.C.</option>
                <option value="IM">I.M.</option>
              </select>
            </td>

            <td>
              <textarea
                bind:value={row.indications}
                class="w-full h-full p-1 bg-transparent outline-none text-xs resize-none focus:bg-blue-50"
              ></textarea>
            </td>

            <td>
              {@render textCell(row.dose, (v) => (row.dose = v))}
            </td>

            <td>
              <input
                type="time"
                bind:value={row.time}
                class="w-full h-full p-1 bg-transparent outline-none text-xs text-center border-none focus:bg-blue-50"
              />
            </td>

            <td>
              {@render textCell(row.doctorSign, (v) => (row.doctorSign = v))}
            </td>

            <td>
              {@render textCell(row.nurseSign, (v) => (row.nurseSign = v))}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="mt-4 print:hidden text-center">
    <button
      onclick={addRow}
      class="bg-blue-900 text-white px-6 py-2 rounded shadow hover:bg-blue-800 transition text-sm font-bold"
    >
      + Agregar Fila
    </button>
  </div>
</div>

<style>
  /* Print Adjustments to ensure the table borders are crisp */
  @media print {
    .print\:hidden {
      display: none;
    }

    /* Force background colors to print for the header row */
    th {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>
