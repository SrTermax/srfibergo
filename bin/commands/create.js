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
    let version = options.version || await getProjectVersion();

    const portValidation = validatePort(port);
    if (!portValidation.valid) {
      logWarning(`Porta inválida "${port}", usando padrão 3000`);
      port = "3000";
    } else {
      port = portValidation.port;
    }

    if (!options.port && process.stdin.isTTY) {
      try {
        const answers = await inquirer.prompt([
          {
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
          },
        ]);
        port = answers.port;
      } catch (err) {
        logWarning(`Usando porta padrão: ${port}`);
      }
    }

    await createProjectStructure(targetDir, projectName, port, version);

    logSuccess(`Projeto "${projectName}" criado com sucesso!`);
    printNextSteps(projectName, port);
  } catch (error) {
    logError(`Erro ao criar projeto: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function createProjectStructure(targetDir, projectName, port, version) {
  await fs.ensureDir(path.join(targetDir, "views"));
  await fs.ensureDir(path.join(targetDir, "static", "css"));
  await fs.ensureDir(path.join(targetDir, "static", "js"));
  await fs.ensureDir(path.join(targetDir, "handlers"));
  await fs.ensureDir(path.join(targetDir, "config"));

  await fs.writeFile(
    path.join(targetDir, "main.go"),
    templates.getMainGoContent(port, projectName)
  );

  await fs.writeFile(
    path.join(targetDir, "go.mod"),
    templates.getGoModContent(projectName)
  );

  await fs.writeFile(path.join(targetDir, ".gitignore"), templates.getGitignoreContent());

await fs.writeFile(
    path.join(targetDir, "handlers", "home.go"),
    templates.getHomeHandlerContent(version)
  );

  await fs.writeFile(
    path.join(targetDir, "config", "config.go"),
    templates.getConfigContent(port)
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
    templates.getReadmeContent(projectName, port, version)
  );
}

module.exports = { createProject };
