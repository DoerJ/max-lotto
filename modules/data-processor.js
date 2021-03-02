import { PrizeChecker } from './prize-checker.js';

export class DataProcessor {

  constructor() { }

  static process(step, callback) {
    if (step === 0) {
      // initialize price checker 
      PrizeChecker.init(callback);
    }
    else {
      if (callback) {
        callback();
      }
    }
  }
  
}