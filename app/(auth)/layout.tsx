import AuthHeroAsset from "@/components/AuthHeroAsset";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex min-h-screen w-full justify-between font-inter">
            {children}
            <div className="auth-asset">
                <AuthHeroAsset />
            </div>
        </main>
    );
}

