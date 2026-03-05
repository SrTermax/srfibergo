# srfibergo v1.0.3

CLI para gerar projetos Go com Fiber modernos, rápidos e seguros.

## ✨ O que é?

Template inicial para projetos web com **Go Fiber** - um framework web inspirado no Express.js, conhecido por sua velocidade excepcional e segurança.

## 🔥 Características

- **Rápido**: Fiber é um dos frameworks Go mais rápidos
- **Seguro**: Tipagem forte do Go + estrutura segura
- **Moderno**: Tailwind CSS, Font Awesome, animações leves
- **Minimalista**: Base limpa, fácil de expandir

## 🚀 Uso

```bash
# Com npx (recomendado)
npx srfibergo create meu-projeto

# Com porta específica
npx srfibergo create meu-projeto -p 8080

# Instalação global
npm install -g srfibergo
srfibergo create meu-projeto
```

## 📁 Estrutura Gerada

```
meu-projeto/
├── main.go              # Servidor
├── go.mod               # Dependências
├── .gitignore
├── README.md
├── handlers/            # Rotas HTTP
│   └── home.go
├── config/              # Configurações
│   └── config.go
├── views/               # Templates HTML
│   ├── layout.html
│   └── index.html
└── static/              # Arquivos estáticos
    ├── css/
    └── js/
```

## 🛠️ Após Criar

```bash
cd meu-projeto
go mod tidy
go run main.go ou air "Se tiver instalado."
```

Acesse: http://localhost:3000 "Essa porta 3000 é padrão."

## ⚙️ Opções

- `-p, --port <port>`: Porta do servidor (padrão: 3000)
- `-v, --version <ver>`: Versão do projeto

## 📚 Recursos

- [Fiber Docs](https://docs.gofiber.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Font Awesome](https://fontawesome.com/search)

---

Feito por [SrTermax](https://github.com/SrTermax)
