import MapboxDraw from "@mapbox/mapbox-gl-draw";

export default {
    map: null,
    open: false,
    drawObj: null,
    draw: new MapboxDraw({
        clickBuffer: 3,
        displayControlsDefault: false,
        controls: {point: true, line_string: true, polygon: true, trash: true}
    }),
    value: '',
    getBounds: (map) => {
        return {
            north: map.getBounds().getNorth(),
            east: map.getBounds().getEast(),
            south: map.getBounds().getSouth(),
            west: map.getBounds().getWest()
        };
    }
}
