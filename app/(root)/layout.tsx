import CommandPaletteWrapper from "@/components/CommandPaletteWrapper";
import MobileNav from "@/components/MobileNav";
import PageTransition from "@/components/PageTransition";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const loggedIn = await getLoggedInUser();

    if (!loggedIn) redirect("/sign-in");

    return (
        <CommandPaletteWrapper>
            <main className="flex h-screen w-full font-inter">
                <Sidebar user={loggedIn} />

                <div className="flex size-full flex-col">
                    <div className="root-layout">
                        <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
                        <div>
                            <MobileNav user={loggedIn} />
                        </div>
                    </div>
                    <PageTransition className="flex-1 overflow-hidden">
                        {children}
                    </PageTransition>
                </div>
            </main>
        </CommandPaletteWrapper>
    );
}

