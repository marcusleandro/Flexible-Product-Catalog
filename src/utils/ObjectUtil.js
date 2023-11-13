class ObjectUtil {
  constructor() {
    throw new Error("This class can't be instantiated!");
  }

  static removeCiclesFromObject(object) {
    const seen = new WeakSet();
    return JSON.parse(
      JSON.stringify(object, (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      })
    );
  }

  static clean(object) {
    for (const propName in object) {
      if (object[propName] === null || object[propName] === undefined) {
        delete object[propName];
      }
    }
    return object;
  }
}

module.exports = ObjectUtil;
