'use client';

import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from './CustomInput';
import { authFormSchema } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions';
import PlaidLink from './PlaidLink';

const AuthForm = ({ type }: { type: string }) => {
    const router = useRouter();
    const [user, SetUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const formSchema = authFormSchema(type);

    //Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: '',
            firstName: '',
            lastName: '',
            address1: '',
            city: '',
            state: '',
            postalCode: '',
            dateofBirth: '',
            ssn: ''
        },
    })


    //2.Define a submit handler
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            // sign up with Appwrite & create a plain link token
            if (type === 'sign-up') {
                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    address1: data.address1!,
                    city: data.city!,
                    state: data.state!,
                    postalCode: data.postalCode!,
                    dateOfBirth: data.dateofBirth!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password,
                }


                const newUser = await signUp(userData);

                SetUser(newUser);
            }

            if (type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password,
                })

                if (response) router.push('/')
            }
        } catch (error: any) {
            console.log(error);
            const msg = error?.message || '';
            const responseStr = error?.response || '';
            if (msg.includes('Invalid credentials') || msg.includes('401') || msg.includes('user_invalid_credentials')) {
                setErrorMessage('Invalid email or password. Please try again.');
            } else if (responseStr.includes('Ssn invalid') || msg.includes('Ssn')) {
                setErrorMessage('Sign-up failed: SSN must be exactly 4 digits (last 4 of your Social Security Number, e.g. 1234).');
            } else if (responseStr.includes('State must') || msg.includes('State must')) {
                setErrorMessage('Sign-up failed: State must be a 2-letter abbreviation (e.g. NY, CA, TX).');
            } else if (msg.includes('Dwolla') || msg.includes('ValidationError') || msg.includes('State must be')) {
                setErrorMessage('Sign-up failed: check your State (2-letter code) and SSN (last 4 digits).');
            } else if (msg.includes('already exists') || msg.includes('409') || msg.includes('user_already_exists')) {
                setErrorMessage('An account with this email already exists. Please sign in instead.');
            } else {
                setErrorMessage('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <section className='auth-form'>
            <header className='flex flex-col gap-5 md:8'>
                <Link href="/" className="cursor-pointer flex items-center gap-1">
                    <Image
                        src="/icons/logo.svg"
                        width={34}
                        height={34}
                        alt="horizon Logo"
                    />
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Horizon</h1>
                </Link>

                <div className='flex flex-col gap-1 md:gap-3'>
                    <h1 className='text-24 lg:text-36 font-semi-bold text-gray-900'>
                        {user
                            ? 'Link Account'
                            : type === 'sign-in'
                                ? 'Sign-In'
                                : 'Sign-Up'
                        }
                    </h1>
                    <p className='text-16 font-normal text-gray-600'>
                        {user
                            ? 'Link your account to get sarted'
                            : 'please enter your details'
                        }
                    </p>
                </div>
            </header>
            {user ? (
                <div className="flex flex-col gap-4">
                    <PlaidLink user={user} variant="primary" />
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {type === 'sign-up' && (
                                <>
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} name='firstName' label="First Name" placeholder='Enter your First Name' />
                                        <CustomInput control={form.control} name='lastName' label="Last Name" placeholder='Enter your Last Name' />
                                    </div>
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} name='address1' label="Address" placeholder='Enter your specific address' />
                                        <CustomInput control={form.control} name='city' label="City" placeholder='Enter your specific city' />
                                    </div>

                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} name='state' label="State" placeholder='2-letter code: NY, CA, TX' />
                                        <CustomInput control={form.control} name='postalCode' label="Postal Code" placeholder='Example: 22202' />
                                    </div>
                                    <div className="flex gap-4">
                                        <CustomInput control={form.control} name='dateofBirth' label="Date of Birth" placeholder='YYY-MM-DD' />
                                        <CustomInput control={form.control} name='ssn' label="SSN" placeholder='Last 4 digits: e.g. 1234' />
                                    </div>
                                </>
                            )}

                            <CustomInput control={form.control} name='email' label="Email" placeholder='Enter your email'
                            />
                            <CustomInput control={form.control} name='password' label="Password" placeholder='Enter your password'
                            />

                            <div className='flex flex-col gap-4'>
                                {errorMessage && (
                                    <p className="text-14 font-normal text-red-500">{errorMessage}</p>
                                )}
                                <Button type="submit" disabled={isLoading} className="form-btn">
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                                        </>
                                    ) : type === "sign-in"
                                        ? 'Sign-in' : 'Sign-up'}
                                </Button>
                            </div>
                        </form>

                        <footer className="flex justify-center gap-1">
                            <p className='text-14 font-normal text-gary-600'>
                                {type === 'sign-in'
                                    ? "Dont have an account?"
                                    : "Already have an account?"
                                }</p>
                            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
                                {type === 'sign-in' ? 'sign-up' : 'sign-in'}
                            </Link>
                        </footer>
                    </Form>
                </>
            )}
        </section>
    )
}

export default AuthForm
