mapboxgl.accessToken = 'TU_TOKEN_AQUI';

console.log('TOKEN CARGADO');

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
    data: 'data/states.geojson'
  });

  map.addLayer({
    id: 'states-fill',
    type: 'fill',
    source: 'states',
    paint: {
      'fill-color': '#3bb2d0',
      'fill-opacity': 0.4
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

  // ✅ A PARTIR DE ACÁ VA EL HOVER + TOOLTIP
  map.on('mouseenter', 'states-fill', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'states-fill', () => {
    map.getCanvas().style.cursor = '';
  });

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  map.on('mousemove', 'states-fill', (e) => {
    const feature = e.features && e.features[0];
    if (!feature) return;

    const name =
      feature.properties.NAME ||
      feature.properties.NAME10 ||
      feature.properties.STATE_NAME ||
      'Estado';

    popup
      .setLngLat(e.lngLat)
      .setHTML(`<strong>${name}</strong>`)
      .addTo(map);
  });

  map.on('mouseleave', 'states-fill', () => {
    popup.remove();
  });

  // ✅ FIN DEL BLOQUE HOVER + TOOLTIP

});

