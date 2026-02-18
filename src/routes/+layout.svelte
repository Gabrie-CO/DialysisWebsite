<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { setupConvex } from "convex-svelte";
  import { env } from "$env/dynamic/public";
  import "../app.css";
  import ErrorBoundary from "$lib/components/ui/ErrorBoundary.svelte";
  import { Toaster } from "svelte-sonner";
  import NetworkStatus from "$lib/components/ui/NetworkStatus.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  let { children } = $props();

  try {
    setupConvex(env.PUBLIC_CONVEX_URL ?? "");
  } catch (error) {}

  // Auth Guard
  let isAuthenticated = $state(false);
  let isLoading = $state(true);

  onMount(() => {
    // Check for our cookie
    const match = document.cookie.match(
      new RegExp("(^| )convex_auth_user=([^;]+)"),
    );
    if (match) {
      isAuthenticated = true;
    } else {
      isAuthenticated = false;
    }
    isLoading = false;
  });

  $effect(() => {
    // If not loading and not authenticated, and NOT on login page, redirect
    if (
      !isLoading &&
      !isAuthenticated &&
      !page.url.pathname.startsWith("/login") &&
      !page.url.pathname.startsWith("/auth")
    ) {
      goto("/login");
    }
  });

  function handleLogout() {
    document.cookie =
      "convex_auth_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    isAuthenticated = false;
    goto("/login");
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Toaster position="top-center" richColors />
<NetworkStatus />

{#if isLoading}
  <div class="flex h-screen items-center justify-center bg-gray-50">
    <div class="animate-pulse text-blue-600 font-bold">Loading...</div>
  </div>
{:else}
  <ErrorBoundary>
    {@render children()}
  </ErrorBoundary>
{/if}
