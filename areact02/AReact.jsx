function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child !== 'object' ? createTextElement(child) : child;
      }),
    },
  };
}

function createTextElement(text) {
  return {
    type: 'HostText',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

const isProperty = (key) => key !== 'children';

class AReactDomRoot {
  constructor(container) {
    this.container = container;
  }

  render(element) {
    this.renderImpl(element, this.container);
  }

  renderImpl(element, parent) {
    const dom =
      element.type === 'HostText'
        ? document.createTextNode('')
        : document.createElement(element.type);
    Object.keys(element.props)
      .filter(isProperty)
      .forEach((key) => {
        dom[key] = element.props[key];
      });
    element.props.children.forEach((child) => {
      this.renderImpl(child, dom);
    });
    parent.appendChild(dom);
  }
}

function createRoot(container) {
  return new AReactDomRoot(container);
}

export default { createElement, createRoot };
