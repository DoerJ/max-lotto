import { ElementRenderer } from './element-renderer.js';
import { PrizeChecker } from './prize-checker.js';
import { NumberPool } from './number-pool.js';
import { ViewFader } from './view-fader.js';
import { debounce } from './debounce.js';

// submit new main number/bonus set  
var submitNumberSet = (event) => {
  var str = '';
  var id = event.target.id;
  var set, list;

  // if submit main number set
  if (id === 'enter-main-num') {
    set = document.getElementsByClassName('num-set');
    // push the new number set to the pool
    NumberPool.pushNumberSetToPool(set, 'main');
    
    // reset submit button to disabled 
    document.getElementById('enter-main-num').disabled = 'true';
    list = document.getElementById('display-num-set');
  }
  // if submit bonus number set
  else if (id === 'enter-bonus-num') {
    set = document.getElementsByClassName('bonus-set');
    NumberPool.pushNumberSetToPool(set, 'bonus');

    document.getElementById('enter-bonus-num').disabled = 'true';
    list = document.getElementById('display-bonus-set');
  }

  // clear input fields value 
  for (let i = 0; i < set.length; i++) {
    str += (i === set.length - 1) ? set[i].value : `${set[i].value} &nbsp;&nbsp;&nbsp;`;
    // clear the input value
    set[i].value = '';
  }

  // display the new number set to the right panel
  list.innerHTML += `<li>${str}</li>`;
}

// input validators
var inputValidator = (event) => {
  switch (event.target.name) {
    case 'prize-number':
      let next = document.getElementById('to-right');
      next.disabled = !document.getElementById('prize-num-form').checkValidity();
      break;
    case 'main-num-set':
      let enter_num = document.getElementById('enter-main-num');
      enter_num.disabled = !document.getElementById('num-pool-form').checkValidity();
      break;
    case 'bonus-num-set':
      let enter_bonus = document.getElementById('enter-bonus-num');
      enter_bonus.disabled = !document.getElementById('bonus-num-form').checkValidity();
      break;
  }
}

// add debounce to input validator
var validatorWithDebounce = debounce(inputValidator, 500);

export class ViewRenderer {

  static prizeNumRendered = false;
  static numPoolRendered = false;

  // key: current step; value: view id
  static viewMap = new Map([
    [0, 'prize-num'],
    [1, 'num-pool'],
    [2, 'prize-result']
  ]);

  constructor() { }

  static render(step, from) {
    // when fade-in, need to know the current view and the previous page to decide which direction to fade in
    if (step === 0 && !ViewRenderer.prizeNumRendered) {
      ViewRenderer.renderPrizeNum();
    }
    else {
      if (step === 1 && !ViewRenderer.numPoolRendered) {
        ViewRenderer.renderNumPool();
      }
      else if (step === 2) {
        ViewRenderer.renderPrizeResult();
      }
      ViewFader.fadeIn(step, from);
    }
  }

  // render the template for the prize number page
  static renderPrizeNum() {
    var container = document.getElementById('prize-num');

    var content = ElementRenderer.render({
      type: 'form',
      id: 'prize-num-form',
      childs: [
        {
          type: 'label',
          id: 'prize-num-label',
          text: '输入本次的中奖号码：'
        }, {
          element: ElementRenderer.renderPrizeNumInput({ 
            num: 7, 
            id: 'prize-num',
            classlist: ['prize-num'],
            attrs: { name: 'prize-number' },
            listener: { event: 'input', cb: validatorWithDebounce }
          })
        }, {
          type: 'label',
          id: 'bonus-num-label',
          text: '输入本次的Bonus号码：'
        }, {
          element: ElementRenderer.renderPrizeNumInput({ 
            num: 1, 
            id: 'bonus-num',
            classlist: ['bonus-num'],
            attrs: { name: 'prize-number' },
            listener: { event: 'input', cb: validatorWithDebounce }
          })
        }
      ]
    });

    var navigator = ElementRenderer.render({
      type: 'div',
      classlist: ['navigators'],
      childs: [{
        type: 'button',
        classlist: ['prize-num-navigator', 'btn', 'btn-primary'],
        id: 'to-right',
        text: '下一步',
        attrs: { disabled: 'true' }
      }]
    });
    container.appendChild(content);
    container.appendChild(navigator);

    ViewRenderer.prizeNumRendered = true;      
  }

  // render the template for the number pool page
  static renderNumPool() {
    var left_col = document.getElementById('left-col');

    var content = ElementRenderer.render({
      el: document.createElement('div'),
      childs: [{
        // number pool form 
        type: 'form',
        id: 'num-pool-form',
        childs: [{
          // input label for main numbers 
          type: 'label',
          text: '输入你的号码：'
        }, {
          // number pool input
          element: ElementRenderer.renderPrizeNumInput({ 
            num: 7, 
            id: 'main-num',
            classlist: ['num-set'],
            attrs: { name: 'main-num-set' },
            listener: { event: 'input', cb: validatorWithDebounce }
          })
        }]
      }, {
        type: 'div',
        classlist: ['enter-btn'],
        childs: [{
          // submit the number set to the pool
          type: 'button',
          id: 'enter-main-num',
          classlist: ['btn', 'btn-primary'],
          attrs: { disabled: 'true' },
          text: '输入',
          listener: { event: 'click', cb: submitNumberSet }
        }]
      }, {
        // bonus number input 
        type: 'form',
        id: 'bonus-num-form',
        childs: [{
          // input label for bonus
          type: 'label',
          text: '输入你的Bonus号码：'
        }, {
          // bonus number input
          element: ElementRenderer.renderPrizeNumInput({
            num: 7,
            id: 'bonus-num',
            classlist: ['bonus-set'],
            attrs: { name: 'bonus-num-set' },
            listener: { event: 'input', cb: validatorWithDebounce }
          })
        }]
      }, {
        type: 'div',
        classlist: ['enter-btn'],
        childs: [{
          // submit button for bonus numbers
          type: 'button',
          id: 'enter-bonus-num',
          classlist: ['btn', 'btn-primary'],
          attrs: { disabled: 'true' },
          text: '输入',
          listener: { event: 'click', cb: submitNumberSet }
        }]
      }]
    });

    left_col.appendChild(content);
    ViewRenderer.numPoolRendered = true;
  }

  // render template for prize result
  static renderPrizeResult() {
    var container = document.getElementById('prize-result');  

    // create a container div for removal 
    var content = ElementRenderer.buildElement({
      type: 'div',
      id: 'prize-result-container'
    }); 
    var prize_list = ElementRenderer.render({
      type: 'ul',
      id: 'result-list',
      childs: [{
        type: 'span',
        text: '你的中奖结果'
      }, {
        type: 'hr'
      }]
    });

    PrizeChecker.generatePrizeResult(result => {
      if (result.size === 0) {
        prize_list.innerHTML += '<li>你没有中奖</li>';
      }
      else {
        result.forEach((value, key) => {
          prize_list.innerHTML += `<li>${key}: ${value}</li>`;
        });
      }  
      var navigator = ElementRenderer.buildElement({
        type: 'button',
        classlist: ['prize-result-navigator', 'btn', 'btn-primary'],
        id: 'to-left',
        text: '上一步'
      });

      content.appendChild(prize_list);
      content.appendChild(navigator);
      container.appendChild(content);
    });
  }

}