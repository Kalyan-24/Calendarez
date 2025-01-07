import React, { useContext, useEffect, useState } from "react";

import { Context } from "@/pages/app";

import AddEventModal from "@/components/add-event-modal";
import AuthModal from "@/components/auth-modal";
import EventCard from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import VerifyAccountModal from "@/components/verify-account-modal";

import { cn } from "@/lib/utils";

const MonthCalendar = () => {
	const {
		setAuthType,
		isAuthenticated,
		user,
		monthDates,
		newSelectedDate,
		setNewSelectedDate,
		allMonths,
		allDays,
		holidays,
		events,
		showHolidays,
		showEvents,
		showTasks,
		showBirthdays,
	} = useContext(Context);

	const [open, setOpen] = useState(false);
	const [innerOpen, setInnerOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [inviteOpen, setInviteOpen] = useState(false);

	const [openDialogId, setOpenDialogId] = useState(null);

	const [monthHolidays, setMonthHolidays] = useState([]);
	const [monthBirthdays, setMonthBirthdays] = useState([]);
	const [monthEvents, setMonthEvents] = useState([]);

	const handleOpenChange = (id, open) => {
		setOpenDialogId(open ? id : null);
		setOpen(open);
	};

	const showEventsAndTasks = () => {
		let eventsAndTasks =
			events && events.filter((event) => event.type !== "Birthday");
		if (!eventsAndTasks) return;
		if (!showEvents && !showTasks) {
			eventsAndTasks = [];
		} else if (showEvents && !showTasks) {
			eventsAndTasks = eventsAndTasks.filter(
				(event) => event.type === "Event"
			);
		} else if (!showEvents && showTasks) {
			eventsAndTasks = eventsAndTasks.filter(
				(event) => event.type === "Task"
			);
		}

		let tempEvents = [];

		if (eventsAndTasks) {
			eventsAndTasks.map((event) => {
				monthDates(newSelectedDate).map((week) => {
					week.map((date) => {
						if (
							new Date(event.date).getDate() === date.getDate() &&
							new Date(event.date).getMonth() + 1 ===
								date.getMonth() + 1 &&
							new Date(event.date).getFullYear() ===
								date.getFullYear()
						) {
							tempEvents.push(event);
						}
					});
				});
			});
		}

		if (tempEvents) {
			tempEvents = tempEvents.reduce((previous, current) => {
				const key = `${new Date(current.date).getDate()}-${new Date(
					current.date
				).getMonth()}-${new Date(current.date).getFullYear()}`;

				if (!previous[key]) {
					previous[key] = {
						...current,
						_id: [current._id],
						title: [current.title],
						description: [current.description],
						type: [current.type],
						date: [current.date],
						time: [current.time],
						remaindertime: [current.remaindertime],
						remainderformat: [current.remainderformat],
						color: [current.color],
						iscompleted: [current.iscompleted],
					};
				} else {
					previous[key]._id.push(current._id);
					previous[key].title.push(current.title);
					previous[key].description.push(current.description);
					previous[key].type.push(current.type);
					previous[key].date.push(current.date);
					previous[key].time.push(current.time);
					previous[key].remaindertime.push(current.remaindertime);
					previous[key].remainderformat.push(current.remainderformat);
					previous[key].color.push(current.color);
					previous[key].iscompleted.push(current.iscompleted);
				}

				return previous;
			}, {});

			tempEvents = Object.values(tempEvents);
			setMonthEvents(tempEvents);
		}
	};

	useEffect(() => {
		let tempHolidays = [];
		try {
			holidays.map((holiday) => {
				monthDates(newSelectedDate).map((week) => {
					week.map((date) => {
						if (
							parseInt(holiday.Date) === date.getDate() &&
							holiday.Month === allMonths[date.getMonth()] &&
							parseInt(holiday.Year) === date.getFullYear()
						) {
							tempHolidays.push(holiday);
						}
					});
				});
			});

			tempHolidays = tempHolidays.map((holiday) => ({
				...holiday,
				Type: "Holiday",
			}));

			tempHolidays = tempHolidays.reduce((previous, current) => {
				const key = `${current.Date}-${current.Month}-${current.Year}`;

				if (!previous[key]) {
					previous[key] = {
						...current,
						_id: [current._id],
						Name: [current.Name],
					};
				} else {
					previous[key]._id.push(current._id);
					previous[key].Name.push(current.Name);
				}

				return previous;
			}, {});

			tempHolidays = Object.values(tempHolidays);

			setMonthHolidays(tempHolidays);
		} catch (error) {
			toast.error(error.message);
		}
	}, [holidays]);

	useEffect(() => {
		const onlyBirthdays =
			events && events.filter((event) => event.type === "Birthday");
		let tempBirthdays = [];

		if (onlyBirthdays) {
			onlyBirthdays.map((birthday) => {
				monthDates(newSelectedDate).map((week) => {
					week.map((date) => {
						if (
							new Date(birthday.date).getDate() ===
								date.getDate() &&
							new Date(birthday.date).getMonth() + 1 ===
								date.getMonth() + 1 &&
							new Date(birthday.date).getFullYear() ===
								date.getFullYear()
						) {
							tempBirthdays.push(birthday);
						}
					});
				});
			});
		}

		if (tempBirthdays) {
			tempBirthdays = tempBirthdays.reduce((previous, current) => {
				const key = `${new Date(current.date).getDate()}-${new Date(
					current.date
				).getMonth()}-${new Date(current.date).getFullYear()}-${
					current.time.split(":")[0]
				}-${current.time.split(" ")[1]}`;

				if (!previous[key]) {
					previous[key] = {
						_id: [current._id],
						name: [current.title],
						description: [current.description],
						type: [current.type],
						date: [current.date],
						time: ["0"],
						remaindertime: [current.remaindertime],
						remainderformat: [current.remainderformat],
						color: [current.color],
					};
				} else {
					previous[key]._id.push(current._id);
					previous[key].name.push(current.title);
					previous[key].description.push(current.description);
					previous[key].type.push(current.type);
					previous[key].date.push(current.date);
					previous[key].time.push("0");
					previous[key].remaindertime.push(current.remaindertime);
					previous[key].remainderformat.push(current.remainderformat);
					previous[key].color.push(current.color);
				}

				return previous;
			}, {});

			tempBirthdays = Object.values(tempBirthdays);

			setMonthBirthdays(tempBirthdays);
		}
	}, [isAuthenticated, newSelectedDate, events]);

	useEffect(() => {
		let eventsAndTasks =
			events && events.filter((event) => event.type !== "Birthday");

		if (!eventsAndTasks) return;

		if (!showEvents && !showTasks) {
			eventsAndTasks = [];
		} else if (showEvents && !showTasks) {
			eventsAndTasks = eventsAndTasks.filter(
				(event) => event.type === "Event"
			);
		} else if (!showEvents && showTasks) {
			eventsAndTasks = eventsAndTasks.filter(
				(event) => event.type === "Task"
			);
		}

		let tempEvents = [];

		if (eventsAndTasks) {
			eventsAndTasks.map((event) => {
				monthDates(newSelectedDate).map((week) => {
					week.map((date) => {
						if (
							new Date(event.date).getDate() === date.getDate() &&
							new Date(event.date).getMonth() + 1 ===
								date.getMonth() + 1 &&
							new Date(event.date).getFullYear() ===
								date.getFullYear()
						) {
							tempEvents.push(event);
						}
					});
				});
			});
		}

		if (tempEvents) {
			tempEvents = tempEvents.reduce((previous, current) => {
				const key = `${new Date(current.date).getDate()}-${new Date(
					current.date
				).getMonth()}-${new Date(current.date).getFullYear()}`;

				if (!previous[key]) {
					previous[key] = {
						...current,
						_id: [current._id],
						title: [current.title],
						description: [current.description],
						type: [current.type],
						date: [current.date],
						time: [current.time],
						remaindertime: [current.remaindertime],
						remainderformat: [current.remainderformat],
						color: [current.color],
						iscompleted: [current.iscompleted],
					};
				} else {
					previous[key]._id.push(current._id);
					previous[key].title.push(current.title);
					previous[key].description.push(current.description);
					previous[key].type.push(current.type);
					previous[key].date.push(current.date);
					previous[key].time.push(current.time);
					previous[key].remaindertime.push(current.remaindertime);
					previous[key].remainderformat.push(current.remainderformat);
					previous[key].color.push(current.color);
					previous[key].iscompleted.push(current.iscompleted);
				}

				return previous;
			}, {});

			tempEvents = Object.values(tempEvents);

			setMonthEvents(tempEvents);
		}
	}, [events]);

	useEffect(() => {
		showEventsAndTasks();
	}, [showEvents, showTasks]);

	return (
		<div className="flex flex-col w-full h-full pb-[1px]">
			<div className="flex items-center w-full">
				{allDays.map((day, index) => {
					const isToday =
						new Date().getMonth() ===
							new Date(newSelectedDate).getMonth() &&
						new Date().getFullYear() ===
							new Date(newSelectedDate).getFullYear() &&
						day === allDays[new Date().getDay()];
					const isSelected =
						day === allDays[new Date(newSelectedDate).getDay()];

					return (
						<div
							key={index}
							className={cn(
								"flex items-center justify-center w-full h-full relative text-sm font-semibold pt-3 pb-2",
								isToday && "text-slate-700",
								isSelected && "text-blue-500",
								!isToday && !isSelected && "text-slate-500/80"
							)}
						>
							{day.substring(0, 3)}

							{index !== 6 && (
								<Separator
									orientation="vertical"
									className="w-[0.5px] h-full bottom-0 absolute right-0"
								/>
							)}
						</div>
					);
				})}
			</div>
			<Separator className="w-full h-[0.5px]" />

			<div className="flex flex-col w-full h-full">
				{monthDates(newSelectedDate).map((week, index) => (
					<div
						key={index}
						className="flex items-center w-full h-full"
					>
						{week.map((date, ind) => {
							const isToday =
								date.toDateString() ===
								new Date().toDateString();
							const isSelected =
								date.toDateString() ===
								newSelectedDate.toDateString();

							return (
								<div
									key={ind}
									className="w-full h-full relative"
								>
									<div className="w-full h-full flex flex-col items-center justify-start">
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													className={cn(
														"text-xs font-normal py-2 px-2 rounded-full w-6 h-6 aspect-square mt-2 mb-1 text-slate-400/80",
														isToday &&
															"bg-[hsl(var(--accent))] text-slate-700 hover:text-[hsl(var(--accent-foreground))]",
														isSelected &&
															"bg-blue-500 text-[hsl(var(--primary-foreground))] hover:bg-blue-500/90 hover:text-[hsl(var(--primary-foreground))]",
														!isToday &&
															!isSelected &&
															date.getMonth() ===
																newSelectedDate.getMonth() &&
															"text-slate-700"
													)}
													onClick={() => {
														setNewSelectedDate(
															date
														);
													}}
												>
													{date.getDate()}
												</Button>
											</TooltipTrigger>
											<TooltipContent className="bg-gray-700">
												{`${date.getDate()} ${
													allMonths[date.getMonth()]
												} ${date.getFullYear()}
                                        `}
											</TooltipContent>
										</Tooltip>

										<Dialog
											open={
												openDialogId ===
													date.toDateString() && open
											}
											onOpenChange={(open) => {
												if (
													!innerOpen &&
													!editOpen &&
													!deleteOpen &&
													!inviteOpen
												) {
													handleOpenChange(
														date.toDateString(),
														open
													);
												} else {
													handleOpenChange(
														date.toDateString(),
														false
													);
												}
											}}
										>
											<DialogTrigger
												onClick={() =>
													setAuthType("login")
												}
												asChild
											>
												<div className="w-full h-full flex flex-col relative cursor-pointer">
													{showHolidays && (
														<div className="w-full h-fit relative">
															{monthHolidays.map(
																(
																	holiday,
																	i
																) => {
																	if (
																		date.getDate() ===
																			parseInt(
																				holiday.Date
																			) &&
																		allMonths[
																			date.getMonth()
																		] ===
																			holiday.Month &&
																		date.getFullYear() ===
																			parseInt(
																				holiday.Year
																			)
																	) {
																		return (
																			<EventCard
																				key={
																					i
																				}
																				date={
																					date
																				}
																				names={
																					holiday.Name
																				}
																				time="0"
																				type={
																					holiday.Type
																				}
																				innerOpen={
																					innerOpen
																				}
																				setInnerOpen={
																					setInnerOpen
																				}
																			/>
																		);
																	}
																}
															)}
														</div>
													)}

													{showBirthdays && (
														<div
															className={cn(
																"w-full h-fit relative",
																monthBirthdays &&
																	monthBirthdays.length !==
																		0 &&
																	monthHolidays.length !==
																		0 &&
																	showHolidays &&
																	showBirthdays &&
																	"mt-[1px] bottom-[-25px]"
															)}
														>
															{monthBirthdays &&
																monthBirthdays.map(
																	(
																		birthday,
																		ind
																	) => {
																		for (
																			let i = 0;
																			i <
																			birthday
																				.name
																				.length;
																			i++
																		) {
																			if (
																				date.getDate() ===
																					new Date(
																						birthday.date[
																							i
																						]
																					).getDate() &&
																				date.getMonth() ===
																					new Date(
																						birthday.date[
																							i
																						]
																					).getMonth() &&
																				date.getFullYear() ===
																					new Date(
																						birthday.date[
																							i
																						]
																					).getFullYear()
																			) {
																				return (
																					<div
																						key={
																							ind
																						}
																					>
																						<EventCard
																							key={
																								ind
																							}
																							eventId={
																								birthday._id
																							}
																							date={
																								new Date(
																									birthday.date[0]
																								)
																							}
																							names={
																								birthday.name
																							}
																							time="0"
																							type={
																								birthday.type
																							}
																							description={
																								birthday.description
																							}
																							remainderTime={
																								birthday.remaindertime
																							}
																							remainderFormat={
																								birthday.remainderformat
																							}
																							color={
																								birthday.color
																							}
																							innerOpen={
																								innerOpen
																							}
																							setInnerOpen={
																								setInnerOpen
																							}
																							editOpen={
																								editOpen
																							}
																							setEditOpen={
																								setEditOpen
																							}
																							deleteOpen={
																								deleteOpen
																							}
																							setDeleteOpen={
																								setDeleteOpen
																							}
																							inviteOpen={
																								inviteOpen
																							}
																							setInviteOpen={
																								setInviteOpen
																							}
																						/>
																					</div>
																				);
																			}
																		}
																	}
																)}
														</div>
													)}

													<div
														className={cn(
															"w-full h-fit relative",
															monthEvents &&
																monthEvents.length !==
																	0 &&
																((monthBirthdays &&
																	monthBirthdays.length !==
																		0) ||
																	monthHolidays.length !==
																		0) &&
																(showHolidays ||
																	showBirthdays) &&
																(showEvents ||
																	showTasks) &&
																"mt-[1px] bottom-[-25px]",
															monthEvents &&
																monthEvents.length !==
																	0 &&
																monthBirthdays &&
																monthBirthdays.length !==
																	0 &&
																monthHolidays.length !==
																	0 &&
																showHolidays &&
																showBirthdays &&
																(showEvents ||
																	showTasks) &&
																"mt-[1.5px] bottom-[-50px]"
														)}
													>
														{isAuthenticated &&
															monthEvents &&
															monthEvents.map(
																(
																	event,
																	ind
																) => {
																	if (
																		new Date(
																			event.date[0]
																		).getDate() ===
																			date.getDate() &&
																		new Date(
																			event.date[0]
																		).getMonth() ===
																			date.getMonth() &&
																		new Date(
																			event.date[0]
																		).getFullYear() ===
																			date.getFullYear()
																	) {
																		return (
																			<EventCard
																				key={
																					ind
																				}
																				eventId={
																					event._id
																				}
																				date={
																					new Date(
																						event.date[0]
																					)
																				}
																				names={
																					event.title
																				}
																				time={
																					event.time
																				}
																				type={
																					event.type
																				}
																				description={
																					event.description
																				}
																				remainderTime={
																					event.remaindertime
																				}
																				remainderFormat={
																					event.remainderformat
																				}
																				color={
																					event.color
																				}
																				isCompleted={
																					event.iscompleted
																				}
																				innerOpen={
																					innerOpen
																				}
																				setInnerOpen={
																					setInnerOpen
																				}
																				editOpen={
																					editOpen
																				}
																				setEditOpen={
																					setEditOpen
																				}
																				deleteOpen={
																					deleteOpen
																				}
																				setDeleteOpen={
																					setDeleteOpen
																				}
																				inviteOpen={
																					inviteOpen
																				}
																				setInviteOpen={
																					setInviteOpen
																				}
																				from={
																					"month"
																				}
																			/>
																		);
																	}
																}
															)}
													</div>
												</div>
											</DialogTrigger>

											{isAuthenticated &&
											user.isverified ? (
												<AddEventModal
													date={date}
													time={"12:00 AM"}
													id={`${date.getDate()} ${"12:00 AM"}`}
													handleOpenChange={
														handleOpenChange
													}
												/>
											) : !isAuthenticated ? (
												<AuthModal />
											) : (
												<VerifyAccountModal
													handleOpenChange={
														handleOpenChange
													}
												/>
											)}
										</Dialog>
									</div>

									<Separator className="w-full h-[0.5px]" />
									{ind !== 6 && (
										<Separator
											orientation="vertical"
											className="h-full w-[0.5px] absolute top-0 right-0"
										/>
									)}
									{/* <Separator
										orientation="vertical"
										className="h-full w-[0.5px] absolute top-0 "
									/> */}
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
};

export default MonthCalendar;
