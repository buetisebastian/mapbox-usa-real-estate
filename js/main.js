mapboxgl.accessToken = 'pk.eyJ1IjoiYnVldGlzZWJhc3RpYW4iLCJhIjoiY21qZWJnN3B3MDFpOTNmbjBwNnQzMjQzZyJ9.S-PoMRw0fCRq52vwCbU0mg';

console.log('TOKEN CARGADO');

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-98.5, 39.8],
  zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
  // 1) Fuente con promoteId para feature-state
  map.addSource('states', {
    type: 'geojson',
    data: 'data/states.geojson',
    promoteId: 'STATEFP'
  });

  // 2) Capa fill con color dinámico (hover/selected)
  map.addLayer({
    id: 'states-fill',
    type: 'fill',
    source: 'states',
    paint: {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'selected'], false], '#ef476f',
        ['boolean', ['feature-state', 'hover'], false], '#ffd166',
        '#3bb2d0'
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'selected'], false], 0.70,
        ['boolean', ['feature-state', 'hover'], false], 0.75,
        0.4
      ]
    }
  });

  // 3) Bordes
  map.addLayer({
    id: 'states-outline',
    type: 'line',
    source: 'states',
    paint: {
      'line-color': '#ffffff',
      'line-width': 1
    }
  });

  // 4) Cursor + tooltip
  map.on('mouseenter', 'states-fill', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  // 5) Hover + popup + feature-state (todo en un solo mousemove, limpio)
  let hoveredId = null;
  let selectedId = null;

  map.on('mousemove', 'states-fill', (e) => {
    const feature = e.features && e.features[0];
    if (!feature) return;

    const id = feature.id;
    if (id == null) return;

    // tooltip
    const name =
      feature.properties.NAME ||
      feature.properties.NAME10 ||
      feature.properties.STATE_NAME ||
      'Estado';

    popup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>${name}</strong>`)
      .addTo(map);

    // hover state
    if (hoveredId !== null && hoveredId !== id) {
      map.setFeatureState({ source: 'states', id: hoveredId }, { hover: false });
    }
    hoveredId = id;
    map.setFeatureState({ source: 'states', id: hoveredId }, { hover: true });
  });

  map.on('mouseleave', 'states-fill', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();

    if (hoveredId !== null) {
      map.setFeatureState({ source: 'states', id: hoveredId }, { hover: false });
    }
    hoveredId = null;
  });

  // 6) Click para seleccionar
  map.on('click', 'states-fill', (e) => {
    const feature = e.features && e.features[0];
    if (!feature) return;

    const id = feature.id;
    if (id == null) return;

    // apagar selección anterior si corresponde
    if (selectedId !== null && selectedId !== id) {
      map.setFeatureState({ source: 'states', id: selectedId }, { selected: false });
    }

    // toggle selección
    const newSelected = selectedId !== id;
    selectedId = newSelected ? id : null;

    map.setFeatureState({ source: 'states', id }, { selected: newSelected });
  });
});



