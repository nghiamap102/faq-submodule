import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';

// =================================== VBD3DBuilding ===================================
/* eslint eqeqeq: 0 */

// VBD3DBuilding
const ROTATE = -Math.PI / 2;
const LIGHT = 0xCCCCCC;
const MAXD = 800;
// converts from WGS84 Longitude, Latitude into a unit vector anchor at the top left as needed for GL JS custom layers
const MERCATOR_EXTENT = 20037508.3427892;
const MERCATOR_SCALE = 1 / (2 * MERCATOR_EXTENT);

const CAMERA_FOV = 45;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1e6;
// derived from https://gist.github.com/springmeyer/871897
const mecator = function(lon, lat)
{
    const x = lon * MERCATOR_EXTENT / 180;
    let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
    y = y * MERCATOR_EXTENT / 180;

    return [
        (x + MERCATOR_EXTENT) / (2 * MERCATOR_EXTENT),
        1 - ((y + MERCATOR_EXTENT) / (2 * MERCATOR_EXTENT)),
    ];
};

const getTransform = function(ll, h)
{
    const translate = mecator(ll[0], ll[1]);
    return new THREE.Matrix4()
        .makeTranslation(translate[0], translate[1], h * MERCATOR_SCALE)
        .scale(new THREE.Vector3(MERCATOR_SCALE, -MERCATOR_SCALE, MERCATOR_SCALE))
    ;
};
// Extend Number object with method to convert numeric degrees to radians
if (Number.prototype.toRadians === undefined)
{
    Number.prototype.toRadians = function()
    {
        return this * Math.PI / 180;
    };
}
// Extend Number object with method to convert radians to numeric (signed) degrees
if (Number.prototype.toDegrees === undefined)
{
    Number.prototype.toDegrees = function()
    {
        return this * 180 / Math.PI;
    };
}

