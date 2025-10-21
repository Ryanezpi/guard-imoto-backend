import { config } from "dotenv";
import express, { json } from "express";
import db from "./db.js";
import authRoutes from "./src/routes/auth.routes.js";
import deviceRoutes from "./src/routes/device.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import configRoutes from "./src/routes/config.routes.js";
import alertRoutes from "./src/routes/alert.routes.js";
import sensorRoutes from "./src/routes/sensor.routes.js";
import logEndpoints from "./src/utils/print-endpoints.js";
import isRunningLocally from "./src/utils/check-local-server.js";

config();
db; // Initialize DB

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/user", userRoutes);
app.use("/api", configRoutes);
app.use("/api", sensorRoutes);
app.use("/api", alertRoutes);

app.get("/", (req, res) => {
  res.send("Guardimoto API is running!");
});

logEndpoints(app);

async function isRunningAt() {
  await isRunningLocally();
  console.log(
    `[\x1b[35mSERVER\x1b[0m  ] ${
      global.isLocal
        ? `Server is running locally: \x1b[32m\x1b[4m${process.env.LOCAL_URL}\x1b[0m`
        : `Server is running at your cloud service: \x1b[32m\x1b[4m${process.env.CLOUD_URL}\x1b[0m`
    }`
  );
}

app.listen(PORT, async () => {
  console.log(
    `[\x1b[35mPORT\x1b[0m    ] Server is Listening to [ \x1b[33m${PORT}\x1b[0m ]`
  );
  isRunningAt();
});
