<script lang="ts">
    import { useQuery } from "convex-svelte";
    import { api } from "../../../../convex/_generated/api";
    // @ts-ignore
    import type { Id } from "../../../../convex/_generated/dataModel";

    let { patientId } = $props<{ patientId: string }>();

    const meetings = useQuery(api.meetings.getRecent, () =>
        patientId ? { patientId: patientId as Id<"users"> } : "skip",
    );
</script>

<div class="space-y-4">
    <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span>📅</span> Patient Timeline
        <span class="text-xs font-normal text-gray-500 ml-auto"
            >(Last 3 Sessions)</span
        >
    </h3>

    {#if meetings.isLoading}
        <div class="flex justify-center p-8">
            <div
                class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"
            ></div>
        </div>
    {:else if !meetings.data || meetings.data.length === 0}
        <div
            class="p-8 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl"
        >
            <p class="text-gray-400 font-medium">
                No recent timeline activity.
            </p>
        </div>
    {:else}
        <div class="relative pl-4 border-l-2 border-gray-200 space-y-8">
            {#each meetings.data as meeting}
                <div class="relative group">
                    <!-- Timeline Dot -->
                    <div
                        class="absolute -left-[25px] top-1 h-5 w-5 rounded-full border-4 border-white shadow-sm transition-colors"
                        class:bg-blue-500={meeting.status === "completed"}
                        class:bg-green-500={meeting.status === "active"}
                        class:bg-purple-500={meeting.type === "pinned_item"}
                        class:bg-gray-400={!["completed", "active"].includes(
                            meeting.status,
                        ) && meeting.type !== "pinned_item"}
                    >
                        {#if meeting.type === "pinned_item"}
                            <span
                                class="absolute inset-0 flex items-center justify-center text-[8px] text-white"
                                >📌</span
                            >
                        {/if}
                    </div>

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
                                <h4 class="font-bold text-gray-900 text-lg">
                                    {meeting.title || "Dialysis Session"}
                                </h4>
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

                        {#if meeting.type === "pinned_item" && meeting.pinnedData}
                            <div
                                class="mt-3 pt-3 border-t border-gray-50 text-sm text-gray-600"
                            >
                                <div class="grid grid-cols-2 gap-2">
                                    {#each Object.entries(meeting.pinnedData) as [key, value]}
                                        {#if typeof value !== "object" && value}
                                            <div>
                                                <span
                                                    class="font-bold capitalize text-gray-400 text-xs"
                                                    >{key
                                                        .replace(
                                                            /([A-Z])/g,
                                                            " $1",
                                                        )
                                                        .trim()}:</span
                                                >
                                                <span class="text-gray-800"
                                                    >{value === true
                                                        ? "Yes"
                                                        : value === false
                                                          ? "No"
                                                          : value}</span
                                                >
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            </div>
                        {:else}
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
                                        <span class="font-medium text-gray-700"
                                            >{meeting.condition}</span
                                        >
                                    {:else}
                                        <span class="text-gray-300 italic"
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
                                    {#if meeting.weight?.pre}
                                        <span class="font-medium text-gray-700"
                                            >{meeting.weight.pre} kg</span
                                        >
                                    {:else}
                                        <span class="text-gray-300 italic"
                                            >--</span
                                        >
                                    {/if}
                                </div>

                                <!-- Weight Post -->
                                <div>
                                    <span
                                        class="text-[10px] uppercase text-gray-400 font-bold block mb-1"
                                        >Post-Weight</span
                                    >
                                    {#if meeting.weight?.post}
                                        <span class="font-medium text-gray-700"
                                            >{meeting.weight.post} kg</span
                                        >
                                    {:else}
                                        <span class="text-gray-300 italic"
                                            >--</span
                                        >
                                    {/if}
                                </div>

                                <!-- Patient Card / Obs -->
                                <div>
                                    <span
                                        class="text-[10px] uppercase text-gray-400 font-bold block mb-1"
                                        >Observations</span
                                    >
                                    {#if meeting.patientCardData?.observations}
                                        <p
                                            class="text-xs text-gray-600 line-clamp-2"
                                            title={meeting.patientCardData
                                                .observations}
                                        >
                                            {meeting.patientCardData
                                                .observations}
                                        </p>
                                    {:else}
                                        <span class="text-gray-300 italic"
                                            >--</span
                                        >
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
