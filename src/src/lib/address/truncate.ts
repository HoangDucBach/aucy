export function truncateAddress(address: string, chars = 4) {
    if (!address) return '';
    // Check evm address
    if (address.startsWith('0x')) {
        return `${address.slice(0, chars + 2)}...${address.slice(-chars
        )}`;
    }
    return address;
}