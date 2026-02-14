<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { setupConvex } from "convex-svelte";
  import { env } from "$env/dynamic/public";
  import "../app.css";
  import ErrorBoundary from "$lib/components/ui/ErrorBoundary.svelte";
  import { Toaster } from "svelte-sonner";
  import NetworkStatus from "$lib/components/ui/NetworkStatus.svelte";

  let { children } = $props();

  try {
    setupConvex(env.PUBLIC_CONVEX_URL);
  } catch (error) {}
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="top-center" richColors />
<NetworkStatus />

<ErrorBoundary>
  {@render children()}
</ErrorBoundary>
