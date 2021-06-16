# node-mongoose-auth

Small package for handling user authentication in node + express + mongoose applications using **TOKEN AUTHENTICATION**

## Installation

```bash
npm install --save node-mongoose-auth
```

### Configuration
The package expects the developer to set the:
1. SECRET_KEY environment variable. You can do this in your .env file and use *dotenv* package to load it with 

    ```js
    require("dotenv").config();
    ```
    Or you can add it your bash profile, load it from a config file, whichever method you use should work just fine.


2. TOKEN_EXPIRES_AFTER: Number of days for token validity. By default this is set to 1 ( 24 hours ). 
`NB: If in prodution and SECRET_KEY is missing, the node process will be terminated!`

## Usage

```js
const express = require("express");
const { authRouter } = require("node-mongoose-auth");

const app = express();

app.use(express.json())
app.use("/api/auth", authRouter);

```

## Endpoints

1. POST /api/auth/register
2. POST /api/auth/login
3. GET /api/auth/getuser

## Schema
*node-mongoose-auth* creates a user model with the following schema.

```js
const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 25,
    },
    lastName: {
      type: String,
      required: true,
      max: 25,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      validate: [validateEmail, "Please provide a valid email address"],
    },
    mobile: {
      type: String,
      required: false,
      min: 10,
      max: 15,
    },
    address: {
      type: String,
      required: false,
      max: 100,
    },
    birthDate: {
      type: Date,
      required: false,
    },
    sex: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    about: {
      type: String,
      required: false,
    },
    hash: {
      type: String,
      required: false,
    },
    salt: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

```

## Protected Routes
You can protect your other express API endpoints using **authMiddleware**.
If the token sent in the request header is invalid or missing, a 403 Forbidden response is sent with a message of `Invalid or expired token` or `No authorization credentials sent` or `Invalid token!` or `User not found` if token is valid but no matching user.

```js
const { authMiddleware } = require("node-mongoose-auth");

app.get("/powers", authMiddleware, (req, res)=>{
  // auth middleware attaches the current user to the request or returns a 403 Forbidden response
  const loggedInUser = req.user
  if(user.isAdmin){
    res.json("You are a superuser")
  }else{
    res.json("You are a regular user")
  }
});

```

### Working with the User model

```js
const { User } = require("node-mongoose-auth");
const users = await User.find();
```

## Code Examples
   
Login example using axios package.
```js
const axios = require("axios");

const handleLogin = async() => {
  const endpoint = "/api/auth/login";

  const payload = {
    email: "randomuser@example.com",
    password:"somestrongpassword"
  }

  const axiosConfig = {
    headers:{
        "Content-Type": "application/json",
    }
  }

  const res = await axios.post(endpoint, JSON.stringify(payload), axiosConfig);
  const {token, user} = res.data;

  localStorage.setItem("token", token);
}


const handleRegister = async() => {
  const endpoint = "/api/auth/register";

  const payload = {
    firstName: "John",
    lastName: "Doe",
    sex: "Male",
    email: "randomuser@example.com",
    password: "somestrongpassword",
    address: "Kampala, Uganda", // Optional
    mobile: "256782000000", // Optional
    birthDate: "1987-03-12", // Optional
    about: "" // Optional
  }

  const axiosConfig = {
    headers:{
        "Content-Type": "application/json",
    }
  }

  const res = await axios.post(endpoint, JSON.stringify(payload), axiosConfig);
  const { token, user } = res.data;

  localStorage.setItem("token", token);
}


const getUser = async (token)=> {
  const endpoint = "/api/auth/getuser"
  const res = await axios.get(endpoint, {
    headers:{
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });

  return res.data
}

```

Good Luck! Constructive criticism and ideas are welcome.