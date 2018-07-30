import logger from "./logger";
import AutoStorage from "./auto-storage";
import { getType, cutting, parseObjectByString } from "./helper";

const REGEX = /(\.|\[|\])/g;

export function init($vm) {
  if (!$vm.$options.autoStorage) return;
  if (!$vm.$options.name) return;
  if ($vm.$autoStorage) return;

  $vm.$autoStorage = new AutoStorage($vm);

  recoveryData($vm);

  $vm.$nextTick(() => {
    addWatch($vm);
  });
}

export function destroy($vm) {
  if ($vm.$autoStorage) {
    $vm.$autoStorage.destroy();
    delete $vm.$autoStorage;
  }
}

/**
 * recovery data for [autoStorage]
 *
 * @export
 * @param {*} $vm Vue instance
 * @returns void
 */
function recoveryData($vm) {
  const autoStorage = $vm.$options.autoStorage;
  const type = getType(autoStorage);

  switch (type) {
    case "Array":
      for (const key of autoStorage) {
        const value = $vm.$autoStorage.recovery(key);
        if (value !== undefined) {
          recovery($vm, key, value);
        }
      }
      break;
    case "Object":
      break;
    default:
  }
}

function recovery($vm, key, value) {
  if (!REGEX.test(key)) {
    // non-nested variable
    logger.info("recovery", key, "[non-nested]");
    $vm[key] = value;
  } else {
    // nested variable, such as: "a.b.c", "a[1]"
    logger.info("recovery", key, "[nested]");
    const [parentKey, selfKey] = cutting(key);
    const parentObj = parseObjectByString($vm, parentKey);
    parentObj[selfKey] = value;
  }
}

/**
 * add watch for [autoStorage]
 *
 * @export
 * @param {object} $vm Vue instance
 * @returns void
 */
function addWatch($vm) {
  const autoStorage = $vm.$options.autoStorage;
  const type = getType(autoStorage);

  switch (type) {
    case "Array":
      for (const key of autoStorage) {
        if (typeof parseObjectByString($vm, key) === "undefined") continue;
        $vm.$autoStorage.watch(key);
      }
      break;
    case "Object":
      break;
    default:
  }
}