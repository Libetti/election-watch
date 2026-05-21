<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import 'maplibre-gl/dist/maplibre-gl.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(html, body) {
		margin: 0;
		width: 100%;
		height: 100%;
	}

	:global(body) {
		overflow: hidden;
	}

	:global(body > div) {
		width: 100%;
		height: 100%;
	}
</style>
