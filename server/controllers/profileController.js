const User = require("../models/User");
const BarberProfile = require("../models/BarberProfile");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = { user };

    if (user.role === 'Barber') {
      const barberProfile = await BarberProfile.findOne({ user_id: req.user.id });
      profile.barberProfile = barberProfile;
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profile = { user };

    if (user.role === 'Barber') {
      const barberProfile = await BarberProfile.findOne({ user_id: req.params.id });
      profile.barberProfile = barberProfile;
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true });

    if (user.role === 'Barber') {
      const barberProfile = await BarberProfile.findOneAndUpdate(
        { user_id: req.user.id },
        req.body.barberProfile,
        { new: true }
      );
      return res.status(200).json({ message: "Profile updated successfully", user, barberProfile });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

exports.getAllProfiles = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profiles", error });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.profile_picture = `/uploads/${req.file.filename}`;
    await user.save();
    res.status(200).json({ message: "Profile picture uploaded successfully", profile_picture: user.profile_picture });
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile picture", error });
  }
};