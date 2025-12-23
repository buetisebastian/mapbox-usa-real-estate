mapboxgl.accessToken =
  'pk.eyJ1IjoiYnVldGlzZWJhc3RpYW4iLCJhIjoiY21qZWJnN3B3MDFpOTNmbjBwNnQzMjQzZyJ9.S-PoMRw0fCRq52vwCbU0mg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-98.5, 39.8],
  zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());

// Mostrar errores reales de Mapbox
map.on('error', (e) => {
  console.error('MAPBOX ERROR:', e?.error || e);
});

map.on('load', () => {
  // =========================
  // FUENTE GEOJSON
  // =========================
  map.addSource('states', {
    type: 'geojson',
    data: 'data/states.geojson',
    generateId: true
  });

  // =========================
  // CAPA FILL (colores dinámicos)
  // =========================
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
        ['boolean', ['feature-state', 'selected'], false], 0.7,
        0.4
      ]
    }
  });

  // =========================
  // CAPA CONTORNO
  // =========================
  map.addLayer({
    id: 'states-outline',
    type: 'line',
    source: 'states',
    paint: {
      'line-color': '#ffffff',
      'line-width': 1
    }
  });

  let hoveredId = null;
  let selectedId = null;

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  // =========================
  // HOVER + TOOLTIP
  // =========================
  map.on('mousemove', 'states-fill', (e) => {
    if (!e.features || !e.features.length) return;

    const f = e.features[0];
    const id = f.id;
    if (id === null || id === undefined) return;

    if (hoveredId !== null && hoveredId !== id) {
      map.setFeatureState(
        { source: 'states', id: hoveredId },
        { hover: false }
      );
    }

    hoveredId = id;
    map.setFeatureState(
      { source: 'states', id },
      { hover: true }
    );

    const name = f.properties.NAME || 'State';

    popup
      .setLngLat(e.lngLat)
      .setHTML(
        `<strong>${name}</strong><br/>
         <small style="color:#555">Click to select state</small>`
      )
      .addTo(map);
  });

  map.on('mouseleave', 'states-fill', () => {
    if (hoveredId !== null) {
      map.setFeatureState(
        { source: 'states', id: hoveredId },
        { hover: false }
      );
    }
    hoveredId = null;
    popup.remove();
  });

  // =========================
  // CLICK + SELECCIÓN + PANEL
  // =========================
  map.on('click', 'states-fill', (e) => {
    if (!e.features || !e.features.length) return;

    const f = e.features[0];
    const id = f.id;
    if (id === null || id === undefined) return;

    if (selectedId !== null && selectedId !== id) {
      map.setFeatureState(
        { source: 'states', id: selectedId },
        { selected: false }
      );
    }

    const selected = selectedId !== id;
    selectedId = selected ? id : null;

    map.setFeatureState(
      { source: 'states', id },
      { selected }
    );

    // ✅ ACTUALIZA PANEL IZQUIERDO
    const panel = document.getElementById('selected-state');
    if (panel) {
      panel.textContent = selected
        ? `Selected state: ${f.properties.NAME}`
        : 'Selected state: none';
    }
  });
});
