import { getAuction } from "@/entry-functions";
import { Provider } from "./components/Provider";

export default async function Page({ params }: { params: { id: string } }) {
    const auction = await getAuction(params.id);
    return <Provider {...auction} />;
}