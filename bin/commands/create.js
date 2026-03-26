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
    let withMongo = options.withMongo || false;
    let withDocker = options.withDocker || false;
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

      if (!options.withMongo) {
        questions.push({
          type: "confirm",
          name: "withMongo",
          message: "Adicionar integração com MongoDB? (driver oficial + config/db.go)",
          default: false,
        });
      }

      if (!options.withDocker) {
        questions.push({
          type: "confirm",
          name: "withDocker",
          message: "Adicionar Dockerfiles para deploy em VPS? (Dockerfile + docker-compose.yml)",
          default: false,
        });
      }

      if (questions.length > 0) {
        try {
          const answers = await inquirer.prompt(questions);
          if (answers.port) port = answers.port;
          if (answers.withAir !== undefined) withAir = answers.withAir;
          if (answers.withEnv !== undefined) withEnv = answers.withEnv;
          if (answers.withMongo !== undefined) withMongo = answers.withMongo;
          if (answers.withDocker !== undefined) withDocker = answers.withDocker;
        } catch (err) {
          logWarning("Usando configurações padrão");
        }
      }
    }

    // MongoDB requer variáveis de ambiente
    if (withMongo) withEnv = true;

    await createProjectStructure(targetDir, projectName, port, version, { withAir, withEnv, withMongo, withDocker });

    logSuccess(`Projeto "${projectName}" criado com sucesso!`);
    printNextSteps(projectName, port, { withAir, withEnv, withMongo, withDocker });
  } catch (error) {
    logError(`Erro ao criar projeto: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function createProjectStructure(targetDir, projectName, port, version, opts = {}) {
  const { withAir, withEnv, withMongo, withDocker } = opts;

  await fs.ensureDir(path.join(targetDir, "views"));
  await fs.ensureDir(path.join(targetDir, "static", "css"));
  await fs.ensureDir(path.join(targetDir, "static", "js"));
  await fs.ensureDir(path.join(targetDir, "handlers"));
  await fs.ensureDir(path.join(targetDir, "config"));

  await fs.writeFile(
    path.join(targetDir, "main.go"),
    templates.getMainGoContent(port, projectName, withEnv, withMongo)
  );

  await fs.writeFile(
    path.join(targetDir, "go.mod"),
    templates.getGoModContent(projectName, withEnv, withMongo)
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
    templates.getConfigContent(port, withEnv || withMongo)
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

  if (withEnv || withMongo) {
    await fs.writeFile(
      path.join(targetDir, ".env"),
      templates.getEnvContent(port, withMongo)
    );
  }

  if (withMongo) {
    await fs.writeFile(
      path.join(targetDir, "config", "db.go"),
      templates.getMongoConfigContent()
    );
  }

  if (withDocker) {
    await fs.writeFile(
      path.join(targetDir, "Dockerfile"),
      templates.getDockerfileContent()
    );
    await fs.writeFile(
      path.join(targetDir, "docker-compose.yml"),
      templates.getDockerComposeContent(port, withMongo)
    );
    await fs.writeFile(
      path.join(targetDir, ".dockerignore"),
      templates.getDockerignoreContent()
    );
  }
}

module.exports = { createProject };
