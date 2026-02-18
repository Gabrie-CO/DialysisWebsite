<script lang="ts">
    import { superForm, defaults } from "sveltekit-superforms";
    import { zod } from "sveltekit-superforms/adapters";
    import { criticalInfoSchema } from "$lib/schemas/criticalInfoSchema";
    import { untrack } from "svelte";
    import { toast } from "svelte-sonner";
    import TextInput from "$lib/components/forms/ui/TextInput.svelte";
    import Checkbox from "$lib/components/forms/ui/Checkbox.svelte";

    let { initialData, onSave } = $props<{
        initialData: any;
        onSave: (data: any) => void;
    }>();

    const { form, enhance } = superForm(
        defaults(
            // @ts-ignore
            untrack(() => initialData || {}),
            zod(criticalInfoSchema as any),
        ),
        {
            SPA: true,
            dataType: "json",
            validators: zod(criticalInfoSchema as any),
            resetForm: false,
            onUpdate: async ({ form }) => {
                if (form.valid) {
                    try {
                        await onSave(form.data);
                        toast.success("Critical info saved");
                    } catch (error) {
                        console.error("Save failed", error);
                        toast.error("Error saving.");
                    }
                }
            },
        },
    );
</script>

<form
    method="POST"
    use:enhance
    class="bg-red-50/30 border border-red-100 rounded-xl p-6 mb-8 relative shadow-sm hover:shadow-md transition-all duration-300"
>
    <div class="absolute top-0 right-0 p-4 z-10">
        <button
            type="submit"
            class="bg-white text-red-600 border border-red-200 text-xs font-bold px-4 py-2 rounded-full hover:bg-red-50 hover:text-red-700 transition shadow-sm flex items-center gap-1"
        >
            <span>💾</span> Save Vitals
        </button>
    </div>

    <h3
        class="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6 border-b border-red-100 pb-2"
    >
        <span class="text-2xl">🚨</span> Critical Patient Information
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        <!-- Weights -->
        <div
            class="col-span-1 md:col-span-1 lg:col-span-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors flex flex-col justify-between gap-4"
        >
            <!-- Pre Weight (Top) -->
            <div class="w-full">
                <div class="mb-1">
                    <span
                        class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                        >Pre Weight</span
                    >
                </div>
                <div class="flex items-center gap-2">
                    <input
                        type="number"
                        bind:value={$form.preWeight}
                        step="0.1"
                        class="block w-full text-2xl font-bold text-gray-800 border-none p-0 focus:ring-0 placeholder-gray-300"
                        placeholder="0.0"
                    />
                    <span class="text-sm font-medium text-gray-400">kg</span>
                </div>
            </div>

            <!-- Divider -->
            <div class="w-full h-px bg-gray-100"></div>

            <!-- Dry Weight (Bottom) -->
            <div class="w-full">
                <div class="mb-1">
                    <span
                        class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                        >Dry Weight</span
                    >
                </div>
                <div class="flex items-center gap-2">
                    <input
                        type="number"
                        bind:value={$form.bodyWeight}
                        step="0.1"
                        class="block w-full text-2xl font-bold text-gray-800 border-none p-0 focus:ring-0 placeholder-gray-300"
                        placeholder="0.0"
                    />
                    <span class="text-sm font-medium text-gray-400">kg</span>
                </div>
            </div>
        </div>

        <!-- Condition -->
        <div
            class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors"
        >
            <span
                class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3"
                >Patient Condition</span
            >
            <div class="flex flex-wrap gap-2">
                {#each ["stable", "warning", "critical"] as status}
                    <label class="cursor-pointer">
                        <input
                            type="radio"
                            bind:group={$form.condition}
                            value={status}
                            class="peer sr-only"
                        />
                        <div
                            class="px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all uppercase tracking-wider
                            peer-checked:ring-2 peer-checked:ring-offset-1 peer-checked:shadow-sm
                            {status === 'stable'
                                ? 'peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-600 border-gray-200 text-gray-400 hover:bg-green-50'
                                : ''}
                            {status === 'warning'
                                ? 'peer-checked:bg-orange-500 peer-checked:text-white peer-checked:border-orange-600 border-gray-200 text-gray-400 hover:bg-orange-50'
                                : ''}
                            {status === 'critical'
                                ? 'peer-checked:bg-red-600 peer-checked:text-white peer-checked:border-red-700 border-gray-200 text-gray-400 hover:bg-red-50'
                                : ''}
                        "
                        >
                            {status}
                        </div>
                    </label>
                {/each}
            </div>
        </div>

        <!-- Infected -->
        <!-- Infected -->
        <div
            class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors flex flex-col justify-between h-full"
        >
            <span
                class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1"
                >Infection Status</span
            >

            <div
                class="flex flex-col items-start gap-3 mt-1 h-full justify-between"
            >
                <div class="flex items-center gap-2">
                    <span class="text-2xl">{$form.infected ? "⚠️" : "🛡️"}</span>
                    <span
                        class="text-sm font-bold {$form.infected
                            ? 'text-red-600'
                            : 'text-green-600'}"
                    >
                        {$form.infected ? "Contagious" : "Clear"}
                    </span>
                </div>
                <div class="scale-125 origin-left">
                    <Checkbox bind:checked={$form.infected} label="" />
                </div>
            </div>
        </div>

        <!-- Treatment Type -->
        <div
            class="col-span-1 md:col-span-2 lg:col-span-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors group"
        >
            <div class="mb-1">
                <span
                    class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                    >Treatment Type</span
                >
            </div>
            <input
                type="text"
                bind:value={$form.treatmentType}
                class="block w-full text-lg font-bold text-gray-800 border-none p-0 focus:ring-0 placeholder-gray-300"
                placeholder="e.g. HD Standard"
            />
        </div>

        <!-- Pre-existing Conditions -->
        <div
            class="col-span-1 md:col-span-2 lg:col-span-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors group"
        >
            <div class="mb-2 flex items-center gap-2">
                <span
                    class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                    >Pre-existing Conditions / Comorbidities</span
                >
            </div>
            <div class="relative">
                <input
                    type="text"
                    bind:value={$form.preExistingConditions}
                    class="block w-full text-base text-gray-700 border-none p-0 focus:ring-0 placeholder-gray-300 bg-transparent"
                    placeholder="Enter conditions separated by commas (e.g. Diabetes, Hypertension, CVD)"
                />
                <div class="absolute right-0 bottom-0 text-gray-300">✏️</div>
            </div>
            {#if $form.preExistingConditions}
                <div class="flex flex-wrap gap-2 mt-3">
                    {#each $form.preExistingConditions
                        .split(",")
                        .filter((c: string) => c.trim()) as condition}
                        <span
                            class="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold border border-gray-200"
                        >
                            {condition.trim()}
                        </span>
                    {/each}
                </div>
            {/if}
        </div>
        <!-- Observations -->
        <div
            class="col-span-1 md:col-span-2 lg:col-span-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors"
        >
            <div class="mb-1">
                <span
                    class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                    >Observations</span
                >
            </div>
            <textarea
                bind:value={$form.observations}
                class="block w-full text-sm text-gray-700 border-none p-0 focus:ring-0 placeholder-gray-300 resize-none"
                placeholder="Add any general observations..."
                rows="2"
            ></textarea>
        </div>
    </div>
</form>
