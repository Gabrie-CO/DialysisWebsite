<script lang="ts">
  import FormGenerator from "../generator/FormGenerator.svelte";
  import { cidhSchema } from "../schemas/cidhSchema";
  import { createCIDHData, type CIDHFormData } from "../data/cidhModel";

  let { initialData = {}, onSave } = $props<{
    initialData?: Partial<CIDHFormData>;
    onSave: (data: CIDHFormData) => void;
  }>();

  // Initialize form data using the helper from cidhModel
  let formData = $state<CIDHFormData>(createCIDHData(initialData));

  // Re-initialize if initialData changes
  $effect(() => {
    formData = createCIDHData(initialData);
  });
</script>

<div class="form-container">


  <header class="form-header">
    <div>
      <h1 class="form-title">Diálisis de Honduras S.A. de C.V.</h1>
      <p class="form-subtitle">Brindando calidad de vida</p>
    </div>
    <div class="text-right">
      <h2 class="text-2xl font-serif text-gray-600">CIDH</h2>
      <p class="text-xs font-bold uppercase text-gray-500">
        Comité de Infectologia
      </p>
      {#if formData.updatedAt}
        <p class="text-[10px] text-gray-400 mt-1">
          Actualizado: {new Date(formData.updatedAt).toLocaleString()}
        </p>
      {/if}
    </div>
  </header>

  <!-- GENERATED FORM -->
  <FormGenerator schema={cidhSchema} bind:data={formData} />
    <div class="form-save-btn">
    <button onclick={() => onSave(formData)} class="form-button">
      Guardar
    </button>
  </div>
</div>
