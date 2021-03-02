import { ViewRenderer } from './view-renderer.js';

export class ViewFader {

  constructor() { }

  static fadeIn(step) {
    var view = ViewRenderer.viewMap.get(step);
    var div = document.getElementById(view);
    div.style.display = 'block';
  }

  static fadeOut(step) {
    // if fade out prize result, remove the content 
    if (step === 2) {
      let view = document.getElementById('prize-result-container');
      view.remove();
    }
    else {
      let view = ViewRenderer.viewMap.get(step);
      let div = document.getElementById(view);
      div.style.display = 'none'; 
    }
  }
  
}