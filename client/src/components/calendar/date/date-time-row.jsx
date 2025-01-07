import React, { useContext, useEffect, useRef, useState } from "react";

import { Context } from "@/pages/app";

import EventCard from "../../event-card";
import { Separator } from "../../ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddEventModal from "@/components/add-event-modal";
import AuthModal from "@/components/auth-modal";
import VerifyAccountModal from "@/components/verify-account-modal";

const DateTimeRow = ({ t, time }) => {
	const {
		setAuthType,
		isAuthenticated,
		user,
		newSelectedDate,
		currentDate,
		currentMonth,
		currentYear,
		currentHour,
		currentMinute,
		currentAMPM,
		allMonths,
		events,
		showEvents,
		showTasks,
	} = useContext(Context);

	const [open, setOpen] = useState(false);
	const [innerOpen, setInnerOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [inviteOpen, setInviteOpen] = useState(false);

	const [openDialogId, setOpenDialogId] = useState(null);

	const [dateEvents, setDateEvents] = useState([]);

	const currentTimeRef = useRef(null);

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
				if (
					new Date(event.date).getDate() ===
						newSelectedDate.getDate() &&
					new Date(event.date).getMonth() + 1 ===
						newSelectedDate.getMonth() + 1 &&
					new Date(event.date).getFullYear() ===
						newSelectedDate.getFullYear()
				) {
					tempEvents.push(event);
				}
			});
		}

		if (tempEvents) {
			tempEvents = tempEvents.reduce((previous, current) => {
				const key = `${new Date(current.date).getDate()}-${new Date(
					current.date
				).getMonth()}-${new Date(current.date).getFullYear()}-${
					current.time.split(":")[0]
				}-${current.time.split(" ")[1]}`;

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

			setDateEvents(tempEvents);
		}
	};

	useEffect(() => {
		if (currentTimeRef.current) {
			currentTimeRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		} else {
			window.scrollTo(0, 0);
		}
	}, [newSelectedDate]);

	useEffect(() => {
		handleOpenChange(null, false);
	}, [events]);

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
				if (
					new Date(event.date).getDate() ===
						newSelectedDate.getDate() &&
					new Date(event.date).getMonth() + 1 ===
						newSelectedDate.getMonth() + 1 &&
					new Date(event.date).getFullYear() ===
						newSelectedDate.getFullYear()
				) {
					tempEvents.push(event);
				}
			});
		}

		if (tempEvents) {
			tempEvents = tempEvents.reduce((previous, current) => {
				const key = `${new Date(current.date).getDate()}-${new Date(
					current.date
				).getMonth()}-${new Date(current.date).getFullYear()}-${
					current.time.split(":")[0]
				}-${current.time.split(" ")[1]}`;

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

			setDateEvents(tempEvents);
		}
	}, [events]);

	useEffect(() => {
		showEventsAndTasks();
	}, [showEvents, showTasks]);

	return (
		<div className="flex relative">
			<div className="flex items-center text-xs text-slate-500/80 w-full h-[45px] relative">
				{t && (
					<span className="absolute top-0 w-12 flex items-end justify-end translate-y-[-50%]">
						{t}
					</span>
				)}

				{newSelectedDate.getDate() === currentDate &&
					allMonths[newSelectedDate.getMonth()] === currentMonth &&
					newSelectedDate.getFullYear() === currentYear &&
					time === `${currentHour}:00 ${currentAMPM}` && (
						<Badge
							style={{
								top: `${(currentMinute / 60) * 100}%`,
							}}
							className="absolute translate-x-[-100%] translate-y-[-50%] top-[50%] left-28 bg-emerald-600 hover:bg-emerald-600 z-[50]"
						>
							{currentHour}:{currentMinute} {currentAMPM}
						</Badge>
					)}

				<div className="flex w-[calc(100%-121px)] absolute right-0 h-full">
					<div className="flex-1 cursor-pointer">
						<Dialog
							open={openDialogId === time && open}
							onOpenChange={(open) => {
								if (
									!innerOpen &&
									!editOpen &&
									!deleteOpen &&
									!inviteOpen
								) {
									handleOpenChange(time, open);
								} else {
									handleOpenChange(time, false);
								}
							}}
						>
							<DialogTrigger
								onClick={() => setAuthType("login")}
								asChild
							>
								<div className="h-full flex relative">
									{isAuthenticated &&
										dateEvents &&
										dateEvents.map((event, ind) => {
											for (
												let i = 0;
												i < event.title.length;
												i++
											) {
												if (
													event.time[i].split(
														":"
													)[0] ===
														time.split(":")[0] &&
													event.time[i].split(
														" "
													)[1] === time.split(" ")[1]
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
														/>
													);
												}
											}
										})}

									{newSelectedDate.getDate() ===
										currentDate &&
										allMonths[
											newSelectedDate.getMonth()
										] === currentMonth &&
										newSelectedDate.getFullYear() ===
											currentYear &&
										time ===
											`${currentHour}:00 ${currentAMPM}` && (
											<div
												ref={currentTimeRef}
												style={{
													top: `${
														(currentMinute / 60) *
														100
													}%`,
												}}
												className={`absolute w-full h-[2px] z-[50]`}
											>
												<span className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] w-3 h-3 rounded-full bg-emerald-600" />
												<Separator
													className={`w-full h-full bg-emerald-600`}
												/>
											</div>
										)}
								</div>
							</DialogTrigger>
							{isAuthenticated && user.isverified ? (
								<AddEventModal
									date={newSelectedDate}
									time={time}
									id={time}
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
						<Separator
							orientation="vertical"
							className="w-[0.5px] h-full absolute top-0"
						/>
					</div>
				</div>
			</div>
			{t && <Separator className="w-[93%] h-[0.5px] absolute left-24" />}
		</div>
	);
};

export default DateTimeRow;
