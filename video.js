
var videoTexture, videoImageContext, video;
var posWorld;

function createVideo()
{
  // create the video element
	/*video = document.createElement( 'video' );
	// video.id = 'video';
	// video.type = ' video/ogg; codecs="theora, vorbis" ';
	video.src = "assets/sintel.mp4";
  video.muted = true;
	video.playsinline = true;
	video.load(); // must call after setting/changing source
	//video.play();
	*/
	video = document.getElementById( 'myVideo' );

	var videoImage = document.createElement( 'canvas' );
	videoImage.width = 480;
	videoImage.height = 204;

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#ff0000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;

	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );

  var plane = new THREE.PlaneGeometry( 0.5, 0.5, 32, 32 );

  var position = new THREE.Vector3(1.2, 0.5, 0.0);
  posWorld = localToWorld(position);

	var mesh = new THREE.Mesh( plane, movieMaterial );
  mesh.position.copy(posWorld);
  mesh.quaternion.copy(rot);
  scene.add(mesh);

	var button = document.createElement( 'button' );
	var t = document.createTextNode("CLICK ME");
	button.appendChild(t);
	button.onclick = function(){
		startParticleEffect(posWorld);
		video.paused ? video.play() : video.pause();
	}
	document.body.appendChild(button);
}

function updateVideo(pos)
{
	var shouldPause = pos.distanceTo(posWorld) > 2.0;
	if(video.paused != shouldPause)
	{
		//startParticleEffect(posWorld);
		//video.paused ? video.play() : video.pause();
	}

  // Update video
  if ( !video.paused && video.readyState === video.HAVE_ENOUGH_DATA )
	{
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture )
			videoTexture.needsUpdate = true;
	}
}
