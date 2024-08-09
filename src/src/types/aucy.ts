export type TAuctionCreation = {
    name?: string;
    description?: string;
    tokenAddress?: string;
    tokenId?: number;
    topicId?: string;
    startingPrice?: number;
    minBidIncrement?: number;
    endingPrice?: number;
    endingAt?: number;
    receivers?: string[];
    percentages?: number[];
}

/**
 * Auction type
 * @param name - The name of the auction
 * @param description - The description of the auction
 * @param seller - The address of the seller    
 * @param tokenAddress - The address of the token
 * @param tokenId - The ID of the token
 * @param startingPrice - The starting price of the auction
 * @param minBidIncrement - The minimum bid increment
 * @param endingPrice - The ending price of the auction
 * @param startedAt - The time the auction started
 * @param endingAt - The time the auction ends
 * @param endedAt - The time the auction ended
 * @param highestBid - The highest bid
 * @param highestBidder - The address of the highest bidder
 * @param donation - The number of donations
 * @param receivers - The addresses of the receivers
 * @param percentages - The percentages of the receivers
 */
export type TAuction = {
    id?: string
    topicId?: string;
    name?: string;
    description?: string;
    seller?: string;
    tokenAddress?: string;
    tokenId?: BigInt;
    startingPrice?: BigInt;
    minBidIncrement?: BigInt;
    endingPrice?: BigInt;
    startedAt?: BigInt;
    endingAt?: BigInt;
    endedAt?: BigInt;
    highestBid?: BigInt;
    highestBidder?: string;
    donation?: BigInt;
    receivers?: string[];
    percentages?: number[];
}

/**
 * Bid type
 * @param bidder - The address of the bidder
 * @param auctionId - The ID of the auction
 * @param amount - The amount of the bid
 * @param timestamp - The time of the bid
 */
export type TBid = {
    bidder?: string;
    auctionId?: string;
    amount?: BigInt;
    timestamp?: BigInt;
}

/**
 * Receiver type
 * @param address - The address of the receiver
 * @param percentage - The percentage of the receiver
 */
export type TReceiver = {
    address?: string;
    percentage?: number | BigInt;
}