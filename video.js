
var videoTexture, video;
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

	// create the videoTexture
	videoTexture= new THREEx.VideoTexture(url)
	video	= videoTexture.video
	updateFcts.push(function(delta, now){
		videoTexture.update(delta, now)
	})

	// use the texture in a THREE.Mesh
	var geometry	= new THREE.CubeGeometry(1,1,1);
	var material	= new THREE.MeshBasicMaterial({
		//map	: videoTexture.texture
	});
	var mesh	= new THREE.Mesh( geometry, material );

  var position = new THREE.Vector3(1.2, 0.5, 0.0);
  posWorld = localToWorld(position);
	mesh.position.copy(posWorld);

	scene.add( mesh );

	/*var material = new THREE.MeshBasicMaterial( { map: texture } );

  var plane = new THREE.PlaneGeometry( 0.5, 0.5, 32, 32 );

  var position = new THREE.Vector3(1.2, 0.5, 0.0);
  posWorld = localToWorld(position);

	var mesh = new THREE.Mesh( plane, material );
  mesh.position.copy(posWorld);
  mesh.quaternion.copy(rot);
  scene.add(mesh);*/

	/*var button = document.createElement( 'button' );
	var t = document.createTextNode("CLICK ME");
	button.appendChild(t);
	button.onclick = function(){
		startParticleEffect(posWorld);
		video.paused ? video.play() : video.pause();
	}
	document.body.appendChild(button);*/
}


function onVideoPlayButtonClick(){
	video.play();
}
function onVideoPauseButtonClick(){
	video.pause();
}

var lastTimeMsec = null;
function updateVideo(pos)
{
	// measure time
	var nowMsec = new Date().getTime();
	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
	lastTimeMsec	= nowMsec
	videoTexture.update(deltaMsec/1000, nowMsec/1000);
	/*if( video.readyState !== video.HAVE_ENOUGH_DATA )
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
