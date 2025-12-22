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

});
