import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "@/components/loader";
import { LucideCircleCheckBig } from "lucide-react";

import { Context } from "./app";
import Error from "./error";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const VerifyAccount = () => {
	const { isLoading, setIsLoading } = useContext(Context);
	const { token } = useParams();
	const [tokenVerified, setTokenVerified] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = "Verify Account";
	}, []);

	useEffect(() => {
		if (tokenVerified) {
			document.title = "Verify Account";
		} else {
			document.title = "Error";
		}
	}, [tokenVerified]);

	useEffect(() => {
		const accountVerified = async () => {
			try {
				setIsLoading(true);

				const accountVerifiedResponse = await axios.post(
					`${
						import.meta.env.VITE_SERVER_URL
					}/api/v1/account-verified`,
					{ token: token },
					{
						withCredentials: true,
					}
				);

				if (accountVerifiedResponse.data.status === "Success") {
					setTokenVerified(true);
				} else {
					setTokenVerified(false);
					if (accountVerifiedResponse.data.error === "jwt expired") {
						setError(
							"410 This link for Verify Account has been expired."
						);
					} else {
						setError(
							"498 This link for Verify Account has been Tampered."
						);
					}
				}
			} catch (error) {
				setTokenVerified(false);
				setError("498 This link for Verify Account has been Tampered.");
			} finally {
				setIsLoading(false);
			}
		};

		accountVerified();
	}, []);

	return isLoading ? (
		<Loader />
	) : tokenVerified ? (
		<div className="h-[calc(100vh-121px)] flex flex-col items-center justify-center">
			<Card className="w-[525px]">
				<CardHeader className="gap-3 flex flex-col items-center">
					<LucideCircleCheckBig className="w-24 h-24 text-emerald-500" />
					<CardTitle className="text-3xl text-center font-bold text-blue-500">
						Account Verified
					</CardTitle>
					<CardContent>
						<CardDescription className="text-center">
							Congratulations! Your account has been verified. You
							can now access all services.
						</CardDescription>
					</CardContent>
				</CardHeader>
			</Card>
		</div>
	) : (
		<Error from="Verify Account" error={error} />
	);
};

export default VerifyAccount;
