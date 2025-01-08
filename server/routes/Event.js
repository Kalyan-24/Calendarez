import express from "express";

import { postAddEventController, postGetEventsController, postEditEventController, postDeleteEventController, postTaskCompleteController, postSearchController } from "../controllers/Event.js";

import isAuthenticated from "../middlewares/Auth.js";

const router = express.Router()

router.post('/api/v1/add-event', isAuthenticated, postAddEventController)

router.post('/api/v1/get-events', isAuthenticated, postGetEventsController)

router.post('/api/v1/edit-event', isAuthenticated, postEditEventController)

router.post('/api/v1/delete-event', isAuthenticated, postDeleteEventController)

router.post('/api/v1/task-complete', isAuthenticated, postTaskCompleteController)

router.post('/api/v1/search', isAuthenticated, postSearchController)

export default router