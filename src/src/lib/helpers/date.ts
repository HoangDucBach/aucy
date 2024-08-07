export function checkIsExpired(timestamp: number): boolean {
    return timestamp < Date.now();
}