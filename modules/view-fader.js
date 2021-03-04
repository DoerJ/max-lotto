import { ViewRenderer } from './view-renderer.js';

// the fade animation takes .8s in total
var timeout = 800;
export class ViewFader {

  constructor() { }

  static fadeIn(step, from) {

    // get the view to fade in
    var viewid = ViewRenderer.viewMap.get(step);
    var view = document.getElementById(viewid);
    
    // after fadein animation is done, set display to block and remove fadein id
    var fadeinDone = (id) => {
      setTimeout(() => {
        view.style.display = 'block';
        view.classList.remove(id);
      }, timeout);
    }

    var fade = (from < step) ? 'fade-in-left' : 'fade-in-right';
    view.classList.add(fade);
    fadeinDone(fade);
  }

  static fadeOut(step, navid) {
    
    // get the view to fade out 
    var viewid = (step === 2) ? 'prize-result-container': ViewRenderer.viewMap.get(step);
    var view = document.getElementById(viewid);
    
    // after fadeout animation is done, set display to none and remove fadeout id
    var fadeoutDone = (id, resolve) => {
      setTimeout(() => {
        if (step === 2) {
          view.remove();
        }
        else {
          view.style.display = 'none';
        }
        view.classList.remove(id);
        resolve();
      }, timeout);
    }

    // if nav id is to-left, then the view should fade out to right
    // Otherwise, fade to left
    var fade = (navid === 'to-left') ? 'fade-out-right' : 'fade-out-left';
    view.classList.add(fade);

    var promise = new Promise((resolve) => {
      fadeoutDone(fade, resolve);
    })
    return promise;
  }

}