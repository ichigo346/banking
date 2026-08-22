"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Info, Loader2, ShieldCheck, X } from "lucide-react";
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
    sharableId: z.string().min(8, "Please enter a valid receiver Sharable ID"),
});

type FormValues = z.infer<typeof formSchema>;

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
                throw new Error("Recipient account could not be found. Please check the Sharable ID.");
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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleInitiateTransfer)} className="flex flex-col">
                    {/* Source Bank Selection */}
                    <FormField
                        control={form.control}
                        name="senderBank"
                        render={() => (
                            <FormItem className="border-t border-gray-200">
                                <div className="payment-transfer_form-item pb-6 pt-5">
                                    <div className="payment-transfer_form-content">
                                        <FormLabel className="text-14 font-medium text-gray-700">
                                            Select Source Bank
                                        </FormLabel>
                                        <FormDescription className="text-12 font-normal text-gray-600">
                                            Select the bank account you want to transfer funds from
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

                    {/* Optional Note */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="border-t border-gray-200">
                                <div className="payment-transfer_form-item pb-6 pt-5">
                                    <div className="payment-transfer_form-content">
                                        <FormLabel className="text-14 font-medium text-gray-700">
                                            Transfer Note (Optional)
                                        </FormLabel>
                                        <FormDescription className="text-12 font-normal text-gray-600">
                                            Provide any reference or note for the recipient
                                        </FormDescription>
                                    </div>
                                    <div className="flex w-full flex-col">
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write a short note here (e.g. Monthly rent share)"
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

                    {/* Recipient Header */}
                    <div className="payment-transfer_form-details">
                        <h2 className="text-18 font-semibold text-gray-900">
                            Recipient details
                        </h2>
                        <p className="text-14 font-normal text-gray-600">
                            Enter the verified details of the recipient account
                        </p>
                    </div>

                    {/* Recipient Email */}
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

                    {/* Sharable ID */}
                    <FormField
                        control={form.control}
                        name="sharableId"
                        render={({ field }) => (
                            <FormItem className="border-t border-gray-200">
                                <div className="payment-transfer_form-item pb-5 pt-6">
                                    <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                                        Receiver&apos;s Plaid Sharable Id
                                    </FormLabel>
                                    <div className="flex w-full flex-col">
                                        <FormControl>
                                            <Input
                                                placeholder="Enter the recipient's public account ID"
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

                    {/* Amount */}
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem className="border-y border-gray-200">
                                <div className="payment-transfer_form-item py-5">
                                    <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                                        Amount ($ USD)
                                    </FormLabel>
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

                    {/* Processing Expectation Notice */}
                    <div className="mt-6 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-25/50 p-4 text-blue-900">
                        <Info className="size-5 text-bankGradient shrink-0" />
                        <p className="text-12 sm:text-14">
                            Transfers are processed securely via Dwolla ACH and typically take <strong>1-3 business days</strong> to settle.
                        </p>
                    </div>

                    {/* Action Button */}
                    <div className="payment-transfer_btn-box">
                        <Button type="submit" disabled={isLoading} className="payment-transfer_btn">
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> &nbsp; Processing...
                                </>
                            ) : (
                                "Review Transfer"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>

            {/* P1 Safeguard: High-Stakes Confirmation Modal */}
            {showConfirmation && pendingData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="size-6 text-bankGradient" />
                                <h3 className="text-18 font-semibold text-gray-900">Confirm Payment Transfer</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowConfirmation(false)}
                                disabled={isLoading}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X className="size-5" />
                            </button>
                        </div>

                        <div className="my-6 space-y-4">
                            <div className="rounded-lg bg-gray-25 p-4 space-y-3">
                                <div className="flex justify-between text-14">
                                    <span className="text-gray-500">Source Account:</span>
                                    <span className="font-medium text-gray-900">
                                        {selectedSenderAccount?.name || "Selected Bank"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-14">
                                    <span className="text-gray-500">Recipient Email:</span>
                                    <span className="font-medium text-gray-900">{pendingData.email}</span>
                                </div>
                                <div className="flex justify-between text-14">
                                    <span className="text-gray-500">Transfer Note:</span>
                                    <span className="font-medium text-gray-900">{pendingData.name || "None"}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-3 text-16 font-semibold">
                                    <span className="text-gray-700">Total Amount:</span>
                                    <span className="text-bankGradient font-ibm-plex-serif">
                                        ${Number(pendingData.amount).toFixed(2)} USD
                                    </span>
                                </div>
                            </div>

                            <p className="text-12 text-gray-500">
                                By confirming, you authorize Horizon to debit your source account for the amount specified. Once submitted, ACH transfers cannot be instantly canceled.
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
                                Edit Details
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
                    </div>
                </div>
            )}
        </>
    );
};

export default PaymentTransferForm;