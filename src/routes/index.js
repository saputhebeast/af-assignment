import express from "express";
import auth from "../controller/v1/auth.controller";
import user from "../controller/v1/user.controller";
import course from "../controller/v1/cource.controller";
import notification from "../controller/v1/notification.controller";
import faculty from "../controller/v1/faculty.controller";
import enrollment from "../controller/v1/enrollment.controller";
import resource from "../controller/v1/resource.controller";
import classroom from "../controller/v1/classroom.controller";
import timetable from "../controller/v1/timetable.controller";
import booking from "../controller/v1/booking.controller";

const router = express.Router();

router.use(`/v1/auth`, auth);
router.use(`/v1/user`, user);
router.use(`/v1/course`, course);
router.use(`/v1/notification`, notification);
router.use(`/v1/faculty`, faculty);
router.use(`/v1/enrollment`, enrollment);
router.use(`/v1/resource`, resource);
router.use(`/v1/classroom`, classroom);
router.use(`/v1/timetable`, timetable);
router.use(`/v1/booking`, booking);

export default router;
