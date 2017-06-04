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

var renderer = new THREE.WebGLRenderer();
//renderer.setPixelRatio(dpr);
renderer.setSize( renderContainer.clientWidth, renderContainer.clientHeight );
renderContainer.appendChild( renderer.domElement );

var shapesGroup = new THREE.Group();
scene.add(shapesGroup);
var fractalGroup = new THREE.Group();
scene.add(fractalGroup);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

var raycaster = new THREE.Raycaster();

var transformControls = new THREE.TransformControls(camera, renderer.domElement);
//transformControls.addEventListener('change', render);
transformControls.setTranslationSnap(0.05);
transformControls.setRotationSnap(THREE.Math.degToRad(15));
transformControls.setSpace("world");
scene.add(transformControls);

//camera.position.z = 5;


var normalMat = new THREE.MeshNormalMaterial();
var highlightedMat1 = new THREE.MeshBasicMaterial({color: 0xFFFF00});
var highlightedMat2 = new THREE.MeshBasicMaterial({color: 0xFF8000});

var currentObj = null;

function render() {
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObject(shapesGroup, true);

    for (var i = 0; i < shapesGroup.children.length; i++)
        shapesGroup.children[i].material = normalMat;

    if (intersects.length > 0) {
        renderer.domElement.style = 'cursor: pointer';
        currentObj = intersects[0].object;
        if (LINK_STATE === 1) {
            currentObj.material = highlightedMat1;
        } else if (LINK_STATE === 2) {
            currentObj.material = highlightedMat2;
        }
    } else {
        renderer.domElement.style = 'cursor: default';
        currentObj = null;
    }


    renderer.render(scene, camera);
    requestAnimationFrame(render);
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

    setTimeout(function() {
        //renderer.setPixelRatio(dpr);
        //renderer.setSize( renderContainer.clientWidth, renderContainer.clientHeight );
        //resize()
    }, 5);

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
    var geo = new THREE.SphereGeometry(1, 35, 35);
    var mat = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geo, mat);
    shapesGroup.add(mesh);
}

var LINKS = [];
var LINK_STATE = null;
var linkObj1 = null;
var linkObj2 = null;

document.getElementById('link-button').onclick = function() {
    LINK_STATE = 1;
    //renderContainer.setAttribute('style', 'cursor: pointer');
}

renderer.domElement.addEventListener('click', function() {
    if (LINK_STATE === null) return;
    if (currentObj === null) return;
    if (LINK_STATE === 1) {
        linkObj1 = currentObj;
        LINK_STATE = 2;
    } else if  (LINK_STATE === 2) {
        linkObj2 = currentObj;
        LINKS.push([linkObj1, linkObj2]);
        console.log(LINKS);
        LINK_STATE = null;
    }
    console.log(LINK_STATE);
});

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

function generate(nIters) {
    var transforms = [];
    for (var i = 0; i < LINKS.length; i++) {
        var relTransform = new THREE.Matrix4().getInverse(LINKS[i][0].matrix);
        relTransform.multiply(LINKS[i][1].matrix);
        //relTransform.multiply(new THREE.Matrix4().getInverse(LINKS[i][1].matrix));
        relTransform.premultiply(new THREE.Matrix4().getInverse(LINKS[i][0].matrix));
        relTransform.multiply(LINKS[i][0].matrix);
        transforms.push(relTransform);
    }

    generateRecur(nIters, shapesGroup, transforms, 1);
}

function generateRecur(nIters, obj, transforms, lvl) {
    if (lvl > nIters) return;
    
    for (var i = 0; i < transforms.length; i++) {
        var t = transforms[i];
        var replica = obj.clone();
        replica.applyMatrix(t);
        fractalGroup.add(replica);
        generateRecur(nIters, replica, transforms, lvl+1);
    }
}
