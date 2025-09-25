import 'dotenv/config' 
import express from "express";
import mongoose from 'mongoose'; 
import passport from 'passport';
const { session: _session, } = passport;
import MongoStore from 'connect-mongo';
import userRoutes from './routes/user.js';
import cors from 'cors'
import pkg from 'passport-local';
const local_auth = pkg.Strategy;
import session from 'express-session';
import User from './models/user.js';

const { connect, connection } = mongoose;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/auth';

connect(dbUrl);

const db = connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

const secret = process.env.SECRET ;



const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600 // lazy update
    }),
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));





app.use(passport.initialize());
app.use(passport.session());
passport.use(new local_auth(User.authenticate()));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',  // MUST match frontend URL
  credentials: true                // Allow cookies / sessions
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', userRoutes);

app.listen(process.env.PORT, () => console.log(`Connected on port: ${process.env.PORT}`));