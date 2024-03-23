import mongoose from "mongoose";
import mongoosePaginateV2 from "mongoose-paginate-v2";

const { Schema } = mongoose;

const facultySchema = new Schema(
  {
    name: {
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

facultySchema.plugin(mongoosePaginateV2);

const Faculty = mongoose.model("Faculty", facultySchema);

export default Faculty;
