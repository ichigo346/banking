'use client';

import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, Variants } from 'framer-motion'

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

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

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
        <motion.section
            className='auth-form'
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.header variants={itemVariants} className='flex flex-col gap-5 md:8'>
                <Link href="/" className="cursor-pointer flex items-center gap-1 group">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Image
                            src="/icons/logo.svg"
                            width={34}
                            height={34}
                            alt="horizon Logo"
                        />
                    </motion.div>
                    <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1 transition-colors group-hover:text-bankGradient">Horizon</h1>
                </Link>

                <div className='flex flex-col gap-1 md:gap-3'>
                    <h1 className='text-24 lg:text-36 font-semi-bold text-gray-900'>
                        {user
                            ? 'Link Account'
                            : type === 'sign-in'
                                ? 'Sign In'
                                : 'Sign Up'
                        }
                    </h1>
                    <p className='text-16 font-normal text-gray-600'>
                        {user
                            ? 'Link your account to get started'
                            : 'Please enter your details to continue'
                        }
                    </p>
                </div>
            </motion.header>

            {user ? (
                <motion.div variants={itemVariants} className="flex flex-col gap-4">
                    <PlaidLink user={user} variant="primary" />
                </motion.div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {type === 'sign-up' && (
                                <motion.div variants={itemVariants} className="space-y-4">
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
                                        <CustomInput control={form.control} name='dateofBirth' label="Date of Birth" placeholder='YYYY-MM-DD' />
                                        <CustomInput control={form.control} name='ssn' label="SSN" placeholder='Last 4 digits: e.g. 1234' />
                                    </div>
                                </motion.div>
                            )}

                            <motion.div variants={itemVariants} className="space-y-4">
                                <CustomInput control={form.control} name='email' label="Email" placeholder='Enter your email' />
                                <CustomInput control={form.control} name='password' label="Password" placeholder='Enter your password' />
                            </motion.div>

                            <motion.div variants={itemVariants} className='flex flex-col gap-4'>
                                <AnimatePresence>
                                    {errorMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, y: -6 }}
                                            animate={{ opacity: 1, height: "auto", y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -6 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-14 font-medium text-red-600">
                                                {errorMessage}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <Button type="submit" disabled={isLoading} className="form-btn w-full">
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" /> &nbsp; Loading...
                                            </>
                                        ) : type === "sign-in"
                                            ? 'Sign In' : 'Sign Up'}
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </form>

                        <motion.footer variants={itemVariants} className="flex justify-center gap-1 pt-2">
                            <p className='text-14 font-normal text-gray-600'>
                                {type === 'sign-in'
                                    ? "Don't have an account?"
                                    : "Already have an account?"
                                }</p>
                            <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link font-semibold transition-all hover:underline">
                                {type === 'sign-in' ? 'Sign up' : 'Sign in'}
                            </Link>
                        </motion.footer>
                    </Form>
                </>
            )}
        </motion.section>
    )
}

export default AuthForm
