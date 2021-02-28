import { NumberPool } from './number-pool.js';

export class PrizeChecker {

  static prizeNumMap = new Map();
  static prizeMap = new Map([
    [3, '$5 Free Play'],
    [3.5, '$20'],
    [4, '$20'],
    [4.5, '2.75% of Pools Fund'],
    [5, '3.5% of Pools Fund'],
    [5.5, '1.5% of Pools Fund'],
    [6, '2.5% of Pools Fund'],
    [6.5, '2.5% of Pools Fund'],
    [7, 'Main Jackpot']
  ]);

  constructor() { }

  static init(callback) {

    if (PrizeChecker.prizeNumMap.size === 0) {
      // fetch all input data and store in map
      var prizeNums = document.getElementsByClassName('prize-num');
      var bonusNum = document.getElementsByClassName('bonus-num')[0];
  
      for (let i = 0; i < prizeNums.length; i++) {
        var num = prizeNums[i].value;
        if (!PrizeChecker.prizeNumMap.has('main')) {
          PrizeChecker.prizeNumMap.set('main', [num]);
        }
        else {
          let nums = PrizeChecker.prizeNumMap.get('main');
          PrizeChecker.prizeNumMap.set('main', [...nums, num]);
        }
      }
      PrizeChecker.prizeNumMap.set('bonus', bonusNum.value);
    } 
    // after data being stored, switch to next view 
    callback();
  }

  static generatePrizeResult(callback) {
    var result = new Map();

    // TODO: add bonus check
    var main_nums = NumberPool.numberPool;
    var winning_nums = PrizeChecker.prizeNumMap.get('main');
    main_nums.forEach(set => {
      // number of matching for each set
      var match = 0;
      set.forEach(num => {
        if (winning_nums.includes(num)) {
          match += 1;
        }
      });
      if (PrizeChecker.prizeMap.has(match)) {
        var prize = PrizeChecker.prizeMap.get(match);
        if (!result.has(prize)) {
          result.set(prize, 1);
        }
        else {
          let occurrence = result.get(prize);
          result.set(prize, occurrence + 1);
        }
      }
    })    
    callback(result);
  }

}