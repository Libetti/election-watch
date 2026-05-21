import { page } from 'vitest/browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import {
	DEFAULT_MAP_CENTER,
	DEFAULT_MAP_STYLE,
	DEFAULT_MAP_ZOOM
} from '$lib/map/config';

type MapOptions = {
	container: HTMLDivElement;
	style: string;
	center: [number, number];
	zoom: number;
};

const removeSpy = vi.fn();
const mapConstructor = vi.fn((options: MapOptions) => options);

class MockMap {
	constructor(options: MapOptions) {
		mapConstructor(options);
	}

	remove() {
		removeSpy();
	}
}

vi.mock('$lib/map/maplibre', () => ({
	maplibregl: {
		Map: MockMap
	}
}));

const loadMapComponent = async () => import('./Map.svelte').then((module) => module.default);

const getMapOptions = () => {
	expect(mapConstructor).toHaveBeenCalledTimes(1);
	const options = mapConstructor.mock.calls.at(0)?.[0];
	expect(options).toBeDefined();
	return options as MapOptions;
};

describe('Map.svelte', () => {
	beforeEach(() => {
		mapConstructor.mockClear();
		removeSpy.mockClear();
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('renders the map container', async () => {
		const { unmount } = render(await loadMapComponent());

		await expect.element(page.getByTestId('map-container')).toBeInTheDocument();

		unmount();
	});

	it('initializes MapLibre with default options', async () => {
		const { unmount } = render(await loadMapComponent());

		const options = getMapOptions();
		expect(options.style).toBe(DEFAULT_MAP_STYLE);
		expect(options.center).toEqual(DEFAULT_MAP_CENTER);
		expect(options.zoom).toBe(DEFAULT_MAP_ZOOM);
		expect(options.container).toBeInstanceOf(HTMLDivElement);

		unmount();
	});

	it('supports overriding style and viewport props', async () => {
		const customCenter: [number, number] = [-77.0369, 38.9072];
		const customZoom = 8;
		const customStyle = 'https://example.com/style.json';

		const { unmount } = render(await loadMapComponent(), {
			initialCenter: customCenter,
			initialZoom: customZoom,
			styleUrl: customStyle
		});

		const options = getMapOptions();
		expect(options.center).toEqual(customCenter);
		expect(options.zoom).toBe(customZoom);
		expect(options.style).toBe(customStyle);

		unmount();
	});

	it('removes the map on unmount', async () => {
		const { unmount } = render(await loadMapComponent());

		unmount();

		expect(removeSpy).toHaveBeenCalledTimes(1);
	});
});
