// magic goes here
function magic(mesh, shapeCount, iters, cubeSize) {
    var res = voxelizeMesh(mesh, cubeSize);
    var voxels = res.voxels;
    var origin = res.origin;
    var dims = res.dims;

    var voxelRecon = new Int8Array(voxels.length);

    for (var i = 0; i < shapeCount, i++) {
        var props = [0, 0, 0, 10, 10, 10];
        var shape = 'E';
        for (var j = 0; j < iters; j++) {
            var newProps = props.slice();
            mutate(newProps);
    
            var newVox = voxelizeEllipsoid(
                props[0], props[1], props[2], props[3], props[4], props[5]
            );


        }
    }
}

function mutate(props) {
    var idx = Math.floor(Math.random * props.length);
    props[idx] += (Math.random()-0.5) * 10;
}
