mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: bnb.geometry.coordinates, // starting position [lng, lat]
  zoom: 5, // starting zoom
});
new mapboxgl.Marker()
  .setLngLat(bnb.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h5>${bnb.title}</h5>`))
  .addTo(map);
