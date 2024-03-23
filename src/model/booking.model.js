import mongoose from "mongoose";
import mongoosePaginateV2 from "mongoose-paginate-v2";

const { Schema } = mongoose;

const bookingSchema = new Schema(
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
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom"
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course"
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: "Faculty"
    },
    booking_type: {
      type: String,
      required: true
    },
    start_datetime: {
      type: Date,
      required: true
    },
    end_datetime: {
      type: Date,
      required: true
    },
    recurring: {
      type: Boolean,
      required: true
    },
    recurring_type: {
      type: String,
      default: null
    },
    recurring_from: {
      type: Date,
      default: null
    },
    recurring_to: {
      type: Date,
      default: null
    },
    booking_status: {
      type: String,
      default: "PENDING"
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

bookingSchema.plugin(mongoosePaginateV2);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
