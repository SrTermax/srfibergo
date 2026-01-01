#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { program } = require('commander');

program
  .name('srfibergo')
  .description('CLI para gerar projetos Go com Fiber, Tailwind CSS e Font Awesome')
  .version('1.0.1');

program
  .command('create <project-name>')
  .description('Cria um novo projeto Go com Fiber')
  .option('-p, --port <port>', 'Porta do servidor (padrão: 3000)', '3000')
  .action(async (projectName, options) => {
    const targetDir = path.resolve(process.cwd(), projectName);
    
    // Verifica se o diretório já existe
    if (await fs.pathExists(targetDir)) {
      console.log(chalk.red(`❌ O diretório "${projectName}" já existe!`));
      process.exit(1);
    }

    try {
      console.log(chalk.blue(`🚀 Criando projeto "${projectName}"...`));
      
      let port = options.port || '3000';
      
      // Valida a porta fornecida
      const portNum = parseInt(port);
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        console.log(chalk.yellow(`⚠️  Porta inválida "${port}", usando padrão 3000`));
        port = '3000';
      } else {
        port = portNum.toString();
      }
      
      // Se não foi fornecida via opção, pergunta interativamente (se possível)
      if (!options.port && process.stdin.isTTY) {
        try {
          const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'port',
              message: 'Qual porta deseja usar?',
              default: port,
              validate: (input) => {
                const p = parseInt(input);
                if (isNaN(p) || p < 1 || p > 65535) {
                  return 'Por favor, insira uma porta válida (1-65535)';
                }
                return true;
              }
            }
          ]);
          port = answers.port;
        } catch (err) {
          // Se inquirer falhar, usa o padrão
          console.log(chalk.yellow(`⚠️  Usando porta padrão: ${port}`));
        }
      }

      // Cria estrutura de diretórios
      await createProjectStructure(targetDir, projectName, port);
      
      console.log(chalk.green(`✅ Projeto "${projectName}" criado com sucesso!`));
      console.log(chalk.yellow(`\n📝 Próximos passos:`));
      console.log(chalk.white(`   cd ${projectName}`));
      console.log(chalk.white(`   go mod tidy`));
      console.log(chalk.white(`   go run main.go`));
      console.log(chalk.white(`\n🌐 Acesse: http://localhost:${port}`));
      
    } catch (error) {
      console.error(chalk.red(`❌ Erro ao criar projeto: ${error.message}`));
      if (error.stack) {
        console.error(chalk.gray(error.stack));
      }
      process.exit(1);
    }
  });

program.parse();

async function createProjectStructure(targetDir, projectName, port) {
  const templatesDir = path.join(__dirname, '..', 'templates');
  
  // Cria diretórios
  await fs.ensureDir(path.join(targetDir, 'views'));
  await fs.ensureDir(path.join(targetDir, 'static', 'css'));
  await fs.ensureDir(path.join(targetDir, 'static', 'js'));
  await fs.ensureDir(path.join(targetDir, 'handlers'));
  await fs.ensureDir(path.join(targetDir, 'config'));

  // Arquivos principais
  await fs.writeFile(
    path.join(targetDir, 'main.go'),
    getMainGoContent(port, projectName)
  );

  await fs.writeFile(
    path.join(targetDir, 'go.mod'),
    getGoModContent(projectName)
  );

  await fs.writeFile(
    path.join(targetDir, '.gitignore'),
    getGitignoreContent()
  );

  // Handlers
  await fs.writeFile(
    path.join(targetDir, 'handlers', 'home.go'),
    getHomeHandlerContent()
  );

  // Config
  await fs.writeFile(
    path.join(targetDir, 'config', 'config.go'),
    getConfigContent(port)
  );

  // Views
  await fs.writeFile(
    path.join(targetDir, 'views', 'index.html'),
    getIndexHtmlContent()
  );

  await fs.writeFile(
    path.join(targetDir, 'views', 'layout.html'),
    getLayoutHtmlContent()
  );

  // Arquivos estáticos
  await fs.writeFile(
    path.join(targetDir, 'static', 'css', 'style.css'),
    getStyleCssContent()
  );

  await fs.writeFile(
    path.join(targetDir, 'static', 'js', 'main.js'),
    getMainJsContent()
  );

  // README
  await fs.writeFile(
    path.join(targetDir, 'README.md'),
    getReadmeContent(projectName, port)
  );
}

function getMainGoContent(port, projectName) {
  return `package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	
	"${projectName}/handlers"
)

func main() {
	// Configurar engine de templates HTML
	engine := html.New("./views", ".html")
	engine.Reload(true) // Recarregar templates em desenvolvimento
	
	// Criar app Fiber
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// Servir arquivos estáticos
	app.Static("/static", "./static")

	// Rotas
	setupRoutes(app)

	// Iniciar servidor
	log.Printf("🚀 Servidor rodando em http://localhost:%s", "${port}")
	log.Fatal(app.Listen(":${port}"))
}

func setupRoutes(app *fiber.App) {
	// Rotas principais
	app.Get("/", handlers.Home)
	
	// Adicione mais rotas aqui
}
`;
}

function getGoModContent(projectName) {
  return `module ${projectName}

go 1.21

require (
	github.com/gofiber/fiber/v2 v2.52.0
	github.com/gofiber/template/html/v2 v2.1.0
)
`;
}

function getGitignoreContent() {
  return `# Binários
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work

# Dependências
vendor/

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
`;
}

