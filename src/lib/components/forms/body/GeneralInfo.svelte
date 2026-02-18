<script lang="ts">
    import { superForm, defaults } from "sveltekit-superforms";
    import { zod } from "sveltekit-superforms/adapters";
    import type { z } from "zod";
    import { generalInfoSchema } from "$lib/schemas/generalInfoSchema";
    import { untrack } from "svelte";
    import { toast } from "svelte-sonner";

    import TextInput from "../ui/TextInput.svelte";
    import FormSectionCard from "../../ui/FormSectionCard.svelte";

    let {
        initialData = {},
        patientId,
        onSave,
    } = $props<{
        initialData?: Partial<z.infer<typeof generalInfoSchema>>;
        patientId: string;
        onSave: (data: z.infer<typeof generalInfoSchema>) => void;
    }>();

    // Initialize Superform in SPA mode
    const { form, enhance } = superForm(
        defaults(
            // @ts-ignore
            untrack(() => initialData || {}),
            zod(generalInfoSchema as any),
        ),
        {
            SPA: true,
            dataType: "json",
            validators: zod(generalInfoSchema as any),
            resetForm: false, // Prevent form from resetting to stale initialData
            onUpdate: async ({ form }) => {
                if (form.valid) {
                    try {
                        await onSave(form.data);
                        toast.success("Saved successfully");
                    } catch (error) {
                        console.error("Save failed", error);
                        toast.error("Error saving.");
                    }
                }
            },
        },
    );
</script>

<form method="POST" use:enhance class="mt-6 space-y-6">
    <FormSectionCard
        title="Datos Generales"
        data={$form}
        patientId={patientId || ""}
    >
        <div class="grid grid-cols-12 gap-x-4 gap-y-4">
            <div class="col-span-8">
                <TextInput label="NOMBRE" bind:value={$form.name} />
            </div>
            <div class="col-span-4">
                <TextInput label="SEXO" bind:value={$form.sex} />
            </div>

            <div class="col-span-2">
                <TextInput label="EDAD" bind:value={$form.age} />
            </div>
            <div class="col-span-5">
                <TextInput
                    label="ESTADO CIVIL"
                    bind:value={$form.civilStatus}
                />
            </div>
            <div class="col-span-5">
                <TextInput label="OCUPACION" bind:value={$form.occupation} />
            </div>

            <div class="col-span-6">
                <TextInput
                    label="LUGAR DE NACIMIENTO"
                    bind:value={$form.birthPlace}
                />
            </div>
            <div class="col-span-6">
                <TextInput
                    label="FECHA DE NACIMIENTO"
                    bind:value={$form.birthDate}
                />
            </div>

            <div class="col-span-8">
                <TextInput
                    label="LUGAR DE RESIDENCIA"
                    bind:value={$form.residence}
                />
            </div>
            <div class="col-span-4">
                <TextInput label="TELEFONO" bind:value={$form.phone} />
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
