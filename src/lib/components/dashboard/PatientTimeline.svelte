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
    <h3 class="timeline-title">
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
        <div class="timeline-container">
            {#each meetings.data as meeting}
                <div class="relative group">
                    <!-- Timeline Dot -->
                    <div
                        class="timeline-dot"
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

                    <div class="timeline-card">
                        <div
                            class="flex flex-col sm:flex-row justify-between gap-4 mb-3"
                        >
                            <div>
                                <p class="timeline-date">
                                    {new Date(
                                        meeting.date,
                                    ).toLocaleDateString()} at {new Date(
                                        meeting.date,
                                    ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                                <h4 class="timeline-item-title">
                                    {meeting.title || "Dialysis Session"}
                                </h4>
                            </div>

                            {#if meeting.chairId}
                                <div class="flex items-start">
                                    <span class="badge-blue">
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
                                    <span class="timeline-stat-label"
                                        >Condition</span
                                    >
                                    {#if meeting.condition}
                                        <span class="timeline-stat-value"
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
                                    <span class="timeline-stat-label"
                                        >Pre-Weight</span
                                    >
                                    {#if meeting.weight?.pre}
                                        <span class="timeline-stat-value"
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
                                    <span class="timeline-stat-label"
                                        >Post-Weight</span
                                    >
                                    {#if meeting.weight?.post}
                                        <span class="timeline-stat-value"
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
                                    <span class="timeline-stat-label"
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
