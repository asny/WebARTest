
var texture, videoImageContext, video;
var posWorld;

function createVideo()
{
	// find out which file formats i can read
	var canPlayMp4	= document.createElement('video').canPlayType('video/mp4') !== '' ? true : false
	var canPlayOgg	= document.createElement('video').canPlayType('video/ogg') !== '' ? true : false
	if( canPlayMp4 ){
		var url	= 'assets/sintel.mp4'
	}else if( canPlayOgg ){
		var url	= 'assets/sintel.ogv'
	}else	alert('cant play mp4 or ogv')

	// create the video element
	video	= document.createElement('video');
	video.width	= 320;
	video.height	= 240;
	video.autoplay	= true;
  video.muted = true;
	video.loop	= true;
	video.src	= url;

	// create the texture
	texture	= new THREE.Texture( video );

  // create the video element
	/*video = document.createElement( 'video' );
	// video.id = 'video';
	// video.type = ' video/ogg; codecs="theora, vorbis" ';
	video.src = "assets/sintel.mp4";
  video.muted = true;
	video.playsinline = true;
	video.load(); // must call after setting/changing source
	//video.play();

	video = document.getElementById( 'myVideo' );

	var videoImage = document.createElement( 'canvas' );
	videoImage.width = 480;
	videoImage.height = 204;

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#ff0000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );*/

	var material = new THREE.MeshBasicMaterial( { map: texture } );

  var plane = new THREE.PlaneGeometry( 0.5, 0.5, 32, 32 );

  var position = new THREE.Vector3(1.2, 0.5, 0.0);
  posWorld = localToWorld(position);

	var mesh = new THREE.Mesh( plane, material );
  mesh.position.copy(posWorld);
  mesh.quaternion.copy(rot);
  scene.add(mesh);

	/*var button = document.createElement( 'button' );
	var t = document.createTextNode("CLICK ME");
	button.appendChild(t);
	button.onclick = function(){
		startParticleEffect(posWorld);
		video.paused ? video.play() : video.pause();
	}
	document.body.appendChild(button);*/
}

function updateVideo(pos)
{
	if( video.readyState !== video.HAVE_ENOUGH_DATA )
		return;
	texture.needsUpdate	= true;
	/*var shouldPause = pos.distanceTo(posWorld) > 2.0;
	if(video.paused != shouldPause)
	{
		//startParticleEffect(posWorld);
		//video.paused ? video.play() : video.pause();
	}

  // Update video
  if ( !video.paused && video.readyState === video.HAVE_ENOUGH_DATA )
	{
		//videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture )
			videoTexture.needsUpdate = true;
	}*/
}
