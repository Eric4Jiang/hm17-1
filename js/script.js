var scene = new THREE.Scene();
var renderContainer = document.getElementById('threejs-panel');
var camera = new THREE.PerspectiveCamera(
    75, renderContainer.clientWidth/renderContainer.clientHeight, 0.01, 20000 );

var mouse = new THREE.Vector2();

camera.position.set(7, 7, 7);
camera.lookAt(scene.position);
camera.up.set(0, 0, 1);
scene.add(camera);

var dpr = window.devicePixelRatio || 1;
dpr = 1;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(dpr);
renderer.setSize( renderContainer.clientWidth*dpr, renderContainer.clientHeight*dpr );
renderContainer.appendChild( renderer.domElement );

var shapesGroup = new THREE.Group();
scene.add(shapesGroup);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var raycaster = new THREE.Raycaster();

var transformControls = new THREE.TransformControls(camera, renderer.domElement);
transformControls.addEventListener('change', render);
transformControls.setTranslationSnap(0.05);
transformControls.setRotationSnap(THREE.Math.degToRad(15));
transformControls.setSpace("world");
scene.add(transformControls);

//camera.position.z = 5;


var normalMat = new THREE.MeshNormalMaterial();
var highlightedMat = new THREE.MeshBasicMaterial({color: 0xFFFF00});

var currentObj = null;

function render() {
    requestAnimationFrame(render);
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObject(shapesGroup, true);

    if (intersects.length > 0) {
        renderer.domElement.style = 'cursor: pointer';
        currentObj = intersects[0].object;
    } else {
        renderer.domElement.style = 'cursor: default';
        currentObj = null;
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

    //setTimeout(resize, 5);

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
    //transformControls.attach(mesh);
    //scene.add(transformControls);
}

document.getElementById('add-sphere').onclick = function() {
    var geo = new THREE.SphereGeometry(1, 100, 100);
    var mat = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geo, mat);
    shapesGroup.add(mesh);
}

var LINK_STATE = null;

document.getElementById('link-button').onclick = function() {
    LINK_STATE = 1;
    //renderContainer.setAttribute('style', 'cursor: pointer');
}

renderContainer.onmousemove = function(event) {
    mouse.x = (event.clientX - renderContainer.offsetLeft)/renderContainer.clientWidth * 2 - 1;
    mouse.y = -(event.clientY - renderContainer.offsetTop)/renderContainer.clientHeight * 2 + 1;
    //console.log(mouse.x, mouse.y);
}

function showValue(newValue) {
    document.getElementById("range").innerHTML="Iterations: " + newValue;
}

function resize() {
    camera.aspect = renderContainer.clientWidth / renderContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( renderContainer.clientWidth, renderContainer.clientHeight );

    render();
}

window.onresize = resize;

window.onkeydown = function(e) {
    console.log('keydown', e.keyCode);
    if (currentObj === null) {
        if (e.keyCode == 27) {
            // escape
            transformControls.detach();
        }
        return;
    }

    if (e.keyCode == 84) {
        // translate
        console.log('we ???');
        transformControls.detach();
        transformControls.setMode("translate");
        transformControls.attach(currentObj);
    } else if (e.keyCode == 82) {
        // rotate
        transformControls.detach();
        transformControls.setMode("rotate");
        transformControls.attach(currentObj);
    } else if (e.keyCode == 83) {
        // scale
        transformControls.detach();
        transformControls.setMode("scale");
        transformControls.attach(currentObj);
    } else if (e.keyCode == 8) {
        // delete
        transformControls.detach();
        shapesGroup.remove(currentObj);
    }
}
