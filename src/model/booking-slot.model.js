import mongoose from "mongoose";
import mongoosePaginateV2 from "mongoose-paginate-v2";

const { Schema } = mongoose;

const bookingSlotSchema = new Schema(
  {
    start_datetime: {
      type: Date,
      required: true
    },
    end_datetime: {
      type: Date,
      required: true
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
    },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom"
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

bookingSlotSchema.plugin(mongoosePaginateV2);

const BookingSlot = mongoose.model("BookingSlot", bookingSlotSchema);

export default BookingSlot;
