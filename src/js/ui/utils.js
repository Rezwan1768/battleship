export function createElement({
  element,
  content = "",
  classes = [],
  attributes = {},
}) {
  if (!Array.isArray(classes)) classes = [];

  const elem = document.createElement(element);
  elem.textContent = content;
  elem.classList.add(...classes);

  for (let key in attributes) {
    if (Object.prototype.hasOwnProperty.call(attributes, key))
      elem.setAttribute(key, attributes[key]);
  }
  return elem;
}

export function isDirectInstance(obj, cls) {
  return obj instanceof cls && Object.getPrototypeOf(obj) === cls.prototype;
}
