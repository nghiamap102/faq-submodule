import './BoxSelectHandler.scss';

import mapboxgl from 'mapbox-gl';

export class BoxSelectHandler
{
    map = null;

    canvas = null;
    start = null;
    current = null;
    box = null;

    minLatLng = null;
    maxLatLng = null;

    constructor(map)
    {
        this.map = map;
        this.canvas = map.getCanvasContainer();
    }

    // Return the xy coordinates of the mouse position
    mousePos = (e) =>
    {
        const rect = this.canvas.getBoundingClientRect();

        return new mapboxgl.Point(
            e.clientX - rect.left - this.canvas.clientLeft,
            e.clientY - rect.top - this.canvas.clientTop,
        );
    };

    onKeyDown = (e) =>
    {
        // If the ESC key is pressed
        if (e.keyCode === 27)
        {
            this.finish();
        }
    };

    onMouseMove = (e) =>
    {
        // Capture the ongoing xy coordinates
        this.current = this.mousePos(e);

        // Append the box element if it doesnt exist
        if (!this.box)
        {
            this.box = document.createElement('div');
            this.box.classList.add('boxdraw');
            this.canvas.appendChild(this.box);
        }

        const minX = Math.min(this.start.x, this.current.x);
        const maxX = Math.max(this.start.x, this.current.x);
        const minY = Math.min(this.start.y, this.current.y);
        const maxY = Math.max(this.start.y, this.current.y);

        this.minLatLng = new mapboxgl.Point(maxX, minY);
        this.maxLatLng = new mapboxgl.Point(minX, maxY);

        // Adjust width and xy position of the box element ongoing
        const pos = 'translate(' + minX + 'px,' + minY + 'px)';

        this.box.style.transform = 'translate(' + minX + 'px,' + minY + 'px)';
        this.box.style.WebkitTransform = pos;
        this.box.style.width = `${maxX - minX}px`;
        this.box.style.height = `${maxY - minY}px`;
    };

    finish = (bbox) =>
    {
        // Remove these events now that finish has been called.
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('keydown', this.onKeyDown);
        document.removeEventListener('mouseup', this.onMouseUp);

        if (this.box)
        {
            this.box.parentNode.removeChild(this.box);
            this.box = null;
        }

        // If bbox exists. use this value as the argument for `queryRenderedFeatures`
        if (bbox)
        {
            this.map.onBoxSelectHandler(bbox, this.map);
        }

        this.map.dragPan.enable();
    };

    onMouseUp = () =>
    {
        // Capture xy coordinates
        this.finish([this.maxLatLng, this.minLatLng]);
    };

    mouseDown = (e) =>
    {
        // Continue the rest of the function if the shiftkey is pressed.
        if (!(e.shiftKey && e.button === 0))
        {
            return;
        }

        // Disable default drag zooming when the shift key is held down.
        this.map.dragPan.disable();
        this.map.boxZoom.disable();

        // Call functions for the following events
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('keydown', this.onKeyDown);

        // // Capture the first xy coordinates
        this.start = this.mousePos(e);
    };

    initBoxSelectEvent()
    {
        this.canvas.addEventListener('mousedown', this.mouseDown, true);
    }
}
