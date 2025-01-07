import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { LucideAlertTriangle, LucideCheck, LucideX } from "lucide-react";

import Error from "./error";
import { Context } from "./app";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AuthModal from "@/components/auth-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loader from "@/components/loader";

import { cn } from "@/lib/utils";

const Invite = () => {
	const {
		setAuthType,
		isAuthenticated,
		isLoading,
		setIsLoading,
		user,
		allMonths,
		allDays,
		getHexFromColor,
	} = useContext(Context);

	const { invitationId } = useParams();

	const [invitationData, setInvitationData] = useState({});
	const [eventData, setEventData] = useState({});

	const [isCommenting, setIsCommenting] = useState(false);
	const [comment, setComment] = useState("");

	const timeAgo = (input) => {
		const date = input instanceof Date ? input : new Date(input);
		const formatter = new Intl.RelativeTimeFormat("en");
		const ranges = {
			years: 3600 * 24 * 365,
			months: 3600 * 24 * 30,
			weeks: 3600 * 24 * 7,
			days: 3600 * 24,
			hours: 3600,
			minutes: 60,
			seconds: 1,
		};
		const secondsElapsed = (date.getTime() - Date.now()) / 1000;
		for (let key in ranges) {
			if (ranges[key] < Math.abs(secondsElapsed)) {
				const delta = secondsElapsed / ranges[key];
				return formatter.format(Math.round(delta), key);
			}
		}
		return formatter.format(Math.round(secondsElapsed), "seconds");
	};

	useEffect(() => {
		if (invitationData) {
			if (eventData.title) {
				document.title = `${eventData.title} - Invitation`;
			} else if (eventData.title === "") {
				document.title = "Invitation";
			}
		} else {
			document.title = "Error";
		}
	}, [invitationData]);

	useEffect(() => {
		const getInvitationData = async () => {
			setIsLoading(true);
			try {
				const invitationDataResponse = await axios.post(
					`${
						import.meta.env.VITE_SERVER_URL
					}/api/v1/get-invitation-data`,
					{ inviteid: invitationId },
					{ withCredentials: true }
				);

				if (invitationDataResponse.data.status === "Success") {
					setInvitationData(invitationDataResponse.data.invite);

					setEventData(invitationDataResponse.data.event);
				}
			} catch (error) {
			} finally {
				setIsLoading(false);
			}
		};

		getInvitationData();
	}, [invitationId]);

	useEffect(() => {
		if (
			invitationData.responses &&
			user &&
			invitationData.responses.find(
				(response) => response.user.id === user.id
			)
		) {
			setComment(
				invitationData.responses.find(
					(response) => response.user.id === user.id
				).comment
			);
		}
	}, [invitationData, user]);

	const respondToInviteHandler = async (response) => {
		if (isAuthenticated) {
			try {
				setIsLoading(true);
				const respondToInviteResponse = await axios.post(
					`${
						import.meta.env.VITE_SERVER_URL
					}/api/v1/respond-to-invite`,
					{ inviteid: invitationId, value: response },
					{ withCredentials: true }
				);

				if (respondToInviteResponse.data.status === "Success") {
					toast.success(respondToInviteResponse.data.message);
					setInvitationData(respondToInviteResponse.data.invite);
				} else if (respondToInviteResponse.data.status === "Error") {
					toast.error(respondToInviteResponse.data.error);
				}
			} catch (error) {
				toast.error(
					`${error.response.data.error} (Internal server error)`
				);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const commentHandler = async () => {
		if (isAuthenticated) {
			try {
				setIsLoading(true);
				const commentResponse = await axios.post(
					`${
						import.meta.env.VITE_SERVER_URL
					}/api/v1/comment-on-invite`,
					{ inviteid: invitationId, comment },
					{ withCredentials: true }
				);

				if (commentResponse.data.status === "Success") {
					toast.success(commentResponse.data.message);
					setInvitationData(commentResponse.data.invite);
					setComment(
						commentResponse.data.invite.responses.find(
							(response) => response.user.id === user.id
						).comment
					);
					setIsCommenting(false);
				} else if (commentResponse.data.status === "Error") {
					toast.error(commentResponse.data.error);
					setComment(
						invitationData.responses.find(
							(response) => response.user.id === user.id
						).comment
					);
					setIsCommenting(false);
				}
			} catch (error) {
				toast.error(
					`${error.response.data.error} (Internal server error)`
				);
				setComment(
					invitationData.responses.find(
						(response) => response.user.id === user.id
					).comment
				);
				setIsCommenting(false);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<>
			{invitationData.host && invitationData.host.id ? (
				<div className="flex h-[calc(100vh-61px)]">
					<div className="flex flex-col flex-grow justify-start items-center relative my-5">
						{eventData.type === "Event" ? (
							<img
								src="/assets/images/event-placeholder.webp"
								className="w-[540px] rounded-t-2xl"
								alt="event"
							/>
						) : eventData.type === "Birthday" ? (
							<img
								src="/assets/images/birthday-placeholder.webp"
								className="w-[540px] rounded-t-2xl"
								alt="birthday"
							/>
						) : null}

						<div className="flex flex-col justify-evenly w-[540px] h-full border rounded-b-2xl px-5">
							{isLoading ? (
								<Skeleton className="w-full h-8" />
							) : (
								<>
									{eventData.title === undefined ? (
										<Skeleton className="w-full h-8" />
									) : (
										<span
											className="text-3xl font-semibold"
											style={{
												color: getHexFromColor(
													eventData.color
												),
											}}
										>
											{eventData.title
												? eventData.title
												: "[Untitled]"}
										</span>
									)}
								</>
							)}
							{isLoading ? (
								<Skeleton className="w-full h-8" />
							) : (
								<>
									{eventData.description === undefined ? (
										<Skeleton className="w-full h-8" />
									) : (
										<span className="text-sm text-gray-600">
											{eventData.description
												? eventData.description
												: "[No description]"}
										</span>
									)}
								</>
							)}
							{isLoading ? (
								<Skeleton className="w-full h-8" />
							) : (
								<>
									{!new Date(eventData.date).getDate() ? (
										<Skeleton className="w-full h-8" />
									) : (
										<span className="text-md text-gray-600">
											{`${new Date(
												eventData.date
											).getDate()} ${
												allMonths[
													new Date(
														eventData.date
													).getMonth()
												]
											} ${new Date(
												eventData.date
											).getFullYear()}, ${
												allDays[
													new Date(
														eventData.date
													).getDay()
												]
											}`}
											{eventData.type !== "Birthday" &&
												` | ${eventData.time}`}
										</span>
									)}
								</>
							)}

							{isAuthenticated &&
							invitationData.host &&
							invitationData.host.id === user.id ? (
								<></>
							) : (
								<div className="flex items-center">
									<span className="text-lg font-semibold">
										Willing to go
									</span>
									<div>
										<Dialog>
											<DialogTrigger asChild>
												<Button
													disabled={isLoading}
													variant="outline"
													onClick={() => {
														respondToInviteHandler(
															"Yes"
														);
														setAuthType("login");
													}}
													className={cn(
														"ml-5",
														invitationData.responses &&
															invitationData.responses.filter(
																(response) =>
																	user &&
																	response
																		.user
																		.id ===
																		user.id &&
																	response.value ===
																		"Yes"
															).length === 1 &&
															"bg-blue-500 hover:bg-blue-500/90 text-primary-foreground hover:text-primary-foreground"
													)}
												>
													Yes
												</Button>
											</DialogTrigger>

											{!isAuthenticated && <AuthModal />}
										</Dialog>

										<Dialog>
											<DialogTrigger asChild>
												<Button
													disabled={isLoading}
													variant="outline"
													onClick={() => {
														respondToInviteHandler(
															"No"
														);
														setAuthType("login");
													}}
													className={cn(
														"ml-5",
														invitationData.responses &&
															invitationData.responses.filter(
																(response) =>
																	user &&
																	response
																		.user
																		.id ===
																		user.id &&
																	response.value ===
																		"No"
															).length === 1 &&
															"bg-blue-500 hover:bg-blue-500/90 text-primary-foreground hover:text-primary-foreground"
													)}
												>
													No
												</Button>
											</DialogTrigger>

											{!isAuthenticated && <AuthModal />}
										</Dialog>

										<Dialog>
											<DialogTrigger asChild>
												<Button
													disabled={isLoading}
													variant="outline"
													onClick={() => {
														respondToInviteHandler(
															"Not sure"
														);
														setAuthType("login");
													}}
													className={cn(
														"ml-5",
														invitationData.responses &&
															invitationData.responses.filter(
																(response) =>
																	user &&
																	response
																		.user
																		.id ===
																		user.id &&
																	response.value ===
																		"Not sure"
															).length === 1 &&
															"bg-blue-500 hover:bg-blue-500/90 text-primary-foreground hover:text-primary-foreground"
													)}
												>
													Not sure
												</Button>
											</DialogTrigger>

											{!isAuthenticated && <AuthModal />}
										</Dialog>
									</div>
								</div>
							)}

							{!isAuthenticated ||
							(isAuthenticated &&
								invitationData.host &&
								invitationData.host.id === user.id) ||
							(invitationData.responses &&
								invitationData.responses.find(
									(response) => response.user.id === user.id
								) === undefined) ? (
								<></>
							) : (
								<div className="flex items-center">
									{!isCommenting ? (
										<Button
											disabled={isLoading}
											onClick={() =>
												setIsCommenting((prev) => !prev)
											}
											className="bg-blue-500 hover:bg-blue-500/90 text-primary-foreground hover:text-primary-foreground"
										>
											{isAuthenticated &&
											invitationData.responses &&
											invitationData.responses.find(
												(response) =>
													response.user.id === user.id
											) &&
											invitationData.responses.find(
												(response) =>
													response.user.id === user.id
											).comment !== "" &&
											isAuthenticated &&
											invitationData.responses &&
											invitationData.responses.find(
												(response) =>
													response.user.id === user.id
											).comment !== undefined ? (
												<>Edit Comment</>
											) : (
												<>Add Comment</>
											)}
										</Button>
									) : (
										<div className="w-full flex flex-col gap-2">
											<Label
												htmlFor="comment"
												className="text-sm font-semibold text-gray-600"
											>
												Comment
											</Label>
											<Input
												id="comment"
												value={comment}
												onChange={(e) =>
													setComment(e.target.value)
												}
												className="w-full focus-visible:border-blue-500"
											/>
											<div className="flex justify-end gap-2">
												<Button
													variant="outline"
													disabled={isLoading}
													onClick={() => {
														setIsCommenting(false);
													}}
													className="w-full"
												>
													Cancel
												</Button>
												<Button
													disabled={isLoading}
													onClick={commentHandler}
													className="bg-blue-500 hover:bg-blue-500/90 text-primary-foreground hover:text-primary-foreground w-full"
												>
													Comment
												</Button>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>

					<Separator orientation="vertical" />

					<div className="w-[500px]">
						<ScrollArea className="h-[calc(100vh-61px)]">
							<h3 className="text-xl font-semibold pl-5 pt-5">
								<span className="font-bold">Host</span>
							</h3>

							<div className="flex flex-col gap-3 my-5 px-5">
								<div className="flex gap-5 w-full">
									<span className="relative">
										<Avatar className="w-9 h-9 scale-[1.2]">
											<AvatarImage />
											<AvatarFallback
												className={cn(
													`bg-${invitationData.host.profilecolor}-500 text-accent font-medium`,
													invitationData.host &&
														invitationData.host.username.split(
															"_"
														)[1] &&
														"text-lg"
												)}
											>
												{invitationData.host &&
													invitationData.host.username
														.split("_")[0][0]
														.toUpperCase()}
												{invitationData.host &&
													invitationData.host.username.split(
														"_"
													)[1] &&
													invitationData.host.username
														.split("_")[1][0]
														.toUpperCase()}
											</AvatarFallback>
										</Avatar>
									</span>
									<div className="flex flex-col justify-center">
										<div
											className={cn(
												"text-md font-semibold h-fit -m-1 -mb-1"
											)}
										>
											{invitationData.host &&
												invitationData.host.username}

											<span className="text-xs text-gray-500 font-normal ml-1">
												(Created{" "}
												{timeAgo(
													invitationData.createdAt
												)}
												)
											</span>
										</div>
									</div>
								</div>
							</div>

							<Separator className="h-[0.5px]" />

							<h3 className="text-xl font-semibold pl-5 pt-5 flex items-center gap-1">
								<span
									className={cn(
										"font-black",
										invitationData.responses &&
											invitationData.responses.length ===
												0 &&
											"font-semibold"
									)}
								>
									{invitationData.responses &&
									invitationData.responses.length > 0
										? invitationData.responses.length
										: "No"}
								</span>{" "}
								{(invitationData.responses &&
									invitationData.responses.length > 1) ||
								invitationData.responses.length === 0
									? "Responses"
									: "Response"}{" "}
								<span className="text-gray-500 font-normal text-sm mt-0.5">
									{invitationData.responses &&
										invitationData.responses.length > 0 &&
										"("}
									{invitationData.responses &&
										invitationData.responses.filter(
											(response) =>
												response.value === "Yes"
										).length !== 0 &&
										`${
											invitationData.responses.filter(
												(response) =>
													response.value === "Yes"
											).length
										} Yes`}
									{invitationData.responses &&
										invitationData.responses.filter(
											(response) =>
												response.value === "Yes"
										).length !== 0 &&
										(invitationData.responses.filter(
											(response) =>
												response.value === "No"
										).length !== 0 ||
											invitationData.responses.filter(
												(response) =>
													response.value ===
													"Not sure"
											).length !== 0) &&
										", "}
									{invitationData.responses &&
										invitationData.responses.filter(
											(response) =>
												response.value === "No"
										).length !== 0 &&
										`${
											invitationData.responses.filter(
												(response) =>
													response.value === "No"
											).length
										} No`}
									{invitationData.responses &&
										invitationData.responses.filter(
											(response) =>
												response.value === "No"
										).length !== 0 &&
										invitationData.responses.filter(
											(response) =>
												response.value === "Not sure"
										).length !== 0 &&
										", "}
									{invitationData.responses &&
										invitationData.responses.filter(
											(response) =>
												response.value === "Not sure"
										).length !== 0 &&
										`${
											invitationData.responses.filter(
												(response) =>
													response.value ===
													"Not sure"
											).length
										} Not sure`}
									{invitationData.responses &&
										invitationData.responses.length > 0 &&
										")"}
								</span>
							</h3>

							{invitationData.responses &&
								invitationData.responses.map(
									(response, index) => {
										return (
											<div
												key={index}
												className="flex flex-col gap-3 my-5 px-5"
											>
												<div className="flex gap-5 w-full">
													<span className="relative">
														<Avatar className="w-9 h-9 scale-[1.2]">
															<AvatarImage />
															<AvatarFallback
																className={cn(
																	`bg-${response.user.profilecolor}-500 text-accent font-medium`,
																	response.user &&
																		response.user.username.split(
																			"_"
																		)[1] &&
																		"text-lg"
																)}
															>
																{response.user &&
																	response.user.username
																		.split(
																			"_"
																		)[0][0]
																		.toUpperCase()}
																{response.user &&
																	response.user.username.split(
																		"_"
																	)[1] &&
																	response.user.username
																		.split(
																			"_"
																		)[1][0]
																		.toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<Avatar className="w-4 h-4 absolute bottom-0 right-0 translate-x-1 translate-y-1">
															<AvatarFallback
																className={cn(
																	"flex items-center justify-center",
																	response.value ===
																		"Yes" &&
																		"bg-green-500",
																	response.value ===
																		"No" &&
																		"bg-red-500",
																	response.value ===
																		"Not sure" &&
																		"bg-yellow-500"
																)}
															>
																{response.value ===
																"Yes" ? (
																	<LucideCheck className="w-[10px] h-[10px] text-white" />
																) : response.value ===
																  "No" ? (
																	<LucideX className="w-[10px] h-[10px] text-white" />
																) : (
																	<LucideAlertTriangle className="w-[10px] h-[10px] text-white" />
																)}
															</AvatarFallback>
														</Avatar>
													</span>
													<div className="flex flex-col justify-center">
														<div
															className={cn(
																"flex items-center text-md font-semibold h-fit -m-1 -mb-1",
																response.comment &&
																	"-mt-2 mb-1"
															)}
														>
															{
																response.user
																	.username
															}
															<span className="text-xs text-gray-500 font-normal ml-1">
																(
																{timeAgo(
																	response.createdAt
																)}
																)
															</span>
															{response.isEdited && (
																<span className="text-xs text-gray-500 font-normal ml-1">
																	(edited)
																</span>
															)}
														</div>
														<div className="text-sm text-gray-600 h-fit w-full flex [word-break:break-all]">
															{response.comment}
														</div>
													</div>
												</div>
											</div>
										);
									}
								)}
						</ScrollArea>
					</div>
				</div>
			) : (
				<div className="h-[calc(100vh-121px)] flex items-center justify-center">
					{isLoading ? (
						<Loader />
					) : (
						<Error error="404 Invitation not found. Contact the Host for additional information!" />
					)}
				</div>
			)}
		</>
	);
};

export default Invite;
