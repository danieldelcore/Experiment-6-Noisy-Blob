/* globals document */

import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';

const simplexNoise = new SimplexNoise();

export default class Blob {
    constructor() {
        const geometry = new THREE.IcosahedronGeometry(30, 5);
        const material = new THREE.MeshStandardMaterial({
            color: '#ff0844',
            transparent: true,
            side: THREE.DoubleSide,
            alphaTest: 0.5,
            opacity: 1,
            roughness: 0.2,
        });
        const image = document.createElement('img');
        const alphaMap = new THREE.Texture(image);

        image.onload = () => (alphaMap.needsUpdate = true);
        image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGUlEQVQoU2NkYGD4z4AHMP7//x+/gmFhAgCXphP14bko/wAAAABJRU5ErkJggg==';

        material.alphaMap = alphaMap;
        material.alphaMap.magFilter = THREE.NearestFilter;
        material.alphaMap.wrapT = THREE.RepeatWrapping;
        material.alphaMap.repeat.y = 1;

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.z = -Math.PI / 4;
    }

    update(timeStamp) {
        // offset the texture
        this.mesh.material.alphaMap.offset.y = timeStamp * 0.00015;

        // apply simplex noise
        this.mesh.geometry.vertices.forEach((vertex) => {
            const offset = this.mesh.geometry.parameters.radius;
            const amp = 10;
            const time = Date.now();

            vertex.normalize();

            const noise = simplexNoise.noise3D(
                vertex.x + (time * 0.0007),
                vertex.y + (time * 0.0008),
                vertex.z + (time * 0.0009),
            );

            const distance = offset + (noise * amp);

            vertex.multiplyScalar(distance);
        });

        this.mesh.geometry.verticesNeedUpdate = true;
        this.mesh.geometry.normalsNeedUpdate = true;
        this.mesh.geometry.computeVertexNormals();
        this.mesh.geometry.computeFaceNormals();
    }
}
