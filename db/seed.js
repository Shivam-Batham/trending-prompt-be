import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/User";
import Session from "../models/Session";
import Post from "../models/Post";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("MongoDB connected");

    // optional: clear old seed data
    await Promise.all([
      User.deleteMany({}),
      Session.deleteMany({}),
      Post.deleteMany({}),
    ]);

    console.log("Old seed data removed");

    // create users
    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
        isVerified: true,
        location: "Lucknow",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "user",
        isVerified: true,
        location: "Delhi",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        role: "user",
        isVerified: false,
        location: "Mumbai",
      },
    ]);

    console.log(`${users.length} users created`);

    // create sessions
    const sessions = await Session.create([
      {
        userId: users[0]._id,
        sessionId: "session-admin-001",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        userId: users[1]._id,
        sessionId: "session-user-001",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log(`${sessions.length} sessions created`);

    // create posts
    const posts = await Post.create([
      {
        title: "Cinematic Mountain Landscape",
        ai_model: "Midjourney",
        prompt_text:
          "A cinematic mountain landscape at sunrise with dramatic lighting",
        prompt_description: "Landscape prompt for realistic mountain scenes",
        tags: ["landscape", "cinematic", "mountains"],
        created_by: users[0]._id,
        author: users[0].name,
        is_featured: true,
        status: "active",
        is_verified: true,
      },
      {
        title: "Cyberpunk City",
        ai_model: "DALL·E",
        prompt_text:
          "A neon cyberpunk city street at night with rain reflections",
        prompt_description: "Cyberpunk futuristic city prompt",
        tags: ["cyberpunk", "city", "neon"],
        created_by: users[1]._id,
        author: users[1].name,
        is_featured: false,
        status: "active",
        is_verified: true,
      },
      {
        title: "Fantasy Castle",
        ai_model: "Stable Diffusion",
        prompt_text:
          "A majestic fantasy castle floating above the clouds",
        prompt_description: "Fantasy concept art prompt",
        tags: ["fantasy", "castle", "concept-art"],
        created_by: users[2]._id,
        author: users[2].name,
        is_featured: false,
        status: "draft",
        is_verified: false,
      },
    ]);

    console.log(`${posts.length} posts created`);

    console.log("Seed completed");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();