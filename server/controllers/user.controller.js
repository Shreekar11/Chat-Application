require("dotenv").config();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");


const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).send("All fields required");
    } else {
      const isAlreadyExists = await Users.findOne({ email });
      if (isAlreadyExists) {
        res.status(400).send("User already exists");
      } else {
        const newUser = new Users({ fullName, email });
        bcryptjs.hash(password, 10, (err, hashedPassword) => {
          newUser.set("password", hashedPassword);
          newUser.save();
          next();
        });
        return res.status(200).send("User registered successfully");
      }
    }
  } catch (err) {
    console.log(err, "Error");
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send("All fields required");
    } else {
      const user = await Users.findOne({ email });
      if (!user) {
        res.status(400).send("User email incorrect");
      } else {
        const validateUser = await bcryptjs.compare(password, user.password);
        if (!validateUser) {
          res.status(400).send("User password incorrect");
        } else {
          const payload = {
            userId: user._id,
            email: user.email,
          };
          const JWT_SECRET_KEY =
            process.env.JWT_SECRET_KEY || "THIS_IS_A_JWT_SECRET_KEY";
          const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 });
          async () => {
            await Users.updateOne(
              { _id: user._id },
              {
                $set: { token },
              }
            );
            user.save();
            res.status(200).json({
              user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
              },
              token: token,
            });
          };
        }
      }
    }
  } catch (err) {
    console.log(err, "Error");
  }
};

const getUsers = async (req, res) => {
    try {
      const users = await Users.find();
      const usersData = Promise.all(
        users.map((user) => {
          return {
            users: {
              email: user.email,
              fullName: user.fullName,
            },
            userId: user._id,
          };
        })
      );
      res.status(200).json(await usersData);
    } catch (err) {
      console.log(err, "Error");
    }
};


module.exports = { register, login, getUsers };


