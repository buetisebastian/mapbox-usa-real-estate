mapboxgl.accessToken = 'pk.eyJ1IjoiYnVldGlzZWJhc3RpYW4iLCJhIjoiY21qZWJnN3B3MDFpOTNmbjBwNnQzMjQzZyJ9.S-PoMRw0fCRq52vwCbU0mg';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-98.5, 39.8],
  zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {

  map.addSource('states', {
    type: 'geojson',
    data: 'data/states.geojson',
    promoteId: 'STATEFP'
  });

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

  map.on('mousemove', 'states-fill', (e) => {
    const feature = e.features[0];
    const id = feature.id;

    if (hoveredId !== null && hoveredId !== id) {
      map.setFeatureState({ source: 'states', id: hoveredId }, { hover: false });
    }

    hoveredId = id;
    map.setFeatureState({ source: 'states', id }, { hover: true });

    popup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>${feature.properties.NAME}</strong>`)
      .addTo(map);
  });

  map.on('mouseleave', 'states-fill', () => {
    if (hoveredId !== null) {
      map.setFeatureState({ source: 'states', id: hoveredId }, { hover: false });
    }
    hoveredId = null;
    popup.remove();
  });

  map.on('click', 'states-fill', (e) => {
    const id = e.features[0].id;

    if (selectedId !== null && selectedId !== id) {
      map.setFeatureState({ source: 'states', id: selectedId }, { selected: false });
    }

    selectedId = selectedId === id ? null : id;
    map.setFeatureState({ source: 'states', id }, { selected: selectedId === id });
  });

});



