
var videoTexture, videoContext, video, videoImage;

function createVideo(localToWorld)
{
  video = document.getElementById( 'video' );

  videoImage = document.createElement( 'canvas' );
  videoImage.width = 480;
  videoImage.height = 204;

  videoContext = videoImage.getContext( '2d' );
  videoContext.fillStyle = '#000000';
  videoContext.fillRect( 0, 0, 480, 204 );

  videoTexture = new THREE.Texture( videoImage );
  var material = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: 0.5 } );

	var plane = new THREE.PlaneGeometry( 0.5, 0.5, 32, 32 );

  var trans = new THREE.Vector3();
  var rot = new THREE.Quaternion();
  var scale = new THREE.Vector3();
  localToWorld.decompose(trans, rot, scale);
  var position = new THREE.Vector3(0.0, 0.0, 0.0);
  var p = trans.clone().add(xAxis.clone().multiplyScalar(position.x).add(yAxis.clone().multiplyScalar(position.y)).add(zAxis.clone().multiplyScalar(position.z)));

	var mesh = new THREE.Mesh( plane, material );
  mesh.position.copy(p);
  mesh.quaternion.copy(rot);
  mesh.rotation.x -= 0.5 * Math.PI;
	scene.add(mesh);
}

function updateVideo()
{
  console.log("Damn " + video.readyState + ": " + video.HAVE_ENOUGH_DATA);
  // Update video
  if ( video.readyState == video.HAVE_ENOUGH_DATA ) {

    videoContext.drawImage( video, 0, 0 );
    console.log("HAHa");

    if ( videoTexture ) videoTexture.needsUpdate = true;

  }
}
