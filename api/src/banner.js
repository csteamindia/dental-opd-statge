import chalk from "chalk"

export function showBanner() {
  console.clear()

  console.log(
    chalk.black.bold(`
 ██████╗ ██████╗  █████╗ ██╗     ███████╗████████╗ ██████╗ ██████╗ 
██╔═══██╗██╔══██╗██╔══██╗██║     ██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗
██║   ██║██████╔╝███████║██║     ███████╗   ██║   ██║   ██║██████╔╝
██║   ██║██╔══██╗██╔══██║██║     ╚════██║   ██║   ██║   ██║██╔═══╝ 
╚██████╔╝██║  ██║██║  ██║███████╗███████║   ██║   ╚██████╔╝██║     
 ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     
`)
  )

  console.log(
    chalk.yellow.bold(
      "                ●  THE CHOICE OF DENTAL PROFESSIONALS  ●\n"
    )
  )

  console.log(chalk.cyan.bold("🚀 PG-Sequelize Server Initializing...\n"))
}
