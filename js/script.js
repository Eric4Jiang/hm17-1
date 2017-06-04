var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.01, 20000 );

var mouse = new THREE.Vector2();

camera.position.set(7, 7, 7);
camera.lookAt(scene.position);
camera.up.set(0, 0, 1);
scene.add(camera);

var renderContainer = document.getElementById('threejs-panel');
var renderer = new THREE.WebGLRenderer();
renderer.setSize( renderContainer.clientWidth, renderContainer.clientHeight );
renderContainer.appendChild( renderer.domElement );

var shapesGroup = new THREE.Group();
scene.add(shapesGroup);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var raycaster = new THREE.Raycaster();

//camera.position.z = 5;


var normalMat = new THREE.MeshNormalMaterial();
var highlightedMat = new THREE.MeshBasicMaterial({color: 0xFFFF00});

function render() {
    requestAnimationFrame(render);
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObject(shapesGroup, true);

    for (var i = 0; i < shapesGroup.children.length; i++) {
        shapesGroup.children[i].material = normalMat;
    }

    console.log(intersects.length);
    for (var i = 0; i < intersects.length; i++) {
        intersects[i].object.material = highlightedMat;
    }
    if (intersects.length > 0) {
        renderer.domElement.style = 'cursor: pointer';
    } else {
        renderer.domElement.style = 'cursor: default';
    }

    renderer.render(scene, camera);
}


function init() {
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

document.getElementById('add-pyramid').onclick = function() {
    var geo = new THREE.CylinderGeometry(1, 3, 3, 4);
    geo.vertices = [
        new THREE.Vector3( -0.5, -0.5, 0 ),
        new THREE.Vector3( -0.5, 0.5, 0 ),
        new THREE.Vector3( 0.5, 0.5, 0 ),
        new THREE.Vector3( 0.5, -0.5, 0 ),
        new THREE.Vector3( 0, 0, 1 )
    ];

    geo.faces = [
        new THREE.Face3( 0, 1, 2 ),
        new THREE.Face3( 0, 2, 3 ),
        new THREE.Face3( 1, 0, 4 ),
        new THREE.Face3( 2, 1, 4 ),
        new THREE.Face3( 3, 2, 4 ),
        new THREE.Face3( 0, 3, 4 )
    ];
    geo.computeFaceNormals();

    var mat = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geo, mat);
    shapesGroup.add(mesh);
}

document.getElementById('add-cube').onclick = function() {
    var geo = new THREE.BoxGeometry(1, 1, 1);
    var mat = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geo, mat);
    shapesGroup.add(mesh);
}

document.getElementById('add-sphere').onclick = function() {
    var geo = new THREE.SphereGeometry(1, 100, 100);
    var mat = new THREE.MeshBasicMaterial({color: 0x00FF00});
    var mesh = new THREE.Mesh(geo, mat);
    shapesGroup.add(mesh);
}

var LINK_STATE = null;

document.getElementById('link-button').onclick = function() {
    LINK_STAT = 1;
    //renderContainer.setAttribute('style', 'cursor: pointer');
}

renderer.domElement.onclick = function() {
    console.log('waddup');
}

renderContainer.onmousemove = function(event) {
    mouse.x = (event.clientX - renderContainer.offsetLeft)/renderContainer.clientWidth * 2 - 1;
    mouse.y = -(event.clientY - renderContainer.offsetTop)/renderContainer.clientHeight * 2 + 1;
    //console.log(mouse.x, mouse.y);
}

function showValue(newValue) {
    document.getElementById("range").innerHTML="Current Layers: " + newValue + "<br>";
}
