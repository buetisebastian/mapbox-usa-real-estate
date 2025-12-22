mapboxgl.accessToken = 'pk.eyJ1IjoiYnVldGlzZWJhc3RpYW4iLCJhIjoiY21qZWJnN3B3MDFpOTNmbjBwNnQzMjQzZyJ9.S-PoMRw0fCRq52vwCbU0mg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-98.5, 39.8],
  zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {

  // 1) SOURCE con promoteId (necesario para feature-state)
  map.addSource('states', {
    type: 'geojson',
    data: 'data/states.geojson',
    promoteId: 'STATEFP'
  });

  // 2) CAPA fill con colores dinámicos (hover/selected)
  map.addLayer({
    id: 'states-fill',
    type: 'fill',
    source: 'states',
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false], '#ffd166',
        ['boolean', ['feature-state', 'selected'], false], '#ef476f',
        '#3bb2d0'
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false], 0.75,
        ['boolean', ['feature-state', 'selected'], false], 0.70,
        0.4
      ]
    }
  });

  // 3) borde
  map.addLayer({
    id: 'states-outline',
    type: 'line',
    source: 'states',
    paint: {
      'line-color': '#ffffff',
      'line-width': 1
    }
  });

  // 4) Popup
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  // 5) Estado interno de hover/selección
  let hoveredId = null;
  let selectedId = null;

  // 6) Cursor + hover + tooltip
  map.on('mouseenter', 'states-fill', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'states-fill', () => {
    map.getCanvas().style.cursor = '';

    // apagar hover
    if (hoveredId !== null) {
      map.setFeatureState({ source: 'states', id: hoveredId }, { hover: false });
    }
    hoveredId = null;

    // sacar popup
    popup.remove();
  });

  map.on('mousemove', 'states-fill', (e) => {
    const feature = e.features && e.features[0];
    if (!feature) return;

    // --- hover ---
    const id = feature.id;
    if (id == null) return;

    if (hoveredId !== null && hoveredId !== id) {
      map.setFeatureState({ source: 'states', id: hoveredId }, { hover: false });
    }
    hoveredId = id;
    map.setFeatureState({ source: 'states', id }, { hover: true });

    // --- tooltip ---
    const name =
      feature.properties.NAME ||
      feature.properties.name ||
      feature.properties.STATE_NAME ||
      'Estado';

    popup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>${name}</strong>`)
      .addTo(map);
  });

  // 7) Click para seleccionar (toggle)
  map.on('click', 'states-fill', (e) => {
    const feature = e.features && e.features[0];
    if (!feature) return;

    const id = feature.id;
    if (id == null) return;

    // apagar selección anterior (si era otro)
    if (selectedId !== null && selectedId !== id) {
      map.setFeatureState({ source: 'states', id: selectedId }, { selected: false });
    }

    // toggle
    const willSelect = selectedId !== id;
    selectedId = willSelect ? id : null;

    map.setFeatureState({ source: 'states', id }, { selected: willSelect });
  });

});