function getHomeHandlerContent() {
  return `package handlers

import (
	"github.com/gofiber/fiber/v2"
)

// Home renderiza a página inicial
func Home(c *fiber.Ctx) error {
	return c.Render("index", fiber.Map{
		"Title": "Bem-vindo ao Fiber Go",
	})
}
`;
}

function getConfigContent(port) {
  return `package config

const (
	// Port define a porta do servidor
	Port = "${port}"
	
	// StaticDir define o diretório de arquivos estáticos
	StaticDir = "./static"
	
	// ViewsDir define o diretório de templates
	ViewsDir = "./views"
)
`;
}

function getLayoutHtmlContent() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{if .Title}}{{.Title}} - {{end}}Fiber Go</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- CSS Customizado -->
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body class="bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <i class="fas fa-rocket text-blue-600 text-2xl mr-2"></i>
                    <span class="text-xl font-bold text-gray-800">Fiber Go</span>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/" class="text-gray-700 hover:text-blue-600 transition">
                        <i class="fas fa-home mr-1"></i>Home
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {{block "content" .}}{{end}}
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-12">
        <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p class="text-center text-gray-600 text-sm">
                <i class="fas fa-code mr-1"></i>
                Feito com <i class="fas fa-heart text-red-500"></i> usando Fiber Go
            </p>
        </div>
    </footer>

    <!-- JavaScript Customizado -->
    <script src="/static/js/main.js"></script>
</body>
</html>
`;
}

function getIndexHtmlContent() {
  return `{{define "content"}}
<div class="px-4 py-6 sm:px-0">
    <!-- Hero Section -->
    <div class="text-center py-12">
        <div class="mb-6">
            <i class="fas fa-rocket text-6xl text-blue-600 mb-4"></i>
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
            {{.Title}}
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Seu projeto Go com Fiber está pronto! Comece a desenvolver suas funcionalidades.
        </p>
        
        <!-- Cards de Features -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div class="text-4xl text-blue-600 mb-4">
                    <i class="fas fa-bolt"></i>
                </div>
                <h3 class="text-xl font-semibold mb-2">Rápido</h3>
                <p class="text-gray-600">Fiber é um dos frameworks Go mais rápidos disponíveis</p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div class="text-4xl text-green-600 mb-4">
                    <i class="fas fa-paint-brush"></i>
                </div>
                <h3 class="text-xl font-semibold mb-2">Tailwind CSS</h3>
                <p class="text-gray-600">Estilização moderna e responsiva com Tailwind CSS</p>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div class="text-4xl text-purple-600 mb-4">
                    <i class="fas fa-icons"></i>
                </div>
                <h3 class="text-xl font-semibold mb-2">Font Awesome</h3>
                <p class="text-gray-600">Ícones profissionais prontos para uso</p>
            </div>
        </div>
        
        <!-- CTA Button -->
        <div class="mt-12">
            <a href="#" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
                <i class="fas fa-play mr-2"></i>
                Começar Agora
            </a>
        </div>
    </div>
</div>
{{end}}

{{template "layout" .}}
`;
}

function getStyleCssContent() {
  return `/* Estilos customizados */
/* Adicione seus estilos personalizados aqui */

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Animações personalizadas */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn 0.5s ease-in;
}
`;
}

function getMainJsContent() {
  return `// JavaScript customizado
// Adicione seu código JavaScript aqui

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Fiber Go - Projeto carregado!');
    
    // Exemplo: Adicionar animação de fade-in aos cards
    const cards = document.querySelectorAll('.bg-white.p-6');
    cards.forEach((card, index) => {
        card.style.animationDelay = \`\${index * 0.1}s\`;
        card.classList.add('fade-in');
    });
});
`;
}

function getReadmeContent(projectName, port) {
  return `# ${projectName}

Projeto Go com Fiber, Tailwind CSS e Font Awesome.

## 🚀 Tecnologias

- **Go** - Linguagem de programação
- **Fiber** - Framework web rápido inspirado no Express
- **Tailwind CSS** - Framework CSS utilitário (via CDN)
- **Font Awesome** - Biblioteca de ícones (via CDN)

## 📁 Estrutura do Projeto

\`\`\`
${projectName}/
├── main.go              # Arquivo principal
├── go.mod               # Dependências Go
├── handlers/            # Handlers HTTP
│   └── home.go
├── config/              # Configurações
│   └── config.go
├── views/               # Templates HTML
│   ├── layout.html
│   └── index.html
└── static/              # Arquivos estáticos
    ├── css/
    └── js/
\`\`\`

## 🛠️ Instalação

1. Instale as dependências:
\`\`\`bash
go mod tidy
\`\`\`

2. Execute o projeto:
\`\`\`bash
go run main.go
\`\`\`

3. Acesse no navegador:
\`\`\`
http://localhost:${port}
\`\`\`

## 📝 Desenvolvimento

- Os templates HTML são recarregados automaticamente em desenvolvimento
- Arquivos estáticos estão em \`./static\`
- Adicione novos handlers em \`./handlers\`
- Adicione novas rotas em \`main.go\` na função \`setupRoutes\`

## 📚 Recursos

- [Documentação Fiber](https://docs.gofiber.io/)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação Font Awesome](https://fontawesome.com/docs)

## Criado usando srfibergo
- [srfibergo](https://github.com/srtermax/srfibergo)
`;
}
