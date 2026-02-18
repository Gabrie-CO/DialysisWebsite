<script lang="ts">
    let { totalPatients, totalChairs } = $props<{
        totalPatients: number;
        totalChairs: number;
    }>();
</script>

<div class="clinic-stats-container">
    <span class="clinic-stats-label">Clinic Load</span>
    <span class="clinic-stats-value">
        {totalPatients}<span class="clinic-stats-sep">/{totalChairs}</span>
    </span>
</div>
