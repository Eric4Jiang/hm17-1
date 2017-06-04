var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 5;

// loader for STL files
var loader = new THREE.STLLoader();

function render() {
    requestAnimationFrame( render );
    renderer.render(scene, camera);
}

function uploadFile(){
    var x = document.getElementById("myFile");
    var txt = "";
    var ext = "";
    if ('files' in x) {
        if (x.files.length == 0) {
            txt = "Select one or more files.";
        } else {
            var file = x.files[0];
            if ('name' in file) {
                n = file.name;

                // check if file is stl
                ext = n.substring(n.length - 4, n.length);
                txt += "<strong>Current File: </strong>" + file.name + "<br>";
                console.log(typeof(file));
                console.log(ext.localeCompare(".stl"));
                if (ext.localeCompare(".stl") == 0) {
                    render();
                } else {
                    txt = file.name + " IS NOT AN STL FILE!!! <br>";
                }

                var url = window.URL.createObjectURL(file);
                loader.load(url, function ( geometry ) {
                    scene.add( new THREE.Mesh( geometry ) );
                });

            }
        }
    }
    document.getElementById("demo").innerHTML = txt;
}
