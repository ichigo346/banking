'use client';

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/navigation';
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';
import Image from 'next/image';

/**
 * Inner component that only mounts (and therefore only loads the Plaid SDK
 * script) once the user has explicitly clicked "Add Bank". Keeping it
 * separate means usePlaidLink is never called during SSR or before the user
 * has interacted — eliminating the duplicate-script warning that occurs when
 * two PlaidLink instances are mounted at the same time (e.g. Sidebar + AuthForm).
 */
const PlaidLinkOpener = ({
    token,
    onSuccess,
    onClose,
}: {
    token: string;
    onSuccess: PlaidLinkOnSuccess;
    onClose: () => void;
}) => {
    const config: PlaidLinkOptions = {
        token,
        onSuccess: (public_token: string, metadata) => {
            onSuccess(public_token, metadata);
            onClose();
        },
        onExit: () => {
            onClose();
        },
    };
    const { open, ready } = usePlaidLink(config);

    // Open immediately once the SDK is ready
    useEffect(() => {
        if (ready) open();
    }, [ready, open]);

    // Render nothing — the button has already been clicked
    return null;
};

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [isOpening, setIsOpening] = useState(false);

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        await exchangePublicToken({ publicToken: public_token, user });
        router.push('/');
    }, [user, router]);

    const handleClose = useCallback(() => {
        setIsOpening(false);
        setToken('');
    }, []);

    const handleClick = async () => {
        if (isOpening) return;
        setIsOpening(true);
        try {
            // Fetch the link token lazily — only when the user actually clicks
            const data = await createLinkToken(user);
            if (data?.linkToken) {
                setToken(data.linkToken);
            } else {
                setIsOpening(false);
            }
        } catch {
            setIsOpening(false);
        }
    };

    return (
        <>
            {/* Render the opener only after the user clicks AND we have a token */}
            {isOpening && token && (
                <PlaidLinkOpener
                    token={token}
                    onSuccess={onSuccess}
                    onClose={handleClose}
                />
            )}

            {variant === 'primary' ? (
                <Button
                    onClick={handleClick}
                    className="plaidlink-primary"
                    disabled={isOpening}
                >
                    Connect bank
                </Button>
            ) : variant === 'ghost' ? (
                <Button onClick={handleClick} variant="ghost" className="plaidlink-ghost" disabled={isOpening}>
                    <Image
                        src="/icons/connect-bank.svg"
                        alt="connect bank"
                        width={24}
                        height={24}
                    />
                    <p className="hidden text-16 font-semibold text-black-2 xl:block">Connect bank</p>
                </Button>
            ) : (
                <Button onClick={handleClick} className="plaidlink-default" disabled={isOpening}>
                    <Image
                        src="/icons/connect-bank.svg"
                        alt="connect bank"
                        width={24}
                        height={24}
                    />
                    <p className="text-16 font-semibold text-black-2">Connect bank</p>
                </Button>
            )}
        </>
    );
};

export default PlaidLink;
