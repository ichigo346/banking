import React, { use } from 'react'
import Image from "next/image";
import { logoutAccount } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';


const Footer = ({ user, type = 'desktop' }: FooterProps) => {

    const router = useRouter();

    const handleLogOut = async () => {
        const loggedOut = await logoutAccount();

        if (loggedOut) router.push('/sign-in')
    }

    const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Adrian Hajdin';
    const displayEmail = user?.email || 'adrian@jsmastery.pro';

    return (
        <footer className="footer">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white border border-gray-100 p-1 shadow-xs overflow-hidden">
                <Image
                    src="/icons/jsm.svg"
                    width={32}
                    height={32}
                    alt="avatar"
                    className="size-full object-contain"
                />
            </div>

            <div className="flex flex-1 flex-col justify-center min-w-0">
                <h1 className="text-14 truncate text-gray-900 font-bold">
                    {displayName}
                </h1>
                <p className="text-12 truncate font-normal text-gray-500">
                    {displayEmail}
                </p>
            </div>

            <button
                type="button"
                onClick={handleLogOut}
                className="relative size-6 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                title="Logout"
            >
                <Image src="/icons/logout.svg" fill alt="logout" />
            </button>
        </footer>
    );
};

export default Footer