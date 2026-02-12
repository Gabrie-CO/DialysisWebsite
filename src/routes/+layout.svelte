<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import { setupConvex } from "convex-svelte";
	import { env } from "$env/dynamic/public";
	import "../app.css";
	let { children } = $props();

	setupConvex(env.PUBLIC_CONVEX_URL);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
