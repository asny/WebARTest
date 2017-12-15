

var products = [];

function createProducts()
{
  for(var i = 0; i < productInfos.length; i++)
  {
    createProduct(productInfos[i]);
  }

  createParticleEffect(localToWorld(new THREE.Vector3(-0.5, 0.8, 0.3)));
  createParticleEffect(localToWorld(new THREE.Vector3(1.15, 1.4, 0.1)));
  createParticleEffect(localToWorld(new THREE.Vector3(0.8, 0.7, 0.5)));
  createParticleEffect(localToWorld(new THREE.Vector3(-1.2, 1.8, 0.1)));
}

function createProduct(productInfo)
{
  var position = new THREE.Vector3(productInfo.position[0], productInfo.position[1], productInfo.position[2]);

  // ANCHOR
  // Create anchor
  var posAnchor = localToWorld(position.clone().add(new THREE.Vector3(-0.1, 0.1, 0.1)));
  var mesh = anchorModel.clone();
  mesh.position.copy(posAnchor);
  mesh.quaternion.copy(rot);
  mesh.rotation.x -= 0.5 * Math.PI;
  mesh.scale.set(0.0001, 0.0001, 0.0001);
  scene.add( mesh );

  // VIDEO
  var posVideo = localToWorld(position);
  var video = createVideo(productInfo.vid, posVideo, productInfo.vidwidth, productInfo.vidheight);

  certificates = [];
  for(var i = 0; i < productInfo.cers.length; i++)
  {
    certificate = createCertificate(posVideo, certifications[productInfo.cers[i]]);
    certificates.push(certificate);
  }

  // Save product information
  var product = {position: position, anchor:mesh, certificates:certificates, animation:0.0, video: video};
  products.push(product);

}

function createCertificate(posWorld, certificateInfo)
{
  // TEXT
  // Create image
  var bitmap = document.createElement('canvas');
  var context = bitmap.getContext('2d');
  bitmap.width = 1200;
  bitmap.height = 1200;
  context.fillStyle="#FFFFFF";
  context.fillRect(0,0,bitmap.width,bitmap.height);

  var lineHeight = 60;
  var marginX = lineHeight * 2;
  var marginY = lineHeight * 2;
  var textWidth = bitmap.width - 2 * marginX;

  // Create background
  var div = document.createElement("div");
  div.style = "display:none;";

  var image = document.createElement("img");
  image.src = certificateInfo.img;
  image.width = certificateInfo.logowidth;
  image.height = certificateInfo.logoheight;
  var imageHeight = textWidth * image.height / image.width;
  var imageWidth = textWidth;
  var imageXStart = marginX;
  var maxImageHeight = bitmap.height / 2;
  if(imageHeight > maxImageHeight)
  {
    imageHeight = maxImageHeight;
    imageWidth = imageHeight * image.width / image.height;
    imageXStart = bitmap.width / 2 - imageWidth / 2;
  }
  context.drawImage(image, 0, 0, image.width, image.height, imageXStart, marginY, imageWidth, imageHeight);
  div.appendChild(image);
  document.body.appendChild(div);

  // Draw product title
  marginY += imageHeight + lineHeight * 2;
  context.font = '56px Open Sans bold';
  context.fillStyle = 'black';
  marginY = wrapText(context, certificateInfo.title, marginX, marginY, textWidth, lineHeight);

  // Draw teaser
  lineHeight = 50;
  marginY += lineHeight;
  context.font = '40px Open Sans';
  context.fillStyle = 'black';
  marginY = wrapText(context, certificateInfo.text, marginX, marginY, textWidth, lineHeight);

  // Draw certifications
  /*marginX += lineHeight * 0.25;
  for(var i = 0; i < productInfo.Certification.length; i++)
  {
    marginY = wrapText(context, " - " + productInfo.Certification[i], marginX, marginY, bitmap.width - 2 * marginX, lineHeight);
  }

  // Draw environmental effects
  marginY += lineHeight;
  context.font = '18px bold Open Sans';
  lineHeight = 20;
  for(var i = 0; i < productInfo.EnvironmentalEffects.effect.length; i++)
  {
    var effect = productInfo.EnvironmentalEffects.effect[i];
    marginY = wrapText(context, effect["@name"] + ": " + effect["#text"], marginX, marginY, bitmap.width - 2 * marginX, lineHeight);
  }*/

  // Create a texture
  var texture = new THREE.Texture(bitmap);
  texture.needsUpdate = true;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  // Create text geometry
  var geometry = new THREE.PlaneGeometry( 0.1, 0.1, 8, 8 );
  var material = new THREE.MeshBasicMaterial( {map : texture, side: THREE.DoubleSide, transparent: true, opacity: 0.8} );
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.copy(posWorld);
  mesh.quaternion.copy(rot);
  scene.add( mesh );

  return {mesh:mesh}
}

var lastTime = new Date().getTime();
function updateProducts(pos)
{
    var currentTime = (new Date().getTime() - lastTime) / 1000;
    var closestProduct = -1;
    var closestDist = 1000000.0;
    for(var i = 0; i < products.length; i++)
    {
      var dist = pos.distanceTo(localToWorld(products[i].position));
      if(dist < 1.0 && closestDist > dist)
      {
        closestDist = dist;
        closestProduct = i;
      }
    }

    for(var i = 0; i < products.length; i++)
    {
      var product = products[i];
      var animation = product.animation + 0.001 * currentTime * ( closestProduct == i ? 1.0 : - 1.0 );
      product.animation = Math.min(1.0, Math.max(0.0, animation));
      var shouldShow = product.animation > 0.00001;

      for(var j = 0; j < product.certificates.length; j++)
      {
        var certificate = product.certificates[j];
        certificate.mesh.scale.set(product.animation, product.animation, product.animation);
        certificate.mesh.visible = shouldShow;
        if(shouldShow)
        {
          var t = 0.00005 * (new Date().getTime() % (100000.0)) + ((1.0*j)/product.certificates.length) * 2.0 * Math.PI;
          var localPos = new THREE.Vector3(0.1 * Math.sin(t), -0.2, 0.06 * Math.cos(t));
          var posCertificate = localToWorld(product.position.clone().add(localPos));
          certificate.mesh.position.copy(posCertificate);
        }
      }

      product.anchor.rotation.x += 0.015;
    	product.anchor.rotation.y += 0.01;
    	product.anchor.rotation.y += 0.01;

      product.video.update();

      if(shouldShow)
      {
        product.video.play();
      }
      else {
        product.video.pause();
      }
    }
}

function wrapText(context, text, x, y, maxWidth, lineHeight)
{
  var cars = text.split("\n");

  for (var ii = 0; ii < cars.length; ii++) {

      var line = "";
      var words = cars[ii].split(" ");

      for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + " ";
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;

          if (testWidth > maxWidth) {
              context.fillText(line, x, y);
              line = words[n] + " ";
              y += lineHeight;
          }
          else {
              line = testLine;
          }
      }

      context.fillText(line, x, y);
      y += lineHeight;
  }
  return y;
}
