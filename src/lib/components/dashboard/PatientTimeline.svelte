<script lang="ts">
    import { useQuery, useConvexClient } from "convex-svelte";
    import { api } from "../../../../convex/_generated/api";
    // @ts-ignore
    import type { Id } from "../../../../convex/_generated/dataModel";
    import CriticalInfoForm from "./CriticalInfoForm.svelte";

    let { patientId } = $props<{ patientId: string }>();

    const convex = useConvexClient();

    const meetings = useQuery(api.meetings.getRecent, () =>
        patientId ? { patientId: patientId as Id<"users"> } : "skip",
    );

    const patient = useQuery(api.patients.getById, () =>
        patientId ? { id: patientId as Id<"users"> } : "skip",
    );

    const criticalInfoData = $derived(
        patient.data?.criticalInfo
            ? {
                  bodyWeight: patient.data.criticalInfo.bodyWeight ?? 0,
                  preWeight: patient.data.criticalInfo.preWeight ?? 0,
                  condition: patient.data.criticalInfo.condition ?? "stable",
                  infected: patient.data.criticalInfo.infected ?? false,
                  preExistingConditions:
                      patient.data.criticalInfo.preExistingConditions ?? "",
                  treatmentType: patient.data.criticalInfo.treatmentType ?? "",
                  observations: patient.data.criticalInfo.observations ?? "",
              }
            : patient.data // Fallback to root (legacy/transition) if not in form yet
              ? {
                    bodyWeight: patient.data.bodyWeight ?? 0,
                    preWeight: patient.data.preWeight ?? 0,
                    condition: patient.data.condition ?? "stable",
                    infected: patient.data.infected ?? false,
                    preExistingConditions:
                        patient.data.preExistingConditions ?? "",
                    treatmentType: patient.data.treatmentType ?? "",
                    observations: patient.data.observations ?? "",
                }
              : undefined,
    );

    const pinnedItems = $derived.by(() => {
        const patientData = patient.data;
        if (!patientData || !patientData.pinnedSections) return [];

        return patientData.pinnedSections.map((section: string) => {
            // Map section ID (e.g. "hemodialysis") to data
            const data = patientData[section as keyof typeof patientData];
            // Format title (e.g. "hemodialysis" -> "Hemodialysis")
            const title = section.charAt(0).toUpperCase() + section.slice(1);

            return {
                title,
                date: new Date().toISOString(),
                pinnedData: data,
            };
        });
    });
</script>

<div class="space-y-4">
    <!-- Critical Info Header Form -->
    {#if patient.data && criticalInfoData}
        <CriticalInfoForm
            initialData={criticalInfoData}
            onSave={async (data) => {
                await convex.mutation(api.patients.updateCriticalInfo, {
                    // Using 'any' as workaround due to tooling stripping generic args in template
                    patientId: patientId as any,
                    criticalInfo: data,
                });
            }}
        />
    {/if}

    <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span>📅</span> Patient Timeline
        <span class="text-xs font-normal text-gray-500 ml-auto"
            >(Last 3 Sessions)</span
        >
    </h3>

    {#if meetings.isLoading || patient.isLoading}
        <div class="flex justify-center p-8">
            <div
                class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"
            ></div>
        </div>
    {:else if !meetings.data?.recentSessions?.length && !pinnedItems.length}
        <div
            class="p-8 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl"
        >
            <p class="text-gray-400 font-medium">
                No recent timeline activity.
            </p>
        </div>
    {:else}
        <div class="space-y-8">
            <!-- Pinned Items Section -->
            {#if pinnedItems.length > 0}
                <div class="space-y-3">
                    <h4
                        class="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"
                    >
                        <span>📌</span> Pinned Reminders
                    </h4>
                    {#each pinnedItems as item}
                        <div
                            class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm relative group"
                        >
                            <div class="flex justify-between items-start mb-2">
                                <h5 class="font-bold text-gray-900">
                                    {item.title}
                                </h5>
                                <span class="text-[10px] text-gray-400">
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                            </div>

                            {#if item.pinnedData}
                                <div class="grid grid-cols-2 gap-2 text-sm">
                                    {#each Object.entries(item.pinnedData) as [key, value]}
                                        {#if typeof value !== "object" && value !== null && value !== undefined}
                                            <div
                                                class="flex items-center gap-2"
                                            >
                                                <span
                                                    class="text-gray-500 capitalize text-xs"
                                                >
                                                    {key
                                                        .replace(
                                                            /([A-Z])/g,
                                                            " $1",
                                                        )
                                                        .trim()}:
                                                </span>
                                                <span
                                                    class="font-medium text-gray-800"
                                                >
                                                    {value === true
                                                        ? "Yes"
                                                        : value === false
                                                          ? "No"
                                                          : value}
                                                </span>
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}

            <!-- Recent Sessions Timeline -->
            {#if meetings.data?.recentSessions?.length}
                <div>
                    <h4
                        class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"
                    >
                        <span>🕒</span> Recent Activity
                    </h4>
                    <div
                        class="relative pl-4 border-l-2 border-gray-200 space-y-8"
                    >
                        {#each meetings.data?.recentSessions ?? [] as meeting}
                            <div class="relative group">
                                <!-- Timeline Dot -->
                                <div
                                    class="absolute -left-[25px] top-1 h-5 w-5 rounded-full border-4 border-white shadow-sm transition-colors"
                                    class:bg-blue-500={meeting.status ===
                                        "completed"}
                                    class:bg-green-500={meeting.status ===
                                        "active"}
                                    class:bg-gray-400={![
                                        "completed",
                                        "active",
                                    ].includes(meeting.status)}
                                ></div>

                                <div
                                    class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                                >
                                    <div
                                        class="flex flex-col sm:flex-row justify-between gap-4 mb-3"
                                    >
                                        <div>
                                            <p
                                                class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1"
                                            >
                                                {new Date(
                                                    meeting.date,
                                                ).toLocaleDateString()} at {new Date(
                                                    meeting.date,
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>

                                        {#if meeting.chairId}
                                            <div class="flex items-start">
                                                <span
                                                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold"
                                                >
                                                    💺 Chair {meeting.chairId}
                                                </span>
                                            </div>
                                        {/if}
                                    </div>

                                    <!-- Stats Grid -->
                                    <div
                                        class="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-gray-50"
                                    >
                                        <!-- Condition -->
                                        <div>
                                            <span
                                                class="text-[10px] uppercase text-gray-400 font-bold block mb-1"
                                                >Condition</span
                                            >
                                            {#if meeting.condition}
                                                <span
                                                    class="font-medium text-gray-700"
                                                    >{meeting.condition}</span
                                                >
                                            {:else}
                                                <span
                                                    class="text-gray-300 italic"
                                                    >--</span
                                                >
                                            {/if}
                                        </div>

                                        <!-- Weight Pre -->
                                        <div>
                                            <span
                                                class="text-[10px] uppercase text-gray-400 font-bold block mb-1"
                                                >Pre-Weight</span
                                            >

                                            <span class="text-gray-300 italic"
                                                >--</span
                                            >
                                        </div>

                                        <!-- Weight Post -->
                                        <div>
                                            <span
                                                class="text-[10px] uppercase text-gray-400 font-bold block mb-1"
                                                >Post-Weight</span
                                            >

                                            <span class="text-gray-300 italic"
                                                >--</span
                                            >
                                        </div>

                                        <!-- Observations -->
                                        <div>
                                            <span
                                                class="text-[10px] uppercase text-gray-400 font-bold block mb-1"
                                                >Observations</span
                                            >
                                            <span class="text-gray-300 italic"
                                                >--</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</div>
