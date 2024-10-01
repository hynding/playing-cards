export const qs = (selector) => document.querySelector(selector)
export const qsa = (selector) => document.querySelectorAll(selector)
export const ce = (selector) => {
    const [tag, ...classNames] = selector.split('.')
    const element = document.createElement(tag)
    element.className = classNames.join(' ')
    return element
}

export const el = (selector) => {
    const element = qs(selector)
    const self = {
        clear: () => {
            element.innerHTML = ''
            return self
        },
        add: (...elements) => {
            element.append(...elements)
            return self
        },
        ev: (event, callback) => {
            element.addEventListener(event, callback)
            return self
        },
    }
    return self
}

export const cel = (selector, ...children) => {
  const element = ce(selector);
  element.append(...children);
  return element;
};