import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { LucidePlus } from "lucide-react";

import { Context } from "@/pages/app";

import AddEventModal from "@/components/add-event-modal";
import AuthModal from "@/components/auth-modal";
import EventCard from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/dropdown-calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import VerifyAccountModal from "@/components/verify-account-modal";

const YearCalendar = () => {
	const {
		isAuthenticated,
		user,
		isLoading,
		newSelectedDate,
		setNewSelectedDate,
		allMonths,
		allDays,
		yearDates,
		holidays,
		events,
		showHolidays,
		showEvents,
		showTasks,
		showBirthdays,
	} = useContext(Context);

	const [yearHolidays, setYearHolidays] = useState([]);
	const [yearBirthdays, setYearBirthdays] = useState([]);
	const [yearEvents, setYearEvents] = useState([]);

	const [showOuterOverlay, setShowOuterOverlay] = useState(true);
	const [openOuterDialogId, setOpenOuterDialogId] = useState(null);
	const [outerOpen, setOuterOpen] = useState(false);

	const [openDialogId, setOpenDialogId] = useState(null);
	const [open, setOpen] = useState(false);

	const [innerOpen, setInnerOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [inviteOpen, setInviteOpen] = useState(false);

	const [calendarKey, setCalendarKey] = useState(0);

	const handleOuterOpenChange = (id, open) => {
		setOpenOuterDialogId(open ? id : null);
		setOuterOpen(open);
	};

	const handleOpenChange = (id, open) => {
		setOpenDialogId(open ? id : null);
		setOpen(open);
		setShowOuterOverlay(!open);
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
				yearDates(newSelectedDate).map((date) => {
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

			setYearEvents(tempEvents);
		}
	};

	useEffect(() => {
		setCalendarKey(calendarKey + 12);
	}, [newSelectedDate]);

	useEffect(() => {
		let tempHolidays = [];
		try {
			holidays.map((holiday) => {
				yearDates(newSelectedDate).map((date) => {
					if (
						parseInt(holiday.Date) === date.getDate() &&
						holiday.Month === allMonths[date.getMonth()] &&
						parseInt(holiday.Year) === date.getFullYear()
					) {
						tempHolidays.push(holiday);
					}
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

			setYearHolidays(tempHolidays);
		} catch (error) {}
	}, [holidays]);

	useEffect(() => {
		const onlyBirthdays =
			events && events.filter((event) => event.type === "Birthday");
		let tempBirthdays = [];

		if (onlyBirthdays) {
			onlyBirthdays.map((birthday) => {
				yearDates(newSelectedDate).map((date) => {
					if (
						new Date(birthday.date).getDate() === date.getDate() &&
						new Date(birthday.date).getMonth() + 1 ===
							date.getMonth() + 1 &&
						new Date(birthday.date).getFullYear() ===
							date.getFullYear()
					) {
						tempBirthdays.push(birthday);
					}
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

			setYearBirthdays(tempBirthdays);
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
				yearDates(newSelectedDate).map((date) => {
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

			setYearEvents(tempEvents);
		}
	}, [events]);

	useEffect(() => {
		showEventsAndTasks();
	}, [showEvents, showTasks]);

	return (
		<div className="w-full h-full flex flex-wrap items-center justify-center overflow-y-scroll overflow-x-hidden scrollbar-style">
			{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => (
				<Calendar
					key={calendarKey + month}
					className="w-fit"
					mode="single"
					fixedWeeks
					disableNavigation
					formatters={{
						formatCaption: (date, options) =>
							format(date, "LLLL", options),
					}}
					selected={
						month === newSelectedDate.getMonth()
							? newSelectedDate
							: null
					}
					disabled={isLoading}
					onSelect={(e) => {
						if (e) {
							setNewSelectedDate(e);
							handleOuterOpenChange(`${e.toDateString()}`, true);
						} else {
							handleOuterOpenChange(
								`${newSelectedDate.toDateString()}`,
								true
							);
						}
					}}
					defaultMonth={new Date(newSelectedDate).setMonth(month)}
				/>
			))}

			<Dialog
				open={
					openOuterDialogId === `${newSelectedDate.toDateString()}` &&
					outerOpen
				}
				onOpenChange={(open) => {
					handleOuterOpenChange(
						`${newSelectedDate.toDateString()}`,
						open
					);
				}}
			>
				<DialogContent
					showOverlay={showOuterOverlay}
					className="sm:max-w-[425px] gap-1"
					onClick={(e) => e.stopPropagation()}
					onInteractOutside={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					<DialogHeader className={"mt-6"}>
						<DialogTitle className="text-2xl">Date</DialogTitle>
						<DialogDescription>
							{`${newSelectedDate.getDate()} ${
								allMonths[newSelectedDate.getMonth()]
							} ${newSelectedDate.getFullYear()}, ${
								allDays[newSelectedDate.getDay()]
							}`}
						</DialogDescription>
					</DialogHeader>

					<div>
						{showHolidays &&
							yearHolidays &&
							yearHolidays.find(
								(holiday) =>
									holiday.Date ===
										`${newSelectedDate.getDate()}` &&
									holiday.Month ===
										allMonths[newSelectedDate.getMonth()] &&
									holiday.Year ===
										`${newSelectedDate.getFullYear()}`
							) !== undefined && (
								<div className="w-full h-[4.5rem]">
									<div className="w-full h-fit relative">
										<h3 className="font-semibold text-lg my-1">
											Holidays
										</h3>
										{yearHolidays.map((holiday, ind) => {
											if (
												newSelectedDate.getDate() ===
													parseInt(holiday.Date) &&
												allMonths[
													newSelectedDate.getMonth()
												] === holiday.Month &&
												newSelectedDate.getFullYear() ===
													parseInt(holiday.Year)
											) {
												return (
													<EventCard
														key={ind}
														date={newSelectedDate}
														names={holiday.Name}
														time="0"
														type={holiday.Type}
														innerOpen={innerOpen}
														setInnerOpen={
															setInnerOpen
														}
														setShowOuterOverlay={
															setShowOuterOverlay
														}
													/>
												);
											}
										})}
									</div>
								</div>
							)}

						{showHolidays &&
							yearHolidays &&
							yearHolidays.find(
								(holiday) =>
									holiday.Date ===
										`${newSelectedDate.getDate()}` &&
									holiday.Month ===
										allMonths[newSelectedDate.getMonth()] &&
									holiday.Year ===
										`${newSelectedDate.getFullYear()}`
							) !== undefined &&
							((showBirthdays &&
								yearBirthdays &&
								yearBirthdays.find(
									(birthday) =>
										new Date(
											birthday.date
										).toDateString() ===
										newSelectedDate.toDateString()
								) !== undefined) ||
								((showEvents || showTasks) &&
									yearEvents &&
									yearEvents.find(
										(event) =>
											new Date(
												event.date[0]
											).toDateString() ===
											newSelectedDate.toDateString()
									) !== undefined)) && (
								<Separator className="h-[0.5px]" />
							)}

						{showBirthdays &&
							yearBirthdays &&
							yearBirthdays.find(
								(birthday) =>
									new Date(birthday.date).toDateString() ===
									newSelectedDate.toDateString()
							) !== undefined && (
								<div className="w-full h-[4.5rem]">
									<div className="w-full h-fit relative">
										<h3 className="font-semibold text-lg my-1">
											Birthdays
										</h3>
										{yearBirthdays &&
											yearBirthdays.map(
												(birthday, ind) => {
													for (
														let i = 0;
														i <
														birthday.name.length;
														i++
													) {
														if (
															newSelectedDate.getDate() ===
																new Date(
																	birthday.date[
																		i
																	]
																).getDate() &&
															newSelectedDate.getMonth() ===
																new Date(
																	birthday.date[
																		i
																	]
																).getMonth() &&
															newSelectedDate.getFullYear() ===
																new Date(
																	birthday.date[
																		i
																	]
																).getFullYear()
														) {
															return (
																<EventCard
																	key={ind}
																	eventId={
																		birthday._id
																	}
																	date={
																		newSelectedDate
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
																	setShowOuterOverlay={
																		setShowOuterOverlay
																	}
																/>
															);
														}
													}
												}
											)}
									</div>
								</div>
							)}

						{((showHolidays &&
							yearHolidays &&
							yearHolidays.find(
								(holiday) =>
									holiday.Date ===
										`${newSelectedDate.getDate()}` &&
									holiday.Month ===
										allMonths[newSelectedDate.getMonth()] &&
									holiday.Year ===
										`${newSelectedDate.getFullYear()}`
							) !== undefined) ||
							(showBirthdays &&
								yearBirthdays &&
								yearBirthdays.find(
									(birthday) =>
										new Date(
											birthday.date
										).toDateString() ===
										newSelectedDate.toDateString()
								) !== undefined)) &&
							(showEvents || showTasks) &&
							yearEvents &&
							yearEvents.find(
								(event) =>
									new Date(event.date[0]).toDateString() ===
									newSelectedDate.toDateString()
							) !== undefined && (
								<Separator className="h-[0.5px]" />
							)}

						{(showEvents || showTasks) &&
							yearEvents &&
							yearEvents.find(
								(event) =>
									new Date(event.date[0]).toDateString() ===
									newSelectedDate.toDateString()
							) !== undefined && (
								<div className="w-full h-[4.5rem]">
									<div className="w-full h-fit relative">
										<h3 className="font-semibold text-lg my-1">
											Events/Tasks
										</h3>
										{yearEvents &&
											yearEvents.map((event, ind) => {
												if (
													new Date(
														event.date[0]
													).getDate() ===
														newSelectedDate.getDate() &&
													new Date(
														event.date[0]
													).getMonth() ===
														newSelectedDate.getMonth() &&
													new Date(
														event.date[0]
													).getFullYear() ===
														newSelectedDate.getFullYear()
												) {
													return (
														<EventCard
															key={ind}
															eventId={event._id}
															date={
																new Date(
																	event.date[0]
																)
															}
															names={event.title}
															time={event.time}
															type={event.type}
															description={
																event.description
															}
															remainderTime={
																event.remaindertime
															}
															remainderFormat={
																event.remainderformat
															}
															color={event.color}
															isCompleted={
																event.iscompleted
															}
															innerOpen={
																innerOpen
															}
															setInnerOpen={
																setInnerOpen
															}
															editOpen={editOpen}
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
															setShowOuterOverlay={
																setShowOuterOverlay
															}
														/>
													);
												}
											})}
									</div>
								</div>
							)}

						{showHolidays &&
							yearHolidays &&
							yearHolidays.find(
								(holiday) =>
									holiday.Date ===
										`${newSelectedDate.getDate()}` &&
									holiday.Month ===
										allMonths[newSelectedDate.getMonth()] &&
									holiday.Year ===
										`${newSelectedDate.getFullYear()}`
							) === undefined &&
							showBirthdays &&
							yearBirthdays &&
							yearBirthdays.find(
								(birthday) =>
									new Date(birthday.date).toDateString() ===
									newSelectedDate.toDateString()
							) === undefined &&
							(showEvents || showTasks) &&
							yearEvents &&
							yearEvents.find(
								(event) =>
									new Date(event.date[0]).toDateString() ===
									newSelectedDate.toDateString()
							) === undefined && (
								<div className="w-full h-[4.5rem] flex items-center justify-center italic font-extralight">
									No Events on this day
								</div>
							)}
					</div>

					<Tooltip>
						<Dialog
							open={openDialogId === "year" && open}
							onOpenChange={(open) =>
								handleOpenChange("year", open)
							}
						>
							<TooltipTrigger asChild>
								<DialogTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="absolute top-[6px] right-10"
										onClick={(e) => {
											e.stopPropagation();
										}}
									>
										<LucidePlus className="w-4 h-4" />
									</Button>
								</DialogTrigger>
							</TooltipTrigger>

							{isAuthenticated && user.isverified ? (
								<AddEventModal
									date={newSelectedDate}
									time={"12:00 AM"}
									id={`${newSelectedDate.getDate()} ${"12:00 AM"}`}
									handleOpenChange={handleOpenChange}
								/>
							) : !isAuthenticated ? (
								<AuthModal />
							) : (
								<VerifyAccountModal
									handleOpenChange={handleOpenChange}
								/>
							)}
						</Dialog>
						<TooltipContent className="bg-gray-700">
							Create
						</TooltipContent>
					</Tooltip>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default YearCalendar;
