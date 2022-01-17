const cacheData = {
  'test 1': {
    name: 'test 1',
    [Symbol.for('timeLive')]: 8_000,
    [Symbol.for('dateCreate')]: Date.now()
  },
  'test 2': {
    name: 'test 2',
    [Symbol.for('dateCreate')]: Date.now()
  },
};

const handler = {
  get(target, prop) {
    if ( target[prop] ) {
      const date = Date.now();
      const timeLive = target[prop][Symbol.for('timeLive')];
      const dateCreate = target[prop][Symbol.for('dateCreate')];

      if ( timeLive && (date - dateCreate > timeLive) ) {
        delete target[prop];
      }
    }

    if ( typeof target[prop] === 'object' && target[prop] !== null ) {
      return new Proxy(target[prop], handler);
    }
  },

  set(target, prop, value) {
    if ( typeof value !== 'object' ) {
      value = {
        value,
      };
    }
    if ( !target[prop] ) {
      value[Symbol.for('dateCreate')] = Date.now();
      target[prop] = value;
    } else {
      const date = Date.now();
      const timeLive = target[prop][Symbol.for('timeLive')];
      const dateCreate = target[prop][Symbol.for('dateCreate')];

      if ( timeLive && (date - dateCreate > timeLive) ) {
        delete target[prop];
      }
    }


    if ( target[prop] && value.timeLive ) {
      target[prop][Symbol.for('timeLive')] = value.timeLive;
      delete target[prop].timeLive;
    }

    if (prop === 'timeLive' ) {
      target[Symbol.for('dateCreate')] = Date.now();
      target[Symbol.for('timeLive')] = value;
      delete target.timeLive;
    }

    return true;
  },
};

const cache = new Proxy(cacheData, handler);
cache['test 3'] = {
  a: 2,
  timeLive: 4_000
};
cache['test 2'].timeLive = 4_000;
console.log(cache);

