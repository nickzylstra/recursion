// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

let stringifyJSON = function (obj) {
  let str = '';
  const objType = typeof obj;

  if (obj === null || obj === Infinity) {
    str += 'null';
  } else if (objType === 'string') {
    str += `"${obj}"`;
  } else if (objType === 'number' || objType === 'boolean') {
    if (Number.isNaN(obj)) {
      str += 'null';
    } else {
      str += `${obj}`;
    }
  } else if (Array.isArray(obj)) {
    str += '[';

    const len = obj.length;
    for (let i = 0; i < len; i += 1) {
      const el = obj[i];

      const elType = typeof el;
      if (elType === 'undefined' || elType === 'function' || elType === 'symbol') {
        str += 'null';
      } else {
        str += stringifyJSON(el);
      }

      if (i < len - 1) {
        str += ',';
      }
    }

    str += ']';
  } else if (objType === 'object') {
    str += '{';

    const keys = Object.keys(obj);
    const len = keys.length;
    for (let i = 0; i < len; i += 1) {
      const key = keys[i];
      const val = obj[key];
      const valType = typeof val;
      if (valType === 'undefined' || valType === 'function' || valType === 'symbol') {
        str += '';
      } else {
        str += `${stringifyJSON(key)}:${stringifyJSON(val)}`;
        if (i < len - 1) {
          str += ',';
        }
      }
    }

    str += '}';
  }

  return str;
};