// Warn if overriding existing method
if (Array.prototype.equals === undefined)
{
    // attach the .equals method to Array's prototype to call it on any array
    Array.prototype.equals = function(array)
    {
        // if the other array is a falsy value, return
        if (!array)
        {
            return false;
        }

        // compare lengths - can save a lot of time
        if (this.length != array.length)
        {
            return false;
        }

        for (let i = 0, l = this.length; i < l; i++)
        {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array)
            {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                {
                    return false;
                }
            }
            else if (this[i] != array[i])
            {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };
}
/* http://www.apsalin.com/convert-cartesian-to-geodetic.aspx */
const cartesian2Eeodetic = function(x, y, z)
{
    const a = 6378137;
    const
        b = 6356752.314245;
    const e2 = (a * a - b * b) / (a * a); // 1st eccentricity squared
    const ε2 = (a * a - b * b) / (b * b); // 2nd eccentricity squared
    const p = Math.sqrt(x * x + y * y); // distance from minor axis
    const R = Math.sqrt(p * p + z * z); // polar radius
    // parametric latitude (Bowring eqn 17, replacing tanβ = z·a / p·b)
    const tanβ = (b * z) / (a * p) * (1 + ε2 * b / R);
    const sinβ = tanβ / Math.sqrt(1 + tanβ * tanβ);
    const cosβ = sinβ / tanβ;
    // geodetic latitude (Bowring eqn 18: tanφ = z+ε²bsin³β / p−e²cos³β)
    const φ = Math.atan2(z + ε2 * b * sinβ * sinβ * sinβ, p - e2 * a * cosβ * cosβ * cosβ);
    // longitude
    const λ = Math.atan2(y, x);
    // height above ellipsoid (Bowring eqn 7)
    const sinφ = Math.sin(φ);
    const
        cosφ = Math.cos(φ);
    const ν = a / Math.sqrt(1 - e2 * sinφ * sinφ); // length of the normal terminated by the minor axis
    const h = p * cosφ + z * sinφ - (a * a / ν);
    return [λ.toDegrees(), φ.toDegrees(), h];
};

const getCameraPosition = function(matrix, rootTransform)
{
    const cam = new THREE.Camera();
    const rootInverse = new THREE.Matrix4().copy(rootTransform).invert();
    cam.projectionMatrix.elements = matrix;
    cam.projectionMatrixInverse = new THREE.Matrix4().copy(cam.projectionMatrix).invert();// add since three@0.103.0
    const campos = new THREE.Vector3(0, 0, 0).unproject(cam).applyMatrix4(rootInverse);
    return campos;
};

const wireframe = function(model, on)
{
    model.traverse((node) =>
    {
        if (!node.isMesh)
        {
            return;
        }
        node.material.wireframe = on;
    });
};

const addBoundBox = function(model)
{
    const helper = new THREE.BoundingBoxHelper(model, 0xff0000);
    helper.update();
    return helper;
};

const COLORS = [
    'red', 'green', 'blue', 'red', 'green', 'blue',
    'red', 'green', 'blue', 'red', 'green', 'blue',
    'red', 'green', 'blue', 'red', 'green', 'blue',
    'red', 'green', 'blue', 'red', 'green', 'blue',
    'red', 'green', 'blue', 'red', 'green', 'blue',
    'white',
];
const Colors = function(index)
{
    if (index >= COLORS.length)
    {
        index = COLORS.length - 1;
    }

    return COLORS[index];
};
//= ====================================================
//= ====================================================
class TileLoader
{
    // This class contains the common code to load tile content, such as b3dm and pnts files.
    // It is not to be used directly. Instead, subclasses are used to implement specific
    // content loaders for different tile types.
    constructor(url)
    {
        this.url = url;
        this.type = url.slice(-4);
        this.version = null;
        this.byteLength = null;
        this.featureTableJSON = null;
        this.featureTableBinary = null;
        this.batchTableJson = null;
        this.batchTableBinary = null;
        this.binaryData = null;
    }

    load()
    {
        const self = this;
        return new Promise((resolve, reject) =>
        {
            fetch(self.url)
                .then((response) =>
                {
                    if (!response.ok)
                    {
                        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
                    }
                    return response;
                })
                .then((response) => response.arrayBuffer())
                .then((buffer) => self.parseResponse(buffer))
                .then((res) => resolve(res))
                .catch((error) =>
                {
                    reject(error);
                });
        });
    }

    parseResponse(buffer)
    {
        const header = new Uint32Array(buffer.slice(0, 28));
        const decoder = new TextDecoder();
        const magic = decoder.decode(new Uint8Array(buffer.slice(0, 4)));
        if (magic != this.type)
        {
            throw new Error(`Invalid magic string, expected '${this.type}', got '${this.magic}'`);
        }
        this.version = header[1];
        if (this.version !== 1)
        {
            throw new Error('Only Batched 3D Model version 1 is supported.  Version ' + this.version + ' is not.');
        }
        this.byteLength = header[2];
        let featureTableJSONByteLength = header[3];
        let featureTableBinaryByteLength = header[4];
        let batchTableJsonByteLength = header[5];
        let batchTableBinaryByteLength = header[6];

        // console.log('magic: ' + magic);
        // console.log('version: ' + this.version);
        // console.log('featureTableJSONByteLength: ' + featureTableJSONByteLength);
        // console.log('featureTableBinaryByteLength: ' + featureTableBinaryByteLength);
        // console.log('batchTableJsonByteLength: ' + batchTableJsonByteLength);
        // console.log('batchTableBinaryByteLength: ' + batchTableBinaryByteLength);

        let pos = 28; // header length
        let batchLength;
        // Legacy header #1: [batchLength] [batchTableByteLength]
        // Legacy header #2: [batchTableJsonByteLength] [batchTableBinaryByteLength] [batchLength]
        // Current header: [featureTableJsonByteLength] [featureTableBinaryByteLength] [batchTableJsonByteLength] [batchTableBinaryByteLength]
        // If the header is in the first legacy format 'batchTableJsonByteLength' will be the start of the JSON string (a quotation mark) or the glTF magic.
        // Accordingly its first byte will be either 0x22 or 0x67, and so the minimum uint32 expected is 0x22000000 = 570425344 = 570MB. It is unlikely that the feature table JSON will exceed this length.
        // The check for the second legacy format is similar, except it checks 'batchTableBinaryByteLength' instead
        if (batchTableJsonByteLength >= 570425344)
        {
            // First legacy check
            pos -= 2;
            batchLength = featureTableJSONByteLength;
            batchTableJsonByteLength = featureTableBinaryByteLength;
            batchTableBinaryByteLength = 0;
            featureTableJSONByteLength = 0;
            featureTableBinaryByteLength = 0;
        }
        else if (batchTableBinaryByteLength >= 570425344)
        {
            // Second legacy check
            pos -= 1;
            batchLength = batchTableJsonByteLength;
            batchTableJsonByteLength = featureTableJSONByteLength;
            batchTableBinaryByteLength = featureTableBinaryByteLength;
            featureTableJSONByteLength = 0;
            featureTableBinaryByteLength = 0;
        }

        // featureTableJsonByteLength
        if (featureTableJSONByteLength === 0)
        {
            this.featureTableJSON = {};
        }
        else
        {
            const featureTableString = decoder.decode(new Uint8Array(buffer.slice(pos, pos + featureTableJSONByteLength)));
            this.featureTableJSON = JSON.parse(featureTableString);
            pos += featureTableJSONByteLength;
        }

        // featureTableBinaryByteLength
        this.featureTableBinary = buffer.slice(pos, pos + featureTableBinaryByteLength);
        pos += featureTableBinaryByteLength;

        if (batchTableJsonByteLength > 0)
        {
            const batchTableString = decoder.decode(new Uint8Array(buffer.slice(pos, pos + batchTableJsonByteLength)));
            this.batchTableJson = JSON.parse(batchTableString);
            pos += batchTableJsonByteLength;

            if (batchTableBinaryByteLength > 0)
            {
                this.batchTableBinary = buffer.slice(pos, pos + batchTableBinaryByteLength);
                pos += batchTableBinaryByteLength;
            }
        }
        else
        {
            this.batchTableJson = {};
        }

        let gltfByteLength = this.byteLength - pos;
        if (gltfByteLength === 0)
        {
            throw new Error('glTF byte length must be greater than 0.');
        }

        if (pos % 4 === 0)
        {
            this.binaryData = buffer.slice(pos);
        }
        else
        {
            // Create a copy of the glb so that it is 4-byte aligned
            pos = 40;
            gltfByteLength = 2521;
            this.binaryData = buffer.slice(pos, pos + gltfByteLength);
        }

        // this.binaryData = buffer.slice(pos);
        return this;
    }
}

//-----------------------------------------------------
class B3DM extends TileLoader
{
    constructor(url)
    {
        super(url);
        this.glbData = null;
    }

    parseResponse(buffer)
    {
        super.parseResponse(buffer);
        this.glbData = this.binaryData;
        return this;
    }
}

//-----------------------------------------------------
class PNTS extends TileLoader
{
    constructor(url)
    {
        super(url);
        this.points = new Float32Array();
        this.rgba = null;
        this.rgb = null;
    }

    parseResponse(buffer)
    {
        super.parseResponse(buffer);
        if (this.featureTableJSON.POINTS_LENGTH && this.featureTableJSON.POSITION)
        {
            const len = this.featureTableJSON.POINTS_LENGTH;
            let pos = this.featureTableJSON.POSITION.byteOffset;
            this.points = new Float32Array(this.featureTableBinary.slice(pos, pos + len * Float32Array.BYTES_PER_ELEMENT * 3));
            this.rtc_center = this.featureTableJSON.RTC_CENTER;
            if (this.featureTableJSON.RGBA)
            {
                pos = this.featureTableJSON.RGBA.byteOffset;
                const colorInts = new Uint8Array(this.featureTableBinary.slice(pos, pos + len * Uint8Array.BYTES_PER_ELEMENT * 4));
                const rgba = new Float32Array(colorInts.length);
                for (let i = 0; i < colorInts.length; i++)
                {
                    rgba[i] = colorInts[i] / 255.0;
                }
                this.rgba = rgba;
            }
            else if (this.featureTableJSON.RGB)
            {
                pos = this.featureTableJSON.RGB.byteOffset;
                const colorInts = new Uint8Array(this.featureTableBinary.slice(pos, pos + len * Uint8Array.BYTES_PER_ELEMENT * 3));
                const rgb = new Float32Array(colorInts.length);
                for (let i = 0; i < colorInts.length; i++)
                {
                    rgb[i] = colorInts[i] / 255.0;
                }
                this.rgb = rgb;
            }
            else if (this.featureTableJSON.RGB565)
            {
                console.error('RGB565 is currently not supported in pointcloud tiles.');
            }
        }
        return this;
    }
}

//= ====================================================
//= ====================================================
class Data3D
{
    constructor(params, layer)
    {
        this.hasmodel = 0;
        this.scene = null;
        this.camera = null;
        this.layer = layer;
        this.box = null;
        this.clock = null;
        this.mixer = null;
        this.parse(params);
    }

    initScene()
    {
        this.scene = new THREE.Scene();
        this.camera = this.layer.camera();
        // init light
        const light = new THREE.AmbientLight(0xFFFFFF); // soft white light
        this.scene.add(light);
    }

    parse(params)
    {
    }

    render(renderer)
    {
        if (this.visible && this.hasmodel)
        {
            if (this.mixer)
            {
                if (this.clock == null)
                {
                    this.clock = new THREE.Clock();
                }
                this.mixer.update(this.clock.getDelta());
            }
            renderer.render(this.scene, this.camera);
            return true;
        }
        return false;
    }

    raycast(mouse, raycaster)
    {
        if (this.visible && this.hasmodel)
        {
            // 1. update camera
            this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert(); // <--

            // 2. set the picking ray from the camera position and mouse coordinates
            raycaster.setFromCamera(mouse, this.camera);

            // 3. compute intersections
            const intersects = raycaster.intersectObjects(this.scene.children, true);

            for (let i = 0; i < intersects.length; i++)
            {
                // An intersection has the following properties :
                // - object : intersected object (THREE.Mesh)
                // - distance : distance from camera to intersection (number)
                // - face : intersected face (THREE.Face3)
                // - faceIndex : intersected face index (number)
                // - point : intersection point (THREE.Vector3)
                // - uv : intersection point in the object's UV coordinates (THREE.Vector2)
            }
        }
    }

    resize()
    {
        this.camera = this.layer.camera();
    }

    load()
    {
    }

    unload()
    {
        this.visible = false;
    }

    checkLoad(matrix)
    {
        this.unload();
        this.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix).multiply(this.rootTransform);

        const frustum = new THREE.Frustum();
        frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));
        if (!this.sphere || !frustum.intersectsSphere(this.sphere))
        {
            return false;
        }

        const cameraPosition = getCameraPosition(matrix, this.rootTransform);
        this.dist = cameraPosition.length();
        if (this.dist > this.far)
        {
            return false;
        }
        this.load();
        return true;
    }
}

