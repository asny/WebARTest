var THREEx = THREEx || {}

THREEx.VideoTexture	= function(url, width, height){
	// create the video element
	var video	= document.createElement('video');
	video.width	= width;
	video.height	= height;
	video.autoplay	= true;
	video.loop	= true;
	video.preload = "auto";
	video.src	= url;
	// expose video as this.video
	this.video	= video;
	this.shouldPlay = false;

	// create the texture
	var texture	= new THREE.Texture( video );
	// expose texture as this.texture
	this.texture	= texture

	this.pause	= function(){
		if(!video.paused)
			video.pause()
	}

	this.play	= function(){
		if(video.paused)
		{
			if(video.readyState >= video.HAVE_FUTURE_DATA)
			{
				video.play();
				this.shouldPlay = false;
			}
			else {
				this.shouldPlay = true;
			}
		}
	}

	/**
	 * update the object
	 */
	this.update	= function(){
		if( !video.paused )
		{
			texture.needsUpdate	= true;
		}
		else if(this.shouldPlay) {
			this.play();
		}
	}

	/**
	 * destroy the object
	 */
	this.destroy	= function(){
		video.pause()
	}
}

function createVideo(url, posWorld, width, height)
{
	var videoTexture;
	// find out which file formats i can read
	var canPlayMp4	= document.createElement('video').canPlayType('video/mp4') !== '' ? true : false
	var canPlayMov	= document.createElement('video').canPlayType('video/mov') !== '' ? true : false
	if( canPlayMov || canPlayMp4 )
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
			alert('cant play mp4 or mov')
	}
	return videoTexture;
}
