import express from "express";

import { postLoginController, postRegisterController, postLogoutController, postChangePasswordController, postVerifyTokenController, postSendAuthEmailController, postResetPasswordController, postAccountVerifiedController } from "../controllers/Auth.js";

import isAuthenticated from "../middlewares/auth.js";

const router = express.Router();

router.post('/api/v1/login', postLoginController)

router.post('/api/v1/register', postRegisterController)

router.post('/api/v1/logout', postLogoutController)

router.post('/api/v1/forgot-password', postSendAuthEmailController)

router.post('/api/v1/reset-password', postResetPasswordController)

router.post('/api/v1/verify-token', postVerifyTokenController)

router.post('/api/v1/verify-account', isAuthenticated, postSendAuthEmailController)

router.post('/api/v1/account-verified', postAccountVerifiedController)

router.post('/api/v1/change-password', isAuthenticated, postChangePasswordController)

export default router