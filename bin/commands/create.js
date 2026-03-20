const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");
const {
  validatePort,
  logError,
  logSuccess,
  logInfo,
  logWarning,
  printNextSteps,
} = require("../utils");
const templates = require("../templates");

const DEFAULT_VERSION = "1.0.0";

async function getProjectVersion() {
  try {
    const packageJson = await fs.readJson(
      path.join(__dirname, "..", "..", "package.json")
    );
    return packageJson.version || DEFAULT_VERSION;
  } catch {
    return DEFAULT_VERSION;
  }
}

async function createProject(projectName, options) {
  const targetDir = path.resolve(process.cwd(), projectName);

  if (await fs.pathExists(targetDir)) {
    logError(`O diretório "${projectName}" já existe!`);
    process.exit(1);
  }

  try {
    logInfo(`Criando projeto "${projectName}"...`);

    let port = options.port || "3000";
    let withAir = options.withAir || false;
    let withEnv = options.withEnv || false;
    const version = await getProjectVersion();

    const portValidation = validatePort(port);
    if (!portValidation.valid) {
      logWarning(`Porta inválida "${port}", usando padrão 3000`);
      port = "3000";
    } else {
      port = portValidation.port;
    }

    if (process.stdin.isTTY) {
      const questions = [];

      if (!options.port) {
        questions.push({
          type: "input",
          name: "port",
          message: "Qual porta deseja usar?",
          default: port,
          validate: (input) => {
            const p = parseInt(input);
            if (isNaN(p) || p < 1 || p > 65535) {
              return "Por favor, insira uma porta válida (1-65535)";
            }
            return true;
          },
        });
      }

      if (!options.withAir) {
        questions.push({
          type: "confirm",
          name: "withAir",
          message: "Adicionar hot reload com Air? (.air.toml)",
          default: false,
        });
      }

      if (!options.withEnv) {
        questions.push({
          type: "confirm",
          name: "withEnv",
          message: "Adicionar variáveis de ambiente? (.env + godotenv)",
          default: false,
        });
      }

      if (questions.length > 0) {
        try {
          const answers = await inquirer.prompt(questions);
          if (answers.port) port = answers.port;
          if (answers.withAir !== undefined) withAir = answers.withAir;
          if (answers.withEnv !== undefined) withEnv = answers.withEnv;
        } catch (err) {
          logWarning("Usando configurações padrão");
        }
      }
    }

    await createProjectStructure(targetDir, projectName, port, version, { withAir, withEnv });

    logSuccess(`Projeto "${projectName}" criado com sucesso!`);
    printNextSteps(projectName, port, { withAir, withEnv });
  } catch (error) {
    logError(`Erro ao criar projeto: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function createProjectStructure(targetDir, projectName, port, version, opts = {}) {
  const { withAir, withEnv } = opts;

  await fs.ensureDir(path.join(targetDir, "views"));
  await fs.ensureDir(path.join(targetDir, "static", "css"));
  await fs.ensureDir(path.join(targetDir, "static", "js"));
  await fs.ensureDir(path.join(targetDir, "handlers"));
  await fs.ensureDir(path.join(targetDir, "config"));

  await fs.writeFile(
    path.join(targetDir, "main.go"),
    templates.getMainGoContent(port, projectName, withEnv)
  );

  await fs.writeFile(
    path.join(targetDir, "go.mod"),
    templates.getGoModContent(projectName, withEnv)
  );

  await fs.writeFile(
    path.join(targetDir, ".gitignore"),
    templates.getGitignoreContent(withAir)
  );

  await fs.writeFile(
    path.join(targetDir, "handlers", "home.go"),
    templates.getHomeHandlerContent(version)
  );

  await fs.writeFile(
    path.join(targetDir, "handlers", "ping.go"),
    templates.getPingHandlerContent()
  );

  await fs.writeFile(
    path.join(targetDir, "config", "config.go"),
    templates.getConfigContent(port, withEnv)
  );

  await fs.writeFile(
    path.join(targetDir, "views", "index.html"),
    templates.getIndexHtmlContent()
  );

  await fs.writeFile(
    path.join(targetDir, "views", "layout.html"),
    templates.getLayoutHtmlContent()
  );

  await fs.writeFile(
    path.join(targetDir, "static", "css", "style.css"),
    templates.getStyleCssContent()
  );

  await fs.writeFile(
    path.join(targetDir, "static", "js", "main.js"),
    templates.getMainJsContent()
  );

  await fs.writeFile(
    path.join(targetDir, "README.md"),
    templates.getReadmeContent(projectName, port, version, opts)
  );

  if (withAir) {
    await fs.ensureDir(path.join(targetDir, "tmp"));
    await fs.writeFile(
      path.join(targetDir, ".air.toml"),
      templates.getAirTomlContent()
    );
  }

  if (withEnv) {
    await fs.writeFile(
      path.join(targetDir, ".env"),
      templates.getEnvContent(port)
    );
  }
}

module.exports = { createProject };
