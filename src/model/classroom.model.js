import mongoose from "mongoose";
import mongoosePaginateV2 from "mongoose-paginate-v2";

const { Schema } = mongoose;

const classroomSchema = new Schema(
  {
    building: {
      type: String,
      required: true
    },
    floor: {
      type: Number,
      required: true
    },
    room_number: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    resources: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resource",
        default: null
      }
    ],
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

classroomSchema.plugin(mongoosePaginateV2);

const Classroom = mongoose.model("Classroom", classroomSchema);

export default Classroom;
