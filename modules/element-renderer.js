
export class ElementRenderer {
  constructor() {

  }

  // render a single DOM element
  static buildElement(el) {
    var _el = document.createElement(el.type);
    _el.id = el.id ? el.id : '';
    _el.innerHTML = el.text ? el.text : '';

    // element classnames
    if (el.hasOwnProperty('classlist')) {
      el.classlist.forEach((cl) => {
        _el.classList.add(cl);
      });
    }

    // element attributes
    if (el.hasOwnProperty('attrs')) {
      Object.keys(el.attrs).forEach((key) => {
        _el.setAttribute(key, el.attrs[key]);
      });
    }
    // register element with event listener
    if (el.hasOwnProperty('listener')) {
      _el.addEventListener(el.listener.event, el.listener.cb);
    }
    return _el;
  }
  
  // render DOM element group
  static render(parent) {
    var buildElementTree = (el) => {
      var _el = (el.hasOwnProperty('element')) ? el.element :  ElementRenderer.buildElement(el);
      if (!el.hasOwnProperty('childs')) {
        return _el; 
      }
      for (let i = 0; i < el.childs.length; i++) {
        _el.appendChild(buildElementTree(el.childs[i]));
      }
      return _el;
    }
    return buildElementTree(parent);
  }

  // render number input
  static renderPrizeNumInput(input) {
    var div = ElementRenderer.buildElement({
      type: 'div',
      classlist: ['input-form']
    });

    for (let i = 0; i < input.num; i++) {
      div.appendChild(ElementRenderer.buildElement({ 
        type: 'input', 
        id: input.id ? `${input.id}-${i}` : '', 
        classlist: input.classlist,
        attrs: { 
          type: 'text', 
          // the input is two-letter exactly
          minlength: '2', 
          maxlength: '2', 
          required: '',
          ...input.attrs 
        },
        listener: input.listener
      }));
    }
    return div;
  }

}