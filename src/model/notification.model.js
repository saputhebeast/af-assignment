import mongoose from "mongoose";
import mongoosePaginateV2 from "mongoose-paginate-v2";

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    receipt: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
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

notificationSchema.plugin(mongoosePaginateV2);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
