function generateFractal(objects, scene, links, iters, level) {
    level = level || 1;

    var obj = new THREE.Group();
    objects.forEach(function(o) {
        obj.add(o); 
    });
    if (level < iters) {
        for (var i = 0; i < links.length; i++) {
            var base = getFromId(objects, links[i][0]);
            var replica = getFromId(objects, links[i][1]);

            var transform = new THREE.Matrix4().getInverse(base.matrix, false).multiply(replica.matrix);
            new THREE.Object3D().copy(obj);
        }
    }
}

function getFromId(objects, id) {
    for (var i = 0; i < objects.length; i++) {
        if (objects[i].id === id)
            return objects[i];
    }
}
