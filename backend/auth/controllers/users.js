import 'dotenv/config'
import User from '../models/user.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendPasswordChangedEmail,
} from "../services/emailService.js";
import { validateEmail, validatePassword } from "../utils/validators.js";

const register = async (req, res) => {
  const { email, username, password, adminCode } = req.body;

  // Required fields check
  if (!email || !username || !password) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Email format validation
 if (!validateEmail(email))
    return res.status(400).json({ message: "Invalid email format." });

  // Password rules
const passwordError = validatePassword(password);
  if (passwordError) return res.status(400).json({ message: passwordError });


  try {
    // Check for existing username or email
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      const usernameTaken = existingUser.username === username;
      const emailTaken = existingUser.email === email;

      let message = "";
      if (usernameTaken && emailTaken) {
        message = "Username and email are already taken.";
      } else if (usernameTaken) {
        message = "Username is already taken.";
      } else if (emailTaken) {
        message = "Email is already registered.";
      }


      return res.status(400).json({ message });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      emailToken: crypto.randomBytes(64).toString("hex"),
      isAdmin: adminCode === "secretcode123",
    });

    const user = await User.register(newUser, password);

    // Send verification email
    const link = `http://${req.headers.host}/verify-email/${user.emailToken}`;
    await sendVerificationEmail(user, req.headers.host);

    return res.status(201).json({ message: "User registered successfully. Please check your email." });
  } catch (err) {
    console.error(err);

    // Catch any unexpected errors
    return res.status(500).json({ message: "Internal server error." });
  }
};







// VERIFY EMAIL
const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ emailToken: req.params.token });

    if (!user) {
      res.redirect("http://localhost:5173/login");
      return res.status(400).send('Invalid or expired email verification token.');
    }

    user.emailToken = null;
    user.isVerified = true;
    await user.save();

    req.login(user, err => {
      if (err) return next(err);
      console.log('Email verified!');
      console.log(req.user)
      res.redirect("http://localhost:5173/welcome");
    });

  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error.');
  }
};
//resendVerification


export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Generate new token if expired/empty
    if (!user.emailToken) {
      user.emailToken = crypto.randomBytes(64).toString("hex");
      await user.save();
    }

    const link = `http://${req.headers.host}/verify-email/${user.emailToken}`;

    await sendVerificationEmail(user, req.headers.host);

    res.json({ message: "Verification email resent. Please check your inbox." });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGIN
const login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Username or password is wrong'
      });
    }

    if (user.isVerified === false) {
      return res.status(400).json({
        message: 'You have to verify your email',
        user
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) return res.send(err);

      const token = jwt.sign(user.toJSON(), 'secret code');
      return res.json({ user, token });
    });
  })(req, res);
  console.log("logged in")
};

// LOGOUT
const logout = (req, res) => {
  req.logout(function (err) {
    res.status(200).json({ message: 'Logged out successfully' });
    if (err) { return next(err); }

  });
};

// FORGOT PASSWORD
export const forgot = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Avoid leaking info about existing emails
      return res.status(200).json({ message: "If the email exists, a reset link has been sent." });
    }

    // Generate token and hash it
    const token = crypto.randomBytes(20).toString("hex");
    const hashedToken = await bcrypt.hash(token, 10);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset/${token}`;

    // Send reset email
    try {
      await sendResetPasswordEmail(user, resetLink);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // Don't fail the request if email fails
    }

    res.status(200).json({ message: "If the email exists, a reset link has been sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
};

// ==========================
// VERIFY RESET TOKEN
// ==========================
export const GetResetToken = async (req, res) => {
  try {
    const token = req.params.token;
    const users = await User.find({
      resetPasswordExpires: { $gt: Date.now() },
    });

    // Find user with matching token
    const user = users.find(u => bcrypt.compareSync(token, u.resetPasswordToken));
    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    res.status(200).json({ message: "Token is valid.", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ==========================
// POST NEW PASSWORD
// ==========================
export const PostResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirm } = req.body;

    if (!password || !confirm) {
      return res.status(400).json({ message: "Password and confirmation are required." });
    }

    if (password.trim() !== confirm.trim()) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const users = await User.find({
      resetPasswordExpires: { $gt: Date.now() },
    });

    const user = users.find(u => bcrypt.compareSync(token, u.resetPasswordToken));
    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    await new Promise((resolve, reject) => {
      user.setPassword(password.trim(), (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await new Promise((resolve, reject) => {
      req.logIn(user, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(user, process.env.FRONTEND_URL);
    } catch (emailErr) {
      console.error("Confirmation email failed:", emailErr);
    }
    console.log("password changed")
    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred during password reset." });
  }
};


// EDIT USER
const editUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { username, email } = req.body;

    if (!username || username.trim() === '')
      return res.status(400).json({ message: 'Username is empty' });

    if (!email || email.trim() === '')
      return res.status(400).json({ message: 'Email is empty' });

    user.username = username.trim();
    user.email = email.trim();

    await user.save();

    res.json({ user });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Server error' });
  }

};


// GET PROFILE
const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log(user)
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// DELETE USER
const DeleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found or already deleted" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const checkAuth = async (req, res) => {

  if (req.isAuthenticated()) {
    return res.json({ loggedIn: true, user: req.user });
  } else {
    return res.json({ loggedIn: false });
  }

}




// EXPORT ALL
export default {
  register,
  verifyEmail,
  login,
  logout,
  forgot,
  GetResetToken,
  PostResetToken,
  editUser,
  profile,
  DeleteUser,
  checkAuth,
  resendVerification
};
