#!/usr/bin/env node

const { program } = require("commander");
const chalk = require("chalk");
const { createProject } = require("./commands/create");

const VERSION = "1.0.4";

function showBanner() {
  console.log(
    chalk.blue.bold("\n  ⚡ srfibergo") +
    chalk.gray(` v${VERSION}`) +
    chalk.white(" — Go + Fiber + Tailwind + Font Awesome\n")
  );
}

function showInfo() {
  showBanner();
  console.log(chalk.cyan("  Funcionalidades:"));
  console.log(chalk.white("  • Estrutura completa de projeto Go + Fiber"));
  console.log(chalk.white("  • Templates HTML com Tailwind CSS via CDN"));
  console.log(chalk.white("  • Ícones com Font Awesome via CDN"));
  console.log(chalk.white("  • Hot reload com Air  (--with-air)"));
  console.log(chalk.white("  • Variáveis de ambiente com godotenv  (--with-env)\n"));

  console.log(chalk.cyan("  Uso:"));
  console.log(chalk.white("  • srfibergo create <nome>"));
  console.log(chalk.white("  • srfibergo create <nome> -p 8080 --with-air --with-env\n"));

  console.log(chalk.cyan("  Links:"));
  console.log(chalk.gray("  • GitHub : ") + chalk.blue("https://github.com/SrTermax/srfibergo"));
  console.log(chalk.gray("  • npm    : ") + chalk.blue("https://www.npmjs.com/package/srfibergo\n"));
}

showBanner();

program
  .name("srfibergo")
  .description("CLI para gerar projetos Go com Fiber, Tailwind CSS e Font Awesome")
  .version(VERSION);

program
  .command("create <project-name>")
  .description("Cria um novo projeto Go com Fiber")
  .option("-p, --port <port>", "Porta do servidor (padrão: 3000)", "3000")
  .option("--with-air", "Adiciona hot reload com Air (.air.toml)")
  .option("--with-env", "Adiciona suporte a variáveis de ambiente (.env + godotenv)")
  .action(createProject);

program
  .command("info")
  .description("Mostra informações e funcionalidades do srfibergo")
  .action(showInfo);

program.parse();
