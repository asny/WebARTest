
var local2World;
var recordedHits = [];
var rot, trans, scale;

function localToWorld(position)
{
  var xAxis = new THREE.Vector3(), yAxis = new THREE.Vector3(), zAxis = new THREE.Vector3();
  local2World.extractBasis(xAxis, yAxis, zAxis);

  return trans.clone().add(xAxis.clone().multiplyScalar(position.x).add(yAxis.clone().multiplyScalar(position.y)).
    add(zAxis.clone().multiplyScalar(position.z)));
}

function estimateTransformation(X, Y)
{
  // Estimate translation
  var nSamples = X.length;
  var xAvg = new THREE.Vector3();
  var yAvg = new THREE.Vector3();
  for(var i = 0; i < nSamples; i++)
  {
    xAvg.add(X[i]);
    yAvg.add(Y[i]);
  }
  xAvg.multiplyScalar(1.0 / nSamples);
  yAvg.multiplyScalar(1.0 / nSamples);

  var translation = yAvg.clone().sub(xAvg);

  // Estimate rotation
  var P = new Array(nSamples);
  var Q = new Array(nSamples);
  for (var i = 0; i < nSamples; i++) {
    P[i] = [X[i].x - xAvg.x, X[i].y - xAvg.y, X[i].z - xAvg.z];
    Q[i] = [Y[i].x - yAvg.x, Y[i].y - yAvg.y, Y[i].z - yAvg.z];
  }

  var A = numeric.dot(numeric.transpose(P), Q);
  var svd = numeric.svd(A);
  var V = svd.U;
  var WT = numeric.transpose(svd.V);
  var det = numeric.det(numeric.dot(V, WT));
  var D = [[1.0, 0.0, 0.0],[0.0, 1.0, 0.0],[0.0, 0.0, det]];
  var R = numeric.dot(V, numeric.dot(D, WT));

  // Create matrix
  local2World = new THREE.Matrix4();
  local2World.set(R[0][0], R[1][0], R[2][0], translation.x,
                  R[0][1], R[1][1], R[2][1], translation.y,
                  R[0][2], R[1][2], R[2][2], translation.z,
                  0.0, 0.0, 0.0, 1.0);


  trans = new THREE.Vector3();
  rot = new THREE.Quaternion();
  scale = new THREE.Vector3();
  local2World.decompose(trans, rot, scale);
}
