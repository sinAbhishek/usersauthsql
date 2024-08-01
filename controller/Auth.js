import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db-config.js";

export const register = async (req, res) => {
  const { phone, password } = req.body;
  console.log(req.body);
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = "INSERT INTO users (phone, password) VALUES (?, ?)";
  const values = [phone, hashedPassword];

  db.query(query, values, (err, data) => {
    if (err) throw err;
    console.log(data);
    res.json({ message: "User registered successfully" });
  });
};

export const login = (req, res) => {
  const { phone, password } = req.body;
  db.query("SELECT * FROM users WHERE phone = ?", [phone], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (rows.length === 0) {
      return res.status(401).json({ message: "No user found" });
    }
    const user = rows[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid phone number or password" });
      }
      const token = jwt.sign({ id: user.id }, "secret", { expiresIn: 30 });

      res.json({ token });
    });
  });
};

export const resetPassword = (req, res) => {
  const { phone, newPassword } = req.body;
  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
    db.query(
      "UPDATE users SET password = ? WHERE phone = ?",
      [hashedPassword, phone],
      (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Internal server error" });
        }
        console.log(data);
        res.json({ message: "Password updated successfully" });
      }
    );
  });
};
