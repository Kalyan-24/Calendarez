import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { Context } from "@/pages/app";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "../../ui/badge";
import DateTimeRow from "./date-time-row";
import EventCard from "@/components/event-card";

const DateCalendar = () => {
	const {
		isAuthenticated,
		currentHour,
		currentMinute,
		currentAMPM,
		newSelectedDate,
		allMonths,
		allDays,
		holidays,
		events,
		showHolidays,
		showBirthdays,
	} = useContext(Context);

	const [dateHolidays, setDateHolidays] = useState([]);
	const [dateBirthdays, setDateBirthdays] = useState([]);
	const [innerOpen, setInnerOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [inviteOpen, setInviteOpen] = useState(false);

	const isToday =
		newSelectedDate.toDateString() === new Date().toDateString();

	useEffect(() => {
		let tempHolidays = [];
		try {
			holidays.map((holiday) => {
				if (
					parseInt(holiday.Date) === newSelectedDate.getDate() &&
					holiday.Month === allMonths[newSelectedDate.getMonth()] &&
					parseInt(holiday.Year) === newSelectedDate.getFullYear()
				) {
					tempHolidays.push(holiday);
				}
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

			setDateHolidays(tempHolidays);
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
				if (
					new Date(birthday.date).getDate() ===
						newSelectedDate.getDate() &&
					new Date(birthday.date).getMonth() + 1 ===
						newSelectedDate.getMonth() + 1 &&
					new Date(birthday.date).getFullYear() ===
						newSelectedDate.getFullYear()
				) {
					tempBirthdays.push(birthday);
				}
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

			setDateBirthdays(tempBirthdays);
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
						dateBirthdays &&
							dateBirthdays.length !== 0 &&
							showBirthdays &&
							dateHolidays.length !== 0 &&
							showHolidays
							? "pb-12"
							: ((dateHolidays.length !== 0 && showHolidays) ||
									(dateBirthdays &&
										dateBirthdays.length !== 0 &&
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
						<div className="flex items-center justify-start w-full h-full relative">
							<div className="flex flex-col items-center justify-center w-full">
								<div className="flex items-center justify-start w-full">
									<div className="flex flex-col items-center justify-center px-10">
										<div
											className={cn(
												"text-sm font-semibold text-slate-500/80",
												isToday && "text-blue-500"
											)}
										>
											{allDays[
												newSelectedDate.getDay()
											].substring(0, 3)}
										</div>

										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													className={cn(
														"text-[22px] font-normal py-2 px-2 rounded-full w-11 h-11 aspect-square mb-2 text-slate-500/80",
														isToday &&
															"bg-blue-500 text-[hsl(var(--primary-foreground))] hover:bg-blue-500/90 hover:text-[hsl(var(--primary-foreground))]"
													)}
												>
													{newSelectedDate.getDate()}
												</Button>
											</TooltipTrigger>
											<TooltipContent className="bg-gray-700">
												{`${newSelectedDate.getDate()} ${
													allMonths[
														newSelectedDate.getMonth()
													]
												} ${newSelectedDate.getFullYear()}
                                        `}
											</TooltipContent>
										</Tooltip>
									</div>
								</div>

								{showHolidays && (
									<div className="w-full h-fit relative">
										{dateHolidays.map((holiday, ind) => {
											return (
												<EventCard
													key={ind}
													date={newSelectedDate}
													names={holiday.Name}
													time="0"
													type={holiday.Type}
													innerOpen={innerOpen}
													setInnerOpen={setInnerOpen}
												/>
											);
										})}
									</div>
								)}

								{showBirthdays && (
									<div
										className={cn(
											"w-full h-fit relative",
											dateBirthdays &&
												dateBirthdays.length !== 0 &&
												dateHolidays.length !== 0 &&
												showHolidays &&
												showBirthdays &&
												"mt-[1px] bottom-[-25px]"
										)}
									>
										{dateBirthdays &&
											dateBirthdays.map(
												(birthday, ind) => {
													for (
														let i = 0;
														i <
														birthday.name.length;
														i++
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
															/>
														);
													}
												}
											)}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<Separator />
				<div className="flex flex-col w-full overflow-y-scroll overflow-x-hidden scrollbar-style">
					<DateTimeRow
						t={null}
						time={`12:00 AM`}
						holidays={dateHolidays}
						dateBirthdays={dateHolidays}
					/>

					{Array.from({ length: 11 }).map((_, index) => (
						<DateTimeRow
							key={index}
							t={`${index + 1} AM`}
							time={`${index + 1}:00 AM`}
							holidays={dateHolidays}
							dateBirthdays={dateHolidays}
						/>
					))}
					{Array.from({ length: 12 }).map((_, index) => (
						<DateTimeRow
							key={index}
							t={`${
								(index + 12) % 12 ? (index + 12) % 12 : 12
							} PM`}
							time={
								(index + 12) % 12
									? `${(index + 12) % 12}:00 PM`
									: `${12}:00 PM`
							}
							holidays={dateHolidays}
							dateBirthdays={dateHolidays}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default DateCalendar;
