<script lang="ts">
	import { onMount } from 'svelte';
	import { maplibregl } from '$lib/map/maplibre';
	import {
		DEFAULT_MAP_CENTER,
		DEFAULT_MAP_STYLE,
		DEFAULT_MAP_ZOOM
	} from '$lib/map/config';

	type LngLat = [number, number];

	let {
		initialCenter = DEFAULT_MAP_CENTER,
		initialZoom = DEFAULT_MAP_ZOOM,
		styleUrl = DEFAULT_MAP_STYLE,
		className = ''
	}: {
		initialCenter?: LngLat;
		initialZoom?: number;
		styleUrl?: string;
		className?: string;
	} = $props();

	let container: HTMLDivElement;

	onMount(() => {
		const map = new maplibregl.Map({
			container,
			style: styleUrl,
			center: initialCenter,
			zoom: initialZoom
		});

		return () => {
			map.remove();
		};
	});
</script>

<div
	bind:this={container}
	class={`map-shell ${className}`.trim()}
	data-testid="map-container"
	aria-label="Election map"
></div>

<style>
	.map-shell {
		width: 100%;
		height: 100%;
	}
</style>
