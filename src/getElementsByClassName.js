// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
let getElementsByClassName = function (className, node = document.body) {
  const elements = [];

  if (node.classList && node.classList.contains(className)) {
    elements.push(node);
  }

  if (node.childNodes) {
    node.childNodes.forEach((child) => {
      const result = getElementsByClassName(className, child);
      elements.concat(result);
    });
  }

  return elements;
};
