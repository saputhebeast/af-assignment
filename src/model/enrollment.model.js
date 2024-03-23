import mongoose from "mongoose";
import mongoosePaginateV2 from "mongoose-paginate-v2";

const { Schema } = mongoose;

const enrollmentSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course"
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

enrollmentSchema.plugin(mongoosePaginateV2);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
