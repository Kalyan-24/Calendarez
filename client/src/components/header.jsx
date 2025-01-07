import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoHorizontalRule } from "react-icons/go";
import {
	LucideLogOut,
	LucideSearch,
	LucideSettings,
	LucideUser2,
} from "lucide-react";
import { toast } from "sonner";

import { Context } from "@/pages/app";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import AuthModal from "./auth-modal";
import { Badge } from "./ui/badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./ui/command";

import { cn } from "@/lib/utils";

const Header = () => {
	const {
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
		currentMonth,
		currentYear,
		currentDay,
		selectedDate,
		setSelectedDate,
		selectedMonth,
		setSelectedMonth,
		selectedYear,
		setSelectedYear,
		setSelectedDay,
		setSelectedHour,
		setSelectedMinute,
		newSelectedDate,
		setNewSelectedDate,
		allMonths,
		allDays,
		getFirstAndLastDayOfWeek,
		profileColor,
		setSettings,
		setEvents,
	} = useContext(Context);

	const navigate = useNavigate();

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const [searchQuery, setSearchQuery] = useState("");

	const [searchResults, setSearchResults] = useState([]);

	const onTodayButtonClick = () => {
		setNewSelectedDate(new Date());

		setSelectedDate(new Date().getDate());
		setSelectedMonth(allMonths[new Date().getMonth()]);
		setSelectedYear(new Date().getFullYear());
		setSelectedDay(allDays[new Date().getDay()]);
		setSelectedHour(new Date().getHours());
		setSelectedMinute(new Date().getMinutes());
	};

	const handleProfile = () => {
		navigate(`/profile`);
	};

	const handleSettings = () => {
		navigate("/settings");
	};

	const handleLogout = async () => {
		try {
			setIsLoading(true);

			const logoutResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/logout`,
				{},
				{
					withCredentials: true,
				}
			);

			if (logoutResult.data.status === "Success") {
				toast.success(logoutResult.data.message);
				setIsAuthenticated(false);
				setSettings(null);
				setUser(null);
				setEvents(null);
				setNewSelectedDate(new Date());
				navigate("/");
			} else if (logoutResult.data.status === "Error") {
				toast.error(logoutResult.data.message);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsDialogOpen(false);
			setIsLoading(false);
		}
	};

	const handleSearch = async () => {
		try {
			setIsLoading(true);
			const searchResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/search`,
				{
					query: searchQuery,
					year: newSelectedDate.getFullYear(),
				},
				{
					withCredentials: true,
				}
			);

			if (searchResult.data.status === "Success") {
				setSearchResults(searchResult.data.results);
			} else if (searchResult.data.status === "Error") {
				setSearchResults([]);
			}
		} catch (error) {
			toast.error(error.message);
			setSearchResults([]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (searchQuery.length < 3) {
			setSearchResults([]);
		} else {
			handleSearch();
		}
	}, [searchQuery]);

	return (
		<header>
			<div className="flex items-center justify-between px-7 py-3 z-10 bg-white">
				<div className="flex items-center gap-10">
					<Link
						className="flex items-center gap-2 cursor-pointer"
						to={`/${selectedCalendarStyle}/${newSelectedDate.getFullYear()}/${
							newSelectedDate.getMonth() + 1
						}/${newSelectedDate.getDate()}`}
					>
						<img
							src="/assets/images/icon.png"
							alt="Icon"
							width={27}
						/>
						<span className="text-[20px] font-normal">
							Calendarez
						</span>
					</Link>

					{isLoading ? (
						<Skeleton className="h-6 w-[200px]" />
					) : (
						<Tooltip>
							<TooltipTrigger>
								<Badge variant="outline">
									<div className="flex items-center gap-1 text-xl">
										{selectedCalendarStyle === "date" && (
											<span className="font-normal">
												{selectedDate}
											</span>
										)}
										{selectedCalendarStyle === "week" && (
											<>
												{(() => {
													const firstAndLastDayOfWeek =
														getFirstAndLastDayOfWeek(
															newSelectedDate
														);

													const firstDate =
														firstAndLastDayOfWeek
															.split(" - ")[0]
															.split(" ")[0];

													const firstMonth =
														firstAndLastDayOfWeek
															.split(" - ")[0]
															.split(" ")[1]
															.substring(0, 3);

													const firstYear =
														firstAndLastDayOfWeek
															.split(" - ")[0]
															.split(" ")[2];

													const lastDate =
														firstAndLastDayOfWeek
															.split(" - ")[1]
															.split(" ")[0];

													const lastMonth =
														firstAndLastDayOfWeek
															.split(" - ")[1]
															.split(" ")[1]
															.substring(0, 3);

													const lastYear =
														firstAndLastDayOfWeek
															.split(" - ")[1]
															.split(" ")[2];

													if (
														firstMonth === lastMonth
													) {
														return (
															<span className="flex gap-1 items-center justify-center">
																<span className="flex gap-1 items-center justify-center font-normal">
																	{firstDate}
																	<GoHorizontalRule />
																	{lastDate}
																</span>
																<span className="font-extrabold">
																	{firstMonth}
																</span>
																<span className="font-light">
																	{firstYear}
																</span>
															</span>
														);
													} else if (
														firstYear === lastYear
													) {
														return (
															<span className="flex gap-1 items-center justify-center">
																<span className="font-normal">
																	{firstDate}
																</span>
																<span className="font-extrabold">
																	{firstMonth}
																</span>
																<GoHorizontalRule />
																<span className="font-normal">
																	{lastDate}
																</span>
																<span className="font-extrabold">
																	{lastMonth}
																</span>
																<span className="font-light">
																	{firstYear}
																</span>
															</span>
														);
													} else {
														return (
															<span className="flex gap-1 items-center justify-center">
																<span className="font-normal">
																	{firstDate}
																</span>
																<span className="font-extrabold">
																	{firstMonth}
																</span>
																<span className="font-light">
																	{firstYear}
																</span>
																<GoHorizontalRule />
																<span className="font-normal">
																	{lastDate}
																</span>
																<span className="font-extrabold">
																	{lastMonth}
																</span>
																<span className="font-light">
																	{lastYear}
																</span>
															</span>
														);
													}
												})()}
											</>
										)}
										{["date", "month"].includes(
											selectedCalendarStyle
										) && (
											<span className="font-extrabold">
												{selectedMonth}
											</span>
										)}
										{["date", "month", "year"].includes(
											selectedCalendarStyle
										) && (
											<span className="font-light">
												{selectedYear}
											</span>
										)}
									</div>
								</Badge>
							</TooltipTrigger>
							{selectedCalendarStyle === "week" && (
								<TooltipContent className="bg-gray-700">
									<p>Week {newSelectedDate.getWeek()}</p>
								</TooltipContent>
							)}
						</Tooltip>
					)}

					{isLoading ? (
						<Skeleton className="h-6 w-[73.25px]" />
					) : (
						<div>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										onClick={onTodayButtonClick}
									>
										Today
									</Button>
								</TooltipTrigger>
								<TooltipContent className="bg-gray-700">
									<p>
										{currentDate} {currentMonth}{" "}
										{currentYear}, {currentDay}
									</p>
								</TooltipContent>
							</Tooltip>
						</div>
					)}

					{(window.location.pathname.split("/")[1] === "" ||
						window.location.pathname.split("/")[1] === "date" ||
						window.location.pathname.split("/")[1] === "week" ||
						window.location.pathname.split("/")[1] === "month" ||
						window.location.pathname.split("/")[1] === "year") && (
						<Select
							defaultValue={selectedCalendarStyle}
							onValueChange={(value) => {
								setSelectedCalendarStyle(value);
							}}
							disabled={isLoading}
						>
							<SelectTrigger className="max-w-fit gap-2 focus:ring-0">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="date">Date</SelectItem>
									<SelectItem value="week">Week</SelectItem>
									<SelectItem value="month">Month</SelectItem>
									<SelectItem value="year">Year</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					)}
				</div>
				<div className="flex items-center gap-4">
					<div>
						<Tooltip>
							<Dialog
								open={isOpen}
								onOpenChange={(open) => {
									setIsOpen(open);
									setSearchQuery("");
									setSearchResults([]);
								}}
							>
								<TooltipTrigger asChild>
									<DialogTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											disabled={isLoading}
										>
											<LucideSearch className="text-zinc-600 h-5 w-5" />
										</Button>
									</DialogTrigger>
								</TooltipTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle className="text-2xl font-bold text-blue-500">
											Search
										</DialogTitle>
										<DialogDescription>
											Holidays, Events, Tasks and
											Birthdays in
											<span className="ml-1 font-extrabold">
												{newSelectedDate.getFullYear()}
											</span>
										</DialogDescription>
									</DialogHeader>

									<Command>
										<CommandInput
											placeholder="Search event..."
											className="h-9"
											value={searchQuery}
											onValueChange={setSearchQuery}
										/>
										<CommandList>
											<CommandEmpty>
												{isLoading ? (
													<div className="space-y-2">
														<Skeleton className="h-8" />
														<Skeleton className="h-8" />
														<Skeleton className="h-8" />
													</div>
												) : searchQuery.length === 0 ? (
													"Type something to search..."
												) : searchQuery.length < 3 ? (
													"Search query must be at least 3 characters."
												) : (
													"No results found."
												)}
											</CommandEmpty>
											<CommandGroup>
												{!isLoading &&
													searchQuery.length >= 3 &&
													searchResults.map(
														(result) => (
															<CommandItem
																key={result.id}
																className="text-sm cursor-pointer"
																value={
																	result.title
																}
																onSelect={(
																	currentValue
																) => {
																	navigate(
																		`/${selectedCalendarStyle}/${new Date(
																			result.date
																		).getFullYear()}/${
																			new Date(
																				result.date
																			).getMonth() +
																			1
																		}/${new Date(
																			result.date
																		).getDate()}`
																	);
																	setIsOpen(
																		false
																	);
																}}
															>
																{result.type ===
																	"Holiday" &&
																	"🏖️"}
																{result.type ===
																	"Event" &&
																	"📅"}
																{result.type ===
																	"Task" &&
																	"📝"}
																{result.type ===
																	"Birthday" &&
																	"🎂"}
																<span className="ml-2">
																	{
																		result.title
																	}
																	{result.type ===
																		"Birthday" &&
																		result.title !==
																			"" &&
																		"'s Birthday"}
																</span>
															</CommandItem>
														)
													)}
											</CommandGroup>
										</CommandList>
									</Command>
								</DialogContent>
							</Dialog>
							<TooltipContent className="bg-gray-700">
								<p>Search</p>
							</TooltipContent>
						</Tooltip>
					</div>

					{isAuthenticated ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="rounded-full"
									disabled={isLoading}
								>
									<Avatar className="w-9 h-9">
										<AvatarImage />
										<AvatarFallback
											className={cn(
												`bg-${profileColor}-500 text-accent font-medium`,
												!user.username.split("_")[1] &&
													"text-lg"
											)}
										>
											{user.username
												.split("_")[0][0]
												.toUpperCase()}
											{user.username.split("_")[1] &&
												user.username
													.split("_")[1][0]
													.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								<DropdownMenuLabel>
									My Account
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem onClick={handleProfile}>
										<LucideUser2 className="mr-2 h-4 w-4" />
										Profile
									</DropdownMenuItem>
								</DropdownMenuGroup>

								<DropdownMenuGroup>
									<DropdownMenuItem onClick={handleSettings}>
										<LucideSettings className="mr-2 h-4 w-4" />
										Settings
									</DropdownMenuItem>
								</DropdownMenuGroup>

								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => setIsDialogOpen(true)}
								>
									<LucideLogOut className="mr-2 h-4 w-4" />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>

							<AlertDialog
								open={isDialogOpen}
								onOpenChange={setIsDialogOpen}
							>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you sure you want to log out?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel
											onClick={() =>
												setIsDialogOpen(false)
											}
										>
											Cancel
										</AlertDialogCancel>
										<AlertDialogAction
											onClick={handleLogout}
											className="bg-red-500 hover:bg-red-500/90"
										>
											Log out
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</DropdownMenu>
					) : (
						<div className="flex items-center gap-2">
							<Dialog>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										disabled={isLoading}
										onClick={() => {
											setAuthType("login");
										}}
									>
										Login
									</Button>
								</DialogTrigger>
								<AuthModal />
							</Dialog>

							<Dialog>
								<DialogTrigger asChild>
									<Button
										className="bg-blue-500 hover:bg-blue-500/90 transition"
										disabled={isLoading}
										onClick={() => {
											setAuthType("register");
										}}
									>
										Register
									</Button>
								</DialogTrigger>
								<AuthModal />
							</Dialog>
						</div>
					)}
				</div>
			</div>
			<Separator />
		</header>
	);
};

export default Header;
