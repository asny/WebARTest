
var videoTexture, videoImageContext, video;

function createVideo()
{
  // create the video element
	video = document.createElement( 'video' );
	// video.id = 'video';
	// video.type = ' video/ogg; codecs="theora, vorbis" ';
	video.src = "assets/sintel.ogv";
	video.load(); // must call after setting/changing source
	video.play();

	var videoImage = document.createElement( 'canvas' );
	videoImage.width = 480;
	videoImage.height = 204;

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;

	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );

  var plane = new THREE.PlaneGeometry( 0.5, 0.5, 32, 32 );

  var position = new THREE.Vector3(0.0, 0.5, 0.0);
  var posWorld = localToWorld(position);

	var mesh = new THREE.Mesh( plane, movieMaterial );
  mesh.position.copy(posWorld);
  mesh.quaternion.copy(rot);
  scene.add(mesh);
}

function updateVideo()
{
  // Update video
  if ( video.readyState === video.HAVE_ENOUGH_DATA )
	{
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture )
			videoTexture.needsUpdate = true;
	}
}
