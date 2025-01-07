import React, { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { BsCalendarEvent } from "react-icons/bs";
import { toast } from "sonner";

import { Context } from "@/pages/app";

import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/dropdown-calendar";

import { cn } from "@/lib/utils";

const AddEventModal = ({ type, date, time, id, handleOpenChange }) => {
	const {
		isLoading,
		setIsLoading,
		eventsColor,
		tasksColor,
		birthdaysColor,
		eventRemainderTime,
		eventRemainderFormat,
		taskRemainderTime,
		taskRemainderFormat,
		birthdayRemainderTime,
		birthdayRemainderFormat,
		setEvents,
		selectedEventProps,
		setSelectedEventProps,
		allMonths,
		allDays,
		newSelectedDate,
		weekDates,
		getEvents,
	} = useContext(Context);

	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	const addEventFormSchema = z.object({
		title: z.union([
			z
				.string()
				.min(0)
				.max(50, {
					message: "Title must be at most 50 characters",
				})
				.regex(
					/^[a-zA-Z\s'-]+$/,
					"Title can only contain letters, spaces, apostrophes, and hyphens"
				),
			z.literal(""),
		]),
		description: z.union([
			z.string().min(0).max(150, {
				message: "Description must be at most 150 characters",
			}),
			z.literal(""),
		]),
		date: z.coerce.date(),
		type: z.string(),
		time: z.string(),
		remaindertime: z.coerce.number(),
		remainderformat: z.string(),
		color: z.string(),
	});

	const addEventForm = useForm({
		resolver: zodResolver(addEventFormSchema),
		defaultValues: {
			title: selectedEventProps === null ? selectedEventProps.title : "",
			description:
				selectedEventProps === null
					? selectedEventProps.description
					: "",
			type:
				selectedEventProps === null ? selectedEventProps.type : "event",
			date: date,
			time:
				selectedEventProps === null
					? selectedEventProps.time === "0"
						? "12:00 AM"
						: selectedEventProps.time
					: "12:00 AM",
			color:
				selectedEventProps === null ? selectedEventProps.color : "blue",
			remaindertime:
				selectedEventProps === null
					? selectedEventProps.remaindertime
					: "30",
			remainderformat:
				selectedEventProps === null
					? selectedEventProps.remainderformat
					: "minute",
		},
	});

	const apiDate = (date, time) => {
		let hour = parseInt(time.split(":")[0]);
		const minute = parseInt(time.split(":")[1].split(" ")[0]);
		const ampm = time.split(" ")[1];

		if (ampm === "PM") {
			hour = hour + 12;
		} else if (ampm === "AM" && hour === 12) {
			hour = 0;
		} else {
			hour = hour;
		}

		return new Date(new Date(date).setHours(hour, minute, 0, 0));
	};

	const onAddEventSubmit = async ({
		title,
		description,
		type,
		date,
		time,
		color,
		remaindertime,
		remainderformat,
	}) => {
		if (!selectedEventProps.type) {
			try {
				setIsLoading(true);
				const addEventResult = await axios.post(
					`${import.meta.env.VITE_SERVER_URL}/api/v1/add-event`,
					{
						title,
						description,
						type: type[0].toUpperCase() + type.slice(1),
						date:
							type === "birthday"
								? apiDate(date, "12:00 AM")
								: apiDate(date, time),
						time: type === "birthday" ? "12:00 AM" : time,
						remaindertime,
						remainderformat,
						color,
					},
					{
						withCredentials: true,
					}
				);

				if (addEventResult.data.status === "Success") {
					toast.success(addEventResult.data.message);
					if (
						weekDates(newSelectedDate)[0].getFullYear() ===
						weekDates(newSelectedDate)[6].getFullYear()
					) {
						getEvents(
							newSelectedDate.getFullYear(),
							null,
							setEvents
						);
					} else {
						getEvents(
							weekDates(newSelectedDate)[0].getFullYear(),
							weekDates(newSelectedDate)[6].getFullYear(),
							setEvents
						);
					}
					handleOpenChange(id, false);
					addEventForm.setValue("title", "");
					addEventForm.setValue("description", "");
				} else {
					toast.error(addEventResult.data.error);
				}
			} catch (error) {
				toast.error(error.message);
			} finally {
				setIsLoading(false);
			}
		} else {
			try {
				setIsLoading(true);
				const addEventResult = await axios.post(
					`${import.meta.env.VITE_SERVER_URL}/api/v1/edit-event`,
					{
						eventid: selectedEventProps.eventid,
						title,
						description,
						type: type[0].toUpperCase() + type.slice(1),
						date:
							type === "birthday"
								? apiDate(date, "12:00 AM")
								: apiDate(date, time),
						time: type === "birthday" ? "12:00 AM" : time,
						remaindertime,
						remainderformat,
						color,
					},
					{
						withCredentials: true,
					}
				);

				if (addEventResult.data.status === "Success") {
					toast.success(addEventResult.data.message);
					if (
						weekDates(newSelectedDate)[0].getFullYear() ===
						weekDates(newSelectedDate)[6].getFullYear()
					) {
						getEvents(
							newSelectedDate.getFullYear(),
							null,
							setEvents
						);
					} else {
						getEvents(
							weekDates(newSelectedDate)[0].getFullYear(),
							weekDates(newSelectedDate)[6].getFullYear(),
							setEvents
						);
					}
					handleOpenChange(id, false);
					setSelectedEventProps({});
				} else {
					toast.error(addEventResult.data.error);
				}
			} catch (error) {
				toast.error(error.message);
			} finally {
				setIsLoading(false);
			}
		}
	};

	useEffect(() => {
		addEventForm.setValue("date", date);
		addEventForm.setValue("time", time);
	}, [date, time]);

	useEffect(() => {
		if (type !== "edit") {
			if (addEventForm.watch().type === "event") {
				addEventForm.setValue("color", eventsColor);
				addEventForm.setValue("remaindertime", eventRemainderTime);
				addEventForm.setValue("remainderformat", eventRemainderFormat);
			} else if (addEventForm.watch().type === "task") {
				addEventForm.setValue("color", tasksColor);
				addEventForm.setValue("remaindertime", taskRemainderTime);
				addEventForm.setValue("remainderformat", taskRemainderFormat);
			} else if (addEventForm.watch().type === "birthday") {
				addEventForm.setValue("color", birthdaysColor);
				addEventForm.setValue("remaindertime", birthdayRemainderTime);
				addEventForm.setValue(
					"remainderformat",
					birthdayRemainderFormat
				);
			}
		}
	}, [addEventForm.watch().type]);

	useEffect(() => {
		if (type === "edit") {
			addEventForm.setValue("title", selectedEventProps.title);
			addEventForm.setValue(
				"description",
				selectedEventProps.description
			);
			addEventForm.setValue("type", selectedEventProps.type);
			addEventForm.setValue("time", selectedEventProps.time);
			addEventForm.setValue("color", selectedEventProps.color);
			addEventForm.setValue(
				"remaindertime",
				selectedEventProps.remaindertime
			);
			addEventForm.setValue(
				"remainderformat",
				selectedEventProps.remainderformat
			);
		}
	}, [selectedEventProps]);

	return (
		<DialogContent
			onInteractOutside={(e) => {
				e.preventDefault();
			}}
			onClick={(e) => {
				e.stopPropagation();
			}}
			className="sm:max-w-[450px]"
		>
			<DialogHeader>
				<DialogTitle className="text-3xl font-bold text-center text-blue-500">
					{type === "edit" ? "Edit" : "Add"} Event
				</DialogTitle>
			</DialogHeader>
			<Form {...addEventForm}>
				<form
					onSubmit={addEventForm.handleSubmit(onAddEventSubmit)}
					className="space-y-2"
				>
					<FormField
						control={addEventForm.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="title">
									{addEventForm.watch().type === "event"
										? "Event Title"
										: addEventForm.watch().type === "task"
										? "Task Title"
										: "Name"}
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										id="title"
										placeholder={
											addEventForm.watch().type ===
											"event"
												? "Enter event title"
												: addEventForm.watch().type ===
												  "task"
												? "Enter task title"
												: "Enter name"
										}
										disabled={isLoading}
										className="focus-visible:border-blue-500"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={addEventForm.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="description">
									{addEventForm.watch().type === "event"
										? "Event Description"
										: addEventForm.watch().type === "task"
										? "Task Description"
										: "Description"}
								</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										id="description"
										placeholder={
											addEventForm.watch().type ===
											"event"
												? "Enter event description"
												: addEventForm.watch().type ===
												  "task"
												? "Enter task description"
												: "Enter description"
										}
										disabled={isLoading}
										className="focus-visible:border-blue-500 resize-none"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div>
						<FormLabel htmlFor="time">
							{addEventForm.watch().type === "event"
								? "Event Date & Time"
								: addEventForm.watch().type === "task"
								? "Task Date & Time"
								: addEventForm.watch().type === "birthday"
								? "Birthday Date"
								: "Date & Time"}
						</FormLabel>
						<div className="flex items-center justify-center gap-5 mt-2">
							<FormField
								control={addEventForm.control}
								name="date"
								render={({ field }) => (
									<FormItem className="w-full">
										<FormControl>
											<Popover
												open={isCalendarOpen}
												onOpenChange={setIsCalendarOpen}
											>
												<PopoverTrigger asChild>
													<Button
														variant={"outline"}
														id="time"
														className={cn(
															"flex items-center justify-between max-w-fit gap-2 focus:ring-0 min-w-[100%]",
															!field.value &&
																"text-muted-foreground"
														)}
														disabled={isLoading}
													>
														{field.value.getDate()}{" "}
														{
															allMonths[
																field.value.getMonth()
															]
														}{" "}
														{field.value.getFullYear()}
														,{" "}
														{
															allDays[
																field.value.getDay()
															]
														}
														<BsCalendarEvent className="w-4 h-4 opacity-50" />
													</Button>
												</PopoverTrigger>
												<PopoverContent
													className="w-auto p-0"
													align="start"
												>
													<Calendar
														mode="single"
														selected={field.value}
														captionLayout="dropdown-buttons"
														onSelect={(e) => {
															field.onChange(e);
															setIsCalendarOpen(
																false
															);
														}}
														initialFocus
														fromYear={1901}
														toYear={2100}
													/>
												</PopoverContent>
											</Popover>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{addEventForm.watch().type !== "birthday" && (
								<FormField
									control={addEventForm.control}
									name="time"
									render={({ field }) => (
										<FormItem className="w-[40%]">
											<FormControl>
												<Select
													onValueChange={
														field.onChange
													}
													defaultValue={field.value}
													value={field.value}
													disabled={isLoading}
												>
													<SelectTrigger
														id="time"
														className="max-w-fit gap-2 focus:ring-0 min-w-[100%]"
													>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<ScrollArea className="h-56">
															<SelectGroup>
																{[
																	...Array.from(
																		{
																			length: 2,
																		},
																		(
																			_,
																			i
																		) => i
																	).map(
																		(
																			ampm
																		) => [
																			...Array.from(
																				{
																					length: 12,
																				},
																				(
																					_,
																					i
																				) => {
																					return i ===
																						0
																						? 12
																						: i;
																				}
																			).map(
																				(
																					hour
																				) => [
																					...Array.from(
																						{
																							length: 12,
																						},
																						(
																							_,
																							i
																						) => {
																							return i *
																								5 <
																								10
																								? `0${
																										i *
																										5
																								  }`
																								: i *
																										5;
																						}
																					).map(
																						(
																							minute
																						) => (
																							<SelectItem
																								key={`${hour}:${minute}${
																									ampm ===
																									0
																										? " AM"
																										: " PM"
																								}`}
																								value={`${hour}:${minute}${
																									ampm ===
																									0
																										? " AM"
																										: " PM"
																								}`}
																							>
																								{
																									hour
																								}

																								:
																								{
																									minute
																								}
																								{ampm ===
																								0
																									? " AM"
																									: " PM"}
																							</SelectItem>
																						)
																					),
																				]
																			),
																		]
																	),
																]}
																{}
															</SelectGroup>
														</ScrollArea>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						</div>
					</div>

					<FormField
						control={addEventForm.control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="type">Event Type</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										value={field.value}
										disabled={isLoading}
									>
										<SelectTrigger
											id="type"
											className="max-w-fit gap-2 focus:ring-0 min-w-[100%]"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="event">
													<div className="flex items-center">
														<span className="ml-1 mr-3">
															📅
														</span>
														Event
													</div>
												</SelectItem>
												<SelectItem value="task">
													<div className="flex items-center">
														<span className="ml-1 mr-3">
															📝
														</span>
														Task
													</div>
												</SelectItem>
												<SelectItem value="birthday">
													<div className="flex items-center">
														<span className="ml-1 mr-3">
															🎂
														</span>
														Birthday
													</div>
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div>
						<FormLabel htmlFor="remaindertime" className="!mt-2">
							Remainder
						</FormLabel>
						<div className="flex items-center justify-between gap-5 mt-2">
							<FormField
								control={addEventForm.control}
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
								control={addEventForm.control}
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
					</div>

					<FormField
						control={addEventForm.control}
						name="color"
						render={({ field }) => (
							<FormItem>
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
						{type === "edit" ? "Save Changes" : "Save Event"}
					</Button>
				</form>
			</Form>
		</DialogContent>
	);
};

export default AddEventModal;
