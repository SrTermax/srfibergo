#!/usr/bin/env node

const { program } = require("commander");
const { createProject } = require("./commands/create");

program
  .name("srfibergo")
  .description("CLI para gerar projetos Go com Fiber, Tailwind CSS e GSAP")
  .version("1.0.3");

program
  .command("create <project-name>")
  .description("Cria um novo projeto Go com Fiber")
  .option("-p, --port <port>", "Porta do servidor (padrão: 3000)", "3000")
  .option("-v, --version <version>", "Versão do projeto", "1.0.3")
  .action(createProject);

program.parse();
