
function createVideo(url, posWorld, width, height)
{
	var videoTexture;
	// find out which file formats i can read
	var canPlayMp4	= document.createElement('video').canPlayType('video/mp4') !== '' ? true : false
	if( canPlayMp4 )
	{
		// create the videoTexture
		videoTexture = new THREEx.VideoTexture(url, width, height);

		var material = new THREE.MeshBasicMaterial( { map: videoTexture.texture, side: THREE.DoubleSide } );

	  var plane = new THREE.PlaneGeometry( 0.5, 0.5 * (height / width), 32, 32 );

		var mesh = new THREE.Mesh( plane, material );
	  mesh.position.copy(posWorld);
	  mesh.quaternion.copy(rot);
	  scene.add(mesh);
	}
	else {
			alert('cant play mp4')
	}
	return videoTexture;
}
