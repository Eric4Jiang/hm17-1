var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

camera.position.set(5, 5, 5);
camera.lookAt(scene.position);
camera.up.set(0, 0, 1);
scene.add(camera);

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
var renderContainer = document.getElementById('threejs-panel');
renderContainer.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls(camera, renderer.domElement);

//camera.position.z = 5;


function render() {
    requestAnimationFrame( render );

    renderer.render(scene, camera);
}


function init() {
    var geo = new THREE.BoxGeometry(1,1, 1);
    var mat = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // create grid
    var gridMat = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    for (var x = -5; x <= 5; x++) {
        var geo = new THREE.Geometry();
        geo.vertices.push(
            new THREE.Vector3(x, -5, 0),
            new THREE.Vector3(x, 5, 0)
        );
        var line = new THREE.Line(geo, gridMat);
        scene.add(line);

        var geo = new THREE.Geometry();
        geo.vertices.push(
            new THREE.Vector3(-5, x, 0),
            new THREE.Vector3(5, x, 0)
        );
        var line = new THREE.Line(geo, gridMat);
        scene.add(line);
    }


    render();
}

init();
