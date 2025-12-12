// models/Record.js
import mongoose from 'mongoose';

const RecordSchema = new mongoose.Schema({
  // Metadata fields (from app/page.js)
  teacher_name: { type: String, required: true },
  standard: { type: String, required: true },
  section: { type: String, required: true },
  title: { type: String, required: true },
  max_marks: { type: String, required: true },
  
  // Student data fields (from app/dashboard/page.js)
  student_name: { type: String, required: true },
  roll_number: { type: String, required: true },
  admin_number: { type: String }, // Optional
  english: { type: Number, required: true },
  hindi: { type: Number, required: true },
  odia: { type: Number, required: true },
  mathematics: { type: Number, required: true },
  science: { type: Number, required: true },
  social_science: { type: Number, required: true },
  
  // Timestamps for tracking
  createdAt: { type: Date, default: Date.now }
});

// Avoid redefining the model if it already exists
const Record = mongoose.models.Record || mongoose.model('Record', RecordSchema);

export default Record;