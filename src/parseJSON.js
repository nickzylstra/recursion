// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:

// NON FUNCTIONAL!!!!  not finished and may need to start from scratch
// Option 1: use multiple regex passes to clean and
// escape string into one that can be safely read using eval
// Option 2: recursion as outlined below
let parseJSON = function (json) {
  // your code goes here
  function isWhiteSpace(char) {
    // eslint-disable-next-line no-control-regex
    const whitespaceRE = RegExp('[\x20\x09\x0A\x0D]');
    return whitespaceRE.test(char);
  }

  function advanceIdxPastWhiteSpace(str, idx) {
    let curIdx = idx;
    let char = str[curIdx];

    while (isWhiteSpace(char)) {
      curIdx += 1;
      char = str[curIdx];
    }

    return curIdx;
  }

  function validateElemAndWhitespace(elemStr, elemStartIndex, elemLength, jsonString, jsonLength) {
    return (jsonString.slice(elemStartIndex, elemStartIndex + elemLength) === elemStr
    && advanceIdxPastWhiteSpace(jsonString, elemStartIndex + elemLength) === jsonLength);
  }

  const elementStartIndex = advanceIdxPastWhiteSpace(json, 0);
  const start = json[elementStartIndex];
  const jsonLen = json.length;

  // null
  if (start === 'n') {
    const elemLen = 4;
    if (validateElemAndWhitespace('null', elementStartIndex, elemLen, json, jsonLen)) return null;
  }

  // true
  if (start === 't') {
    const elemLen = 4;
    if (validateElemAndWhitespace('true', elementStartIndex, elemLen, json, jsonLen)) return true;
  }

  // false
  if (start === 'f') {
    const elemLen = 5;
    if (validateElemAndWhitespace('false', elementStartIndex, elemLen, json, jsonLen)) return false;
  }

  // number
  const numRE = RegExp('[-0-9]');
  if (numRE.test(start)) {
    // float precision?
    let numEndIdx = elementStartIndex;
    // validate characters are numerical, here or in eval below
    while (!isWhiteSpace(numEndIdx) || numEndIdx === jsonLen) {
      numEndIdx += 1;
    }
    if (advanceIdxPastWhiteSpace(numEndIdx) !== jsonLen) throw new SyntaxError();

    const numStr = json.slice(0, numEndIdx);
    const int = parseInt(numStr, 10);
    const float = parseFloat(numStr, 10);
    if (int === float) return int;
    if (Math.abs(int) < Math.abs(float)) return float;
  }

  // string
  // handle escaping
  if (start === '"') {
    // if double quote at end, return string
    // need to check for others?
    if (json[jsonLen - 1] === '"' && json[jsonLen - 2] !== '\\') {
      return json.slice(1, jsonLen - 1);
    }
  }

  // array
  if (start === '[') {
    const result = [];
    let idx = advanceIdxPastWhiteSpace(json, 1);
    let elStartIdx = idx;
    let delimOpenCount = 1;

    while (delimOpenCount !== 0 || idx === jsonLen) {
      const char = json[idx];

      if (char === ',') {
        if (idx === elStartIdx) throw new SyntaxError();
        if (delimOpenCount === 1) {
          // push current el
          result.push(parseJSON(json.slice(elStartIdx, idx)));
          elStartIdx = idx + 1;
        }
      } else if (char === '[') {
        delimOpenCount += 1;
      } else if (char === ']') {
        if (delimOpenCount === 1 && idx > 1) {
          // push last el
          result.push(parseJSON(json.slice(elStartIdx, idx)));
        }
        delimOpenCount -= 1;
        idx = advanceIdxPastWhiteSpace(json, idx + 1) - 1;
      }

      idx += 1;
    }

    if (idx === jsonLen) return result;
  }

  // object
  if (start === '{') {
    if (json[jsonLen - 1] !== '}') {
      throw new SyntaxError();
    }

    const result = {};
    let propStartIdx = 0;
    let propValueIdx;
    let idx = 1;
    let delimOpenCount = 0;

    while (delimOpenCount !== -1) {
      const char = json[idx];
      const nextChar = json[idx + 1];

      if (char === ',') {
        if (delimOpenCount === 1) {
          // add current property
          const key = json.slice(propStartIdx + 1, propValueIdx - 2);
          const value = parseJSON(json.slice(propValueIdx, idx));
          result[key] = value;
          idx = advanceIdxPastWhiteSpace(json, idx);
          propStartIdx = idx + 1;
        }
      } else if (char === ':') {
        if (delimOpenCount === 1 && json[idx - 1] === '"') {
          propValueIdx = idx + 1;
        }
      } else if (char === '{') {
        if (nextChar !== '"') {
          throw new SyntaxError();
        }
        delimOpenCount += 1;
      } else if (char === '}') {
        if (delimOpenCount === 1 && idx > 1) {
          // add last property
          const key = json.slice(propStartIdx + 1, propValueIdx - 2);
          const value = parseJSON(json.slice(propValueIdx, idx));
          result[key] = value;
        }
        idx = advanceIdxPastWhiteSpace(json, idx);
        delimOpenCount -= 1;
      }

      idx += 1;
    }

    if (idx === jsonLen) return result;
  }

  throw new SyntaxError(); // for invalid JSON
};
