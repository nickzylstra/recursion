// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
let getElementsByClassName = function (className) {
  const elements = [];

  const checkNode = function checkNode(node) {
    if (node.classList && node.classList.contains(className)) {
      elements.push(node);
    }

    if (node.childNodes) {
      node.childNodes.forEach((child) => checkNode(child));
    }
  };

  checkNode(document.body);

  return elements;
};
