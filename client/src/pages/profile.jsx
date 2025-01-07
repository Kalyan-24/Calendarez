import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { z } from "zod";
import { IoSave } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuLoader2, LuPencil } from "react-icons/lu";
import { toast } from "sonner";

import { Context } from "./app";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const Profile = () => {
	const { user, setUser, profileColor } = useContext(Context);
	const [editProfile, setEditProfile] = useState(false);

	const [editPassword, setEditPassword] = useState(false);

	const [isProfileLoading, setIsProfileLoading] = useState(false);

	const editProfileFormSchema = z.object({
		username: z
			.string()
			.min(3, { message: "Username must be at least 3 characters" })
			.max(50, { message: "Username must be at most 50 characters" })
			.refine((data) => /^[a-zA-Z0-9_]+$/.test(data), {
				message:
					"Username must contain only letters, numbers, and underscores",
			}),
		email: z.string().email({ message: "Please enter a valid email" }),
		firstname: z.union([
			z
				.string()
				.min(0)
				.max(50, {
					message: "First name must be at most 50 characters",
				})
				.regex(
					/^[a-zA-Z\s'-]+$/,
					"Name can only contain letters, spaces, apostrophes, and hyphens"
				),
			z.literal(""),
		]),
		lastname: z.union([
			z
				.string()
				.min(0)
				.max(50, {
					message: "Last name must be at most 50 characters",
				})
				.regex(
					/^[a-zA-Z\s'-]+$/,
					"Name can only contain letters, spaces, apostrophes, and hyphens"
				),
			z.literal(""),
		]),
	});

	const editProfileForm = useForm({
		resolver: zodResolver(editProfileFormSchema),
		defaultValues: {
			username: user.username,
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname,
		},
	});

	const changePasswordFormSchema = z
		.object({
			oldpassword: z
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
			newpassword: z
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
		.refine((data) => data.newpassword === data.confirmpassword, {
			message: "Passwords don't match",
			path: ["confirmpassword"],
		});

	const changePasswordForm = useForm({
		resolver: zodResolver(changePasswordFormSchema),
		defaultValues: {
			oldpassword: "",
			newpassword: "",
			confirmpassword: "",
		},
	});

	const handleResendVerification = async () => {
		try {
			setIsProfileLoading(true);
			const resendVerificationResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/verify-account`,
				{ type: "verify-account" },
				{
					withCredentials: true,
				}
			);
			if (resendVerificationResult.data.status === "Success") {
				toast.success(resendVerificationResult.data.message);
			} else if (resendVerificationResult.data.status === "Error") {
				toast.error(resendVerificationResult.data.error);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsProfileLoading(false);
		}
	};

	const handleEditProfileSubmit = async ({
		username,
		email,
		firstname,
		lastname,
	}) => {
		try {
			setIsProfileLoading(true);
			const editProfileResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/edit-profile`,
				{ username, email, firstname, lastname },
				{
					withCredentials: true,
				}
			);
			if (editProfileResult.data.status === "Success") {
				toast.success(editProfileResult.data.message);
				setUser(editProfileResult.data.user);
				setIsProfileLoading(false);
				setEditProfile(false);
			} else if (editProfileResult.data.status === "Error") {
				toast.error(editProfileResult.data.error);
				setIsProfileLoading(false);
			}
		} catch (error) {
			toast.error(error.message);
			setIsProfileLoading(false);
		}
	};

	const handleChangePasswordSubmit = async ({ oldpassword, newpassword }) => {
		try {
			setIsProfileLoading(true);
			const changePasswordResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/change-password`,
				{ oldpassword, newpassword },
				{
					withCredentials: true,
				}
			);
			if (changePasswordResult.data.status === "Success") {
				toast.success(changePasswordResult.data.message);
				setIsProfileLoading(false);
				setEditPassword(false);
			} else if (changePasswordResult.data.status === "Error") {
				toast.error(changePasswordResult.data.error);
				setIsProfileLoading(false);
			}
		} catch (error) {
			toast.error(error.message);
			setIsProfileLoading(false);
		}
	};

	const handleEditProfile = () => {
		setEditProfile(true);
		editProfileForm.reset({
			username: user.username,
			email: user.email,
			firstname: user.firstname,
			lastname: user.lastname,
		});
	};

	const handleChangePassword = () => {
		setEditPassword(true);
		changePasswordForm.reset({
			oldpassword: "",
			newpassword: "",
			confirmpassword: "",
		});
	};

	useEffect(() => {
		document.title = "My Profile";
	}, []);

	return (
		<div className="flex flex-col h-[calc(100vh-61px)]">
			{!user.isverified && (
				<div className="bg-amber-500 text-white text-center py-2 flex items-center justify-between px-9">
					<span className="text-sm">
						Please verify your Account to continue. Check your email
						for the verification link. Or click the button beside to
						resend the verification link.
					</span>
					<Button
						onClick={handleResendVerification}
						className="ml-2 bg-blue-500 hover:bg-blue-500/90"
						disabled={isProfileLoading}
					>
						Resend Verification Link
					</Button>
				</div>
			)}
			<div className="flex flex-col overflow-auto px-20 pt-7">
				<h1 className="text-2xl font-bold">My Profile</h1>
				<div className="flex border rounded-lg px-5 my-7">
					<div className="flex flex-col items-center justify-center py-2">
						<Avatar className="w-9 h-9 scale-[3] mx-9 my-14">
							<AvatarImage />
							<AvatarFallback
								className={cn(
									`bg-${profileColor}-500 text-accent`,
									user.username.split("_")[1] && "text-lg"
								)}
							>
								{user.username.split("_")[0][0].toUpperCase()}
								{user.username.split("_")[1] &&
									user.username
										.split("_")[1][0]
										.toUpperCase()}
							</AvatarFallback>
						</Avatar>

						<div>
							<span className="text-sm font-medium">
								User ID :{" "}
							</span>
							<span className="text-muted-foreground text-xs">
								{user.id}
							</span>
						</div>
					</div>

					<Separator
						orientation="vertical"
						className="flex mx-5 w-[0.5px] h-full"
					/>

					<div className="flex flex-col flex-1 h-full justify-evenly py-4 pl-6">
						<div className="flex items-center justify-between">
							<h2 className="text-xl font-semibold">
								Personal Information
							</h2>
							{!editProfile && (
								<Tooltip>
									<TooltipTrigger>
										<Badge
											variant={
												user.isverified
													? "outline"
													: "secondary"
											}
											className={
												"cursor-pointer text-gray-500 hover:text-accent-foreground hover:bg-accent shadow-sm "
											}
											disabled={user.isverified}
											onClick={
												user.isverified &&
												handleEditProfile
											}
										>
											<LuPencil className="w-3 h-3 mr-1" />
											Edit
										</Badge>
									</TooltipTrigger>
									<TooltipContent className="bg-gray-700">
										<p>
											{user.isverified
												? "Edit Profile"
												: "Verify Account to access"}
										</p>
									</TooltipContent>
								</Tooltip>
							)}
						</div>

						<Form {...editProfileForm}>
							<form
								onSubmit={editProfileForm.handleSubmit(
									handleEditProfileSubmit
								)}
								className="mt-6 space-y-3 grid grid-cols-2 gap-5"
							>
								<FormField
									control={editProfileForm.control}
									name="username"
									render={({ field }) => (
										<FormItem className="flex gap-1 flex-col justify-end">
											<FormLabel>Username</FormLabel>
											{editProfile ? (
												<FormControl>
													<Input
														disabled={
															isProfileLoading
														}
														{...field}
														className="focus-visible:border-blue-500 !mt-3"
													/>
												</FormControl>
											) : (
												<FormDescription>
													@{user.username}
												</FormDescription>
											)}

											{editProfile && <FormMessage />}
										</FormItem>
									)}
								/>

								<FormField
									control={editProfileForm.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											{editProfile ? (
												<FormControl>
													<Input
														disabled={
															isProfileLoading
														}
														{...field}
														className="focus-visible:border-blue-500"
													/>
												</FormControl>
											) : (
												<FormDescription>
													{user.email}
												</FormDescription>
											)}

											{editProfile && <FormMessage />}
										</FormItem>
									)}
								/>

								<FormField
									control={editProfileForm.control}
									name="firstname"
									render={({ field }) => (
										<FormItem>
											<FormLabel>First name</FormLabel>
											{editProfile ? (
												<FormControl>
													<Input
														disabled={
															isProfileLoading
														}
														{...field}
														className="focus-visible:border-blue-500"
													/>
												</FormControl>
											) : (
												<FormDescription>
													{user.firstname ? (
														user.firstname
													) : (
														<>N/A</>
													)}
												</FormDescription>
											)}

											{editProfile && <FormMessage />}
										</FormItem>
									)}
								/>

								<FormField
									control={editProfileForm.control}
									name="lastname"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last name</FormLabel>
											{editProfile ? (
												<FormControl>
													<Input
														disabled={
															isProfileLoading
														}
														{...field}
														className="focus-visible:border-blue-500"
													/>
												</FormControl>
											) : (
												<FormDescription>
													{user.lastname ? (
														user.lastname
													) : (
														<>N/A</>
													)}
												</FormDescription>
											)}

											{editProfile && <FormMessage />}
										</FormItem>
									)}
								/>

								{editProfile && (
									<>
										<Button
											variant="outline"
											className="w-full"
											disabled={isProfileLoading}
											onClick={() => {
												setEditProfile(false);
											}}
										>
											Cancel
										</Button>

										<Button
											type="submit"
											className="w-full bg-blue-500 hover:bg-blue-500/90"
											disabled={isProfileLoading}
										>
											{isProfileLoading ? (
												<LuLoader2 className="animate-spin w-5 h-5 mr-2" />
											) : (
												<>
													<IoSave className="w-4 h-4 mr-2" />
													Save
												</>
											)}
										</Button>
									</>
								)}
							</form>
						</Form>
					</div>
				</div>

				<div className="flex flex-col border rounded-lg py-7 px-5 my-7">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-semibold">Password</h2>
						{!editPassword && (
							<Tooltip>
								<TooltipTrigger>
									<Badge
										variant={
											user.isverified
												? "outline"
												: "secondary"
										}
										className={
											"cursor-pointer text-gray-500 hover:text-accent-foreground hover:bg-accent shadow-sm "
										}
										onClick={
											user.isverified &&
											handleChangePassword
										}
									>
										<LuPencil className="w-3 h-3 mr-1" />
										Change
									</Badge>
								</TooltipTrigger>
								<TooltipContent className="bg-gray-700">
									<p>
										{user.isverified
											? "Change Password"
											: "Verify Account to access"}
									</p>
								</TooltipContent>
							</Tooltip>
						)}
					</div>

					{!editPassword ? (
						<p className="text-3xl text-muted-foreground">
							<span className="inline-block w-1 h-1 rounded-[1.5px] bg-muted-foreground ml-1" />
							<span className="inline-block w-1 h-1 rounded-[1.5px] bg-muted-foreground ml-1" />
							<span className="inline-block w-1 h-1 rounded-[1.5px] bg-muted-foreground ml-1" />
							<span className="inline-block w-1 h-1 rounded-[1.5px] bg-muted-foreground ml-1" />
							<span className="inline-block w-1 h-1 rounded-[1.5px] bg-muted-foreground ml-1" />
							<span className="inline-block w-1 h-1 rounded-[1.5px] bg-muted-foreground ml-1" />
							<span className="inline-block w-1 h-1 rounded-[1.5px] bg-muted-foreground ml-1" />
							<span className="inline-block w-1 h-1 rounded-[1.5px] bg-muted-foreground ml-1" />
							<span className="inline-block w-1 h-1 rounded-[1.5px] bg-muted-foreground ml-1" />
							<span className="inline-block w-1 h-1 rounded-[1.5px] bg-muted-foreground ml-1" />
							<span className="inline-block w-1 h-1 rounded-[1.5px] bg-muted-foreground ml-1" />
							<span className="inline-block w-1 h-1 rounded-[1.5px] bg-muted-foreground ml-1" />
						</p>
					) : (
						<Form {...changePasswordForm}>
							<form
								onSubmit={changePasswordForm.handleSubmit(
									handleChangePasswordSubmit
								)}
								className="mt-6 space-y-3 grid grid-cols-3 gap-8"
							>
								<FormField
									control={changePasswordForm.control}
									name="oldpassword"
									render={({ field }) => (
										<FormItem className="flex gap-1 flex-col justify-end">
											<FormLabel>Old Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													disabled={isProfileLoading}
													{...field}
													className="focus-visible:border-blue-500 !mt-3"
												/>
											</FormControl>

											{editPassword && <FormMessage />}
										</FormItem>
									)}
								/>

								<FormField
									control={changePasswordForm.control}
									name="newpassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>New Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													disabled={isProfileLoading}
													{...field}
													className="focus-visible:border-blue-500"
												/>
											</FormControl>
											{editPassword && <FormMessage />}
										</FormItem>
									)}
								/>

								<FormField
									control={changePasswordForm.control}
									name="confirmpassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Confirm Password
											</FormLabel>
											<FormControl>
												<Input
													type="password"
													disabled={isProfileLoading}
													{...field}
													className="focus-visible:border-blue-500"
												/>
											</FormControl>
											{editPassword && <FormMessage />}
										</FormItem>
									)}
								/>

								{editPassword && (
									<div className="flex gap-8 col-span-3">
										<Button
											variant="outline"
											className="w-full"
											disabled={isProfileLoading}
											onClick={() => {
												setEditPassword(false);
											}}
										>
											Cancel
										</Button>

										<Button
											type="submit"
											className="w-full bg-blue-500 hover:bg-blue-500/90"
											disabled={isProfileLoading}
										>
											<IoSave className="w-4 h-4 mr-2" />
											Save
										</Button>
									</div>
								)}
							</form>
						</Form>
					)}
				</div>
			</div>
		</div>
	);
};

export default Profile;
