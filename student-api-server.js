const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/studentDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  course: { type: String, required: true }
});

const Student = mongoose.model("Student", studentSchema);

app.post("/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    const result = await student.save();
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));