// External imports


// Internal imports
import { Metadata } from "next";
import AuctionsContainer from "./components/AuctionsContainer";
import Main from "./Main";

const metadata : Metadata = {
    title: "Dashboard | Aucy",
    description: "Aucy - NFT Auction Marketplace",
};
export default async function Page() {
    return (
        <Main />
    )
}