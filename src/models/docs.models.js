import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { User } from "./user.models.js";

const docSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Untitled",
    },
    archived: {
      type: Boolean,
      required: false,
      default: false,
    },
    private: {
      type: Boolean,
      required: false,
      default: false,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    content: {
      type: Object,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    contributor: [
      {
        type: Schema.Types.ObjectId,
        ref: User,
      },
    ],
  },
  { timestamps: true }
);

docSchema.plugin(mongooseAggregatePaginate);
const Doc = mongoose.model("Doc", docSchema);
export { Doc };
