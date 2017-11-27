
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

	// alternative method --
	// create DIV in HTML:
	// <video id="myVideo" autoplay style="display:none">
	//		<source src="videos/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'>
	// </video>
	// and set JS variable:
	// video = document.getElementById( 'myVideo' );

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
	// the geometry on which the movie will be displayed;
	// 		movie image will be scaled to fit these dimensions.
	/*var movieGeometry = new THREE.PlaneGeometry( 240, 100, 4, 4 );
	var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	movieScreen.position.set(0,50,0);
	scene.add(movieScreen);*/

  var plane = new THREE.PlaneGeometry( 0.5, 0.5, 32, 32 );

  var position = new THREE.Vector3(0.0, 0.5, 0.0);
  var posWorld = localToWorld(position);

	var mesh = new THREE.Mesh( plane, movieMaterial );
  mesh.position.copy(posWorld);
  mesh.quaternion.copy(rot);
  scene.add(mesh);

  /*video = document.getElementById( 'video' );

  videoImage = document.createElement( 'canvas' );
  videoImage.width = 480;
  videoImage.height = 204;

  videoContext = videoImage.getContext( '2d' );
  videoContext.fillStyle = '#000000';
  videoContext.fillRect( 0, 0, 480, 204 );

  videoTexture = new THREE.Texture( videoImage );
  var material = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: 0.5 } );

	var plane = new THREE.PlaneGeometry( 0.5, 0.5, 32, 32 );

  var position = new THREE.Vector3(0.0, 0.5, 0.0);
  var posWorld = localToWorld(position);

	var mesh = new THREE.Mesh( plane, material );
  mesh.position.copy(posWorld);
  mesh.quaternion.copy(rot);
  //mesh.rotation.x -= 0.5 * Math.PI;
	scene.add(mesh);*/
}

function updateVideo()
{
  console.log("Damn " + video.readyState + ": " + video.HAVE_ENOUGH_DATA);
  // Update video
  if ( video.readyState === video.HAVE_ENOUGH_DATA )
	{
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture )
			videoTexture.needsUpdate = true;
	}
}
