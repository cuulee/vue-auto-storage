export function canWriteStorage(storage) {
  try {
    storage.setItem("@@", 1);
    if (storage.getItem("@@") !== 1) {
      return false;
    }
    storage.removeItem("@@");
    return true;
  } catch (e) {
    return false;
  }
}

export function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

export function debounce(fn, delay = 300) {
  let timer;

  return function(...args) {
    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * Cut object string
 *
 * @export
 * @param {string} string The Object string key need cut.
 * @returns {array} [parentStringKey, selfStringKey]
 * @example
 *
 * cuttingKeyPath("a.b.c")
 * // => ["a.b", "c"]
 *
 * cuttingKeyPath("a.b[3]")
 * // => ["a.b", "3"]
 */
export function cuttingKeyPath(string) {
  const REGEX = /(\[\w+\])$/g;
  if (REGEX.test(string)) {
    // such as: "a.b[1]"
    const index = string.lastIndexOf("[");

    return [string.slice(0, index), string.slice(index + 1, -1)];
  } else {
    // such as: "a.b.c"
    const index = string.lastIndexOf(".");
    return [string.slice(0, index), string.slice(index + 1)];
  }
}

/**
 * Convert path to simple dot-delimited paths
 *
 * @param {string} path The path of the property to get.
 * @returns {string} Returns the resolved value.
 * @example Converted path.
 *
 * dotify("a.b[3]")
 * // => "a.b.c"
 *
 * dotify("[0]")
 * // => "0"
 */
export function dotify(path) {
  path = path.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  path = path.replace(/^\./, ""); // strip a leading dot
  return path;
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @param {Object} object The object to query.
 * @param {string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * const object = { 'a': [{ 'b': { 'c': 3 } }] }
 *
 * get(object, 'a[0].b.c')
 * // => 3
 *
 * get(object, ['a', '0', 'b', 'c'])
 * // => 3
 *
 * get(object, 'a.b.c', 'default')
 * // => 'default'
 */
export function parseObjectByKeyPath(object, path, defaultValue) {
  path = dotify(path);

  const pathArr = path.split(".");

  for (const value of pathArr) {
    if (value in object) {
      object = object[value];
    } else {
      return defaultValue;
    }
  }

  return object;
}
