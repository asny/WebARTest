

var products = [];

function createProducts()
{
  createProduct(new THREE.Vector3(0.3, 0.4, -0.1), productInfos[0]);
  //createProduct(new THREE.Vector3(0.6, 0.4, -0.1), productInfos[1]);
  //createProduct(new THREE.Vector3(0.3, 0.8, -0.15), productInfos[2]);
  createProduct(new THREE.Vector3(0.6, 0.8, -0.15), productInfos[1]);
  //createProduct(new THREE.Vector3(0.3, 1.2, -0.15), productInfos[4]);
  createProduct(new THREE.Vector3(0.6, 1.2, -0.15), productInfos[2]);
  createProduct(new THREE.Vector3(0.3, 1.6, -0.20), productInfos[3]);
  //createProduct(new THREE.Vector3(0.6, 1.6, -0.20), productInfos[7]);*/

  createParticleEffect(localToWorld(new THREE.Vector3(-0.5, 0.8, 0.3)));
  createParticleEffect(localToWorld(new THREE.Vector3(1.15, 1.4, 0.1)));
  createParticleEffect(localToWorld(new THREE.Vector3(-0.2, 0.5, 0.7)));
  createParticleEffect(localToWorld(new THREE.Vector3(-1.2, 1.8, 0.1)));
}

function createProduct(position, productInfo)
{
  var p = localToWorld(position);

  // ANCHOR
  // Create anchor
  var mesh = anchorModel.clone();
  mesh.material = new THREE.MeshStandardMaterial();
  mesh.material.color.copy(new THREE.Color(1, 0.7, 0.7));
	mesh.material.roughness = 0.5;
	mesh.material.metalness = 0.5;
  mesh.position.copy(p);
  mesh.quaternion.copy(rot);
  mesh.rotation.x -= 0.5 * Math.PI;
  mesh.scale.set(0.0001, 0.0001, 0.0001);
  scene.add( mesh );

  // TEXT
  // Create image
  var bitmap = document.createElement('canvas');
  var context = bitmap.getContext('2d');
  bitmap.width = 1200;
  bitmap.height = 1200;

  var lineHeight = 60;
  var marginX = lineHeight * 2;
  var marginY = lineHeight * 2;
  var textWidth = bitmap.width - 2 * marginX;

  // Create background
  var div = document.createElement("div");
  div.style = "display:none;";

  var image = document.createElement("img");
  image.src = productInfo.img;
  image.width = 3840;
  image.height = 2160;
  var imageHeight = image.height * textWidth / image.width;
  context.drawImage(image, 0, 0, image.width, image.height, marginX, marginY, textWidth, imageHeight);
  div.appendChild(image);
  document.body.appendChild(div);

  // Draw product title
  marginY += imageHeight + lineHeight * 2;
  context.font = '56px Open Sans';
  context.fillStyle = 'black';
  marginY = wrapText(context, productInfo.title, marginX, marginY, textWidth, lineHeight);

  // Draw teaser
  lineHeight = 40;
  marginY += lineHeight;
  context.font = '28px Open Sans';
  context.fillStyle = 'black';
  marginY = wrapText(context, productInfo.text, marginX, marginY, textWidth, lineHeight);

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
  var geometry = new THREE.PlaneGeometry( 0.25, 0.25, 8, 8 );
  var material = new THREE.MeshBasicMaterial( {map : texture, side: THREE.DoubleSide} );
  var textGeometry = new THREE.Mesh( geometry, material );
  var p2 = localToWorld(position.clone().add(new THREE.Vector3(0.0, 0.0, 0.04)));
  textGeometry.position.copy(p2);
  textGeometry.quaternion.copy(rot);
  scene.add( textGeometry );

  // Save product information
  var product = {anchor:mesh, description:textGeometry, animation:0.0};
  products.push(product);
}

var lastTime = new Date().getTime();
function updateProducts(pos)
{
    var currentTime = (new Date().getTime() - lastTime) / 1000;
    var closestProduct = -1;
    var closestDist = 1000000.0;
    for(var i = 0; i < products.length; i++)
    {
      var dist = pos.distanceTo(products[i].anchor.position);
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
      product.description.scale.set(product.animation, product.animation, product.animation);

      product.description.visible = product.animation > 0.00001;

      product.anchor.rotation.x += 0.015;
    	product.anchor.rotation.y += 0.01;
    	product.anchor.rotation.y += 0.01;
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
