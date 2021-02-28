 
 export class NumberPool {

  static numberPool = [];
  static bonusPool = [];

  static pushNumberSetToPool(set, type) {
    var _set = [];
    for (let i = 0; i < set.length; i++) {
      _set.push(set[i].value);
    }
    if (type === 'main'){
      NumberPool.numberPool.push(_set);
    }
    else if (type === 'bonus') {
      NumberPool.bonusPool.push(_set);
    }
  }
 }