
var videoTexture = [];
var video;
var posWorld;

function createVideo(url, position)
{
	// find out which file formats i can read
	var canPlayMp4	= document.createElement('video').canPlayType('video/mp4') !== '' ? true : false
	if( canPlayMp4 )
	{
		// create the videoTexture
		videoTexture.push(new THREEx.VideoTexture(url));
		video	= videoTexture.video;

		var material = new THREE.MeshBasicMaterial( { map: videoTexture.texture, side: THREE.DoubleSide } );

	  var plane = new THREE.PlaneGeometry( 0.5, 0.5, 32, 32 );

	  posWorld = localToWorld(position);

		var mesh = new THREE.Mesh( plane, material );
	  mesh.position.copy(posWorld);
	  mesh.quaternion.copy(rot);
	  scene.add(mesh);
	}
	else {
			alert('cant play mp4')
	}
}

/*function onVideoPlayButtonClick(){
	video.play();
}
function onVideoPauseButtonClick(){
	video.pause();
}*/

function updateVideo(pos)
{
	for(var i = 0; i < videoTexture.length; i++) {
		videoTexture[i].update();
	}
}
