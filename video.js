
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

	var material = new THREE.MeshBasicMaterial( { map: videoTexture.texture, side: THREE.DoubleSide } );

  var plane = new THREE.PlaneGeometry( 0.5, 0.5, 32, 32 );

  var position = new THREE.Vector3(1.2, 0.5, 0.0);
  posWorld = localToWorld(position);

	var mesh = new THREE.Mesh( plane, material );
  mesh.position.copy(posWorld);
  mesh.quaternion.copy(rot);
  scene.add(mesh);
}

/*function onVideoPlayButtonClick(){
	video.play();
}
function onVideoPauseButtonClick(){
	video.pause();
}*/

function updateVideo(pos)
{
	videoTexture.update();
}
