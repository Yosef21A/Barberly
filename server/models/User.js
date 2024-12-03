const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      minlength: [2, "First name must be at least 2 characters long"],
    },
    last_name: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [2, "Last name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone_number: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{8}$/, "Phone number must be 8 digits"],
    },
    role: {
      type: String,
      enum: ["Client", "Barber"],
      default: "Client",
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    console.log("Comparing passwords...");
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log("Password comparison result:", result); // Log the result of the comparison
    return result;
  } catch (err) {
    console.error("Error comparing passwords:", err);
    throw err;
  }
};

module.exports = mongoose.model("User", UserSchema);