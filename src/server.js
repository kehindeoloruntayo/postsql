import express from "express";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

// import routes
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";

config(); // Load environment variables from .env file
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    const shutdown = async (label, err, exitCode) => {
      if (err) {
        console.error(`${label}:`, err);
      } else {
        console.log(`${label}. Shutting down gracefully...`);
      }

      server.close(async () => {
        await disconnectDB();
        process.exit(exitCode);
      });
    };

    process.on("unhandledRejection", (err) => {
      shutdown("Unhandled Rejection", err, 1);
    });

    process.on("uncaughtException", (err) => {
      shutdown("Uncaught Exception", err, 1);
    });

    process.on("SIGTERM", async () => {
      shutdown("SIGTERM received", null, 0);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// API routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);

app.get("/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});


// GET, POST, PUT, DELETE
// http://localhost:5001/hello

// AUTH - Signup, Login, Logout
// MOVIE - GETTING ALL MOVIES
// USER - Profiles
// Watchlist - Add to watchlist, update watchlist item, remove from watchlist, get watchlist items