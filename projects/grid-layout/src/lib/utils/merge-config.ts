export function mergeConfig(target: any, source: any): any {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            if (source[key] instanceof Object && !Array.isArray(source[key])) {
                if (!target[key]) {
                    target[key] = {};
                }
                mergeConfig(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
    return target;
}
