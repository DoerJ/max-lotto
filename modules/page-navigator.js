import { ViewRenderer } from './view-renderer.js';
import { DataProcessor } from './data-processor.js';
import { ViewFader } from './view-fader.js';

export class PageNavigator {

  constructor() {
    this.currentStep = 0;

    // indicator that check whether the page navigator for each view has been initiated
    this.prizeNumNavigatorAdded = false;
    this.numPoolNavigatorAdded = false;
    this.prizeResultNavigatorAdded = false;

    // navigation id for each view
    this.navigatorMap = new Map([
      [0, 'prize-num-navigator'],
      [1, 'num-pool-navigator'],
      [2, 'prize-result-navigator']
    ]);

    this.init();
  }

  init() {
    this.renderView();
  }

  // check whether the event listener has been bound to the navigator
  hasEventListenerBound(step) {
    var self = this;
    var bound = false;
    switch (step) {
      case 0:
        bound = self.prizeNumNavigatorAdded;
        self.prizeNumNavigatorAdded = bound ? bound : true;
        break;
      case 1:
        bound = self.numPoolNavigatorAdded;
        self.numPoolNavigatorAdded = bound ? bound : true;
        break;
      case 2:
        // the navigator for prize result page needs to be bound each time 
        break;
    }
    return bound;
  }

  renderView() {
    ViewRenderer.render(this.currentStep);
    this.registerNavigation();
  }

  registerNavigation() {
    var self = this;
    var navigator_id = self.navigatorMap.get(self.currentStep);
    var navigators = document.getElementsByClassName(navigator_id);

    if (navigators && !self.hasEventListenerBound(self.currentStep)) {
      for (var i = 0; i < navigators.length; i++) {
        var navigator = navigators[i];

        // add click event listener to navigation button
        navigator.addEventListener('click', (event) => {
          // process input data before switching the view  
          DataProcessor.process(self.currentStep, () => {
            // fade out the current view
            ViewFader.fadeOut(self.currentStep);
            if (event.target.id === 'to-left') {
              self.currentStep -= 1;
            }
            else if (event.target.id === 'to-right') {
              self.currentStep += 1;
            }
            // render the next view
            self.renderView();
          });
        });
      }
    }
  }

}