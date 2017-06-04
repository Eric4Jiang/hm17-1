// voxelize a Mesh
function voxelizeMesh(mesh, cubeSize, bBox) {
    var geo = mesh.geometry;
    mesh.geometry.computeBoundingBox();
    var bBox = mesh.geometry.boundingBox;

    minX = Math.min(minX, bBox.min.x);
    minY = Math.min(minY, bBox.min.y);
    minZ = Math.min(minZ, bBox.min.z);
    maxX = Math.max(maxX, bBox.max.x);
    maxY = Math.max(maxY, bBox.max.y);
    maxZ = Math.max(maxZ, bBox.max.z);

    var xCount = Math.ceil((maxX - minX) / cubeSize) + 1;
    var yCount = Math.ceil((maxY - minY) / cubeSize) + 1;
    var zCount = Math.ceil((maxZ - minZ) / cubeSize) + 1;

    var voxels = new Int8Array(xCount * yCount * zCount);

    var count = 0;

    for (var i_x = 0; i_x < xCount; i_x++) {
        var x = minX + i_x * cubeSize;
        for (i_y = 0; i_y < yCount; i_y++) {
            var y = minY + i_y * cubeSize;
            var inside = false;
            for (i_z = 0; i_z < zCount; i_z++) {
                var z = minZ + i_z * cubeSize;

                for (var i = 0; i < geo.faces.length; i++) {
                    var f = geo.faces[i];
                    var orig = new THREE.Vector3(x, y, minZ-cubeSize);
                    var dir = new THREE.Vector3(1, 0, 0);
                    var v0 = geo.vertices[f.a].clone();
                    var v1 = geo.vertices[f.b].clone();
                    var v2 = geo.vertices[f.c].clone();
                    if (triIntersectsLine(orig, dir, v0, v1, v2) {
                        inside = !inside;
                        break;
                    }
                }

                if (inside) {
                    var idx = xCount*yCount*i_x + yCount*i_y + i_z;
                    voxels[idx] = 1;
                }
            }
        }
    }

    return {
        voxels: voxels,
        origin: [minX, minY, minZ],
        dim: [xCount, yCount, zCount]
    };
}

function voxelizeEllipsoid(x0, y0, z0, a, b, c, bBox) {
    minX = Math.min(minX, bBox.min.x);
    minY = Math.min(minY, bBox.min.y);
    minZ = Math.min(minZ, bBox.min.z);
    maxX = Math.max(maxX, bBox.max.x);
    maxY = Math.max(maxY, bBox.max.y);
    maxZ = Math.max(maxZ, bBox.max.z);

    var xCount = Math.ceil((maxX - minX) / cubeSize) + 1;
    var yCount = Math.ceil((maxY - minY) / cubeSize) + 1;
    var zCount = Math.ceil((maxZ - minZ) / cubeSize) + 1;

    var voxels = new Int8Array(xCount * yCount * zCount);

    for (var i_x = 0; i_x < xCount; i_x++) {
        var x = minX + i_x * cubeSize;
        for (i_y = 0; i_y < yCount; i_y++) {
            var y = minY + i_y * cubeSize;
            var inside = false;
            for (i_z = 0; i_z < zCount; i_z++) {
                var z = minZ + i_z * cubeSize;

                if ((x-x0)/a*a + (y-y0)/b*b + (z-z0)/c*c < 1) {
                    var idx = xCount*yCount*i_x + yCount*i_y + i_z;
                    voxels[idx] = 1;
                }
            }
        }
    }

    return voxels;
}

// intersect triangle with line
function triIntersectsLine(orig, dir, v0, v1, v2) {
    v1.sub(v0);
    v2.sub(v1);
    var pvec = dir.copy().cross(v2);
    var det = v1.dot(pvec);
    if (det < 1e-8 && det > -1e8)
        return 0;

    var inv_det = 1 / det;
    var tvec = orig.sub(v0);
    var u = inv_det * tvec.dot(pvec);
    if (u < 0 || u > 1) {
        return 0;
    }
    tvec.cross(v1);
    var v = dir.dot(tvec) * inv_det;
    if (v < 0 || v > 1)
        return 0;
    return -1;
}

function voxelsCmp(ref, recon, add) {
    var score = 0;
    for (var i = 0; i < ref.length; i++) {
        var v = 
        if (voxels1[i] == voxels2[i])
            score++;
        else
            score--;
    }
    
    return score;
}
