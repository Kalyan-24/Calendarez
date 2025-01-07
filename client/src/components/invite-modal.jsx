import React, { useContext, useEffect, useState } from "react";
import { LuCheck, LuCopy, LuLoader2 } from "react-icons/lu";
import { toast } from "sonner";
import axios from "axios";

import { Context } from "@/pages/app";

import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const InviteModal = ({ eventId, inviteOpen }) => {
	const { isLoading, setIsLoading } = useContext(Context);
	const [inviteURL, setInviteURL] = useState("");
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		setInviteURL("");
		const getInvitationId = async () => {
			if (!inviteOpen) return;
			try {
				setIsLoading(true);
				const getInviteDataResponse = await axios.post(
					`${
						import.meta.env.VITE_SERVER_URL
					}/api/v1/get-invitation-id`,
					{
						eventid: eventId,
					},
					{
						withCredentials: true,
					}
				);

				if (getInviteDataResponse.data.status === "Success") {
					setInviteURL(
						`${window.location.origin}/event/invite/${getInviteDataResponse.data.invite._id}`
					);
				} else if (getInviteDataResponse.data.status === "Error") {
				}
			} catch (error) {
			} finally {
				setIsLoading(false);
			}
		};

		getInvitationId();
	}, [inviteOpen]);

	const onCopy = () => {
		navigator.clipboard.writeText(inviteURL);
		toast.success("Copied to clipboard");

		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	return (
		<DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
			<DialogHeader>
				<DialogTitle className="text-3xl font-bold text-center text-blue-500">
					Invite People
				</DialogTitle>
				<DialogDescription className="text-center">
					Share this link with people.
				</DialogDescription>

				<Label
					className="!mt-7 uppercase text-xs font-bold text-zinc-500"
					htmlFor="invite-link"
				>
					Invite link
				</Label>
				<div className="flex items-center mt-2 gap-x-2">
					{!isLoading ? (
						<Input
							id="invite-link"
							value={inviteURL}
							className="focus-visible:ring-0 border-0 bg-zinc-100"
							readOnly
						/>
					) : (
						<Skeleton className="h-9 w-[421px]" />
					)}
					<Button
						size="icon"
						variant="ghost"
						onClick={onCopy}
						disabled={isLoading}
					>
						{isLoading ? (
							<LuLoader2 className="animate-spin h-4 w-4" />
						) : copied ? (
							<LuCheck className="h-4 w-4" />
						) : (
							<LuCopy className="h-4 w-4" />
						)}
					</Button>
				</div>
			</DialogHeader>
		</DialogContent>
	);
};

export default InviteModal;
