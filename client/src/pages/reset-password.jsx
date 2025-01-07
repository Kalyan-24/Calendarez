import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Context } from "./app";
import Error from "./error";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Loader from "@/components/loader";

const ResetPassword = () => {
	const navigate = useNavigate();

	const { isLoading, setIsLoading } = useContext(Context);
	const [isPageLoading, setIsPageLoading] = useState(true);

	const { token } = useParams();

	const [tokenVerified, setTokenVerified] = useState(false);
	const [error, setError] = useState(null);

	const resetPasswordFormSchema = z
		.object({
			password: z
				.string()
				.min(8, { message: "Password must be at least 8 characters" })
				.max(50, { message: "Password must be at most 50 characters" })
				.refine((data) => /[a-z]/.test(data), {
					message:
						"Password must contain at least one lowercase letter",
				})
				.refine((data) => /[A-Z]/.test(data), {
					message:
						"Password must contain at least one uppercase letter",
				})
				.refine((data) => /[0-9]/.test(data), {
					message: "Password must contain at least one number",
				})
				.refine(
					(data) =>
						/[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(data),
					{
						message:
							"Password must contain at least one special character",
					}
				),
			confirmpassword: z
				.string()
				.min(8, { message: "Password must be at least 8 characters" })
				.max(50, { message: "Password must be at most 50 characters" }),
		})
		.refine((data) => data.password === data.confirmpassword, {
			message: "Passwords don't match",
			path: ["confirmpassword"],
		});

	const resetPasswordForm = useForm({
		resolver: zodResolver(resetPasswordFormSchema),
		defaultValues: {
			password: "",
			confirmpassword: "",
		},
	});

	const handleSubmit = async ({ password }) => {
		try {
			setIsLoading(true);
			const resetPasswordResponse = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/reset-password`,
				{
					token,
					password,
				},
				{
					withCredentials: true,
				}
			);
			if (resetPasswordResponse.data.status === "Success") {
				toast.success(resetPasswordResponse.data.message);
				navigate("/");
			} else if (
				resetPasswordResponse.data.status === "Error" &&
				resetPasswordResponse.data.error ===
					"New password cannot be same as old password!"
			) {
				toast.error(resetPasswordResponse.data.error);
			} else {
				setError(resetPasswordResponse.data.error);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		document.title = "Reset Password";
	}, []);

	useEffect(() => {
		if (tokenVerified) {
			document.title = "Reset Password";
		} else {
			document.title = "Error";
		}
	}, [tokenVerified]);

	useEffect(() => {
		const verifyToken = async () => {
			try {
				const verifyTokenResponse = await axios.post(
					`${import.meta.env.VITE_SERVER_URL}/api/v1/verify-token`,
					{ token: token },
					{
						withCredentials: true,
					}
				);

				if (verifyTokenResponse.data.status === "Success") {
					setTokenVerified(true);
				} else {
					setTokenVerified(false);
					if (verifyTokenResponse.data.error === "jwt expired") {
						setError(
							"410 This link for Reset Password has been expired."
						);
					} else {
						setError(
							"498 This link for Reset Password has been Tampered."
						);
					}
				}
			} catch (error) {
				setTokenVerified(false);
				setError("498 This link for Reset Password has been Tampered.");
			} finally {
				setIsPageLoading(false);
			}
		};

		verifyToken();
	}, []);

	return (
		<>
			{isPageLoading ? (
				<Loader />
			) : tokenVerified ? (
				<div className="w-full h-[calc(100vh-61px)] flex items-center justify-center">
					<Card className="w-[425px]">
						<CardHeader>
							<CardTitle className="text-3xl text-center font-bold text-blue-500">
								Reset your Password
							</CardTitle>
							<CardDescription className="text-center !mt-1">
								Enter a new password for your account.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...resetPasswordForm}>
								<form
									onSubmit={resetPasswordForm.handleSubmit(
										handleSubmit
									)}
									className="space-y-3"
								>
									<FormField
										control={resetPasswordForm.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													New Password
												</FormLabel>
												<FormControl>
													<Input
														type="password"
														disabled={isLoading}
														{...field}
														className="focus-visible:border-blue-500"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={resetPasswordForm.control}
										name="confirmpassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Confirm Password
												</FormLabel>
												<FormControl>
													<Input
														type="password"
														disabled={isLoading}
														{...field}
														className="focus-visible:border-blue-500"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button
										type="submit"
										className="w-full bg-blue-500 hover:bg-blue-500/90"
										disabled={isLoading}
									>
										Change Password
									</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>
			) : (
				<Error error={error} />
			)}
		</>
	);
};

export default ResetPassword;