//-----------------------------------------------------
class Model3D extends Data3D
{
    parse(params)
    {
        this.model = null;
        this.url = params['name'];
        this.rootTransform = getTransform(params['ll'], 0);
        this.scale = null;
        if ('scale' in params)
        {
            this.scale = params['scale'];
        }
        this.heading = null;
        if ('rotate' in params)
        {
            this.heading = params['rotate'].toRadians();
        }
        if ('heading' in params)
        {
            this.heading = params['heading'];
        }
        this.sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 50);
        this.initScene();
        this.loaded = false;
        this.visible = false;
        this.dist = 0;
        this.far = MAXD;
    }

    load()
    {
        this.visible = true;
        if (this.loaded)
        {
            return;
        }
        this.loaded = true;
        this.loadProgress();
    }

    loadProgress()
    {
    }

    loadSuccess(model)
    {
        const trans = new THREE.Matrix4().multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2));
        if (this.scale != null)
        {
            trans.scale(new THREE.Vector3(this.scale, this.scale, this.scale));
        }
        if (this.heading != null)
        {
            trans.multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), this.heading));
        }
        model.applyMatrix4(trans);

        if (model.animations != null && model.animations.length > 0)
        {
            this.mixer = new THREE.AnimationMixer(model);
            const action = this.mixer.clipAction(model.animations[0]);
            action.play();
        }

        const box = new THREE.Box3().setFromObject(model);
        const dx = (box.max.x - box.min.x);
        const dy = (box.max.y - box.min.y);
        const dz = (box.max.z - box.min.z);
        const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);
        this.sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), radius);
        const far = radius * 8;
        if (far > MAXD)
        {
            this.far = far;
        }
        this.scene.add(model);
        this.hasmodel = true;
        this.layer.refesh();
    }
}

