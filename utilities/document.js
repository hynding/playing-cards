export const qs = (selector) => document.querySelector(selector)
export const qsa = (selector) => document.querySelectorAll(selector)
export const ce = (selector) => {
    const [tag, ...classNames] = selector.split('.')
    const element = document.createElement(tag)
    element.className = classNames.join(' ')
    return element
}

export const el = (selector) => {
    const element = typeof selector === 'string' ? qs(selector) : selector
    const self = {
        clear: () => {
            element.innerHTML = ''
            return self
        },
        add: (...elements) => {
            element.append(...elements)
            return self
        },
        toggleClass: (className) => {
            element.classList.toggle(className)
            return self
        },
        ev: (event, callback) => {
            element.addEventListener(event, () => {
                callback(self)
            })
            return self
        },
        get: () => element
    }
    return self
}

export const cel = (selector, ...children) => {
  const element = el(ce(selector));
  return element.add(...children);
};