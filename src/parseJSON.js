// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
let parseJSON = function (json) {
  // your code goes here
  const start = json[0];
  const numRE = RegExp('[-0-9]');
  const jsonLen = json.length;

  // null
  if (start === 'n') {
    if (json === 'null') return null;
    throw new SyntaxError();
  }

  // true
  if (start === 't') {
    if (json === 'true') return true;
    throw new SyntaxError();
  }

  // false
  if (start === 'f') {
    if (json === 'false') return false;
    throw new SyntaxError();
  }

  // number
  if (numRE.test(start)) {
    // float precision?
    const int = parseInt(json.slice(0, jsonLen), 10);
    const float = parseFloat(json.slice(0, jsonLen), 10);
    if (int === float) return int;
    if (Math.abs(int) < Math.abs(float)) return float;

    throw new SyntaxError();
  }

  // string
  if (start === '"') {
    // if double quote at end, return string
    // need to check for others?
    if (json[jsonLen - 1] === '"') {
      return json.slice(1, jsonLen - 1);
    }

    throw new SyntaxError();
  }

  // array
  if (start === '[') {
    if (json[jsonLen - 1] !== ']') {
      throw new SyntaxError();
    }

    const result = [];
    let elStartIdx = 1;
    let idx = 1;
    // const delimOpens = [0];
    // let delimOpensLen = delimOpens.length;
    let delimOpenCount = 1;
    // would this have correct scope?
    /* const pushEl = function pushEl() {
      result.push(parseJSON(json.slice(elStartIdx, idx)));
    }; */

    while (delimOpenCount !== 0) {
      const char = json[idx];
      // delimOpenCount = delimOpens.length;

      if (char === ',' && json[idx + 1] === ' ') {
        if (delimOpenCount === 1) {
          // push current el
          result.push(parseJSON(json.slice(elStartIdx, idx)));
          elStartIdx = idx + 2;
          idx += 1;
        }
      } else if (char === '[') {
        // delimOpens.push(idx);
        delimOpenCount += 1;
      } else if (char === ']') {
        if (delimOpenCount === 1) {
          // push last el
          result.push(parseJSON(json.slice(elStartIdx, idx)));
        }
        // delimOpens.pop();
        delimOpenCount -= 1;
      }

      idx += 1;
    }

    // if and error throw may not be neccesary
    if (idx === jsonLen) return result;
    throw new SyntaxError();
  }

  // object
  if (start === '{') {
    throw new SyntaxError();
  }

  throw new SyntaxError(); // for invalid JSON
};