class ModelFbx extends Model3D
{
    loadProgress()
    {

    }
}

class ModelGltf extends Model3D
{
    loadProgress()
    {
        const loader = new GLTFLoader();
        loader.load(this.url, (function(gltf)
        {
            this.loadSuccess(gltf.scene);
        }).bind(this));
    }
}

class ModelDae extends Model3D
{
    loadProgress()
    {

    }
}

//-----------------------------------------------------
class TileData
{
    constructor(layer, json, resourcePath, level, nId)
    {
        this.hasmodel = 0;
        this.layer = layer;
        this.level = level;
        this.nId = nId;
        this.loaded = false;
        this.resourcePath = resourcePath;
        this.totalContent = new THREE.Group(); // Three JS Object3D Group for this tile and all its children
        this.tileContent = new THREE.Group(); // Three JS Object3D Group for this tile's content
        this.childContent = new THREE.Group(); // Three JS Object3D Group for this tile's children
        this.totalContent.add(this.tileContent);
        this.totalContent.add(this.childContent);

        this.boundingVolume = json.boundingVolume;
        this.geometricError = json.geometricError;
        this.children = [];
        this.sphere = null;
        this.far = 0;
        this.near = 0;
        this.dist = 0;

        if (json.content)
        {
            this.url = json.content.uri ? json.content.uri : json.content.url;
        }
        if (this.boundingVolume)
        {
            // this.far = this.geometricError * 2000;
            // this.near = this.far/2;

            if (this.boundingVolume.box)
            {
                const box = this.boundingVolume.box;

                const dx = box[3];
                const dy = box[7];
                const dz = box[11];
                const radius = Math.sqrt(dx * dx + dy * dy + dz * dz);

                this.sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), radius);
                this.far = this.geometricError * 2100;
                // this.far = radius * 12;
                this.near = this.far / 3;

                // root
                this.ll = cartesian2Eeodetic(box[0], box[1], box[2]);
                // console.log('level ' + this.level  + ' h: ' + this.ll[2]);
                this.rootTransform = getTransform(this.ll, this.ll[2]);
                this.loadChild(layer, json, resourcePath);
            }
            else if (this.boundingVolume.sphere)
            {
                const sphere = this.boundingVolume.sphere;
                const radius = sphere[3];
                this.sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), radius);
                this.far = this.geometricError * 2100;
                // this.far = radius * 12;
                this.near = this.far / 3;

                // root
                this.ll = cartesian2Eeodetic(sphere[0], sphere[1], sphere[2]);
                // console.log('level ' + this.level + ' h: ' + this.ll[2]);
                this.rootTransform = getTransform(this.ll, this.ll[2]);
                this.loadChild(layer, json, resourcePath);
            }
        }
    }

    loadChild(layer, json, resourcePath)
    {
        if (json.children /* && this.level < 0 */)
        {
            let nId = 1;
            for (let i = 0; i < json.children.length; i++)
            {
                const child = new TileData(layer, json.children[i], resourcePath, this.level + 1, nId);
                this.childContent.add(child.totalContent);
                this.children.push(child);
                nId = nId + 1;
            }
        }
    }

    load()
    {
        this.tileContent.visible = true;
        this.childContent.visible = false;

        if (this.loaded)
        {
            return;
        }
        this.loaded = true;
        if (!this.url)
        {
            return;
        }
        let url = this.url;
        const self = this;
        if (url.substr(0, 4) != 'http')
        {
            url = this.resourcePath + url;
        }

        const type = url.slice(-4);
        if (type == 'json')
        {
            // child is a tileset json
            const tileset = new TileSet(self.layer, 1);
            tileset.load(url).then(function()
            {
                self.children.push(tileset.root);
                self.childContent.add(tileset.root.totalContent);

                self.hasmodel = 2;
                self.layer.refesh();
            });
        }
        else if (type == 'b3dm')
        {
            const loader = new GLTFLoader();
            const b3dm = new B3DM(url);
            b3dm.load().then((d) =>
                loader.parse(d.glbData, self.resourcePath,
                    function(gltf)
                    {
                        const model = gltf.scene;
                        const rotX = self.ll[1];
                        const rotY = -self.ll[0] - 90;
                        const trans = new THREE.Matrix4()
                            .multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), rotX.toRadians()))
                            .multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), rotY.toRadians()))
                        ;


                        model.castShadow = false;
                        model.applyMatrix4(trans);
                        self.tileContent.add(model);

                        // is root
                        if (self.level == 0)
                        {
                            // model.position.y
                            const box = new THREE.Box3().setFromObject(model);
                            const center = box.getCenter(new THREE.Vector3());
                            const trans = new THREE.Matrix4().makeTranslation(-center.x, -center.y, -center.z);
                            self.totalContent.applyMatrix4(trans);
                        }

                        self.hasmodel = 1;
                        self.layer.refesh();
                    },
                    function(e)
                    {
                        throw new Error('error parsing gltf: ' + e);
                    },
                ),
            );
        }
        else if (type == 'pnts')
        {
            const pnts = new PNTS(url);
            pnts.load()
                .then((d) =>
                {
                    const geometry = new THREE.BufferGeometry();
                    geometry.setAttribute('position', new THREE.Float32BufferAttribute(d.points, 3));
                    const material = new THREE.PointsMaterial();
                    material.size = 1.0;
                    material.vertexColors = THREE.NoColors;
                    material.color = new THREE.Color(0xff0000);
                    material.opacity = 1.0;

                    if (d.rgba)
                    {
                        geometry.setAttribute('color', new THREE.Float32BufferAttribute(d.rgba, 4));
                        material.vertexColors = THREE.VertexColors;
                    }
                    else if (d.rgb)
                    {
                        geometry.setAttribute('color', new THREE.Float32BufferAttribute(d.rgb, 3));
                        material.vertexColors = THREE.VertexColors;
                    }
                    self.tileContent.add(new THREE.Points(geometry, material));
                    if (d.rtc_center)
                    {
                        const c = d.rtc_center;
                        self.tileContent.applyMatrix4(new THREE.Matrix4().makeTranslation(c[0], c[1], c[2]));
                    }
                    self.tileContent.add(new THREE.Points(geometry, material));
                });
        }
    }

    unload(includeChildren)
    {
        this.tileContent.visible = false;
        if (includeChildren)
        {
            this.childContent.visible = false;
        }
        else
        {
            this.childContent.visible = true;
        }
        // TODO: should we also free up memory?
    }

    checkLoad(matrix, camera)
    {
        const l = new THREE.Matrix4().fromArray(matrix);
        camera.projectionMatrix = l.multiply(this.rootTransform);

        const frustum = new THREE.Frustum();
        frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
        if (!this.sphere || !frustum.intersectsSphere(this.sphere))
        {
            this.unload(true);
            return false;
        }

        const cameraPosition = getCameraPosition(matrix, this.rootTransform);
        this.dist = cameraPosition.length();
        // are we too far to render this tile?
        if (this.dist > this.far)
        {
            this.unload(true);
            return false;
        }

        this.load();
        if (!this.hasmodel)
        {
            return false;
        }

        // should we load this tile?
        if (this.children.length > 0 && this.dist < this.near)
        {
            this.unload(false);
            let c = 0;
            for (let i = 0; i < this.children.length; i++)
            {
                if (this.children[i].checkLoad(matrix, camera))
                {
                    c = c + 1;
                }
            }
            this.tileContent.visible = (c == 0);
        }
        else
        {
            // no model to view
            if (this.hasmodel == 2)
            {
                return false;
            }
            else
            {
                for (let i = 0; i < this.children.length; i++)
                {
                    this.children[i].unload(true);
                }
            }
        }

        return true;
    }
}

