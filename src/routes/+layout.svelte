<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { setupConvex } from "convex-svelte";
  import { env } from "$env/dynamic/public";
  import "../app.css";
  import ErrorBoundary from "$lib/components/ui/ErrorBoundary.svelte";

  let { children } = $props();

  try {
    setupConvex(env.PUBLIC_CONVEX_URL);
  } catch (error) {}
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<ErrorBoundary>
  {@render children()}
</ErrorBoundary>
