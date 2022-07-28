const http = require("http")
const chalk = require("chalk")
const app = require("./app")
const client = (process.env.DATABASE_URL || 'postgres://localhost:5432/fitness-dev');

const PORT = process.env["PORT"] ?? 3000
const server = http.createServer(app)

client.connect()

server.listen(PORT, () => {
  console.log(
    chalk.blueBright("Server is listening on PORT:"),
    chalk.yellow(PORT),
    chalk.blueBright("Get your routine on!")
  )
})
