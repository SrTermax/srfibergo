# srfibergo 1.0.5 ⚡

> 🚀 CLI para gerar projetos **Go + Fiber** completos em segundos — com **Tailwind CSS**, **Font Awesome**, hot reload 🔥 e suporte a `.env`.

[![npm version](https://img.shields.io/npm/v/srfibergo?color=6fa3b0&style=flat-square)](https://www.npmjs.com/package/srfibergo)
[![npm downloads](https://img.shields.io/npm/dm/srfibergo?color=6fa3b0&style=flat-square)](https://www.npmjs.com/package/srfibergo)
[![license](https://img.shields.io/npm/l/srfibergo?color=6fa3b0&style=flat-square)](LICENSE)

---

## 📦 O que é o srfibergo?

**srfibergo** é uma CLI ⚙️ que gera automaticamente um **boilerplate completo em Go Fiber**, um dos frameworks HTTP mais rápidos do ecossistema Go ⚡.

Inspirado na simplicidade do Express.js, o Fiber entrega alta performance com baixo consumo de recursos — ideal para APIs e aplicações web modernas.

Com um único comando 💨 você tem um projeto pronto para rodar, com:

- ⚡ Servidor HTTP em **Go** usando **Fiber v2**
- 🧩 Templates **HTML** com engine nativa do Fiber
- 🎨 **Tailwind CSS** via CDN (sem build step)
- ⭐ **Font Awesome** via CDN
- 📡 Endpoint `/api/ping` para benchmark e testes
- 🗂️ Estrutura organizada (`handlers/`, `config/`, `views/`, `static/`)
- 🔥 Hot reload com Air (opcional)
- 🔐 Variáveis de ambiente com **godotenv** (opcional)

---

## ⚡ Instalação

### 🚀 Uso rápido (sem instalar)

```bash
npx srfibergo create meu-projeto
````

### 📦 Instalação global

```bash
npm install -g srfibergo
srfibergo create meu-projeto
```

---

## 💡 Exemplos de uso

```bash
# 🟢 Projeto básico (porta padrão 3000)
npx srfibergo create meu-projeto

# 🔧 Porta personalizada
npx srfibergo create meu-projeto -p 8080

# 🔥 Com hot reload
npx srfibergo create meu-projeto --with-air

# 🔐 Com variáveis de ambiente
npx srfibergo create meu-projeto --with-env

# 🚀 Setup completo
npx srfibergo create meu-projeto -p 8080 --with-air --with-env
```

---

## 🏗️ Estrutura do projeto gerado

```
meu-projeto/
├── main.go
├── go.mod
├── .gitignore
├── .env
├── .air.toml
├── README.md
├── handlers/
│   ├── home.go
│   └── ping.go
├── config/
│   └── config.go
├── views/
│   ├── layout.html
│   └── index.html
└── static/
    ├── css/style.css
    └── js/main.js
```

---

## ▶️ Como rodar o projeto

```bash
cd meu-projeto
go mod tidy
go run main.go
```

### 🔥 Com hot reload (Air)

```bash
air
```

🌐 Acesse no navegador:

```
http://localhost:3000
```

---

## ⚙️ Flags disponíveis

| Flag                | Descrição                    | Padrão  |
| ------------------- | ---------------------------- | ------- |
| `-p, --port <port>` | Define a porta do servidor   | `3000`  |
| `--with-air`        | Ativa hot reload com Air 🔥  | `false` |
| `--with-env`        | Adiciona suporte a `.env` 🔐 | `false` |

---

## 🧪 Comandos da CLI

```bash
srfibergo create <nome>   # Criar novo projeto
srfibergo info            # Mostrar informações
srfibergo --help          # Ajuda
srfibergo --version       # Versão
```

---

## 🧱 Stack gerada

| Tecnologia   | Função                               |
| ------------ | ------------------------------------ |
| Go Fiber     | Framework HTTP de alta performance ⚡ |
| Tailwind CSS | Estilização moderna 🎨               |
| Font Awesome | Ícones ⭐                             |
| Air          | Hot reload 🔥                        |
| godotenv     | Variáveis de ambiente 🔐             |

---

## 📊 Por que usar srfibergo?

* ⚡ Criação instantânea de projetos Go Fiber
* 📦 Boilerplate pronto para produção
* 🧼 Estrutura limpa e organizada
* 🚀 Foco em performance e simplicidade
* 🔧 Zero configuração inicial
* 🧠 Ideal para APIs REST e apps web

---

## 🔗 Links

* [https://www.npmjs.com/package/srfibergo](https://www.npmjs.com/package/srfibergo)
* [https://github.com/SrTermax/srfibergo](https://github.com/SrTermax/srfibergo)
* [https://docs.gofiber.io/](https://docs.gofiber.io/)
* [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
* [https://fontawesome.com/](https://fontawesome.com/)
* [https://github.com/air-verse/air](https://github.com/air-verse/air)

---

## ⭐ Contribuição

Pull requests são bem-vindos 🤝

Se quiser melhorar a CLI, corrigir bugs ou adicionar features, sinta-se livre para contribuir.

---

## 📄 Licença

MIT

---

## 💻 Autor

Feito por **SrTermax** 🚀

Se esse projeto te ajudou, deixe uma ⭐ no [GitHub](https://github.com/SrTermax/srfibergo)! — ajuda muito!