import mongoose from "mongoose";
import mongoosePaginateV2 from "mongoose-paginate-v2";

const { Schema } = mongoose;

const timetableSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    event_type: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: null
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course"
    },
    start_datetime: {
      type: Date,
      required: true
    },
    end_datetime: {
      type: Date,
      required: true
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: "Faculty"
    },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom"
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking"
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

timetableSchema.plugin(mongoosePaginateV2);

const Timetable = mongoose.model("Timetable", timetableSchema);

export default Timetable;
