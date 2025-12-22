mapboxgl.accessToken = 'TU_MAPBOX_TOKEN_ACA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-98.5, 39.8], // USA center
  zoom: 3
});

// Controles básicos
map.addControl(new mapboxgl.NavigationControl());
