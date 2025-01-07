import React, { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { IoSave } from "react-icons/io5";
import { LuLoader2, LuPencil } from "react-icons/lu";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
	const {
		user,
		holidaysColor,
		eventsColor,
		tasksColor,
		birthdaysColor,
		holidayRemainderTime,
		holidayRemainderFormat,
		eventRemainderTime,
		eventRemainderFormat,
		taskRemainderTime,
		taskRemainderFormat,
		birthdayRemainderTime,
		birthdayRemainderFormat,
		setSettings,
	} = useContext(Context);

	const [isColorLoading, setIsColorLoading] = useState(false);
	const [isRemainderLoading, setIsRemainderLoading] = useState(false);

	const [editColor, setEditColor] = useState(false);
	const [editRemainder, setEditRemainder] = useState(false);

	const editColorFormSchema = z.object({
		holidaycolor: z.string(),
		eventcolor: z.string(),
		taskcolor: z.string(),
		birthdaycolor: z.string(),
	});

	const editRemainderFormSchema = z
		.object({
			holidayremaindertime: z.coerce.number(),
			holidayremainderformat: z.string(),
			eventremaindertime: z.coerce.number(),
			eventremainderformat: z.string(),
			taskremaindertime: z.coerce.number(),
			taskremainderformat: z.string(),
			birthdayremaindertime: z.coerce.number(),
			birthdayremainderformat: z.string(),
		})
		.superRefine((data, ctx) => {
			if (data.holidayremainderformat === "minute") {
				if (
					data.holidayremaindertime < 0 ||
					data.holidayremaindertime > 43200
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"Remainder time must be between 0 and 43,200 minutes.",
						path: ["holidayremaindertime"],
					});
				}
			} else if (data.holidayremainderformat === "hour") {
				if (
					data.holidayremaindertime < 0 ||
					data.holidayremaindertime > 720
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"Remainder time must be between 0 and 720 hours.",
						path: ["holidayremaindertime"],
					});
				}
			} else if (data.holidayremainderformat === "day") {
				if (
					data.holidayremaindertime < 0 ||
					data.holidayremaindertime > 30
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"Remainder time must be between 0 and 30 days.",
						path: ["holidayremaindertime"],
					});
				}
			}
			if (data.eventremainderformat === "minute") {
				if (
					data.eventremaindertime < 0 ||
					data.eventremaindertime > 43200
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"Remainder time must be between 0 and 43,200 minutes.",
						path: ["eventremaindertime"],
					});
				}
			} else if (data.eventremainderformat === "hour") {
				if (
					data.eventremaindertime < 0 ||
					data.eventremaindertime > 720
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"Remainder time must be between 0 and 720 hours.",
						path: ["eventremaindertime"],
					});
				}
			} else if (data.eventremainderformat === "day") {
				if (
					data.eventremaindertime < 0 ||
					data.eventremaindertime > 30
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"Remainder time must be between 0 and 30 days.",
						path: ["eventremaindertime"],
					});
				}
			}
			if (data.taskremainderformat === "minute") {
				if (
					data.taskremaindertime < 0 ||
					data.taskremaindertime > 43200
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"Remainder time must be between 0 and 43,200 minutes.",
						path: ["taskremaindertime"],
					});
				}
			} else if (data.taskremainderformat === "hour") {
				if (
					data.taskremaindertime < 0 ||
					data.taskremaindertime > 720
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"Remainder time must be between 0 and 720 hours.",
						path: ["taskremaindertime"],
					});
				}
			} else if (data.taskremainderformat === "day") {
				if (data.taskremaindertime < 0 || data.taskremaindertime > 30) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"Remainder time must be between 0 and 30 days.",
						path: ["taskremaindertime"],
					});
				}
			}
			if (data.birthdayremainderformat === "minute") {
				if (
					data.birthdayremaindertime < 0 ||
					data.birthdayremaindertime > 43200
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"Remainder time must be between 0 and 43,200 minutes.",
						path: ["birthdayremaindertime"],
					});
				}
			} else if (data.birthdayremainderformat === "hour") {
				if (
					data.birthdayremaindertime < 0 ||
					data.birthdayremaindertime > 720
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"Remainder time must be between 0 and 720 hours.",
						path: ["birthdayremaindertime"],
					});
				}
			} else if (data.birthdayremainderformat === "day") {
				if (
					data.birthdayremaindertime < 0 ||
					data.birthdayremaindertime > 30
				) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message:
							"Remainder time must be between 0 and 30 days.",
						path: ["birthdayremaindertime"],
					});
				}
			}
		});

	const editColorForm = useForm({
		resolver: zodResolver(editColorFormSchema),
		defaultValues: {
			holidaycolor: holidaysColor,
			eventcolor: eventsColor,
			taskcolor: tasksColor,
			birthdaycolor: birthdaysColor,
		},
	});

	const editRemainderForm = useForm({
		resolver: zodResolver(editRemainderFormSchema),
		defaultValues: {
			holidayremaindertime: holidayRemainderTime,
			holidayremainderformat: holidayRemainderFormat,
			eventremaindertime: eventRemainderTime,
			eventremainderformat: eventRemainderFormat,
			taskremaindertime: taskRemainderTime,
			taskremainderformat: taskRemainderFormat,
			birthdayremaindertime: birthdayRemainderTime,
			birthdayremainderformat: birthdayRemainderFormat,
		},
	});

	const handleResendVerification = async () => {
		try {
			setIsColorLoading(true);
			setIsRemainderLoading(true);
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
			setIsColorLoading(false);
			setIsRemainderLoading(false);
		}
	};

	const handleEditColorSettings = () => {
		editColorForm.reset({
			holidaycolor: holidaysColor,
			eventcolor: eventsColor,
			taskcolor: tasksColor,
			birthdaycolor: birthdaysColor,
		});

		setEditColor(true);
	};
	const handleEditRemainderSettings = () => {
		editRemainderForm.reset({
			holidayremaindertime: holidayRemainderTime,
			holidayremainderformat: holidayRemainderFormat,
			eventremaindertime: eventRemainderTime,
			eventremainderformat: eventRemainderFormat,
			taskremaindertime: taskRemainderTime,
			taskremainderformat: taskRemainderFormat,
			birthdayremaindertime: birthdayRemainderTime,
			birthdayremainderformat: birthdayRemainderFormat,
		});
		setEditRemainder(true);
	};

	const handleEditColorSettingsSubmit = async ({
		holidaycolor,
		eventcolor,
		taskcolor,
		birthdaycolor,
	}) => {
		try {
			setIsColorLoading(true);
			const editColorResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/edit-settings`,
				{ holidaycolor, eventcolor, taskcolor, birthdaycolor },
				{
					withCredentials: true,
				}
			);

			if (editColorResult.data.status === "Success") {
				toast.success(editColorResult.data.message);
				setSettings(editColorResult.data.settings);
				setIsColorLoading(false);
				setEditColor(false);
			} else if (editColorResult.data.status === "Error") {
				toast.error(editColorResult.data.error);
				setIsColorLoading(false);
			}
		} catch (error) {
			toast.error(error.message);
			setIsColorLoading(false);
		}
	};

	const handleEditRemainderSettingsSubmit = async ({
		holidayremaindertime,
		holidayremainderformat,
		eventremaindertime,
		eventremainderformat,
		taskremaindertime,
		taskremainderformat,
		birthdayremaindertime,
		birthdayremainderformat,
	}) => {
		try {
			setIsRemainderLoading(true);
			const editRemainderResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/edit-settings`,
				{
					holidayremaindertime,
					holidayremainderformat,
					eventremaindertime,
					eventremainderformat,
					taskremaindertime,
					taskremainderformat,
					birthdayremaindertime,
					birthdayremainderformat,
				},
				{
					withCredentials: true,
				}
			);

			if (editRemainderResult.data.status === "Success") {
				toast.success(editRemainderResult.data.message);
				setSettings(editRemainderResult.data.settings);
				setEditRemainder(false);
				setIsRemainderLoading(false);
			} else if (editRemainderResult.data.status === "Error") {
				toast.error(editRemainderResult.data.error);
				setIsRemainderLoading(false);
			}
		} catch (error) {
			toast.error(error.message);
			setIsRemainderLoading(false);
		}
	};

	useEffect(() => {
		document.title = "Settings";
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
						disabled={isColorLoading || isRemainderLoading}
					>
						Resend Verification Link
					</Button>
				</div>
			)}
			<div className="flex flex-col overflow-auto px-20 pt-7">
				<h1 className="text-2xl font-bold">Settings</h1>
				<div className="flex flex-col border rounded-lg py-7 px-5 my-7">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold">Colors</h2>

						{!editColor && (
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
											handleEditColorSettings
										}
									>
										<LuPencil className="w-3 h-3 mr-1" />
										Edit
									</Badge>
								</TooltipTrigger>
								<TooltipContent className="bg-gray-700">
									<p>
										{user.isverified
											? "Edit Color"
											: "Verify Account to access"}
									</p>
								</TooltipContent>
							</Tooltip>
						)}
					</div>

					<Form {...editColorForm}>
						<form
							onSubmit={editColorForm.handleSubmit(
								handleEditColorSettingsSubmit
							)}
							className="mt-3 space-y-3 grid grid-cols-4 gap-5"
						>
							<FormField
								control={editColorForm.control}
								name="holidaycolor"
								render={({ field }) => (
									<FormItem className="flex gap-1 flex-col justify-end">
										<FormLabel htmlFor="holidaycolor">
											Holiday color
										</FormLabel>
										{editColor ? (
											<FormControl>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
													value={field.value}
												>
													<SelectTrigger
														id="holidaycolor"
														className="max-w-fit gap-2 focus:ring-0 min-w-[100%]"
													>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<ScrollArea className="h-80">
															<SelectGroup>
																<SelectItem value="red">
																	<span className="flex items-center text-red-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-red-500 ml-1 mr-3" />
																		Red
																	</span>
																</SelectItem>
																<SelectItem value="orange">
																	<span className="flex items-center text-orange-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-orange-500 ml-1 mr-3" />
																		Orange
																	</span>
																</SelectItem>
																<SelectItem value="amber">
																	<span className="flex items-center text-amber-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-amber-500 ml-1 mr-3" />
																		Amber
																	</span>
																</SelectItem>
																<SelectItem value="yellow">
																	<span className="flex items-center text-yellow-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-yellow-500 ml-1 mr-3" />
																		Yellow
																	</span>
																</SelectItem>
																<SelectItem value="lime">
																	<span className="flex items-center text-lime-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-lime-500 ml-1 mr-3" />
																		Lime
																	</span>
																</SelectItem>
																<SelectItem value="green">
																	<span className="flex items-center text-green-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-green-500 ml-1 mr-3" />
																		Green
																	</span>
																</SelectItem>
																<SelectItem value="emerald">
																	<span className="flex items-center text-emerald-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-emerald-500 ml-1 mr-3" />
																		Emerald
																	</span>
																</SelectItem>
																<SelectItem value="teal">
																	<span className="flex items-center text-teal-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-teal-500 ml-1 mr-3" />
																		Teal
																	</span>
																</SelectItem>
																<SelectItem value="cyan">
																	<span className="flex items-center text-cyan-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-cyan-500 ml-1 mr-3" />
																		Cyan
																	</span>
																</SelectItem>
																<SelectItem value="sky">
																	<span className="flex items-center text-sky-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-sky-500 ml-1 mr-3" />
																		Sky
																	</span>
																</SelectItem>
																<SelectItem value="blue">
																	<span className="flex items-center text-blue-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-blue-500 ml-1 mr-3" />
																		Blue
																	</span>
																</SelectItem>
																<SelectItem value="indigo">
																	<span className="flex items-center text-indigo-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-indigo-500 ml-1 mr-3" />
																		Indigo
																	</span>
																</SelectItem>
																<SelectItem value="violet">
																	<span className="flex items-center text-violet-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-violet-500 ml-1 mr-3" />
																		Violet
																	</span>
																</SelectItem>
																<SelectItem value="purple">
																	<span className="flex items-center text-purple-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-purple-500 ml-1 mr-3" />
																		Purple
																	</span>
																</SelectItem>
																<SelectItem value="fuchsia">
																	<span className="flex items-center text-fuchsia-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-fuchsia-500 ml-1 mr-3" />
																		Fuchsia
																	</span>
																</SelectItem>
																<SelectItem value="pink">
																	<span className="flex items-center text-pink-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-pink-500 ml-1 mr-3" />
																		Pink
																	</span>
																</SelectItem>
																<SelectItem value="rose">
																	<span className="flex items-center text-rose-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-rose-500 ml-1 mr-3" />
																		Rose
																	</span>
																</SelectItem>
															</SelectGroup>
														</ScrollArea>
													</SelectContent>
												</Select>
											</FormControl>
										) : (
											<FormDescription>
												<span
													className={`flex items-center text-${field.value}-500`}
												>
													<span
														className={`inline-block w-4 h-4 rounded-full bg-${field.value}-500 ml-1 mr-3`}
													/>
													{field.value[0].toUpperCase() +
														field.value.slice(1)}
												</span>
											</FormDescription>
										)}

										{editColor && <FormMessage />}
									</FormItem>
								)}
							/>

							<FormField
								control={editColorForm.control}
								name="eventcolor"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="eventcolor">
											Event color
										</FormLabel>
										{editColor ? (
											<FormControl>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
													value={field.value}
												>
													<SelectTrigger
														id="eventcolor"
														className="max-w-fit gap-2 focus:ring-0 min-w-[100%]"
													>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<ScrollArea className="h-80">
															<SelectGroup>
																<SelectItem value="red">
																	<span className="flex items-center text-red-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-red-500 ml-1 mr-3" />
																		Red
																	</span>
																</SelectItem>
																<SelectItem value="orange">
																	<span className="flex items-center text-orange-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-orange-500 ml-1 mr-3" />
																		Orange
																	</span>
																</SelectItem>
																<SelectItem value="amber">
																	<span className="flex items-center text-amber-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-amber-500 ml-1 mr-3" />
																		Amber
																	</span>
																</SelectItem>
																<SelectItem value="yellow">
																	<span className="flex items-center text-yellow-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-yellow-500 ml-1 mr-3" />
																		Yellow
																	</span>
																</SelectItem>
																<SelectItem value="lime">
																	<span className="flex items-center text-lime-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-lime-500 ml-1 mr-3" />
																		Lime
																	</span>
																</SelectItem>
																<SelectItem value="green">
																	<span className="flex items-center text-green-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-green-500 ml-1 mr-3" />
																		Green
																	</span>
																</SelectItem>
																<SelectItem value="emerald">
																	<span className="flex items-center text-emerald-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-emerald-500 ml-1 mr-3" />
																		Emerald
																	</span>
																</SelectItem>
																<SelectItem value="teal">
																	<span className="flex items-center text-teal-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-teal-500 ml-1 mr-3" />
																		Teal
																	</span>
																</SelectItem>
																<SelectItem value="cyan">
																	<span className="flex items-center text-cyan-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-cyan-500 ml-1 mr-3" />
																		Cyan
																	</span>
																</SelectItem>
																<SelectItem value="sky">
																	<span className="flex items-center text-sky-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-sky-500 ml-1 mr-3" />
																		Sky
																	</span>
																</SelectItem>
																<SelectItem value="blue">
																	<span className="flex items-center text-blue-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-blue-500 ml-1 mr-3" />
																		Blue
																	</span>
																</SelectItem>
																<SelectItem value="indigo">
																	<span className="flex items-center text-indigo-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-indigo-500 ml-1 mr-3" />
																		Indigo
																	</span>
																</SelectItem>
																<SelectItem value="violet">
																	<span className="flex items-center text-violet-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-violet-500 ml-1 mr-3" />
																		Violet
																	</span>
																</SelectItem>
																<SelectItem value="purple">
																	<span className="flex items-center text-purple-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-purple-500 ml-1 mr-3" />
																		Purple
																	</span>
																</SelectItem>
																<SelectItem value="fuchsia">
																	<span className="flex items-center text-fuchsia-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-fuchsia-500 ml-1 mr-3" />
																		Fuchsia
																	</span>
																</SelectItem>
																<SelectItem value="pink">
																	<span className="flex items-center text-pink-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-pink-500 ml-1 mr-3" />
																		Pink
																	</span>
																</SelectItem>
																<SelectItem value="rose">
																	<span className="flex items-center text-rose-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-rose-500 ml-1 mr-3" />
																		Rose
																	</span>
																</SelectItem>
															</SelectGroup>
														</ScrollArea>
													</SelectContent>
												</Select>
											</FormControl>
										) : (
											<FormDescription>
												<span
													className={`flex items-center text-${field.value}-500`}
												>
													<span
														className={`inline-block w-4 h-4 rounded-full bg-${field.value}-500 ml-1 mr-3`}
													/>
													{field.value[0].toUpperCase() +
														field.value.slice(1)}
												</span>
											</FormDescription>
										)}

										{editColor && <FormMessage />}
									</FormItem>
								)}
							/>

							<FormField
								control={editColorForm.control}
								name="taskcolor"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="taskcolor">
											Task color
										</FormLabel>
										{editColor ? (
											<FormControl>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
													value={field.value}
												>
													<SelectTrigger
														id="taskcolor"
														className="max-w-fit gap-2 focus:ring-0 min-w-[100%]"
													>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<ScrollArea className="h-80">
															<SelectGroup>
																<SelectItem value="red">
																	<span className="flex items-center text-red-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-red-500 ml-1 mr-3" />
																		Red
																	</span>
																</SelectItem>
																<SelectItem value="orange">
																	<span className="flex items-center text-orange-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-orange-500 ml-1 mr-3" />
																		Orange
																	</span>
																</SelectItem>
																<SelectItem value="amber">
																	<span className="flex items-center text-amber-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-amber-500 ml-1 mr-3" />
																		Amber
																	</span>
																</SelectItem>
																<SelectItem value="yellow">
																	<span className="flex items-center text-yellow-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-yellow-500 ml-1 mr-3" />
																		Yellow
																	</span>
																</SelectItem>
																<SelectItem value="lime">
																	<span className="flex items-center text-lime-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-lime-500 ml-1 mr-3" />
																		Lime
																	</span>
																</SelectItem>
																<SelectItem value="green">
																	<span className="flex items-center text-green-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-green-500 ml-1 mr-3" />
																		Green
																	</span>
																</SelectItem>
																<SelectItem value="emerald">
																	<span className="flex items-center text-emerald-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-emerald-500 ml-1 mr-3" />
																		Emerald
																	</span>
																</SelectItem>
																<SelectItem value="teal">
																	<span className="flex items-center text-teal-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-teal-500 ml-1 mr-3" />
																		Teal
																	</span>
																</SelectItem>
																<SelectItem value="cyan">
																	<span className="flex items-center text-cyan-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-cyan-500 ml-1 mr-3" />
																		Cyan
																	</span>
																</SelectItem>
																<SelectItem value="sky">
																	<span className="flex items-center text-sky-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-sky-500 ml-1 mr-3" />
																		Sky
																	</span>
																</SelectItem>
																<SelectItem value="blue">
																	<span className="flex items-center text-blue-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-blue-500 ml-1 mr-3" />
																		Blue
																	</span>
																</SelectItem>
																<SelectItem value="indigo">
																	<span className="flex items-center text-indigo-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-indigo-500 ml-1 mr-3" />
																		Indigo
																	</span>
																</SelectItem>
																<SelectItem value="violet">
																	<span className="flex items-center text-violet-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-violet-500 ml-1 mr-3" />
																		Violet
																	</span>
																</SelectItem>
																<SelectItem value="purple">
																	<span className="flex items-center text-purple-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-purple-500 ml-1 mr-3" />
																		Purple
																	</span>
																</SelectItem>
																<SelectItem value="fuchsia">
																	<span className="flex items-center text-fuchsia-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-fuchsia-500 ml-1 mr-3" />
																		Fuchsia
																	</span>
																</SelectItem>
																<SelectItem value="pink">
																	<span className="flex items-center text-pink-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-pink-500 ml-1 mr-3" />
																		Pink
																	</span>
																</SelectItem>
																<SelectItem value="rose">
																	<span className="flex items-center text-rose-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-rose-500 ml-1 mr-3" />
																		Rose
																	</span>
																</SelectItem>
															</SelectGroup>
														</ScrollArea>
													</SelectContent>
												</Select>
											</FormControl>
										) : (
											<FormDescription>
												<span
													className={`flex items-center text-${field.value}-500`}
												>
													<span
														className={`inline-block w-4 h-4 rounded-full bg-${field.value}-500 ml-1 mr-3`}
													/>
													{field.value[0].toUpperCase() +
														field.value.slice(1)}
												</span>
											</FormDescription>
										)}

										{editColor && <FormMessage />}
									</FormItem>
								)}
							/>

							<FormField
								control={editColorForm.control}
								name="birthdaycolor"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="birthdaycolor">
											Birthday color
										</FormLabel>
										{editColor ? (
											<FormControl>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
													value={field.value}
												>
													<SelectTrigger
														id="birthdaycolor"
														className="max-w-fit gap-2 focus:ring-0 min-w-[100%]"
													>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<ScrollArea className="h-80">
															<SelectGroup>
																<SelectItem value="red">
																	<span className="flex items-center text-red-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-red-500 ml-1 mr-3" />
																		Red
																	</span>
																</SelectItem>
																<SelectItem value="orange">
																	<span className="flex items-center text-orange-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-orange-500 ml-1 mr-3" />
																		Orange
																	</span>
																</SelectItem>
																<SelectItem value="amber">
																	<span className="flex items-center text-amber-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-amber-500 ml-1 mr-3" />
																		Amber
																	</span>
																</SelectItem>
																<SelectItem value="yellow">
																	<span className="flex items-center text-yellow-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-yellow-500 ml-1 mr-3" />
																		Yellow
																	</span>
																</SelectItem>
																<SelectItem value="lime">
																	<span className="flex items-center text-lime-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-lime-500 ml-1 mr-3" />
																		Lime
																	</span>
																</SelectItem>
																<SelectItem value="green">
																	<span className="flex items-center text-green-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-green-500 ml-1 mr-3" />
																		Green
																	</span>
																</SelectItem>
																<SelectItem value="emerald">
																	<span className="flex items-center text-emerald-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-emerald-500 ml-1 mr-3" />
																		Emerald
																	</span>
																</SelectItem>
																<SelectItem value="teal">
																	<span className="flex items-center text-teal-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-teal-500 ml-1 mr-3" />
																		Teal
																	</span>
																</SelectItem>
																<SelectItem value="cyan">
																	<span className="flex items-center text-cyan-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-cyan-500 ml-1 mr-3" />
																		Cyan
																	</span>
																</SelectItem>
																<SelectItem value="sky">
																	<span className="flex items-center text-sky-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-sky-500 ml-1 mr-3" />
																		Sky
																	</span>
																</SelectItem>
																<SelectItem value="blue">
																	<span className="flex items-center text-blue-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-blue-500 ml-1 mr-3" />
																		Blue
																	</span>
																</SelectItem>
																<SelectItem value="indigo">
																	<span className="flex items-center text-indigo-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-indigo-500 ml-1 mr-3" />
																		Indigo
																	</span>
																</SelectItem>
																<SelectItem value="violet">
																	<span className="flex items-center text-violet-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-violet-500 ml-1 mr-3" />
																		Violet
																	</span>
																</SelectItem>
																<SelectItem value="purple">
																	<span className="flex items-center text-purple-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-purple-500 ml-1 mr-3" />
																		Purple
																	</span>
																</SelectItem>
																<SelectItem value="fuchsia">
																	<span className="flex items-center text-fuchsia-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-fuchsia-500 ml-1 mr-3" />
																		Fuchsia
																	</span>
																</SelectItem>
																<SelectItem value="pink">
																	<span className="flex items-center text-pink-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-pink-500 ml-1 mr-3" />
																		Pink
																	</span>
																</SelectItem>
																<SelectItem value="rose">
																	<span className="flex items-center text-rose-500">
																		<span className="inline-block w-4 h-4 rounded-full bg-rose-500 ml-1 mr-3" />
																		Rose
																	</span>
																</SelectItem>
															</SelectGroup>
														</ScrollArea>
													</SelectContent>
												</Select>
											</FormControl>
										) : (
											<FormDescription>
												<span
													className={`flex items-center text-${field.value}-500`}
												>
													<span
														className={`inline-block w-4 h-4 rounded-full bg-${field.value}-500 ml-1 mr-3`}
													/>
													{field.value[0].toUpperCase() +
														field.value.slice(1)}
												</span>
											</FormDescription>
										)}

										{editColor && <FormMessage />}
									</FormItem>
								)}
							/>
							{editColor && (
								<div className="flex gap-8 col-span-4">
									<Button
										variant="outline"
										className="w-full"
										disabled={isColorLoading}
										onClick={() => {
											setEditColor(false);
										}}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										className="w-full bg-blue-500 hover:bg-blue-500/90"
										disabled={isColorLoading}
									>
										{isColorLoading ? (
											<LuLoader2 className="animate-spin w-5 h-5 mr-2" />
										) : (
											<>
												<IoSave className="w-4 h-4 mr-2" />
												Save
											</>
										)}
									</Button>
								</div>
							)}
						</form>
					</Form>
				</div>

				<div className="flex flex-col border rounded-lg py-7 px-5 my-7">
					<div className="flex items-center justify-between">
						<h2 className="text-xl font-bold">Remainder</h2>

						{!editRemainder && (
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
											handleEditRemainderSettings
										}
									>
										<LuPencil className="w-3 h-3 mr-1" />
										Edit
									</Badge>
								</TooltipTrigger>
								<TooltipContent className="bg-gray-700">
									<p>
										{user.isverified
											? "Edit Remainder"
											: "Verify Account to access"}
									</p>
								</TooltipContent>
							</Tooltip>
						)}
					</div>

					<Form {...editRemainderForm}>
						<form
							onSubmit={editRemainderForm.handleSubmit(
								handleEditRemainderSettingsSubmit
							)}
							className="mt-6 space-y-3 grid grid-cols-3 gap-x-20"
						>
							<div className="flex flex-col justify-end gap-3">
								<FormLabel htmlFor="eventremaindertime">
									Event Remainder
								</FormLabel>
								<div className="flex items-center justify-between gap-5 !mb-5">
									<FormField
										control={editRemainderForm.control}
										name="eventremaindertime"
										render={({ field }) => (
											<FormItem className="w-[35%]">
												{editRemainder ? (
													<FormControl>
														<Input
															{...field}
															id="eventremaindertime"
															type="number"
															className="focus-visible:border-blue-500 text-end"
														/>
													</FormControl>
												) : (
													<FormDescription>
														{eventRemainderTime}{" "}
														{eventRemainderFormat[0].toUpperCase() +
															eventRemainderFormat.slice(
																1
															)}
														{eventRemainderTime >
															1 && "s"}
													</FormDescription>
												)}

												{editRemainder && (
													<FormMessage />
												)}
											</FormItem>
										)}
									/>

									<FormField
										control={editRemainderForm.control}
										name="eventremainderformat"
										render={({ field }) => (
											<FormItem className="w-[65%]">
												{editRemainder && (
													<FormControl>
														<Select
															onValueChange={
																field.onChange
															}
															defaultValue={
																field.value
															}
															value={field.value}
														>
															<SelectTrigger className="max-w-fit gap-2 focus:ring-0 min-w-[100%]">
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectGroup>
																	<SelectItem value="minute">
																		Minutes
																	</SelectItem>
																	<SelectItem value="hour">
																		Hours
																	</SelectItem>
																	<SelectItem value="day">
																		Days
																	</SelectItem>
																</SelectGroup>
															</SelectContent>
														</Select>
													</FormControl>
												)}

												{editRemainder && (
													<FormMessage />
												)}
											</FormItem>
										)}
									/>
								</div>
							</div>

							<div className="flex flex-col justify-end gap-3">
								<FormLabel htmlFor="taskremaindertime">
									Task Remainder
								</FormLabel>
								<div className="flex items-center justify-between gap-5 !mb-5">
									<FormField
										control={editRemainderForm.control}
										name="taskremaindertime"
										render={({ field }) => (
											<FormItem className="w-[35%]">
												{editRemainder ? (
													<FormControl>
														<Input
															{...field}
															id="taskremaindertime"
															type="number"
															className="focus-visible:border-blue-500 text-end"
														/>
													</FormControl>
												) : (
													<FormDescription>
														{taskRemainderTime}{" "}
														{taskRemainderFormat[0].toUpperCase() +
															taskRemainderFormat.slice(
																1
															)}
														{taskRemainderTime >
															1 && "s"}
													</FormDescription>
												)}

												{editRemainder && (
													<FormMessage />
												)}
											</FormItem>
										)}
									/>

									<FormField
										control={editRemainderForm.control}
										name="taskremainderformat"
										render={({ field }) => (
											<FormItem className="w-[65%]">
												{editRemainder && (
													<FormControl>
														<Select
															onValueChange={
																field.onChange
															}
															defaultValue={
																field.value
															}
															value={field.value}
														>
															<SelectTrigger className="max-w-fit gap-2 focus:ring-0 min-w-[100%]">
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectGroup>
																	<SelectItem value="minute">
																		Minutes
																	</SelectItem>
																	<SelectItem value="hour">
																		Hours
																	</SelectItem>
																	<SelectItem value="day">
																		Days
																	</SelectItem>
																</SelectGroup>
															</SelectContent>
														</Select>
													</FormControl>
												)}

												{editRemainder && (
													<FormMessage />
												)}
											</FormItem>
										)}
									/>
								</div>
							</div>

							<div className="flex flex-col justify-end gap-3">
								<FormLabel htmlFor="birthdayremaindertime">
									Birthday Remainder
								</FormLabel>
								<div className="flex items-center justify-between gap-5 !mb-5">
									<FormField
										control={editRemainderForm.control}
										name="birthdayremaindertime"
										render={({ field }) => (
											<FormItem className="w-[35%]">
												{editRemainder ? (
													<FormControl>
														<Input
															{...field}
															id="birthdayremaindertime"
															type="number"
															className="focus-visible:border-blue-500 text-end"
														/>
													</FormControl>
												) : (
													<FormDescription>
														{birthdayRemainderTime}{" "}
														{birthdayRemainderFormat[0].toUpperCase() +
															birthdayRemainderFormat.slice(
																1
															)}
														{birthdayRemainderTime >
															1 && "s"}
													</FormDescription>
												)}

												{editRemainder && (
													<FormMessage />
												)}
											</FormItem>
										)}
									/>

									<FormField
										control={editRemainderForm.control}
										name="birthdayremainderformat"
										render={({ field }) => (
											<FormItem className="w-[65%]">
												{editRemainder && (
													<FormControl>
														<Select
															onValueChange={
																field.onChange
															}
															defaultValue={
																field.value
															}
															value={field.value}
														>
															<SelectTrigger className="max-w-fit gap-2 focus:ring-0 min-w-[100%]">
																<SelectValue />
															</SelectTrigger>
															<SelectContent>
																<SelectGroup>
																	<SelectItem value="minute">
																		Minutes
																	</SelectItem>
																	<SelectItem value="hour">
																		Hours
																	</SelectItem>
																	<SelectItem value="day">
																		Days
																	</SelectItem>
																</SelectGroup>
															</SelectContent>
														</Select>
													</FormControl>
												)}

												{editRemainder && (
													<FormMessage />
												)}
											</FormItem>
										)}
									/>
								</div>
							</div>

							{editRemainder && (
								<div className="flex gap-8 col-span-3">
									<Button
										variant="outline"
										className="w-full"
										disabled={isRemainderLoading}
										onClick={() => {
											setEditRemainder(false);
										}}
									>
										Cancel
									</Button>
									<Button
										type="submit"
										className="w-full bg-blue-500 hover:bg-blue-500/90"
										disabled={isRemainderLoading}
									>
										{isRemainderLoading ? (
											<LuLoader2 className="animate-spin w-5 h-5 mr-2" />
										) : (
											<>
												<IoSave className="w-4 h-4 mr-2" />
												Save
											</>
										)}
									</Button>
								</div>
							)}
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default Settings;
