import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { LucideLogIn } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

import { Context } from "@/pages/app";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

const loginFormSchema = z.object({
	usernameoremail: z.string().min(3, {
		message: "Username must be at least 3 characters",
	}),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters",
	}),
});

const registerFormSchema = z
	.object({
		username: z
			.string()
			.min(3, { message: "Username must be at least 3 characters" })
			.max(50, { message: "Username must be at most 50 characters" })
			.refine((data) => /^[a-zA-Z0-9_]+$/.test(data), {
				message:
					"Username must contain only letters, numbers, and underscores",
			}),
		email: z.string().email({ message: "Please enter a valid email" }),
		password: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" })
			.max(50, { message: "Password must be at most 50 characters" })
			.refine((data) => /[a-z]/.test(data), {
				message: "Password must contain at least one lowercase letter",
			})
			.refine((data) => /[A-Z]/.test(data), {
				message: "Password must contain at least one uppercase letter",
			})
			.refine((data) => /[0-9]/.test(data), {
				message: "Password must contain at least one number",
			})
			.refine(
				(data) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(data),
				{
					message:
						"Password must contain at least one special character",
				}
			),
		confirmpassword: z
			.string()
			.min(8, { message: "Password must be at least 8 characters" })
			.max(50, { message: "Password must be at most 50 characters" }),
	})
	.refine((data) => data.password === data.confirmpassword, {
		message: "Passwords don't match",
		path: ["confirmpassword"],
	});

