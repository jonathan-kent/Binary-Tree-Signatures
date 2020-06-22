
class Node{

  constructor(parent){
    this.left = null;
    this.right = null;
    this.parent = parent;
  }

  get signature(){
    var signature = "";
    if (this.left == null){
      signature = "0";
    } else{
      signature = "1";
    }
    if (this.right == null){
      signature = signature + "0";
    } else{
      signature = signature + "1";
    }
    return signature;
  }

}


class BinaryTree{

  constructor(){
    this.root = null;
  }

  add(newNode, side){
    if (this.root == null){
      this.root = newNode;
    } else if (side == "left"){
      newNode.parent.left = newNode;
    } else{
      newNode.parent.right = newNode;
    }
  }

  get height(){
    return getHeight(this.root, 0);
  }

}


function preOrder(node, signature){
  if (node == null){
    return signature;
  }
  signature = signature + node.signature;
  signature = preOrder(node.left, signature);
  signature = preOrder(node.right, signature);
  return signature;
}


function getHeight(node, height){
  if (node == null){
    return height;
  }
  height++;
  lHeight = getHeight(node.left, height);
  rHeight = getHeight(node.right, height);
  return Math.max(lHeight, rHeight);
}


function treeFromSignature(signature, parent, tree, dir){
  if (signature.length % 2 == 1){
    console.log("invalid tree signature: bad length");
    alert("Invalid Tree Signature");
    return null;
  }
  if (signature.charAt(signature.length-2) != '0' && signature.charAt(signature.length-1) != '0'){
    console.log("invalid tree signature: bad ending");
    alert("Invalid Tree Signature");
    return null;
  }
  if (signature.length == 0){
    var values = [tree, signature];
    return values;
  }

  var nodeSig = signature.substring(0,2);
  signature = signature.substring(2,signature.length);
  var node = new Node(parent);
  tree.add(node, dir);

  if (nodeSig.charAt(0) == "1"){
    //go left
    var returned = treeFromSignature(signature, node, tree, "left");
    signature = returned[1];
  }
  if (nodeSig.charAt(1) == "1"){
    //go right
    var returned = treeFromSignature(signature, node, tree, "right");
    signature = returned[1];
  }
  var values = [tree, signature];
  return values;
}


function renderTree(node, topOffset, leftOffset, parentOffset, depth){
  if (node == null){
    return;
  }
  var width = document.getElementById("tree").clientWidth;
  if(leftOffset == null){
    leftOffset = width / 2;
  } else{
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", leftOffset);
    line.setAttribute("y1", topOffset);
    line.setAttribute("x2", parentOffset);
    line.setAttribute("y2", topOffset-30);
    document.getElementById("svg").appendChild(line);
  }
  var renderNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  renderNode.setAttribute("cx", leftOffset);
  renderNode.setAttribute("cy", topOffset);
  document.getElementById("svg").appendChild(renderNode);
  depth++;
  renderTree(node.left, topOffset+30, leftOffset - (width/Math.pow(2, depth)), leftOffset, depth);
  renderTree(node.right, topOffset+30, leftOffset + (width/Math.pow(2, depth)), leftOffset, depth);
  return;
}

function fromForm(){
  var signature = document.getElementById("signature").value;
  var isDecimal = document.getElementById("decimal").checked;
  if (isDecimal){
    if (parseInt(signature) % 2 == 1){
      alert("Invalid Tree Signature");
      return;
    }
    signature = (parseInt(signature) >>> 0).toString(2);
    if (signature.length % 2 == 1){
      signature = "0" + signature;
    }
  }
  newTree = treeFromSignature(signature, new Node(null), new BinaryTree(), null);
  if (newTree[0] != null){
    document.getElementById("svg").innerHTML = "";
    renderTree(newTree[0].root, 30, null, null, 1);
  }
}
