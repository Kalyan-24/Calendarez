import React, { useContext, useState } from "react";
import { LuUser2, LuBellRing, LuUndo2 } from "react-icons/lu";
import { toast } from "sonner";
import axios from "axios";
import { IoCheckmarkDone } from "react-icons/io5";
import { LucidePencil, LucideShare, LucideTrash2 } from "lucide-react";

import { Context } from "@/pages/app";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "./ui/context-menu";
import AddEventModal from "./add-event-modal";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialogDescription,
} from "./ui/alert-dialog";
import InviteModal from "./invite-modal";
import { Button } from "./ui/button";
import VerifyAccountModal from "./verify-account-modal";

import { cn } from "@/lib/utils";

const EventCard = ({
	eventId,
	date,
	time,
	names,
	type,
	description,
	remainderTime,
	remainderFormat,
	color,
	isCompleted,
	innerOpen,
	setInnerOpen,
	editOpen,
	setEditOpen,
	deleteOpen,
	setDeleteOpen,
	inviteOpen,
	setInviteOpen,
	from,
	setShowOuterOverlay,
}) => {
	const {
		setIsLoading,
		setEvents,
		allMonths,
		allDays,
		isAuthenticated,
		user,
		isLoading,
		authtype,
		setAuthType,
		holidaysColor,
		eventsColor,
		tasksColor,
		birthdaysColor,
		holidayRemainderTime,
		holidayRemainderFormat,
		selectedEventProps,
		newSelectedDate,
		setSelectedEventProps,
		getHexFromColor,
		weekDates,
		getEvents,
	} = useContext(Context);

	const [openDialogId, setOpenDialogId] = useState(null);
	const [editDialogId, setEditDialogId] = useState(null);
	const [deleteDialogId, setDeleteDialogId] = useState(null);
	const [inviteDialogId, setInviteDialogId] = useState(null);

	const [showOverlay, setShowOverlay] = useState(true);

	const handleOpenChange = (id, open) => {
		setOpenDialogId(open ? id : null);
		setInnerOpen(open);
		if (setShowOuterOverlay) {
			setShowOuterOverlay(!open);
		}
	};

	const handleEditOpenChange = (id, open) => {
		setEditDialogId(open ? id : null);
		setEditOpen(open);
		setShowOverlay(!open);
		if (setShowOuterOverlay) {
			setShowOuterOverlay(!open);
		}
	};

	const handleDeleteOpenChange = (id, open) => {
		setDeleteDialogId(open ? id : null);
		setDeleteOpen(open);
		setShowOverlay(!open);
		if (setShowOuterOverlay) {
			setShowOuterOverlay(!open);
		}
	};

	const handleInviteOpenChange = (id, open) => {
		setInviteDialogId(open ? id : null);
		setInviteOpen(open);
		setShowOverlay(!open);
		if (setShowOuterOverlay) {
			setShowOuterOverlay(!open);
		}
	};

	const handleDeleteEventSubmit = async (eventId) => {
		try {
			setIsLoading(true);
			const deleteEventResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/delete-event`,
				{ eventid: eventId },
				{
					withCredentials: true,
				}
			);

			if (deleteEventResult.data.status === "Success") {
				toast.success(deleteEventResult.data.message);
				if (
					weekDates(newSelectedDate)[0].getFullYear() ===
					weekDates(newSelectedDate)[6].getFullYear()
				) {
					getEvents(newSelectedDate.getFullYear(), null, setEvents);
				} else {
					getEvents(
						weekDates(newSelectedDate)[0].getFullYear(),
						weekDates(newSelectedDate)[6].getFullYear(),
						setEvents
					);
				}
				handleDeleteOpenChange(null, false);
			} else {
				toast.error(deleteEventResult.data.error);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleTaskCompleteSubmit = async (eventId) => {
		try {
			setIsLoading(true);
			const taskCompleteResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/task-complete`,
				{ eventid: eventId },
				{
					withCredentials: true,
				}
			);

			if (taskCompleteResult.data.status === "Success") {
				toast.success(taskCompleteResult.data.message);
				if (
					weekDates(newSelectedDate)[0].getFullYear() ===
					weekDates(newSelectedDate)[6].getFullYear()
				) {
					getEvents(newSelectedDate.getFullYear(), null, setEvents);
				} else {
					getEvents(
						weekDates(newSelectedDate)[0].getFullYear(),
						weekDates(newSelectedDate)[6].getFullYear(),
						setEvents
					);
				}
				handleOpenChange(null, false);
			} else {
				toast.error(taskCompleteResult.data.error);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="relative w-[calc(100%-12px)] h-full">
			{names.map((name, index) => (
				<Tooltip key={index}>
					<TooltipTrigger
						style={{
							width:
								names.length > 1 && index !== names.length - 1
									? `calc(${170 / names.length}%)`
									: `calc(${100 / names.length}%)`,
							left:
								index === 0
									? "0px"
									: `calc(${(100 / names.length) * index}%)`,
						}}
						className={cn(
							"flex h-fit",
							index === 0 && "relative",
							index !== 0 && `absolute`
						)}
						onContextMenu={(e) => {
							if (type === "Holiday") {
								e.preventDefault();
							}
						}}
					>
						<Dialog
							open={
								openDialogId === `${date.getDate()} ${index}` &&
								innerOpen
							}
							onOpenChange={(open) => {
								handleOpenChange(
									`${date.getDate()} ${index}`,
									open
								);
							}}
						>
							<AlertDialog
								open={
									deleteDialogId ===
										`${date.getDate()} ${index}` &&
									deleteOpen
								}
								onOpenChange={(open) => {
									handleDeleteOpenChange(
										`${date.getDate()} ${index}`,
										open
									);
								}}
							>
								<ContextMenu>
									<ContextMenuTrigger asChild>
										<DialogTrigger asChild>
											<div
												className="flex relative w-full h-fit"
												onClick={(e) => {
													e.stopPropagation();
												}}
											>
												<div
													style={{
														backgroundColor:
															type[index] ===
																"Task" &&
															isCompleted[
																index
															] &&
															getHexFromColor(
																color[index],
																0.5
															),
													}}
													className={cn(
														"flex flex-col border border-grey-100 items-start justify-center p-1 cursor-pointer w-full h-fit absolute text-white rounded-sm",
														type === "Holiday" &&
															`bg-${holidaysColor}-500`,
														(type[index] ===
															"Event" ||
															type[index] ===
																"Task" ||
															type[index] ===
																"Birthday") &&
															`bg-${color[index]}-500`,
														type[index] ===
															"Task" &&
															isCompleted[
																index
															] &&
															"line-through"
													)}
												>
													<div
														className={cn(
															"line-clamp-1 w-full text-start text-xs pr-1",
															!name && "italic"
														)}
													>
														{type === "Holiday" &&
															"🏖️"}
														{type[index] ===
															"Event" && "📅"}
														{type[index] ===
															"Task" && "📝"}
														{type[index] ===
															"Birthday" && "🎂"}
														{name || "[Untitled]"}
														{type[index] &&
															type[index] ===
																"Birthday" &&
															name !== "" &&
															"'s Birthday"}
													</div>
													{from !== "month" &&
														type !== "Holiday" &&
														type[index] !==
															"Birthday" && (
															<div className="line-clamp-1 w-fit text-[11px] pr-1">
																{time[index]}
															</div>
														)}
												</div>
											</div>
										</DialogTrigger>
									</ContextMenuTrigger>

									{type !== "Holiday" && (
										<ContextMenuContent>
											{type[index] === "Task" && (
												<>
													<ContextMenuItem
														onClick={(e) => {
															e.stopPropagation();
															handleTaskCompleteSubmit(
																eventId[index]
															);
															isCompleted[index] =
																!isCompleted[
																	index
																];
														}}
													>
														{isCompleted[index] ? (
															<>
																<LuUndo2 className="mr-2 w-4 h-4" />
																Mark as
																Incomplete
															</>
														) : (
															<>
																<IoCheckmarkDone className="ml-1 mr-2 w-5 h-5" />
																Mark as
																Completed
															</>
														)}
													</ContextMenuItem>
													<ContextMenuSeparator />
												</>
											)}

											<ContextMenuItem
												onClick={(e) => {
													e.stopPropagation();
													handleEditOpenChange(
														`${date.getDate()} ${index}`,
														true
													);
													setSelectedEventProps({
														eventid: eventId[index],
														title: name,
														description:
															description[index],
														type: type[
															index
														].toLowerCase(),
														date: date[index],
														time:
															time[index] === "0"
																? "12:00 AM"
																: time[index],
														remaindertime:
															remainderTime[
																index
															],
														remainderformat:
															remainderFormat[
																index
															],
														color: color[index],
													});
												}}
											>
												<LucidePencil className="ml-1 mr-3 w-4 h-4" />
												Edit
											</ContextMenuItem>

											<AlertDialogTrigger asChild>
												<ContextMenuItem
													onClick={(e) =>
														e.stopPropagation()
													}
												>
													<LucideTrash2 className="ml-1 mr-3 w-4 h-4" />
													Delete
												</ContextMenuItem>
											</AlertDialogTrigger>

											{type[index] !== "Task" &&
												date > new Date() && (
													<ContextMenuItem
														onClick={(e) => {
															e.stopPropagation();
															handleInviteOpenChange(
																`${date.getDate()} ${index}`,
																true
															);
														}}
													>
														<LucideShare className="ml-1 mr-3 w-4 h-4" />
														Invite
													</ContextMenuItem>
												)}
										</ContextMenuContent>
									)}
									<Dialog
										open={
											editDialogId ===
												`${date.getDate()} ${index}` &&
											editOpen
										}
										onOpenChange={(open) => {
											handleEditOpenChange(
												`${date.getDate()} ${index}`,
												open
											);
										}}
									>
										{user?.isverified ? (
											<AddEventModal
												type={"edit"}
												date={date}
												time={time[index]}
												id={`${date.getDate()} ${index}`}
												handleOpenChange={
													handleEditOpenChange
												}
											/>
										) : (
											<VerifyAccountModal
												handleOpenChange={
													handleEditOpenChange
												}
											/>
										)}
									</Dialog>

									<Dialog
										open={
											inviteDialogId ===
												`${date.getDate()} ${index}` &&
											inviteOpen
										}
										onOpenChange={(open) => {
											handleInviteOpenChange(
												`${date.getDate()} ${index}`,
												open
											);
										}}
									>
										{user?.isverified ? (
											<InviteModal
												eventId={
													eventId && eventId[index]
												}
												inviteOpen={inviteOpen}
											/>
										) : (
											<VerifyAccountModal
												handleOpenChange={
													handleInviteOpenChange
												}
											/>
										)}
									</Dialog>
								</ContextMenu>

								{user?.isverified ? (
									<AlertDialogContent
										onClick={(e) => e.stopPropagation()}
										onInteractOutside={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
									>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Are you sure you want to delete
												this event?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel
												disabled={isLoading}
											>
												Cancel
											</AlertDialogCancel>
											<Button
												onClick={() =>
													handleDeleteEventSubmit(
														eventId[index]
													)
												}
												className="bg-red-500 hover:bg-red-500/90"
												disabled={isLoading}
											>
												Delete
											</Button>
										</AlertDialogFooter>
									</AlertDialogContent>
								) : (
									<VerifyAccountModal
										from="delete"
										handleOpenChange={
											handleDeleteOpenChange
										}
									/>
								)}

								<DialogContent
									showOverlay={showOverlay}
									className="sm:max-w-[425px]"
									onClick={(e) => e.stopPropagation()}
									onInteractOutside={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
								>
									<DialogHeader className={"mt-6"}>
										<DialogTitle
											className={cn(
												"text-2xl",
												type === "Holiday" &&
													`text-${holidaysColor}-500`,
												(type[index] === "Event" ||
													type[index] === "Task" ||
													type[index] ===
														"Birthday") &&
													`text-${color[index]}-500`
											)}
										>
											{name || "[Untitled]"}
											{type[index] &&
												type[index] === "Birthday" &&
												name !== "" &&
												"'s Birthday"}
										</DialogTitle>

										{(type[index] === "Event" ||
											type[index] === "Task" ||
											type[index] === "Birthday") && (
											<DialogDescription className="text-gray-600 text-xs">
												{description[index] ||
													"[No description]"}
											</DialogDescription>
										)}

										<DialogDescription className="text-gray-600">
											{`${date.getDate()} ${
												allMonths[date.getMonth()]
											} ${date.getFullYear()}, ${
												allDays[date.getDay()]
											}`}
											{type !== "Holiday" &&
												type[index] !== "Birthday" &&
												` | ${time[index]}`}
										</DialogDescription>
									</DialogHeader>
									<span>
										<DialogDescription className="text-gray-600 flex items-center gap-[10px]">
											{type === "Holiday" ? (
												<span className="text-[1rem]">
													🏖️
												</span>
											) : type[index] === "Event" ? (
												<span className="text-[1rem]">
													📅
												</span>
											) : type[index] === "Task" ? (
												<span className="text-[1rem]">
													📝
												</span>
											) : (
												type[index] === "Birthday" && (
													<span className="text-[1rem]">
														🎂
													</span>
												)
											)}
											{/* <BsCalendarEvent className="w-5 h-5" /> */}
											{type === "Holiday"
												? type
												: type[index]}
										</DialogDescription>

										{type !== "Holiday" && (
											<DialogDescription className="text-gray-600 flex items-center gap-3 mt-4">
												<LuBellRing className="w-5 h-5" />
												{type[index] === "Birthday" ? (
													<>
														{holidayRemainderTime}{" "}
														{holidayRemainderFormat[0].toUpperCase() +
															holidayRemainderFormat.slice(
																1
															)}
														s before 12:00 AM
													</>
												) : (
													<>
														{remainderTime[index]}{" "}
														{remainderFormat[
															index
														][0].toUpperCase() +
															remainderFormat[
																index
															].slice(1)}
														s before {time[index]}{" "}
													</>
												)}
											</DialogDescription>
										)}

										<DialogDescription className="text-gray-600 flex items-center gap-3 mt-4">
											<LuUser2 className="w-5 h-5" />
											{isAuthenticated &&
											type !== "Holiday" ? (
												<>{user.username}</>
											) : (
												<>Public</>
											)}
										</DialogDescription>
									</span>
									<DialogFooter>
										{type[index] === "Task" && (
											<Button
												className="flex items-center gap-2"
												variant="outline"
												onClick={() => {
													handleTaskCompleteSubmit(
														eventId[index]
													);
													isCompleted[index] =
														!isCompleted[index];
												}}
												disabled={isLoading}
											>
												{isCompleted[index] ? (
													<>
														<LuUndo2 className="w-4 h-4" />
														Mark as Incomplete
													</>
												) : (
													<>
														<IoCheckmarkDone className="w-5 h-5" />
														Mark as Completed
													</>
												)}
											</Button>
										)}
									</DialogFooter>

									{type !== "Holiday" && (
										<>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className={cn(
															"absolute top-[6px] right-[120px]",
															(type[index] ===
																"Task" ||
																date <
																	new Date()) &&
																"right-[80px]"
														)}
														onClick={(e) => {
															e.stopPropagation();
															handleEditOpenChange(
																`${date.getDate()} ${index}`,
																true
															);
															setSelectedEventProps(
																{
																	eventid:
																		eventId[
																			index
																		],
																	title: name,
																	description:
																		description[
																			index
																		],
																	type: type[
																		index
																	].toLowerCase(),
																	date: date[
																		index
																	],
																	time:
																		time[
																			index
																		] ===
																		"0"
																			? "12:00 AM"
																			: time[
																					index
																			  ],
																	remaindertime:
																		remainderTime[
																			index
																		],
																	remainderformat:
																		remainderFormat[
																			index
																		],
																	color: color[
																		index
																	],
																}
															);
														}}
													>
														<LucidePencil className="w-4 h-4" />
													</Button>
												</TooltipTrigger>
												<TooltipContent className="bg-gray-700">
													Edit
												</TooltipContent>
											</Tooltip>

											<Tooltip>
												<TooltipTrigger asChild>
													<AlertDialogTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className={cn(
																"absolute top-[6px] right-20",
																(type[index] ===
																	"Task" ||
																	date <
																		new Date()) &&
																	"right-10"
															)}
														>
															<LucideTrash2 className="w-4 h-4" />
														</Button>
													</AlertDialogTrigger>
												</TooltipTrigger>
												<TooltipContent className="bg-gray-700">
													Delete
												</TooltipContent>
											</Tooltip>

											{type[index] !== "Task" &&
												date > new Date() && (
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="absolute top-[6px] right-10"
																onClick={(
																	e
																) => {
																	e.stopPropagation();
																	handleInviteOpenChange(
																		`${date.getDate()} ${index}`,
																		true
																	);
																}}
															>
																<LucideShare className="w-4 h-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent className="bg-gray-700">
															Invite
														</TooltipContent>
													</Tooltip>
												)}
										</>
									)}
								</DialogContent>
							</AlertDialog>
						</Dialog>
					</TooltipTrigger>
					<TooltipContent className="bg-gray-700">
						<p>
							{name || "[Untitled]"}
							{type[index] &&
								type[index] === "Birthday" &&
								name !== "" &&
								"'s Birthday"}
						</p>
					</TooltipContent>
				</Tooltip>
			))}
		</div>
	);
};

export default EventCard;
