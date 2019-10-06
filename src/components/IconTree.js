import L from 'leaflet';

const iconTree = new L.Icon({
    iconUrl: require('../img/tree.png'),
    iconRetinaUrl: require('../img/tree.png'),
    iconAnchor: [17,41],
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(34,41)
});

export { iconTree };