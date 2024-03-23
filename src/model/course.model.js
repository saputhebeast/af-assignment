import mongoose from "mongoose";
import mongoosePaginateV2 from "mongoose-paginate-v2";

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    credits: {
      type: Number,
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

courseSchema.plugin(mongoosePaginateV2);

const Course = mongoose.model("Course", courseSchema);

export default Course;
