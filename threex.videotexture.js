var THREEx = THREEx || {}

THREEx.VideoTexture	= function(url){
	// create the video element
	var video	= document.createElement('video');
	video.width	= 320;
	video.height	= 240;
	video.autoplay	= true;
	video.loop	= true;
	video.src	= url;
	// expose video as this.video
	this.video	= video

	// create the texture
	var texture	= new THREE.Texture( video );
	// expose texture as this.texture
	this.texture	= texture

	/**
	 * update the object
	 */
	this.update	= function(){
		if( video.paused || video.readyState !== video.HAVE_ENOUGH_DATA )	return;
		texture.needsUpdate	= true;
	}

	this.pause	= function(){
		if(!video.paused)
			video.pause()
	}

	this.play	= function(){
		if(video.paused)
			video.play()
	}

	/**
	 * destroy the object
	 */
	this.destroy	= function(){
		video.pause()
	}
}
