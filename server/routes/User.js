import express from "express";

import { postGetHolidaysController, postCreateSettingsController, postEditSettingsController, postGetUserController, postEditProfileController } from "../controllers/User.js";

import isAuthenticated from "../middlewares/auth.js";

const router = express.Router();

router.get('/', (req, res) => {
    return res.status(200).json({ message: 'Hello World' })
})

router.post('/api/v1/holidays', postGetHolidaysController)

router.post('/api/v1/get-user', isAuthenticated, postGetUserController)

router.post('/api/v1/edit-profile', isAuthenticated, postEditProfileController)

router.post('/api/v1/create-settings', postCreateSettingsController)

router.post('/api/v1/edit-settings', isAuthenticated, postEditSettingsController)


export default router