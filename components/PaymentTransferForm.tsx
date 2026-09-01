"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, HelpCircle, Info, Loader2, ShieldCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { decryptId, formatAmount } from "@/lib/utils";

import { BankDropdown } from "./BankDropdown";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    name: z.string().max(100, "Transfer note must be under 100 characters").optional(),
    amount: z.string().refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        { message: "Amount must be a positive number (e.g. 25.00)" }
    ),
    senderBank: z.string().min(1, "Please select a valid source bank account"),
    sharableId: z.string().min(8, "Please enter a valid recipient account ID"),
});

type FormValues = z.infer<typeof formSchema>;

/** Inline tooltip helper — shows a small question-mark with hover text */
const FieldHint = ({ text }: { text: string }) => (
    <span className="group relative inline-flex items-center ml-1.5 cursor-help">
        <HelpCircle className="size-3.5 text-gray-400 group-hover:text-bankGradient transition-colors" />
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-56 rounded-lg bg-gray-900 px-3 py-2 text-11 font-normal leading-4 text-white opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 z-50">
            {text}
        </span>
    </span>
);

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingData, setPendingData] = useState<FormValues | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            amount: "",
            senderBank: "",
            sharableId: "",
        },
    });

    // Step 1: Form validation success triggers the Confirmation Modal
    const handleInitiateTransfer = (data: FormValues) => {
        setErrorMessage(null);
        setPendingData(data);
        setShowConfirmation(true);
    };

    // Step 2: Final confirmation executes the transfer
    const handleConfirmTransfer = async () => {
        if (!pendingData) return;

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const receiverAccountId = decryptId(pendingData.sharableId);
            const receiverBank = await getBankByAccountId({
                accountId: receiverAccountId,
            });

            if (!receiverBank) {
                throw new Error("Recipient account could not be found. Please check the Account ID.");
            }

            const senderBank = await getBank({ documentId: pendingData.senderBank });

            if (!senderBank) {
                throw new Error("Selected source bank account is invalid or unlinked.");
            }

            const transferParams = {
                sourceFundingSourceUrl: senderBank.fundingSourceUrl,
                destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
                amount: pendingData.amount,
            };

            // Create Dwolla transfer
            const transfer = await createTransfer(transferParams);

            if (transfer) {
                const transaction = {
                    name: pendingData.name || "Payment Transfer",
                    amount: pendingData.amount,
                    senderId: senderBank.userId.$id,
                    senderBankId: senderBank.$id,
                    receiverId: receiverBank.userId.$id,
                    receiverBankId: receiverBank.$id,
                    email: pendingData.email,
                };

                const newTransaction = await createTransaction(transaction);

                if (newTransaction) {
                    form.reset();
                    setShowConfirmation(false);
                    router.push("/");
                }
            } else {
                throw new Error("Transfer processing failed. Please verify account balances and try again.");
            }
        } catch (error: any) {
            console.error("Submitting create transfer request failed: ", error);
            setErrorMessage(error?.message || "An unexpected error occurred while processing the transfer.");
            setShowConfirmation(false);
        } finally {
            setIsLoading(false);
        }
    };

    const selectedSenderAccount = accounts?.find(
        (acc) => acc.appwriteItemId === form.watch("senderBank") || acc.id === form.watch("senderBank")
    );

    return (
        <>
            {/* Step progress indicator */}
            <div className="mb-6 flex items-center gap-3 max-w-[850px]">
                <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full bg-bank-gradient text-11 font-semibold text-white">
                        1
                    </span>
                    <span className="text-13 font-medium text-gray-700">Fill Details</span>
                </div>
                <div className="h-px flex-1 bg-gray-200" />
                <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full border border-gray-300 text-11 font-semibold text-gray-400">
                        2
                    </span>
                    <span className="text-13 font-medium text-gray-400">Confirm &amp; Send</span>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleInitiateTransfer)} className="flex flex-col">

                    {/* 1. Source Bank Selection */}
                    <FormField
                        control={form.control}
                        name="senderBank"
                        render={() => (
                            <FormItem className="border-t border-gray-200">
                                <div className="payment-transfer_form-item py-5">
                                    <div className="payment-transfer_form-content">
                                        <FormLabel className="text-14 font-medium text-gray-700">
                                            Source Bank Account
                                        </FormLabel>
                                        <FormDescription className="text-12 font-normal text-gray-600">
                                            Select the account to transfer funds from
                                        </FormDescription>
                                    </div>
                                    <div className="flex w-full flex-col">
                                        <FormControl>
                                            <BankDropdown
                                                accounts={accounts}
                                                setValue={form.setValue}
                                                otherStyles="!w-full"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-12 text-red-500" />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Recipient section header */}
                    <div className="payment-transfer_form-details">
                        <h2 className="text-18 font-semibold text-gray-900">
                            Recipient details
                        </h2>
                        <p className="text-14 font-normal text-gray-600">
                            Enter the verified details of the recipient account
                        </p>
                    </div>

                    {/* 2. Recipient Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="border-t border-gray-200">
                                <div className="payment-transfer_form-item py-5">
                                    <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                                        Recipient&apos;s Email Address
                                    </FormLabel>
                                    <div className="flex w-full flex-col">
                                        <FormControl>
                                            <Input
                                                placeholder="ex: johndoe@gmail.com"
                                                className="input-class"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-12 text-red-500" />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* 3. Recipient Account ID (was: Plaid Sharable ID) */}
                    <FormField
                        control={form.control}
                        name="sharableId"
                        render={({ field }) => (
                            <FormItem className="border-t border-gray-200">
                                <div className="payment-transfer_form-item py-5">
                                    <div className="payment-transfer_form-content">
                                        <FormLabel className="text-14 font-medium text-gray-700 flex items-center">
                                            Recipient&apos;s Account ID
                                            <FieldHint text="Ask the recipient to share their Account ID from their Horizon profile page. It starts with a letter and is 8+ characters long." />
                                        </FormLabel>
                                        <FormDescription className="text-12 font-normal text-gray-600">
                                            The recipient can find this in their profile settings
                                        </FormDescription>
                                    </div>
                                    <div className="flex w-full flex-col">
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the recipient's account ID"
                                                className="input-class"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-12 text-red-500" />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* 4. Amount */}
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem className="border-t border-gray-200">
                                <div className="payment-transfer_form-item py-5">
                                    <div className="payment-transfer_form-content">
                                        <FormLabel className="text-14 font-medium text-gray-700 flex items-center">
                                            Amount (USD)
                                            <FieldHint text="Enter the exact amount you want to send. Transfers settle in 1–3 business days via ACH." />
                                        </FormLabel>
                                        {selectedSenderAccount && (
                                            <p className="text-12 font-normal text-success-600">
                                                Available: {formatAmount(selectedSenderAccount.currentBalance)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex w-full flex-col">
                                        <FormControl>
                                            <Input
                                                placeholder="ex: 50.00"
                                                className="input-class"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-12 text-red-500" />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* 5. Transfer Note (Optional) — moved to end */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="border-t border-gray-200">
                                <div className="payment-transfer_form-item py-5">
                                    <div className="payment-transfer_form-content">
                                        <FormLabel className="text-14 font-medium text-gray-700">
                                            Transfer Note <span className="font-normal text-gray-400">(Optional)</span>
                                        </FormLabel>
                                        <FormDescription className="text-12 font-normal text-gray-600">
                                            A short note for the recipient
                                        </FormDescription>
                                    </div>
                                    <div className="flex w-full flex-col">
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g. Monthly rent — August"
                                                className="input-class"
                                                disabled={isLoading}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-12 text-red-500" />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                            <AlertCircle className="size-5 shrink-0 text-red-500 mt-0.5" />
                            <div className="text-14">
                                <p className="font-semibold">Transfer Error</p>
                                <p>{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Processing Notice */}
                    <div className="mt-6 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-25/20 p-4 text-blue-900">
                        <Info className="size-5 text-bankGradient shrink-0" />
                        <p className="text-12 sm:text-14">
                            Transfers settle securely in <strong>1–3 business days</strong> via ACH. Once confirmed, they cannot be instantly reversed.
                        </p>
                    </div>

                    {/* Submit */}
                    <div className="payment-transfer_btn-box">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="w-full"
                        >
                            <Button type="submit" disabled={isLoading} className="payment-transfer_btn">
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" /> &nbsp; Processing...
                                    </>
                                ) : (
                                    "Review Transfer →"
                                )}
                            </Button>
                        </motion.div>
                    </div>
                </form>
            </Form>

            {/* Step 2 Confirmation Modal */}
            <AnimatePresence>
                {showConfirmation && pendingData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        aria-modal="true"
                        role="dialog"
                        aria-labelledby="confirm-transfer-title"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 8 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8"
                        >
                            {/* Step 2 progress in modal header */}
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="size-6 text-bankGradient" />
                                    <h3 id="confirm-transfer-title" className="text-18 font-semibold text-gray-900">
                                        Confirm Payment Transfer
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmation(false)}
                                    disabled={isLoading}
                                    aria-label="Close confirmation dialog"
                                    className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Step pip — Step 2 of 2 */}
                            <div className="mt-4 mb-5 flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-5 text-success-600" />
                                    <span className="text-12 font-medium text-success-600">Details filled</span>
                                </div>
                                <div className="h-px flex-1 bg-gray-200" />
                                <div className="flex items-center gap-2">
                                    <span className="flex size-5 items-center justify-center rounded-full bg-bank-gradient text-10 font-semibold text-white">
                                        2
                                    </span>
                                    <span className="text-12 font-semibold text-gray-700">Confirm &amp; Send</span>
                                </div>
                            </div>

                            <div className="mb-6 space-y-4">
                                <div className="rounded-lg bg-gray-25 p-4 space-y-3">
                                    <div className="flex justify-between text-14">
                                        <span className="text-gray-500">Source Account:</span>
                                        <span className="font-medium text-gray-900">
                                            {selectedSenderAccount?.name || "Selected Bank"}
                                        </span>
                                    </div>
                                    {selectedSenderAccount && (
                                        <div className="flex justify-between text-14">
                                            <span className="text-gray-500">Available Balance:</span>
                                            <span className="font-medium text-success-600">
                                                {formatAmount(selectedSenderAccount.currentBalance)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-14">
                                        <span className="text-gray-500">Recipient Email:</span>
                                        <span className="font-medium text-gray-900">{pendingData.email}</span>
                                    </div>
                                    {pendingData.name && (
                                        <div className="flex justify-between text-14">
                                            <span className="text-gray-500">Transfer Note:</span>
                                            <span className="font-medium text-gray-900">{pendingData.name}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t border-gray-200 pt-3 text-16 font-semibold">
                                        <span className="text-gray-700">Total Amount:</span>
                                        <span className="text-bankGradient font-ibm-plex-serif">
                                            ${Number(pendingData.amount).toFixed(2)} USD
                                        </span>
                                    </div>
                                </div>

                                <p className="text-12 text-gray-500">
                                    By confirming, you authorize Horizon to debit your source account for the amount specified. ACH transfers cannot be instantly canceled once submitted.
                                </p>
                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowConfirmation(false)}
                                    disabled={isLoading}
                                    className="w-full sm:w-auto"
                                >
                                    ← Edit Details
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmTransfer}
                                    disabled={isLoading}
                                    className="w-full bg-bank-gradient font-semibold text-white sm:w-auto"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin mr-2" />
                                            Sending Transfer...
                                        </>
                                    ) : (
                                        "Confirm & Send"
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PaymentTransferForm;