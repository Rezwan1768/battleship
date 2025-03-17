export function createElement(tag, classes = [], text) {
  const elem = document.createElement(tag);
  elem.classList.add(...classes);
  elem.textContent = text;
  return elem;
}
