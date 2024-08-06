import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Divider
} from "@nextui-org/react";
import { Button } from "@/components/ui/button";
export default function Footer() {
    return (
        <Navbar
            maxWidth="2xl"
            className="py-2"
            classNames={{
                wrapper: 'flex flex-col items-start justify-between',
                base: 'bg-layout-background'
            }}
        >
            <Divider />
            <NavbarContent>
                <p className="text-default-500 font-medium text-xs">Copyright © 2024 AUCY</p>
            </NavbarContent>
        </Navbar>
    );
}
