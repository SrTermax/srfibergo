# srfibergo

CLI npm para gerar projetos Go com Fiber, Tailwind CSS e Font Awesome de forma rápida e organizada.

## 🚀 Uso Rápido

### Opção 1: Usar com npx (Recomendado - Não precisa instalar)

```bash
npx srfibergo create meu-projeto --port 8080
```

Ou sem especificar a porta (padrão 3000):

```bash
npx srfibergo create meu-projeto
```

### Opção 2: Instalação Global

```bash
npm install -g srfibergo
```

Depois use:

```bash
srfibergo create meu-projeto --port 3000
```

## 📖 Como Funciona

O CLI irá:

1. Criar a estrutura de diretórios organizada
2. Configurar o projeto Go com Fiber
3. Incluir templates HTML com Tailwind CSS e Font Awesome
4. Configurar handlers e rotas básicas
5. Perguntar qual porta deseja usar (padrão: 3000)

## 📁 Estrutura Gerada

O CLI cria a seguinte estrutura:

```
meu-projeto/
├── main.go              # Arquivo principal do servidor
├── go.mod               # Dependências Go
├── .gitignore           # Arquivos ignorados pelo Git
├── README.md            # Documentação do projeto
├── handlers/            # Handlers HTTP
│   └── home.go
├── config/              # Configurações
│   └── config.go
├── views/               # Templates HTML
│   ├── layout.html      # Layout base
│   └── index.html       # Página inicial
└── static/              # Arquivos estáticos
    ├── css/
    │   └── style.css
    └── js/
        └── main.js
```

## 🛠️ Tecnologias Incluídas

- **Go Fiber** - Framework web rápido
- **Tailwind CSS** - Framework CSS utilitário (via CDN)
- **Font Awesome 6.5.1** - Biblioteca de ícones (via CDN)
- **HTML Templates** - Sistema de templates do Fiber

## 📝 Próximos Passos Após Criar o Projeto

1. Entre no diretório do projeto:

```bash
cd meu-projeto
```

2. Instale as dependências Go:

```bash
go mod tidy
```

3. Execute o servidor:

```bash
go run main.go
```

4. Acesse no navegador:

```
http://localhost:3000
```

## ⚙️ Opções do Comando

- `--port` ou `-p`: Especifica a porta do servidor (padrão: 3000)
  ```bash
  npx srfibergo create meu-projeto --port 8080
  ```

- Se não especificar a porta, o CLI perguntará interativamente qual porta deseja usar.

## 🎨 Personalização

- **Templates HTML**: Edite os arquivos em `views/`
- **Handlers**: Adicione novos handlers em `handlers/`
- **Rotas**: Configure rotas em `main.go` na função `setupRoutes`
- **Estilos**: Adicione CSS customizado em `static/css/style.css`
- **JavaScript**: Adicione JS customizado em `static/js/main.js`

## 🔧 Solução de Problemas

### Comando não encontrado

Se você receber `command not found`, use `npx`:

```bash
npx srfibergo create meu-projeto --port 3000
```

### Problemas no Windows/Git Bash

Se estiver usando Git Bash no Windows e o comando não funcionar mesmo após instalação global, adicione ao PATH ou use `npx`.

## 📚 Recursos

- [Documentação Fiber](https://docs.gofiber.io/)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação Font Awesome](https://fontawesome.com/docs)

## 📄 Licença

MIT
