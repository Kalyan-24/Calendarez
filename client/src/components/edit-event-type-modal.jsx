import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

import { Context } from "@/pages/app";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

const editEventSchema = z
	.object({
		remaindertime: z.coerce.number(),
		remainderformat: z.string(),
		color: z.string(),
	})
	.superRefine((data, ctx) => {
		if (data.remainderformat === "minute") {
			if (data.remaindertime < 0 || data.remaindertime > 43200) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						"Remainder time must be between 0 and 43,200 minutes.",
					path: ["remaindertime"],
				});
			}
		} else if (data.remainderformat === "hour") {
			if (data.remaindertime < 0 || data.remaindertime > 720) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Remainder time must be between 0 and 720 hours.",
					path: ["remaindertime"],
				});
			}
		} else if (data.remainderformat === "day") {
			if (data.remaindertime < 0 || data.remaindertime > 30) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Remainder time must be between 0 and 30 days.",
					path: ["remaindertime"],
				});
			}
		}
	});

const EditEventTypeModal = ({ setOpen, trigger }) => {
	const {
		isLoading,
		setIsLoading,
		holidaysColor,
		eventsColor,
		tasksColor,
		birthdaysColor,
		holidayRemainderTime,
		eventRemainderTime,
		taskRemainderTime,
		birthdayRemainderTime,
		holidayRemainderFormat,
		eventRemainderFormat,
		taskRemainderFormat,
		birthdayRemainderFormat,
		setSettings,
	} = useContext(Context);

	const editEventForm = useForm({
		resolver: zodResolver(editEventSchema),
		defaultValues: {
			remaindertime: 30,
			remainderformat: "minute",
			color: "blue",
		},
	});

	const onEditEventSubmit = async ({
		remaindertime,
		remainderformat,
		color,
	}) => {
		switch (trigger) {
			case "Holidays":
				try {
					setIsLoading(true);
					const editEventResult = await axios.post(
						`${
							import.meta.env.VITE_SERVER_URL
						}/api/v1/edit-settings`,
						{
							holidayremaindertime: remaindertime,
							holidayremainderformat: remainderformat,
							holidaycolor: color,
						},
						{
							withCredentials: true,
						}
					);

					if (editEventResult.data.status === "Success") {
						toast.success(editEventResult.data.message);
						setSettings(editEventResult.data.settings);
						setOpen(false);
					} else if (editEventResult.data.status === "Error") {
						toast.error(editEventResult.data.error);
					}
				} catch (error) {
					toast.error(error.message);
				} finally {
					setIsLoading(false);
				}
				break;
			case "Events":
				try {
					setIsLoading(true);
					const editEventResult = await axios.post(
						`${
							import.meta.env.VITE_SERVER_URL
						}/api/v1/edit-settings`,
						{
							eventremaindertime: remaindertime,
							eventremainderformat: remainderformat,
							eventcolor: color,
						},
						{
							withCredentials: true,
						}
					);

					if (editEventResult.data.status === "Success") {
						toast.success(editEventResult.data.message);
						setSettings(editEventResult.data.settings);
						setOpen(false);
					} else if (editEventResult.data.status === "Error") {
						toast.error(editEventResult.data.error);
					}
				} catch (error) {
					toast.error(error.message);
				} finally {
					setIsLoading(false);
				}
				break;
			case "Tasks":
				try {
					setIsLoading(true);
					const editEventResult = await axios.post(
						`${
							import.meta.env.VITE_SERVER_URL
						}/api/v1/edit-settings`,
						{
							taskremaindertime: remaindertime,
							taskremainderformat: remainderformat,
							taskcolor: color,
						},
						{
							withCredentials: true,
						}
					);

					if (editEventResult.data.status === "Success") {
						toast.success(editEventResult.data.message);
						setSettings(editEventResult.data.settings);
						setOpen(false);
					} else if (editEventResult.data.status === "Error") {
						toast.error(editEventResult.data.error);
					}
				} catch (error) {
					toast.error(error.message);
				} finally {
					setIsLoading(false);
				}
				break;
			case "Birthdays":
				try {
					setIsLoading(true);
					const editEventResult = await axios.post(
						`${
							import.meta.env.VITE_SERVER_URL
						}/api/v1/edit-settings`,
						{
							birthdayremaindertime: remaindertime,
							birthdayremainderformat: remainderformat,
							birthdaycolor: color,
						},
						{
							withCredentials: true,
						}
					);

					if (editEventResult.data.status === "Success") {
						toast.success(editEventResult.data.message);
						setSettings(editEventResult.data.settings);
						setOpen(false);
					} else if (editEventResult.data.status === "Error") {
						toast.error(editEventResult.data.error);
					}
				} catch (error) {
					toast.error(error.message);
				} finally {
					setIsLoading(false);
				}
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		switch (trigger) {
			case "Holidays":
				editEventForm.setValue("color", holidaysColor);
				editEventForm.setValue("remaindertime", holidayRemainderTime);
				editEventForm.setValue(
					"remainderformat",
					holidayRemainderFormat
				);
				break;
			case "Events":
				editEventForm.setValue("color", eventsColor);
				editEventForm.setValue("remaindertime", eventRemainderTime);
				editEventForm.setValue("remainderformat", eventRemainderFormat);
				break;
			case "Tasks":
				editEventForm.setValue("color", tasksColor);
				editEventForm.setValue("remaindertime", taskRemainderTime);
				editEventForm.setValue("remainderformat", taskRemainderFormat);
				break;
			case "Birthdays":
				editEventForm.setValue("color", birthdaysColor);
				editEventForm.setValue("remaindertime", birthdayRemainderTime);
				editEventForm.setValue(
					"remainderformat",
					birthdayRemainderFormat
				);
				break;
			default:
				break;
		}
	}, [trigger]);

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle className="text-3xl font-bold text-center text-blue-500">
					Edit {trigger} settings
				</DialogTitle>
			</DialogHeader>
			<Form {...editEventForm}>
				<form
					onSubmit={editEventForm.handleSubmit(onEditEventSubmit)}
					className="space-y-2"
				>
					<FormLabel htmlFor="remaindertime">Remainder</FormLabel>
					<div className="flex items-center justify-between gap-5 !mb-5">
						<FormField
							control={editEventForm.control}
							name="remaindertime"
							render={({ field }) => (
								<FormItem className="w-[35%]">
									<FormControl>
										<Input
											{...field}
											id="remaindertime"
											type="number"
											disabled={isLoading}
											className="focus-visible:border-blue-500 text-end"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={editEventForm.control}
							name="remainderformat"
							render={({ field }) => (
								<FormItem className="w-[65%]">
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											value={field.value}
											disabled={isLoading}
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
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Separator />

					<FormField
						control={editEventForm.control}
						name="color"
						render={({ field }) => (
							<FormItem className="!my-5">
								<FormLabel htmlFor="color">Color</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										value={field.value}
										disabled={isLoading}
									>
										<SelectTrigger
											id="color"
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
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						className="w-full bg-blue-500 hover:bg-blue-500/90"
						type="submit"
						disabled={isLoading}
					>
						Save changes
					</Button>
				</form>
			</Form>
		</DialogContent>
	);
};

export default EditEventTypeModal;
