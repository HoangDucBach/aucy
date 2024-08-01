export type TAuctionCreation = {
    tokenId: string;
    startingPrice: number;
    endingPrice: number;
    bidPeriod: number;
    duration: number;
}

export type TAuction = {
    seller: string;
    tokenId: string;
    startingPrice: number;
    endingPrice: number;
    bidPeriod: number;
    duration: number;
    startedAt: number;
    highestBid: string;
    highestBidder: string;
}