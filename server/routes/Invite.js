import express from "express";

import { postGetInvitationIdController, postGetInvitationDataController, postRespondToInviteController, postCommentOnInviteController } from "../controllers/Invite.js";

import isAuthenticated from "../middlewares/auth.js";

const router = express.Router();

router.post('/api/v1/get-invitation-id', isAuthenticated, postGetInvitationIdController)

// No authentication required to view Invitation
router.post('/api/v1/get-invitation-data', postGetInvitationDataController)

router.post('/api/v1/respond-to-invite', isAuthenticated, postRespondToInviteController)

router.post('/api/v1/comment-on-invite', isAuthenticated, postCommentOnInviteController)

export default router