//-----------------------------------------------------
class TileSet
{
    constructor(layer, level)
    {
        this.layer = layer;
        this.url = null;
        this.version = null;
        this.geometricError = null;
        this.root = null;
        this.level = level;
        this.camera = this.layer.camera();
    }

    load(url)
    {
        this.url = url;

        const resourcePath = THREE.LoaderUtils.extractUrlBase(url);
        const self = this;
        return new Promise((resolve, reject) =>
        {
            fetch(self.url)
                .then((response) =>
                {
                    if (!response.ok)
                    {
                        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
                    }
                    return response;
                })
                .then((response) => response.json())
                .then((json) =>
                {
                    self.version = json.asset.version;
                    self.geometricError = json.geometricError;
                    self.root = new TileData(self.layer, json.root, resourcePath, self.level, 1);
                })
                .then((res) => resolve())
                .catch((error) =>
                {
                    console.error(error);
                    reject(error);
                });
        });
    }

    checkLoad(matrix)
    {
        if (this.root)
        {
            return this.root.checkLoad(matrix, this.camera);
        }
        return true;
    }

    resize()
    {
        this.camera = this.layer.camera();
    }
}


//-----------------------------------------------------
class ModelTile extends Data3D
{
    parse(params)
    {
        this.initScene();
        this.url = params['name'];
        this.tileset = new TileSet(this.layer, 0);
        this.clippingPlane = null;


        const self = this;
        this.tileset.load(this.url).then(function()
        {
            self.clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), self.tileset.root.ll[2] + 4);

            self.scene.add(self.tileset.root.totalContent);
            self.hasmodel = 1;
            self.layer.refesh();
        });
    }

    checkLoad(matrix)
    {
        this.visible = false;
        if (this.hasmodel)
        {
            this.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix).multiply(this.tileset.root.rootTransform);
            this.visible = this.tileset.checkLoad(matrix);
        }
        return this.visible;
    }

    render(renderer)
    {
        if (this.visible && this.hasmodel)
        {
            renderer.clippingPlanes = [this.clippingPlane];
            renderer.localClippingEnabled = true;
            renderer.render(this.scene, this.camera);

            renderer.localClippingEnabled = false;
            return true;
        }
        return false;
    }
}

