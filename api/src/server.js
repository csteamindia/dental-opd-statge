// eslint-disable-next-line import/no-unresolved
import chalk from "chalk"
import "dotenv/config"
import stoppable from "stoppable"
import { fileURLToPath } from "url"
import app from "./app.js"
import { Logger } from "./config/logger.js"
import { gracefulShutdown } from "./utils/graceful-shutdown.js"
import { showBanner } from "./banner.js"

const logger = Logger(fileURLToPath(import.meta.url))
const port = process.env.APP_PORT || 4000

showBanner()

import sequelize from "./config/sequelize.js"

const server = app.listen(port, async () => {
  try {
    if (process.env.DATABASE_DIALECT === "sqlite") {
      await sequelize.sync()
      logger.info("Database synced successfully (SQLite).")

      // Seeder Logic
      try {
        const db = (await import("./models/index.js")).default
        const userCount = await db.User.count()
        if (userCount === 0) {
          logger.info("Seeding default data...")

          // Create Role 'Admin'
          await db.Role.create({
            role_id: 1,
            clinic_id: 1,
            client_id: 1,
            name: "Admin",
            status: 1,
          })

          // Create Admin User
          await db.User.create({
            user_id: 1,
            name: "Admin",
            email: "admin@dental.com",
            password: "admin",
            role: 1,
            clinic_id: 1,
            client_id: 1,
            is_verified: 1,
          })

          // Create Clinic
          await db.Clinics.create({
            id: 1,
            clinic_name: "My Dental Clinic",
            client_id: 1,
            status: 1,
          })

          logger.info("Default data seeded. Login: admin@dental.com / admin")
        }
      } catch (seedErr) {
        logger.error("Seeding error:", seedErr)
      }
    }
  } catch (err) {
    logger.error("Unable to sync database:", err)
  }

  logger.info(`App running on port ${chalk.greenBright(port)}...`)
  console.log(`Server is running on port ${port}`)
})

// In case of an error
app.on("error", (appErr, appCtx) => {
  logger.error(
    `App Error: '${appErr.stack}' on url: '${appCtx.req.url}' with headers: '${appCtx.req.headers}'`
  )
})

// Handle unhandled promise rejections
process.on("unhandledRejection", async err => {
  logger.error(chalk.bgRed("UNHANDLED REJECTION! 💥 Shutting down..."))
  logger.error(err.name, err.message)

  await gracefulShutdown(stoppable(server))
})

// Handle uncaught exceptions
process.on("uncaughtException", async uncaughtExc => {
  // Won't execute
  logger.error(chalk.bgRed("UNCAUGHT EXCEPTION! 💥 Shutting down..."))
  logger.error(`UncaughtException Error: ${uncaughtExc}`)
  logger.error(`UncaughtException Stack: ${JSON.stringify(uncaughtExc.stack)}`)

  await gracefulShutdown(stoppable(server))
})

// Graceful shutdown on SIGINT and SIGTERM signals
;["SIGINT", "SIGTERM"].forEach(signal => {
  process.on(signal, async () => {
    logger.warn(`Received ${signal} signal. Shutting down...`)
    await gracefulShutdown(server)
  })
})

export default server
