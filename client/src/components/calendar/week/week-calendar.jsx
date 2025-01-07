import React, { useContext, useEffect, useState } from "react";

import { Context } from "@/pages/app";

import { toast } from "sonner";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "../../ui/badge";
import WeekTimeRow from "./week-time-row";
import EventCard from "@/components/event-card";

import { cn } from "@/lib/utils";

const WeekCalendar = () => {
	const {
		isAuthenticated,
		currentHour,
		currentMinute,
		currentAMPM,
		newSelectedDate,
		setNewSelectedDate,
		allMonths,
		allDays,
		weekDates,
		holidays,
		events,
		showHolidays,
		showBirthdays,
	} = useContext(Context);

	const [weekHolidays, setWeekHolidays] = useState([]);
	const [weekBirthdays, setWeekBirthdays] = useState([]);
	const [innerOpen, setInnerOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [inviteOpen, setInviteOpen] = useState(false);

	useEffect(() => {
		let tempHolidays = [];
		try {
			holidays.map((holiday) => {
				weekDates(newSelectedDate).map((date) => {
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

			setWeekHolidays(tempHolidays);
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
				weekDates(newSelectedDate).map((date) => {
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

			setWeekBirthdays(tempBirthdays);
		}
	}, [isAuthenticated, newSelectedDate, events]);

	function getTimeZone() {
		var offset = new Date().getTimezoneOffset(),
			o = Math.abs(offset);
		return (
			(offset < 0 ? "+" : "-") +
			("00" + Math.floor(o / 60)).slice(-2) +
			":" +
			("00" + (o % 60)).slice(-2)
		);
	}

	return (
		<div className="flex flex-col w-full h-full pt-3">
			<div className="flex flex-col justify-start w-full h-full">
				<div
					className={cn(
						"flex items-center w-[calc(100%-7px)]",
						weekBirthdays &&
							weekBirthdays.length !== 0 &&
							showBirthdays &&
							weekHolidays.length !== 0 &&
							showHolidays
							? "pb-12"
							: ((weekHolidays.length !== 0 && showHolidays) ||
									(weekBirthdays &&
										weekBirthdays.length !== 0 &&
										showBirthdays)) &&
									"pb-6"
					)}
				>
					<div className="relative px-3 pr-6">
						<Tooltip>
							<TooltipTrigger className="my-7">
								<Badge
									variant="outline"
									className="text-xs font-light text-slate-500 cursor-pointer"
								>
									UTC{getTimeZone()}
								</Badge>
							</TooltipTrigger>
							<TooltipContent className="bg-gray-700">
								<p>
									{currentHour}:{currentMinute} {currentAMPM}
								</p>
							</TooltipContent>
						</Tooltip>

						<Separator
							orientation="vertical"
							className="absolute right-0 top-[-12px] h-[calc(100%+60px)]"
						/>
					</div>

					<div className="flex items-center w-full h-full">
						{weekDates(newSelectedDate).map((date, index) => {
							const isToday =
								date.toDateString() ===
								new Date().toDateString();
							const isSelected =
								date.toDateString() ===
								newSelectedDate.toDateString();

							return (
								<div
									key={index}
									className="flex items-center justify-center w-full h-full relative"
								>
									<div className="flex flex-col items-center justify-center w-full">
										<div
											className={cn(
												"text-sm font-semibold",
												isToday && "text-slate-600",
												isSelected && "text-blue-500",
												!isToday &&
													!isSelected &&
													"text-slate-500/80"
											)}
										>
											{allDays[date.getDay()].substring(
												0,
												3
											)}
										</div>

										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													className={cn(
														"text-[22px] font-normal py-2 px-2 rounded-full w-11 h-11 aspect-square mb-2",
														isToday &&
															"bg-[hsl(var(--accent))] text-slate-600/90 hover:text-[hsl(var(--accent-foreground))]",
														isSelected &&
															"bg-blue-500 text-[hsl(var(--primary-foreground))] hover:bg-blue-500/90 hover:text-[hsl(var(--primary-foreground))]",
														!isToday &&
															!isSelected &&
															"text-slate-500/80"
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

										{showHolidays && (
											<div className="w-full h-fit relative">
												{weekHolidays.map(
													(holiday, ind) => {
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
																	key={ind}
																	date={date}
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
													weekBirthdays &&
														weekBirthdays.length !==
															0 &&
														weekHolidays.length !==
															0 &&
														showHolidays &&
														showBirthdays &&
														"mt-[1px] bottom-[-25px]"
												)}
											>
												{weekBirthdays &&
													weekBirthdays.map(
														(birthday, ind) => {
															for (
																let i = 0;
																i <
																birthday.name
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
																	);
																}
															}
														}
													)}
											</div>
										)}
									</div>

									{index !== 6 && (
										<Separator
											orientation="vertical"
											className={cn(
												"w-[0.5px] h-[25%] bottom-0 absolute right-0",
												weekBirthdays &&
													weekBirthdays.length !==
														0 &&
													showBirthdays &&
													weekHolidays.length !== 0 &&
													showHolidays
													? "h-[55%] bottom-[-60%]"
													: ((weekHolidays.length !==
															0 &&
															showHolidays) ||
															(weekBirthdays &&
																weekBirthdays.length !==
																	0 &&
																showBirthdays)) &&
															"h-[40%] bottom-[-30%]"
												// weekHolidays.length !== 0 &&
												// 	(showHolidays ||
												// 		showBirthdays) &&
												// 	"h-[40%] bottom-[-30%]",
												// weekHolidays.length !== 0 &&
												// 	showHolidays &&
												// 	showBirthdays &&
												// 	"h-[55%] bottom-[-60%]"
											)}
										/>
									)}
								</div>
							);
						})}
					</div>
				</div>
				<Separator />
				<div className="flex flex-col w-full overflow-y-scroll overflow-x-hidden scrollbar-style">
					<WeekTimeRow
						t={null}
						time={`12:00 AM`}
						holidays={weekHolidays}
						weekBirthdays={weekHolidays}
					/>

					{Array.from({ length: 11 }).map((_, index) => (
						<WeekTimeRow
							key={index}
							t={`${index + 1} AM`}
							time={`${index + 1}:00 AM`}
							holidays={weekHolidays}
							weekBirthdays={weekHolidays}
						/>
					))}
					{Array.from({ length: 12 }).map((_, index) => (
						<WeekTimeRow
							key={index}
							t={`${
								(index + 12) % 12 ? (index + 12) % 12 : 12
							} PM`}
							time={
								(index + 12) % 12
									? `${(index + 12) % 12}:00 PM`
									: `${12}:00 PM`
							}
							holidays={weekHolidays}
							weekBirthdays={weekHolidays}
						/>
					))}
				</div>
				{/* <Separator
					orientation="vertical"
					className="h-[86.5%] w-[0.5px] absolute bottom-[-60px] left-[133px]"
				/> */}
			</div>
		</div>
	);
};

export default WeekCalendar;