//= ====================================================
//= ====================================================
class BuildingLayer
{
    constructor(layerId, models, level)
    {
        this.id = layerId;
        this.type = 'custom';
        this.renderingMode = '3d';
        this.models = models;
        this.datas = [];
        this.renderer = null;
        this.desc = '';
        this.level = level;
    }

    onAdd(map, gl)
    {
        this.map = map;
        this.matrix = null;

        const loadjson = false;
        for (let i = 0; i < this.models.length; i++)
        {
            const params = this.models[i];
            const type = params['name'].slice(-4);
            if (type == 'gltf')
            {
                this.datas.push(new ModelGltf(params, this));
            }
            else if (type == '.fbx')
            {
                this.datas.push(new ModelFbx(params, this));
            }
            else if (type == '.dae')
            {
                this.datas.push(new ModelDae(params, this));
            }
            else if (type == 'json' && !loadjson)
            {
                this.datas.push(new ModelTile(params, this));
            }
        }

        const self = this;
        // function refresh(){  self.matrix = null; }
        // map.on('dragend', refresh);
        // map.on('moveend', refresh);

        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: false,
        });
        this.renderer.outputEncoding = THREE.GammaEncoding;
        this.renderer.shadowMap.enabled = false;
        this.renderer.autoClear = false;

        // var globalPlane = new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 93 );
        // this.renderer.clippingPlanes = [ globalPlane ];
        // this.renderer.localClippingEnabled = true;

        function resize()
        {
            self.resize();
        }

        map.on('resize', resize);

        function raycast(e)
        {
            self.raycast(e);
        }

        map.on('click', raycast);
    }

    raycast(e)
    {
        const mouse = new THREE.Vector2();
        mouse.x = (e.point.x / this.map.transform.width) * 2 - 1;
        mouse.y = 1 - (e.point.y / this.map.transform.height) * 2;

        const raycaster = new THREE.Raycaster();
        for (let i = 0; i < this.datas.length; i++)
        {
            this.datas[i].raycast(mouse, raycaster);
        }
        // const raycaster = new THREE.Raycaster();
        // raycaster.setFromCamera(mouse, this.camera);
        // console.log(raycaster.intersectObjects(this.scene.children, true));
    }

    resize()
    {
        for (let i = 0; i < this.datas.length; i++)
        {
            this.datas[i].resize();
        }
        this.refesh();
    }

    camera()
    {
        return new THREE.PerspectiveCamera(CAMERA_FOV, this.map.transform.width / this.map.transform.height, CAMERA_NEAR, CAMERA_FAR);
    }

    refesh()
    {
        this.matrix = null;
    }

    render(gl, matrix)
    {
        this.render3D(gl, matrix);
    }

    render3D(gl, matrix)
    {
        if (this.datas.length < 1 || this.renderer == null)
        {
            return;
        }

        const level = this.map.getZoom();
        if (level < this.level)
        {
            return;
        }

        this.renderer.state.reset();
        // this.renderer.setClearColor(0, 1)
        if (!this.matrix || !this.matrix.equals(matrix))
        {
            this.matrix = matrix;
            for (let i = 0; i < this.datas.length; i++)
            {
                this.datas[i].checkLoad(this.matrix);
            }
        }
        for (let i = 0; i < this.datas.length; i++)
        {
            this.datas[i].render(this.renderer);
        }

        this.map.triggerRepaint();
    }
}

export { BuildingLayer };
