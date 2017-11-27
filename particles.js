
var particles = [];

function initParticles()
{
  var material = new THREE.SpriteMaterial( {
    map: new THREE.CanvasTexture( generateBlueSprite() ),
    blending: THREE.AdditiveBlending
  } );

  var particle;
  for ( var i = 0; i < 200; i++ ) {

    particle = new THREE.Sprite( material );
    particle.visible = false;
    particles.push(particle);

    scene.add( particle );
  }
}

function createParticleEffect(pos)
{
  var material = new THREE.SpriteMaterial( {
    map: new THREE.CanvasTexture( generateRedSprite() ),
    blending: THREE.AdditiveBlending
  } );
  var time = 2000;
  var delay = time / particles.length;
  for ( var i = 0; i < 200; i++ ) {

    particle = new THREE.Sprite( material );
    scene.add( particle );
    initParticle( particle, delay, time, pos, true );
  }
}

function generateBlueSprite() {

  var canvas = document.createElement( 'canvas' );
  canvas.width = 16;
  canvas.height = 16;

  var context = canvas.getContext( '2d' );
  var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
  gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
  gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
  gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
  gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

  context.fillStyle = gradient;
  context.fillRect( 0, 0, canvas.width, canvas.height );

  return canvas;
}

function generateRedSprite() {

  var canvas = document.createElement( 'canvas' );
  canvas.width = 16;
  canvas.height = 16;

  var context = canvas.getContext( '2d' );
  var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
  gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
  gradient.addColorStop( 0.2, 'rgba(255,255,0,1)' );
  gradient.addColorStop( 0.4, 'rgba(64,0,0,1)' );
  gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

  context.fillStyle = gradient;
  context.fillRect( 0, 0, canvas.width, canvas.height );

  return canvas;
}

function startParticleEffect(pos)
{
  var time = 2000;
  var delay = time / particles.length;
  // Show particles
  for(var i = 0; i < particles.length; i++)
  {
    initParticle( particles[i], delay, time, pos, false );
  }
}

function initParticle( particle, delay, animationTime, pos, restart ) {

	var particle = this instanceof THREE.Sprite ? this : particle;

  particle.visible = true;
	particle.position.copy(pos);
	particle.scale.x = particle.scale.y = 0.01 + 0.02 * Math.random();

	new TWEEN.Tween( particle )
		.delay( delay )
		.to( {}, animationTime )
		.onComplete( function(){restart ? initParticle(particle, delay, animationTime, pos, restart) : particle.visible = false;} )
		.start();

	new TWEEN.Tween( particle.position )
		.delay( delay )
		.to( { x: pos.x + Math.random() - 0.5, y: pos.y + Math.random() - 0.5, z: pos.z + Math.random() - 0.5 }, animationTime )
		.start();

	new TWEEN.Tween( particle.scale )
		.delay( delay )
		.to( { x: 0.0001, y: 0.0001 }, animationTime )
		.start();

}

function updateParticles()
{
  TWEEN.update();
}
