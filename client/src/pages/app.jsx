import { createContext, useEffect, useRef, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import axios from "axios";

import Home from "./home";
import Profile from "./profile";
import Error from "./error";
import Settings from "./settings";
import Invite from "./invite";
import ResetPassword from "./reset-password";
import VerifyAccount from "./verify-account";

import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/header";
import Loader from "@/components/loader";

export const Context = createContext({
	isAuthenticated: false,
	setIsAuthenticated: () => {},
	isLoading: false,
	setIsLoading: () => {},
	user: null,
	setUser: () => {},
	authtype: "",
	setAuthType: () => {},
	selectedCalendarStyle: "week",
	setSelectedCalendarStyle: () => {},
	currentDate: 0,
	setCurrentDate: () => {},
	currentMonth: "",
	setCurrentMonth: () => {},
	currentYear: 0,
	setCurrentYear: () => {},
	currentDay: "",
	setCurrentDay: () => {},
	currentHour: 0,
	setCurrentHour: () => {},
	currentMinute: 0,
	setCurrentMinute: () => {},
	currentAMPM: "",
	setCurrentAMPM: () => {},
	selectedDate: 0,
	setSelectedDate: () => {},
	selectedMonth: "",
	setSelectedMonth: () => {},
	selectedYear: 0,
	setSelectedYear: () => {},
	selectedDay: "",
	setSelectedDay: () => {},
	selectedHour: 0,
	setSelectedHour: () => {},
	selectedMinute: 0,
	setSelectedMinute: () => {},
	selectedAMPM: "",
	setSelectedAMPM: () => {},
	newSelectedDate: new Date(),
	setNewSelectedDate: () => {},
	allMonths: [],
	allDays: [],
	getFirstAndLastDayOfWeek: () => {},
	holidays: [],
	setHolidays: () => {},
	events: [],
	setEvents: () => {},
	weekDates: () => {},
	monthDates: () => {},
	yearDates: () => {},
	showHolidays: true,
	setShowHolidays: () => {},
	showEvents: true,
	setShowEvents: () => {},
	showTasks: true,
	setShowTasks: () => {},
	showBirthdays: true,
	setShowBirthdays: () => {},
	profileColor: "red",
	setProfileColor: () => {},
	holidaysColor: "orange",
	setHolidaysColor: () => {},
	eventsColor: "blue",
	setEventsColor: () => {},
	tasksColor: "emerald",
	setTasksColor: () => {},
	birthdaysColor: "red",
	setBirthdaysColor: () => {},
	holidayRemainderTime: 30,
	setHolidayRemainderTime: () => {},
	holidayRemainderFormat: "minute",
	setHolidayRemainderFormat: () => {},
	eventRemainderTime: 30,
	setEventRemainderTime: () => {},
	eventRemainderFormat: "minute",
	setEventRemainderFormat: () => {},
	taskRemainderTime: 30,
	setTaskRemainderTime: () => {},
	taskRemainderFormat: "minute",
	setTaskRemainderFormat: () => {},
	birthdayRemainderTime: 30,
	setBirthdayRemainderTime: () => {},
	birthdayRemainderFormat: "minute",
	setBirthdayRemainderFormat: () => {},
	setSettings: () => {},
	selectedEventProps: {},
	setSelectedEventProps: () => {},
	getHexFromColor: () => {},
	getEvents: () => {},
});

function App() {
	const navigate = useNavigate();

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);

	const [authtype, setAuthType] = useState("login");

	const [selectedCalendarStyle, setSelectedCalendarStyle] = useState(
		window.location.pathname.split("/")[1] === "date"
			? "date"
			: window.location.pathname.split("/")[1] === "week"
			? "week"
			: window.location.pathname.split("/")[1] === "month"
			? "month"
			: window.location.pathname.split("/")[1] === "year"
			? "year"
			: "week"
	);

	const [currentDate, setCurrentDate] = useState(0);
	const [currentMonth, setCurrentMonth] = useState("");
	const [currentYear, setCurrentYear] = useState(0);
	const [currentDay, setCurrentDay] = useState("");
	const [currentHour, setCurrentHour] = useState(0);
	const [currentMinute, setCurrentMinute] = useState(0);
	const [currentAMPM, setCurrentAMPM] = useState("");
	const [selectedDate, setSelectedDate] = useState(0);
	const [selectedMonth, setSelectedMonth] = useState("");
	const [selectedYear, setSelectedYear] = useState(0);
	const [selectedDay, setSelectedDay] = useState("");
	const [selectedHour, setSelectedHour] = useState(0);
	const [selectedMinute, setSelectedMinute] = useState(0);
	const [selectedAMPM, setSelectedAMPM] = useState("");

	const [holidays, setHolidays] = useState([]);
	const [events, setEvents] = useState([]);

	const [profileColor, setProfileColor] = useState("red");

	const [holidaysColor, setHolidaysColor] = useState("orange");
	const [eventsColor, setEventsColor] = useState("blue");
	const [tasksColor, setTasksColor] = useState("emerald");
	const [birthdaysColor, setBirthdaysColor] = useState("red");

	const [showHolidays, setShowHolidays] = useState(true);
	const [showEvents, setShowEvents] = useState(true);
	const [showTasks, setShowTasks] = useState(true);
	const [showBirthdays, setShowBirthdays] = useState(true);

	const [holidayRemainderTime, setHolidayRemainderTime] = useState(30);
	const [holidayRemainderFormat, setHolidayRemainderFormat] =
		useState("minute");
	const [eventRemainderTime, setEventRemainderTime] = useState(30);
	const [eventRemainderFormat, setEventRemainderFormat] = useState("minute");
	const [taskRemainderTime, setTaskRemainderTime] = useState(30);
	const [taskRemainderFormat, setTaskRemainderFormat] = useState("minute");
	const [birthdayRemainderTime, setBirthdayRemainderTime] = useState(30);
	const [birthdayRemainderFormat, setBirthdayRemainderFormat] =
		useState("minute");

	const [selectedEventProps, setSelectedEventProps] = useState({});

	const [newSelectedDate, setNewSelectedDate] = useState(new Date());

	const isMounted = useRef(false);

	const allMonths = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const allDays = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	const getCurrentDate = () => {
		const d = new Date();

		setCurrentDate(d.getDate());
		setCurrentMonth(allMonths[d.getMonth()]);
		setCurrentYear(d.getFullYear());
		setCurrentDay(allDays[d.getDay()]);
		setCurrentHour(
			d
				.toLocaleString("en-US", {
					hour: "numeric",
					minute: "numeric",
					hour12: true,
				})
				.split(":")[0]
		);
		setCurrentMinute(
			d
				.toLocaleString("en-US", {
					hour: "numeric",
					minute: "numeric",
					hour12: true,
				})
				.split(":")[1]
				.split(" ")[0]
		);
		setCurrentAMPM(
			d
				.toLocaleString("en-US", {
					hour: "numeric",
					minute: "numeric",
					hour12: true,
				})
				.split(" ")[1]
		);
	};

	const getFirstAndLastDayOfWeek = (d) => {
		const date = new Date(d);
		const firstDate = new Date(
			date.getTime() - 60 * 60 * 24 * date.getDay() * 1000
		);
		const lastDate = new Date(
			firstDate.getTime() + 60 * 60 * 24 * 6 * 1000
		);

		return `${firstDate.getDate()} ${
			allMonths[firstDate.getMonth()]
		} ${firstDate.getFullYear()} - ${lastDate.getDate()} ${
			allMonths[lastDate.getMonth()]
		} ${lastDate.getFullYear()}`;
	};

	Date.prototype.getWeek = function () {
		const startOfYear = new Date(this.getFullYear(), 0, 1);
		const today = new Date(
			this.getFullYear(),
			this.getMonth(),
			this.getDate()
		);
		const dayOfYear = (today - startOfYear + 86400000) / 86400000;
		return Math.floor(dayOfYear / 7) + 1;
	};

	const getHolidays = async (year_1, year_2, setHolidays) => {
		try {
			setIsLoading(true);
			const holidaysResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/holidays`,
				{ year_1, year_2 },
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);
			if (holidaysResult.data.status === "Success") {
				setHolidays(holidaysResult.data.data);
			} else {
				setHolidays([]);
			}
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	const getEvents = async (year_1, year_2, setEvents) => {
		try {
			setIsLoading(true);
			const eventsResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/get-events`,
				{ year_1, year_2 },
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);
			if (eventsResult.data.status === "Success") {
				setEvents(eventsResult.data.events);
			} else {
				setEvents([]);
			}
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	const getUserByToken = async () => {
		try {
			setIsLoading(true);
			const getUserByTokenResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/get-user`,
				{},
				{
					withCredentials: true,
				}
			);

			if (getUserByTokenResult.data.status === "Success") {
				setIsAuthenticated(true);
				setUser(getUserByTokenResult.data.user);
				setSettings(getUserByTokenResult.data.settings);
				setEvents(getUserByTokenResult.data.events);
			} else {
				setIsAuthenticated(false);
				setSettings(null);
				setUser(null);
				setEvents(null);
			}
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	const weekDates = (d) => {
		const date = new Date(d);

		const firstDate = new Date(
			date.getTime() - 60 * 60 * 24 * date.getDay() * 1000
		);
		const secondDate = new Date(firstDate.getTime() + 60 * 60 * 24 * 1000);
		const thirdDate = new Date(
			firstDate.getTime() + 60 * 60 * 24 * 2 * 1000
		);
		const fourthDate = new Date(
			firstDate.getTime() + 60 * 60 * 24 * 3 * 1000
		);
		const fifthDate = new Date(
			firstDate.getTime() + 60 * 60 * 24 * 4 * 1000
		);
		const sixthDate = new Date(
			firstDate.getTime() + 60 * 60 * 24 * 5 * 1000
		);
		const seventhDate = new Date(
			firstDate.getTime() + 60 * 60 * 24 * 6 * 1000
		);
		return [
			firstDate,
			secondDate,
			thirdDate,
			fourthDate,
			fifthDate,
			sixthDate,
			seventhDate,
		];
	};

	const monthDates = (d) => {
		const date = new Date(new Date(d).setDate(1));

		const firstWeekFirstDate = new Date(
			date.getTime() - 60 * 60 * 24 * date.getDay() * 1000
		);
		const secondWeekFirstDate = new Date(
			firstWeekFirstDate.getTime() + 60 * 60 * 24 * 7 * 1000
		);
		const thirdWeekFirstDate = new Date(
			firstWeekFirstDate.getTime() + 60 * 60 * 24 * 14 * 1000
		);
		const fourthWeekFirstDate = new Date(
			firstWeekFirstDate.getTime() + 60 * 60 * 24 * 21 * 1000
		);
		const fifthWeekFirstDate = new Date(
			firstWeekFirstDate.getTime() + 60 * 60 * 24 * 28 * 1000
		);
		const sixthWeekFirstDate = new Date(
			firstWeekFirstDate.getTime() + 60 * 60 * 24 * 35 * 1000
		);

		let allMonthDates = [];

		allMonthDates.push(weekDates(firstWeekFirstDate));
		allMonthDates.push(weekDates(secondWeekFirstDate));
		allMonthDates.push(weekDates(thirdWeekFirstDate));
		allMonthDates.push(weekDates(fourthWeekFirstDate));
		if (fifthWeekFirstDate.getMonth() === date.getMonth())
			allMonthDates.push(weekDates(fifthWeekFirstDate));
		if (sixthWeekFirstDate.getMonth() === date.getMonth())
			allMonthDates.push(weekDates(sixthWeekFirstDate));

		return allMonthDates;
	};

	const yearDates = (d) => {
		const date = new Date(new Date().setFullYear(d.getFullYear(), 0, 1));

		let dates = [];

		const firstDate = new Date(
			date.getTime() - 60 * 60 * 24 * date.getDay() * 1000
		);

		dates.push(firstDate);

		for (let i = 2; i < 367; i++) {
			if (
				i === 366 &&
				new Date(
					firstDate.getTime() + 60 * 60 * 24 * i * 1000
				).getFullYear() !== newSelectedDate.getFullYear()
			) {
				return dates;
			}
			dates.push(new Date(firstDate.getTime() + 60 * 60 * 24 * i * 1000));
		}

		return dates;
	};

	const setSettings = (settings) => {
		if (settings) {
			setProfileColor(settings.profilecolor);

			setHolidaysColor(settings.holidaycolor);
			setEventsColor(settings.eventcolor);
			setTasksColor(settings.taskcolor);
			setBirthdaysColor(settings.birthdaycolor);

			setShowHolidays(settings.showholidays);
			setShowEvents(settings.showevents);
			setShowTasks(settings.showtasks);
			setShowBirthdays(settings.showbirthdays);

			setHolidayRemainderTime(settings.holidayremaindertime);
			setHolidayRemainderFormat(settings.holidayremainderformat);
			setEventRemainderTime(settings.eventremaindertime);
			setEventRemainderFormat(settings.eventremainderformat);
			setTaskRemainderTime(settings.taskremaindertime);
			setTaskRemainderFormat(settings.taskremainderformat);
			setBirthdayRemainderTime(settings.birthdayremaindertime);
			setBirthdayRemainderFormat(settings.birthdayremainderformat);
		} else {
			setProfileColor("red");

			setHolidaysColor("orange");
			setEventsColor("blue");
			setTasksColor("emerald");
			setBirthdaysColor("red");

			setShowHolidays(true);
			setShowEvents(true);
			setShowTasks(true);
			setShowBirthdays(true);

			setHolidayRemainderTime(30);
			setHolidayRemainderFormat("minutes");
			setEventRemainderTime(30);
			setEventRemainderFormat("minutes");
			setTaskRemainderTime(30);
			setTaskRemainderFormat("minutes");
			setBirthdayRemainderTime(30);
			setBirthdayRemainderFormat("minutes");
		}
	};

	const getHexFromColor = (color, opacity = 1) => {
		if (opacity === 1) {
			switch (color) {
				case "red":
					return "#ef4444";
				case "orange":
					return "#f97316";
				case "amber":
					return "#f59e0b";
				case "yellow":
					return "#eab308";
				case "lime":
					return "#84cc16";
				case "green":
					return "#22c55e";
				case "emerald":
					return "#10b981";
				case "teal":
					return "#14b8a6";
				case "cyan":
					return "#06b6d4";
				case "sky":
					return "#0ea5e9";
				case "blue":
					return "#3b82f6";
				case "indigo":
					return "#6366f1";
				case "violet":
					return "#8b5cf6";
				case "purple":
					return "#a855f7";
				case "fuchsia":
					return "#d946ef";
				case "pink":
					return "#ec4899";
				case "rose":
					return "#f43f5e";
				default:
					return "#000000";
			}
		} else {
			switch (color) {
				case "red":
					return `#fca5a5`;
				case "orange":
					return `#fdba74`;
				case "amber":
					return `#fcd34d`;
				case "yellow":
					return `#fde047`;
				case "lime":
					return `#bef264`;
				case "green":
					return `#86efac`;
				case "emerald":
					return `#6ee7b7`;
				case "teal":
					return `#5eead4`;
				case "cyan":
					return `#67e8f9`;
				case "sky":
					return `#7dd3fc`;
				case "blue":
					return `#93c5fd`;
				case "indigo":
					return `#a5b4fc`;
				case "violet":
					return `#c4b5fd`;
				case "purple":
					return `#d8b4fe`;
				case "fuchsia":
					return `#f0abfc`;
				case "pink":
					return `#f9a8d4`;
				case "rose":
					return `#fda4af`;
				default:
					return "#d1d5db";
			}
		}
	};

	useEffect(() => {
		getUserByToken();
	}, []);

	useEffect(() => {
		setInterval(() => {
			getCurrentDate();
		}, 1000);
	}, []);

	useEffect(() => {
		try {
			if (
				window.location.pathname.split("/")[1] === "date" ||
				window.location.pathname.split("/")[1] === "week" ||
				window.location.pathname.split("/")[1] === "month" ||
				window.location.pathname.split("/")[1] === "year"
			) {
				if (
					parseInt(window.location.pathname.split("/")[2]) > 2100 ||
					parseInt(window.location.pathname.split("/")[2]) < 1900 ||
					parseInt(window.location.pathname.split("/")[3]) > 12 ||
					parseInt(window.location.pathname.split("/")[3]) < 1 ||
					parseInt(window.location.pathname.split("/")[4]) > 31 ||
					parseInt(window.location.pathname.split("/")[4]) < 1
				) {
					navigate(
						`/${selectedCalendarStyle}/${new Date().getFullYear()}/${
							new Date().getMonth() + 1
						}/${new Date().getDate()}`
					);
				} else {
					setNewSelectedDate(
						new Date(
							new Date().setFullYear(
								window.location.pathname.split("/")[2],
								window.location.pathname.split("/")[3] - 1,
								window.location.pathname.split("/")[4]
							)
						)
					);
				}
			}
		} catch (e) {
			navigate(
				`/${selectedCalendarStyle}/${new Date().getFullYear()}/${
					new Date().getMonth() + 1
				}/${new Date().getDate()}`
			);
		}
	}, [window.location.pathname]);

	useEffect(() => {
		if (!isMounted.current) {
			isMounted.current = true;
			return;
		}

		if (newSelectedDate) {
			setSelectedDate(newSelectedDate.getDate());
			setSelectedMonth(allMonths[newSelectedDate.getMonth()]);
			setSelectedYear(newSelectedDate.getFullYear());
			setSelectedDay(allDays[newSelectedDate.getDay()]);
			setSelectedHour(newSelectedDate.getHours());
			setSelectedMinute(newSelectedDate.getMinutes());

			navigate(
				`/${selectedCalendarStyle}/${newSelectedDate.getFullYear()}/${
					newSelectedDate.getMonth() + 1
				}/${newSelectedDate.getDate()}`
			);

			if (selectedCalendarStyle === "date") {
				document.title = `Calendarez - ${newSelectedDate.getDate()} ${
					allMonths[newSelectedDate.getMonth()]
				} ${newSelectedDate.getFullYear()}`;
			} else if (selectedCalendarStyle === "week") {
				document.title = `Calendarez - Week ${newSelectedDate.getWeek()} - (${getFirstAndLastDayOfWeek(
					newSelectedDate
				)})`;
			} else if (selectedCalendarStyle === "month") {
				document.title = `Calendarez - ${
					allMonths[newSelectedDate.getMonth()]
				} ${newSelectedDate.getFullYear()}`;
			} else if (selectedCalendarStyle === "year") {
				document.title = `Calendarez - ${newSelectedDate.getFullYear()}`;
			}
		}
	}, [newSelectedDate, selectedCalendarStyle]);

	useEffect(() => {
		if (
			weekDates(newSelectedDate)[0].getFullYear() ===
			weekDates(newSelectedDate)[6].getFullYear()
		) {
			getHolidays(newSelectedDate.getFullYear(), null, setHolidays);
		} else {
			getHolidays(
				weekDates(newSelectedDate)[0].getFullYear(),
				weekDates(newSelectedDate)[6].getFullYear(),
				setHolidays
			);
		}
	}, [newSelectedDate]);

	useEffect(() => {
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
	}, [newSelectedDate, isAuthenticated]);

	return (
		<Context.Provider
			value={{
				isAuthenticated,
				setIsAuthenticated,
				isLoading,
				setIsLoading,
				user,
				setUser,
				authtype,
				setAuthType,
				selectedCalendarStyle,
				setSelectedCalendarStyle,
				currentDate,
				setCurrentDate,
				currentMonth,
				setCurrentMonth,
				currentYear,
				setCurrentYear,
				currentDay,
				setCurrentDay,
				currentHour,
				setCurrentHour,
				currentMinute,
				setCurrentMinute,
				currentAMPM,
				setCurrentAMPM,
				selectedDate,
				setSelectedDate,
				selectedMonth,
				setSelectedMonth,
				selectedYear,
				setSelectedYear,
				selectedDay,
				setSelectedDay,
				selectedHour,
				setSelectedHour,
				selectedMinute,
				setSelectedMinute,
				selectedAMPM,
				setSelectedAMPM,
				newSelectedDate,
				setNewSelectedDate,
				allMonths,
				allDays,
				getFirstAndLastDayOfWeek,
				holidays,
				setHolidays,
				events,
				setEvents,
				weekDates,
				monthDates,
				yearDates,
				showHolidays,
				setShowHolidays,
				showEvents,
				setShowEvents,
				showTasks,
				setShowTasks,
				showBirthdays,
				setShowBirthdays,
				profileColor,
				setProfileColor,
				holidaysColor,
				setHolidaysColor,
				eventsColor,
				setEventsColor,
				tasksColor,
				setTasksColor,
				birthdaysColor,
				setBirthdaysColor,
				holidayRemainderTime,
				setHolidayRemainderTime,
				holidayRemainderFormat,
				setHolidayRemainderFormat,
				eventRemainderTime,
				setEventRemainderTime,
				eventRemainderFormat,
				setEventRemainderFormat,
				taskRemainderTime,
				setTaskRemainderTime,
				taskRemainderFormat,
				setTaskRemainderFormat,
				birthdayRemainderTime,
				setBirthdayRemainderTime,
				birthdayRemainderFormat,
				setBirthdayRemainderFormat,
				setSettings,
				selectedEventProps,
				setSelectedEventProps,
				getHexFromColor,
				getEvents,
			}}
		>
			<TooltipProvider delayDuration={100}>
				<Header />
				<Toaster
					toastOptions={{
						duration: 2000,
						classNames: {
							error: "bg-red-500 text-white",
							info: "bg-blue-500 text-white",
							success: "bg-green-500 text-white",
							warning: "bg-yellow-500 text-white",
						},
					}}
				/>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/year/:year/:month/:date" element={<Home />} />
					<Route
						path="/month/:year/:month/:date"
						element={<Home />}
					/>
					<Route path="/week/:year/:month/:date" element={<Home />} />
					<Route path="/date/:year/:month/:date" element={<Home />} />
					<Route
						path="/profile"
						element={
							isLoading ? (
								<Loader />
							) : isAuthenticated ? (
								<Profile />
							) : (
								<Error error={"401 Unauthorized"} />
							)
						}
					/>
					<Route
						path="/settings"
						element={
							isLoading ? (
								<Loader />
							) : isAuthenticated ? (
								<Settings />
							) : (
								<Error error={"401 Unauthorized"} />
							)
						}
					/>
					<Route
						path="event/invite/:invitationId"
						element={<Invite />}
					/>
					<Route
						path="/verify-account/:token"
						element={<VerifyAccount />}
					/>
					<Route
						path="/reset-password/:token"
						element={<ResetPassword />}
					/>
					<Route
						path="*"
						element={<Error error="404 Page not found" />}
					/>
				</Routes>
			</TooltipProvider>
		</Context.Provider>
	);
}

export default App;
