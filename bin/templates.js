function getMainGoContent(port, projectName) {
  return `package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	
	"${projectName}/handlers"
)

func main() {
	engine := html.New("./views", ".html")
	engine.Reload(true)
	
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	app.Static("/static", "./static")

	setupRoutes(app)

	log.Printf("🚀 Servidor rodando em http://localhost:%s", "${port}")
	log.Fatal(app.Listen(":${port}"))
}

func setupRoutes(app *fiber.App) {
	app.Get("/", handlers.Home)
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

function getHomeHandlerContent(version) {
  return `package handlers

import (
	"github.com/gofiber/fiber/v2"
)

func Home(c *fiber.Ctx) error {
	return c.Render("index", fiber.Map{
		"Title": "Bem-vindo ao Fiber Go",
		"Version": "${version}",
	})
}
`;
}

function getConfigContent(port) {
  return `package config

const (
	Port = "${port}"
	StaticDir = "./static"
	ViewsDir = "./views"
)
`;
}

function getLayoutHtmlContent() {
  return `<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{if .Title}}{{.Title}} - {{end}}Fiber Go</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body class="bg-[#0a0a0f] text-gray-300 antialiased">
    <nav class="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/5">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <i class="fa-brands fa-golang text-blue-400 text-lg"></i>
                </div>
                <span class="font-semibold text-white tracking-tight">Fiber Go</span>
            </div>
            <a href="/" class="text-sm text-gray-400 hover:text-white transition-colors">Home</a>
        </div>
    </nav>

    <main class="pt-32 pb-16">
        {{block "content" .}}{{end}}
    </main>

    <footer class="border-t border-white/5 py-8">
        <div class="max-w-6xl mx-auto px-6 text-center">
            <p class="text-sm text-gray-500">
                Feito com <i class="fa-solid fa-heart text-red-500 mx-1"></i> por <a href="https://github.com/SrTermax" target="_blank" class="text-blue-400 hover:underline">SrTermax</a>
                <span class="mx-2">•</span>
                <span class="text-gray-600">srfibergo v{{.Version}}</span>
            </p>
        </div>
    </footer>
    <script src="/static/js/main.js"></script>
</body>
</html>
`;
}

function getIndexHtmlContent() {
  return `{{define "content"}}
<div class="max-w-6xl mx-auto px-6">
    <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 mb-8">
            <i class="fa-solid fa-bolt text-3xl text-blue-400"></i>
        </div>
        
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {{.Title}}
        </h1>
        
        <p class="text-lg text-gray-400 max-w-xl mx-auto mb-12">
            Projeto Go com Fiber configurado e pronto para desenvolvimento.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div class="group p-6 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all duration-300">
                <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-rocket text-blue-400"></i>
                </div>
                <h3 class="text-white font-medium mb-2">Rápido</h3>
                <p class="text-sm text-gray-500">Fiber é extremamente rápido e leve</p>
            </div>
            
            <div class="group p-6 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-all duration-300">
                <div class="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i class="fa-brands fa-css3 text-violet-400"></i>
                </div>
                <h3 class="text-white font-medium mb-2">Tailwind</h3>
                <p class="text-sm text-gray-500">Estilização moderna com utilitários</p>
            </div>
            
            <div class="group p-6 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all duration-300">
                <div class="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <i class="fa-solid fa-icons text-amber-400"></i>
                </div>
                <h3 class="text-white font-medium mb-2">Font Awesome</h3>
                <p class="text-sm text-gray-500">Ícones profissionais via CDN</p>
            </div>
        </div>
        
        <div class="mt-12">
            <a href="#" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors">
                <i class="fa-solid fa-play"></i>
                Começar
            </a>
        </div>
    </div>
</div>
{{end}}

{{template "layout" .}}
`;
}

function getStyleCssContent() {
  return `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'JetBrains Mono', monospace;
    background: 
        radial-gradient(ellipse at top, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
        #0a0a0f;
    min-height: 100vh;
}

::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #0a0a0f;
}

::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #444;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-up {
    animation: fadeUp 0.6s ease-out forwards;
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
`;
}

function getMainJsContent() {
  return `document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Fiber Go carregado!');
    
    const elements = document.querySelectorAll('.group');
    elements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.animation = 'fadeUp 0.5s ease-out forwards';
    });
});
`;
}

function getReadmeContent(projectName, port, version) {
  return `# ${projectName}

Projeto Go com Fiber, Tailwind CSS e Font Awesome.

## 🚀 Tecnologias

- **Go** - Linguagem de programação
- **Fiber** - Framework web rápido
- **Tailwind CSS** - Framework CSS utilitário (via CDN)
- **Font Awesome** - Ícones (via CDN)
- **GSAP** - Animações (via CDN)

## 📁 Estrutura

\`\`\`
${projectName}/
├── main.go
├── go.mod
├── handlers/
│   └── home.go
├── config/
│   └── config.go
├── views/
│   ├── layout.html
│   └── index.html
└── static/
    ├── css/
    └── js/
\`\`\`

## 🛠️ Instalação

\`\`\`bash
go mod tidy
go run main.go
\`\`\`

Acesse: http://localhost:${port}

## 📚 Recursos

- [Fiber Docs](https://docs.gofiber.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Font Awesome](https://fontawesome.com/search)

## Feito por

[srfibergo v${version}](https://github.com/srtermax/srfibergo) por [SrTermax](https://github.com/SrTermax)
`;
}

module.exports = {
  getMainGoContent,
  getGoModContent,
  getGitignoreContent,
  getHomeHandlerContent,
  getConfigContent,
  getLayoutHtmlContent,
  getIndexHtmlContent,
  getStyleCssContent,
  getMainJsContent,
  getReadmeContent,
};
