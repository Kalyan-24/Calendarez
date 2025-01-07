import React, { useContext, useEffect, useState } from "react";
import { LucidePencil } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Context } from "./app";

import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/dropdown-calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import DateCalendar from "@/components/calendar/date/date-calendar";
import WeekCalendar from "@/components/calendar/week/week-calendar";
import MonthCalendar from "@/components/calendar/month/month-calendar";
import YearCalendar from "@/components/calendar/year/year-calendar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EditEventTypeModal from "@/components/edit-event-type-modal";
import AuthModal from "@/components/auth-modal";

const Home = () => {
	const navigate = useNavigate();

	const {
		isAuthenticated,
		isLoading,
		setIsLoading,
		selectedCalendarStyle,
		setAuthType,
		showHolidays,
		showEvents,
		showTasks,
		showBirthdays,
		newSelectedDate,
		setNewSelectedDate,
		holidaysColor,
		eventsColor,
		tasksColor,
		birthdaysColor,
		setSettings,
		getHexFromColor,
	} = useContext(Context);

	const [calendarKey, setCalendarKey] = useState(0);
	const [open, setOpen] = useState(false);
	const [trigger, setTrigger] = useState(null);

	const handleShowHolidays = async () => {
		try {
			setIsLoading(true);
			const showHolidaysResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/edit-settings`,
				{
					showholidays: !showHolidays,
				},
				{
					withCredentials: true,
				}
			);

			if (showHolidaysResult.data.status === "Success") {
				setSettings(showHolidaysResult.data.settings);
				toast.success(showHolidaysResult.data.message);
			} else {
				toast.error(showHolidaysResult.data.error);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleShowEvents = async () => {
		try {
			setIsLoading(true);
			const showEventsResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/edit-settings`,
				{
					showevents: !showEvents,
				},
				{
					withCredentials: true,
				}
			);

			if (showEventsResult.data.status === "Success") {
				setSettings(showEventsResult.data.settings);
				toast.success(showEventsResult.data.message);
			} else {
				toast.error(showEventsResult.data.error);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleShowTasks = async () => {
		try {
			setIsLoading(true);
			const showTasksResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/edit-settings`,
				{
					showtasks: !showTasks,
				},
				{
					withCredentials: true,
				}
			);

			if (showTasksResult.data.status === "Success") {
				setSettings(showTasksResult.data.settings);
				toast.success(showTasksResult.data.message);
			} else {
				toast.error(showTasksResult.data.error);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleShowBirthdays = async () => {
		try {
			setIsLoading(true);
			const showBirthdaysResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/edit-settings`,
				{
					showbirthdays: !showBirthdays,
				},
				{
					withCredentials: true,
				}
			);

			if (showBirthdaysResult.data.status === "Success") {
				setSettings(showBirthdaysResult.data.settings);
				toast.success(showBirthdaysResult.data.message);
			} else {
				toast.error(showBirthdaysResult.data.error);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		document.title = "Calendarez";
	}, []);

	useEffect(() => {
		setCalendarKey(calendarKey + 1);
	}, [newSelectedDate]);

	const { year, month, date } = useParams();

	useEffect(() => {
		try {
			if (year && month && date) {
				if (
					parseInt(year) > 2100 ||
					parseInt(year) < 1900 ||
					parseInt(month) > 12 ||
					parseInt(month) < 1 ||
					parseInt(date) > 31 ||
					parseInt(date) < 1
				) {
					navigate(
						`/${selectedCalendarStyle}/${new Date().getFullYear()}/${
							new Date().getMonth() + 1
						}/${new Date().getDate()}`
					);
				} else {
					setNewSelectedDate(
						new Date(new Date().setFullYear(year, month - 1, date))
					);
				}
			}
		} catch (error) {
			navigate(
				`/${selectedCalendarStyle}/${new Date().getFullYear()}/${
					new Date().getMonth() + 1
				}/${new Date().getDate()}`
			);
		}
	}, []);

	return (
		<div className="flex h-[calc(100vh-61px)]">
			<div className="flex-grow">
				{selectedCalendarStyle === "date" ? <DateCalendar /> : <></>}
				{selectedCalendarStyle === "week" ? <WeekCalendar /> : <></>}
				{selectedCalendarStyle === "month" ? <MonthCalendar /> : <></>}
				{selectedCalendarStyle === "year" ? <YearCalendar /> : <></>}
			</div>

			<Separator orientation="vertical" />

			<div className="min-w-[300px]">
				{(useEffect(() => {}), [])}
				<Calendar
					key={calendarKey}
					mode="single"
					captionLayout="dropdown-buttons"
					selected={newSelectedDate}
					disabled={isLoading}
					onSelect={(e) => {
						if (e) {
							setNewSelectedDate(e);
						}
					}}
					defaultMonth={newSelectedDate}
					fromYear={1901}
					toYear={2100}
				/>

				<Separator className="h-[0.5px]" />

				<div className="flex items-center space-x-2 m-5">
					<Command className="rounded-lg border shadow-md">
						<CommandList>
							<CommandGroup heading="All events">
								<Label
									htmlFor="holidays-checkbox"
									className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
								>
									<CommandItem
										className="cursor-pointer"
										disabled={isLoading}
									>
										<Checkbox
											className={`h-[18px] w-[18px]`}
											style={{
												backgroundColor:
													showHolidays &&
													getHexFromColor(
														holidaysColor
													),
												borderColor:
													getHexFromColor(
														holidaysColor
													),
											}}
											id="holidays-checkbox"
											checked={showHolidays}
											onCheckedChange={handleShowHolidays}
										/>
										<span className="h-7 w-7 flex items-center justify-between">
											<span className="ml-1 flex">
												<span>🏖️</span>
												<span className="ml-1">
													Holidays
												</span>
											</span>
										</span>
									</CommandItem>
								</Label>

								{isAuthenticated && (
									<Label
										htmlFor="events-checkbox"
										className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
									>
										<CommandItem
											className="cursor-pointer"
											disabled={isLoading}
										>
											<Checkbox
												className={`h-[18px] w-[18px]`}
												style={{
													backgroundColor:
														showEvents &&
														getHexFromColor(
															eventsColor
														),
													borderColor:
														getHexFromColor(
															eventsColor
														),
												}}
												id="events-checkbox"
												checked={showEvents}
												onCheckedChange={
													handleShowEvents
												}
											/>
											<span className="w-full h-full flex items-center justify-between">
												<span className="ml-1">
													📅 Events
												</span>

												<Dialog
													open={
														trigger === "Events" &&
														open
													}
													onOpenChange={setOpen}
												>
													<DialogTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-7 w-7 hover:bg-gray-200"
															onClick={() => {
																setAuthType(
																	"login"
																);
																setTrigger(
																	"Events"
																);
															}}
														>
															<LucidePencil className="w-4 h-4" />
														</Button>
													</DialogTrigger>
													{isAuthenticated ? (
														<EditEventTypeModal
															setOpen={setOpen}
															trigger={trigger}
														/>
													) : (
														<AuthModal />
													)}
												</Dialog>
											</span>
										</CommandItem>
									</Label>
								)}
								{isAuthenticated && (
									<Label
										htmlFor="tasks-checkbox"
										className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
									>
										<CommandItem
											className="cursor-pointer"
											disabled={isLoading}
										>
											<Checkbox
												className={`h-[18px] w-[18px]`}
												style={{
													backgroundColor:
														showTasks &&
														getHexFromColor(
															tasksColor
														),
													borderColor:
														getHexFromColor(
															tasksColor
														),
												}}
												id="tasks-checkbox"
												checked={showTasks}
												onCheckedChange={
													handleShowTasks
												}
											/>
											<span className="w-full h-full flex items-center justify-between">
												<span className="ml-1">
													📝 Tasks
												</span>

												<Dialog
													open={
														trigger === "Tasks" &&
														open
													}
													onOpenChange={setOpen}
												>
													<DialogTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-7 w-7 hover:bg-gray-200"
															onClick={() => {
																setAuthType(
																	"login"
																);
																setTrigger(
																	"Tasks"
																);
															}}
														>
															<LucidePencil className="w-4 h-4" />
														</Button>
													</DialogTrigger>
													{isAuthenticated ? (
														<EditEventTypeModal
															setOpen={setOpen}
															trigger={trigger}
														/>
													) : (
														<AuthModal />
													)}
												</Dialog>
											</span>
										</CommandItem>
									</Label>
								)}
								{isAuthenticated && (
									<Label
										htmlFor="birthdays-checkbox"
										className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
									>
										<CommandItem
											className="cursor-pointer"
											disabled={isLoading}
										>
											<Checkbox
												className={`h-[18px] w-[18px]`}
												style={{
													backgroundColor:
														showBirthdays &&
														getHexFromColor(
															birthdaysColor
														),
													borderColor:
														getHexFromColor(
															birthdaysColor
														),
												}}
												id="birthdays-checkbox"
												checked={showBirthdays}
												onCheckedChange={
													handleShowBirthdays
												}
											/>
											<span className="w-full h-full flex items-center justify-between">
												<span className="ml-1">
													🎂 Birthdays
												</span>

												<Dialog
													open={
														trigger ===
															"Birthdays" && open
													}
													onOpenChange={setOpen}
												>
													<DialogTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-7 w-7 hover:bg-gray-200"
															onClick={() => {
																setAuthType(
																	"login"
																);
																setTrigger(
																	"Birthdays"
																);
															}}
														>
															<LucidePencil className="w-4 h-4" />
														</Button>
													</DialogTrigger>
													{isAuthenticated ? (
														<EditEventTypeModal
															setOpen={setOpen}
															trigger={trigger}
														/>
													) : (
														<AuthModal />
													)}
												</Dialog>
											</span>
										</CommandItem>
									</Label>
								)}
							</CommandGroup>
						</CommandList>
					</Command>
				</div>
			</div>
		</div>
	);
};

export default Home;
