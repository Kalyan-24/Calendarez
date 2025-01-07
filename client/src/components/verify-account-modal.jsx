import React, { useContext } from "react";
import { IoAlertCircle } from "react-icons/io5";
import axios from "axios";
import { toast } from "sonner";
import { LucideX } from "lucide-react";

import { Context } from "@/pages/app";

import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";

const VerifyAccountModal = ({ from, handleOpenChange }) => {
	const { isLoading, setIsLoading } = useContext(Context);

	const handleVerify = async () => {
		setIsLoading(true);
		try {
			const verifyAccountResponse = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/verify-account`,
				{ type: "verify-account" },
				{
					withCredentials: true,
				}
			);

			if (verifyAccountResponse.data.status === "Success") {
				toast.success(verifyAccountResponse.data.message);
				handleOpenChange(null, false);
			} else if (verifyAccountResponse.data.status === "Error") {
				toast.error(verifyAccountResponse.data.error);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{from !== "delete" ? (
				<DialogContent className="lg:max-w-[500px] md:max-w-[500px] sm:max-w-[425px]">
					<div className="flex items-center justify-center -mb-3">
						<IoAlertCircle className="text-red-500 text-5xl" />
					</div>
					<DialogHeader>
						<DialogTitle className="text-3xl font-bold flex items-center justify-center gap-6 text-red-500">
							Account not Verified
						</DialogTitle>

						<DialogDescription className="text-sm text-center"></DialogDescription>
					</DialogHeader>

					<div className="text-sm text-center">
						Your account is not yet verified. Please check your
						email for a verification link.
					</div>

					<div className="flex items-center justify-center">
						<Separator className="w-1/3 bg-muted-foreground" />
						<span className="text-sm text-muted-foreground mx-5">
							or
						</span>
						<Separator className="w-1/3 bg-muted-foreground" />
					</div>

					<DialogFooter className={"!flex-col"}>
						<div className="flex items-center justify-between">
							<Button
								className="text-sm w-full bg-blue-500 hover:bg-blue-500/90"
								disabled={isLoading}
								onClick={handleVerify}
							>
								Resend Verification Email
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			) : (
				<AlertDialogContent className="lg:max-w-[500px] md:max-w-[500px] sm:max-w-[425px]">
					<div className="flex items-center justify-center -mb-3">
						<IoAlertCircle className="text-red-500 text-5xl" />
					</div>
					<AlertDialogHeader>
						<AlertDialogTitle className="text-3xl font-bold flex items-center justify-center gap-6 text-red-500">
							Account not Verified
						</AlertDialogTitle>

						<AlertDialogDescription className="text-sm text-center"></AlertDialogDescription>
					</AlertDialogHeader>

					<div className="text-sm text-center">
						Your account is not yet verified. Please check your
						email for a verification link.
					</div>

					<div className="flex items-center justify-center">
						<Separator className="w-1/3 bg-muted-foreground" />
						<span className="text-sm text-muted-foreground mx-5">
							or
						</span>
						<Separator className="w-1/3 bg-muted-foreground" />
					</div>

					<AlertDialogFooter className={"!flex-col"}>
						<div className="flex items-center justify-between">
							<Button
								className="text-sm w-full bg-blue-500 hover:bg-blue-500/90"
								disabled={isLoading}
								onClick={handleVerify}
							>
								Resend Verification Email
							</Button>
						</div>
					</AlertDialogFooter>

					<AlertDialogCancel className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground p-0 w-4 h-4 border-none">
						<LucideX className="h-4 w-4" />
					</AlertDialogCancel>
				</AlertDialogContent>
			)}
		</>
	);
};

export default VerifyAccountModal;
