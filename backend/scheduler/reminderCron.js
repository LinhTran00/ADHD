const cron = require("node-cron");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const Task = require("../models/task.model");
const User = require("../models/user.model");

// Time zone used when writing the due time into reminder emails
const TIMEZONE = process.env.TIMEZONE || "America/Chicago";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendDueReminders = async () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Reminders skipped: EMAIL_USER / EMAIL_PASS not set.");
    return;
  }

  try {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    // Tasks due within the next hour that haven't had a reminder yet
    const tasks = await Task.find({
      dueDate: { $gte: now, $lte: oneHourLater },
      isCompleted: false,
      reminderSent: { $ne: true },
    });

    for (const task of tasks) {
      // task.userId is stored as a string, so look the user up directly
      const user = await User.findById(task.userId).select("email");
      if (!user || !user.email) continue;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `Task Reminder: ${task.title}`,
          text: `Reminder: Your task "${task.title}" is due at ${moment(task.dueDate)
            .tz(TIMEZONE)
            .format("LLLL")}.`,
        });
        task.reminderSent = true;
        await task.save();
        console.log(`Reminder sent for task ${task._id}`);
      } catch (err) {
        console.error(`Error sending reminder for task ${task._id}:`, err);
      }
    }
  } catch (error) {
    console.error("Error checking for due tasks:", error);
  }
};

// Run at the top of every hour
cron.schedule("0 * * * *", sendDueReminders);

module.exports = { sendDueReminders };