const AuthModal = () => {
	const { isLoading, setIsLoading, authtype, setAuthType } =
		useContext(Context);

	const loginForm = useForm({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			usernameoremail: "",
			password: "",
		},
	});

	const handleForgotPassword = async () => {
		const email = loginForm.control._formValues.usernameoremail;

		if (!email) {
			toast.error("Please enter your email");
		} else if (z.string().email().safeParse(email).error) {
			toast.error("Please enter a valid email");
		} else {
			try {
				setIsLoading(true);
				const forgotPasswordResponse = await axios.post(
					`${import.meta.env.VITE_SERVER_URL}/api/v1/forgot-password`,
					{ email, type: "reset-password" },
					{
						withCredentials: true,
					}
				);

				if (forgotPasswordResponse.data.status === "Success") {
					toast.success(forgotPasswordResponse.data.message);
				} else if (forgotPasswordResponse.data.status === "Error") {
					toast.error(forgotPasswordResponse.data.error);
				}
			} catch (error) {
				toast.error(error.message);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<DialogContent className="sm:max-w-[425px]">
			<DialogHeader>
				{authtype === "login" ? (
					<DialogTitle className="text-3xl font-bold text-center text-blue-500">
						Login to Calendarez
					</DialogTitle>
				) : (
					<>
						{authtype === "register" ? (
							<DialogTitle className="text-3xl font-bold text-center text-blue-500">
								Create an account
							</DialogTitle>
						) : (
							<></>
						)}
					</>
				)}

				{authtype === "login" ? (
					<DialogDescription className="text-sm text-center">
						Please enter your credentials to login to your account.
					</DialogDescription>
				) : (
					<>
						{authtype === "register" ? (
							<DialogDescription className="text-sm text-center">
								Please create a new account to use Calendarez.
							</DialogDescription>
						) : (
							<></>
						)}
					</>
				)}
			</DialogHeader>
			{authtype === "login" ? (
				<LoginModal loginForm={loginForm} />
			) : (
				<RegisterModal />
			)}

			<DialogFooter className={"!flex-col"}>
				<div className="flex items-center justify-between">
					<Button
						variant="link"
						className="text-sm"
						disabled={isLoading}
						onClick={handleForgotPassword}
					>
						{authtype === "login" ? <>Forgot Password?</> : <></>}
					</Button>
					<Button
						variant="link"
						className="text-sm"
						disabled={isLoading}
						onClick={() => {
							if (authtype === "login") {
								setAuthType("register");
							} else setAuthType("login");
						}}
					>
						{authtype === "login" ? (
							<>Don't have an account?</>
						) : (
							<>
								{authtype === "register" ? (
									<>Already have an account?</>
								) : (
									<></>
								)}
							</>
						)}
					</Button>
					<DialogTrigger asChild>Signup</DialogTrigger>
				</div>
			</DialogFooter>
		</DialogContent>
	);
};

const LoginModal = ({ loginForm }) => {
	const {
		authtype,
		setIsAuthenticated,
		setUser,
		isLoading,
		setIsLoading,
		setSettings,
		events,
		setEvents,
		weekDates,
		newSelectedDate,
		getEvents,
	} = useContext(Context);

	const onLoginSubmit = async ({ usernameoremail, password }) => {
		try {
			setIsLoading(true);

			const loginResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/login`,
				{ usernameoremail, password },
				{
					withCredentials: true,
				}
			);

			if (loginResult.data.status === "Success") {
				toast.success(loginResult.data.message);

				setIsAuthenticated(true);
				setUser(loginResult.data.user);
				setSettings(loginResult.data.settings);
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
			} else if (loginResult.data.status === "Error") {
				toast.error(loginResult.data.error);
				setIsAuthenticated(false);
				setUser(null);
				setSettings(null);
				setEvents(null);
			}
		} catch (error) {
			toast.error(error.message);
			setIsAuthenticated(false);
			setUser(null);
			setSettings(null);
			setEvents(null);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...loginForm}>
			<form
				onSubmit={loginForm.handleSubmit(onLoginSubmit)}
				className="space-y-3"
			>
				<FormField
					control={loginForm.control}
					name="usernameoremail"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username/Email</FormLabel>
							<FormControl>
								<Input
									disabled={isLoading}
									{...field}
									className="focus-visible:border-blue-500"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={loginForm.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									disabled={isLoading}
									{...field}
									className="focus-visible:border-blue-500"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full bg-blue-500 hover:bg-blue-500/90"
					disabled={isLoading}
				>
					<LucideLogIn className="mr-4 h-4 w-4" />
					{authtype === "login" ? (
						<>Login</>
					) : (
						<>{authtype === "register" ? <>Register</> : <></>}</>
					)}
				</Button>
			</form>
		</Form>
	);
};

const RegisterModal = () => {
	const { authtype, setAuthType, isLoading, setIsLoading } =
		useContext(Context);

	const registerForm = useForm({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmpassword: "",
		},
	});

	const onRegisterSubmit = async ({ username, email, password }) => {
		try {
			setIsLoading(true);

			const registerResult = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/v1/register`,
				{ username, email, password },
				{
					withCredentials: true,
				}
			);

			if (registerResult.data.status === "Success") {
				const createSettingsResult = await axios.post(
					`${import.meta.env.VITE_SERVER_URL}/api/v1/create-settings`,
					{ username },
					{
						withCredentials: true,
					}
				);

				if (createSettingsResult.data.status === "Success") {
					toast.success(registerResult.data.message);
					setAuthType("login");
				} else if (createSettingsResult.data.status === "Error") {
					toast.error(createSettingsResult.data.error);
				}
			} else if (registerResult.data.status === "Error") {
				toast.error(registerResult.data.error);
			}
		} catch (error) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Form {...registerForm}>
			<form
				onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
				className="space-y-3"
			>
				<FormField
					control={registerForm.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									disabled={isLoading}
									{...field}
									className="focus-visible:border-blue-500"
								/>
							</FormControl>
							{/* <FormDescription>
								This is your public display name.
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={registerForm.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									disabled={isLoading}
									{...field}
									className="focus-visible:border-blue-500"
								/>
							</FormControl>
							{/* <FormDescription>
								This is your public display name.
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={registerForm.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									disabled={isLoading}
									{...field}
									className="focus-visible:border-blue-500"
								/>
							</FormControl>
							{/* <FormDescription>
								This is your public display name.
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={registerForm.control}
					name="confirmpassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									disabled={isLoading}
									{...field}
									className="focus-visible:border-blue-500"
								/>
							</FormControl>
							{/* <FormDescription>
								This is your public display name.
							</FormDescription> */}
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full bg-blue-500 hover:bg-blue-500/90"
					disabled={isLoading}
				>
					<LucideLogIn className="mr-4 h-4 w-4" />
					{authtype === "login" ? (
						<>Login</>
					) : (
						authtype === "register" && <>Register</>
					)}
				</Button>
			</form>
		</Form>
	);
};

export default AuthModal;
