import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    ownerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    testId:     { type: String, required: true },
    config:     { type: mongoose.Schema.Types.Mixed, default: {} },
    paper:      { type: mongoose.Schema.Types.Mixed, required: true },
    createdAt:  { type: Date, default: Date.now },
  },
  { bufferCommands: false }
);

schema.index({ ownerEmail: 1, testId: 1 }, { unique: true });

export const GeneratedTest =
  mongoose.models.GeneratedTest ||
  mongoose.model("GeneratedTest", schema);
