export class BuildingLayer {
    constructor(layerId: any, models: any, level: any);
    id: any;
    type: string;
    renderingMode: string;
    models: any;
    datas: any[];
    renderer: THREE.WebGLRenderer | null;
    desc: string;
    level: any;
    onAdd(map: any, gl: any): void;
    map: any;
    matrix: any;
    raycast(e: any): void;
    resize(): void;
    camera(): THREE.PerspectiveCamera;
    refesh(): void;
    render(gl: any, matrix: any): void;
    render3D(gl: any, matrix: any): void;
}
import * as THREE from "three";
//# sourceMappingURL=VBD3DBuildings.d.ts.map