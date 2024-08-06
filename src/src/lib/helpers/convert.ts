/**
 * Convert snake_case to camelCase
 * @param str - The string to convert
 * @returns The camelCase string
 */
function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Convert object keys from snake_case to camelCase
 * @param obj - The object to convert
 * @returns The object with camelCase keys
 */
export function keysToCamelCase<T>(obj: any): T {
    if (Array.isArray(obj)) {
        return obj.map(v => keysToCamelCase(v)) as T;
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            result[toCamelCase(key)] = keysToCamelCase(obj[key]);
            return result;
        }, {} as any);
    }
    return obj;
}