function getMainGoContent(port, projectName, withEnv) {
  if (withEnv) {
    return `package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	"github.com/joho/godotenv"

	"${projectName}/handlers"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Arquivo .env não encontrado, usando variáveis de ambiente do sistema")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "${port}"
	}

	engine := html.New("./views", ".html")
	engine.Reload(true)

	app := fiber.New(fiber.Config{
		Views: engine,
	})

	app.Static("/static", "./static")

	setupRoutes(app)

	log.Printf("🚀 Servidor rodando em http://localhost:%s", port)
	log.Fatal(app.Listen(":" + port))
}

func setupRoutes(app *fiber.App) {
	app.Get("/", handlers.Home)
	app.Get("/api/ping", handlers.Ping)
}
`;
  }

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
	app.Get("/api/ping", handlers.Ping)
}
`;
}

function getGoModContent(projectName, withEnv) {
  const godotenvDep = withEnv ? `\tgithub.com/joho/godotenv v1.5.1\n` : "";
  return `module ${projectName}

go 1.21

require (
\tgithub.com/gofiber/fiber/v2 v2.52.0
\tgithub.com/gofiber/template/html/v2 v2.1.0
${godotenvDep})
`;
}

function getGitignoreContent(withAir) {
  const airEntry = withAir ? `\n# Air (hot reload)\ntmp/\n` : "";
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

# Variáveis de ambiente
.env
.env.local
.env.*.local
${airEntry}`;
}

function getHomeHandlerContent(version) {
  return `package handlers

import (
	"github.com/gofiber/fiber/v2"
)

func Home(c *fiber.Ctx) error {
	return c.Render("index", fiber.Map{
		"Title":   "Bem-vindo ao Fiber Go",
		"Version": "${version}",
	})
}
`;
}

function getConfigContent(port, withEnv) {
  if (withEnv) {
    return `package config

import "os"

func GetPort() string {
	if port := os.Getenv("PORT"); port != "" {
		return port
	}
	return "${port}"
}

const (
	StaticDir = "./static"
	ViewsDir  = "./views"
)
`;
  }

  return `package config

const (
	Port      = "${port}"
	StaticDir = "./static"
	ViewsDir  = "./views"
)
`;
}

// ─── Layout ──────────────────────────────────────────────────────────────────

function getLayoutHtmlContent() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{if .Title}}{{.Title}} — {{end}}Fiber Go</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
    <div class="grain" aria-hidden="true"></div>

    <nav class="nav">
        <div class="nav-inner">
            <div class="nav-logo">
                <div class="nav-icon">
                    <i class="fa-brands fa-golang"></i>
                </div>
                <span class="nav-name">fiber<span class="nav-acc">go</span></span>
                <span class="nav-badge">v{{.Version}}</span>
            </div>
            <div class="nav-status">
                <span class="status-dot"></span>
                <span class="status-lbl">ONLINE</span>
            </div>
        </div>
    </nav>

    <main>
        {{block "content" .}}{{end}}
    </main>

    <footer class="footer">
        <div class="footer-inner">
            <span class="footer-txt">srfibergo v{{.Version}}</span>
            <span class="footer-sep">·</span>
            <a href="https://github.com/SrTermax" target="_blank" class="footer-lnk">SrTermax</a>
            <span class="footer-sep">·</span>
            <a href="https://docs.gofiber.io/" target="_blank" class="footer-lnk">Fiber Docs</a>
            <span class="footer-sep">·</span>
            <a href="https://tailwindcss.com" target="_blank" class="footer-lnk">Tailwind</a>
        </div>
    </footer>

    <script src="/static/js/main.js"></script>
</body>
</html>
`;
}

// ─── Index ───────────────────────────────────────────────────────────────────

function getIndexHtmlContent() {
  return `{{define "content"}}

<!-- ░░ HERO ░░ -->
<section class="hero">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="hero-inner">

        <div class="hero-chip">
            <span class="chip-dot"></span>
            GO &middot; FIBER &middot; TAILWIND &middot; FONT AWESOME
        </div>

        <h1 class="hero-title">
            <span class="ht" style="--i:0">Build fast.</span>
            <span class="ht ht--acc" style="--i:1">Ship faster.</span>
        </h1>
        <p class="hero-sub">Framework web Go de alta performance, pronto para produção.</p>

        <div class="hero-term" id="heroTerm">
            <div class="term-bar">
                <span class="td td-r"></span>
                <span class="td td-y"></span>
                <span class="td td-g"></span>
                <span class="term-bar-title">bash &mdash; meu-projeto</span>
            </div>
            <div class="term-body">
                <div class="term-row">
                    <span class="term-ps">~/meu-projeto $&nbsp;</span><span id="termCmd"></span><span id="termCursor">&#9607;</span>
                </div>
                <div id="termOut"></div>
            </div>
        </div>

        <div class="hero-actions">
            <a href="https://github.com/SrTermax/srfibergo" target="_blank" class="star-cta">
                <div class="star-cta-info">
                    <i class="fa-brands fa-github star-gh-icon"></i>
                    <div>
                        <div class="star-cta-name">srtermax / srfibergo</div>
                        <div class="star-cta-hint">Se curtiu, deixe uma estrela!</div>
                    </div>
                </div>
                <div class="star-cta-badge">
                    <i class="fa-solid fa-star"></i> Star
                </div>
            </a>
            <a href="https://docs.gofiber.io/" target="_blank" class="btn btn-ghost">
                <i class="fa-solid fa-book-open"></i>
                Fiber Docs
            </a>
        </div>

    </div>
</section>

<!-- ░░ METRICS ░░ -->
<section class="metrics">
    <div class="metrics-inner">
        <div class="metric" data-val="52000" data-sfx="/s">
            <div class="metric-val" id="mv1">—</div>
            <div class="metric-key">Requisições por segundo</div>
        </div>
        <div class="metric" data-val="99" data-sfx="%">
            <div class="metric-val" id="mv2">—</div>
            <div class="metric-key">Menos memória que Node.js</div>
        </div>
        <div class="metric" data-val="3" data-sfx="×">
            <div class="metric-val" id="mv3">—</div>
            <div class="metric-key">Mais rápido que Express</div>
        </div>
    </div>
</section>

<!-- ░░ BENCHMARK ░░ -->
<section class="bench">
    <div class="bench-inner">
        <div class="bench-left">
            <p class="eyebrow">TESTE AO VIVO</p>
            <h2 class="bench-title">Sinta a velocidade<br>do Go.</h2>
            <p class="bench-desc">Dispara 200 requisições para <code>/api/ping</code> neste servidor e exibe o desempenho em tempo real. Sem mocks &mdash; é o seu Go rodando de verdade.</p>
        </div>
        <div class="bench-panel">
            <div class="bench-stats">
                <div class="bstat">
                    <div class="bstat-val" id="bReqs">0</div>
                    <div class="bstat-key">requisições</div>
                </div>
                <div class="bstat">
                    <div class="bstat-val" id="bAvg">—</div>
                    <div class="bstat-key">ms médio</div>
                </div>
                <div class="bstat">
                    <div class="bstat-val" id="bRps">—</div>
                    <div class="bstat-key">req / s</div>
                </div>
            </div>
            <div class="bench-track">
                <div class="bench-fill" id="benchFill"></div>
            </div>
            <button class="bench-btn" id="benchBtn">
                <i class="fa-solid fa-play"></i>
                Iniciar Teste
            </button>
        </div>
    </div>
</section>

<!-- ░░ FEATURES ░░ -->
<section class="feats">
    <div class="feats-inner">

        <div class="feats-head">
            <p class="eyebrow">STACK INCLUSO</p>
            <h2 class="feats-title">Tudo que você precisa.<br>Nada que você não precisa.</h2>
        </div>

        <div class="feats-grid">

            <div class="fc fc--tall">
                <div class="fc-icon">
                    <i class="fa-solid fa-bolt"></i>
                </div>
                <p class="fc-no">01</p>
                <h3 class="fc-name">Go + Fiber</h3>
                <p class="fc-desc">Framework web inspirado no Express, construído sobre Fasthttp &mdash; o servidor HTTP mais rápido para Go. Ideal para APIs e apps web de alto desempenho.</p>
                <span class="fc-pkg">gofiber/fiber/v2</span>
            </div>

            <div class="fc">
                <div class="fc-icon fc-icon--teal">
                    <i class="fa-brands fa-css3-alt"></i>
                </div>
                <p class="fc-no">02</p>
                <h3 class="fc-name">Tailwind CSS</h3>
                <p class="fc-desc">Utilitários CSS modernos via CDN, sem build step ou configuração.</p>
            </div>

            <div class="fc">
                <div class="fc-icon fc-icon--org">
                    <i class="fa-solid fa-icons"></i>
                </div>
                <p class="fc-no">03</p>
                <h3 class="fc-name">Font Awesome</h3>
                <p class="fc-desc">Biblioteca de ícones completa, pronta para uso via CDN.</p>
                <a href="https://fontawesome.com/search?ic=free-collection" target="_blank" class="fc-link">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Explorar ícones gratuitos
                </a>
            </div>

            <div class="fc fc--code">
                <p class="fc-no">04</p>
                <h3 class="fc-name">Roteamento Fiber</h3>
                <div class="csnap">
                    <div class="cs-ln"><span class="cs-o">app</span>.<span class="cs-f">Get</span>(<span class="cs-s">"/"</span>, handlers.Home)</div>
                    <div class="cs-ln"><span class="cs-o">app</span>.<span class="cs-f">Get</span>(<span class="cs-s">"/api/ping"</span>, handlers.Ping)</div>
                    <div class="cs-ln"><span class="cs-o">app</span>.<span class="cs-f">Static</span>(<span class="cs-s">"/static"</span>, <span class="cs-s">"./static"</span>)</div>
                </div>
            </div>

        </div>
    </div>
</section>

<!-- ░░ CTA ░░ -->
<section class="cta">
    <div class="cta-inner">
        <div class="cta-text">
            <p class="eyebrow">PRONTO PARA USAR</p>
            <h2 class="cta-title">Seu projeto Go está pronto.</h2>
            <p class="cta-sub">Edite os handlers, adicione suas rotas e faça deploy.</p>
        </div>
        <div class="cta-cmd">
            <span class="cmd-ps">$</span>
            <span class="cmd-tx">go mod tidy &amp;&amp; go run main.go</span>
        </div>
    </div>
</section>

{{end}}

{{template "layout" .}}
`;
}

// ─── Style ───────────────────────────────────────────────────────────────────

function getStyleCssContent() {
  return `/* ── Variables ─────────────────────────────────────── */
:root {
    --bg:      #07080a;
    --bg-s:    #0b0d10;
    --bg-t:    #10131a;
    --bdr:     #191e27;
    --bdr-hi:  #232b36;
    --txt:     #7a8899;
    --txt-hi:  #c5d0dc;
    --txt-lo:  #333d4a;
    --acc:     #00ddb8;
    --acc-bg:  rgba(0,221,184,.08);
    --acc-gl:  rgba(0,221,184,.22);
    --org:     #ff5c33;
    --org-bg:  rgba(255,92,51,.08);
    --whi:     #edf2f8;
    --fnt-d:   'Bebas Neue', cursive;
    --fnt-m:   'IBM Plex Mono', monospace;
}

/* ── Reset ──────────────────────────────────────────── */
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

html { font-size:16px; scroll-behavior:smooth; }

body {
    background: var(--bg);
    color: var(--txt);
    font-family: var(--fnt-m);
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; }

/* ── Grain overlay ──────────────────────────────────── */
.grain {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 200;
    opacity: .028;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 200px;
}

/* ── Navigation ─────────────────────────────────────── */
.nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    height: 56px;
    border-bottom: 1px solid var(--bdr);
    background: rgba(7,8,10,.82);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
}

.nav-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: .7rem;
}

.nav-icon {
    width: 30px; height: 30px;
    background: var(--acc-bg);
    border: 1px solid rgba(0,221,184,.18);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: var(--acc);
    font-size: .85rem;
}

.nav-name {
    font-family: var(--fnt-m);
    font-size: .88rem;
    font-weight: 600;
    color: var(--txt-hi);
    letter-spacing: .06em;
}

.nav-acc { color: var(--acc); }

.nav-badge {
    font-size: .62rem;
    color: var(--txt-lo);
    background: var(--bg-s);
    border: 1px solid var(--bdr);
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: .1em;
}

.nav-status { display: flex; align-items: center; gap: .45rem; }

.status-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--acc);
    box-shadow: 0 0 8px var(--acc);
    animation: blink-dot 2.4s ease-in-out infinite;
}

@keyframes blink-dot {
    0%,100% { opacity:1; box-shadow: 0 0 8px var(--acc); }
    50%      { opacity:.35; box-shadow: 0 0 3px var(--acc); }
}

.status-lbl {
    font-size: .62rem;
    color: var(--acc);
    letter-spacing: .18em;
    font-weight: 500;
}

/* ── Hero ───────────────────────────────────────────── */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 56px;
    position: relative;
    overflow: hidden;
}

.hero-bg {
    position: absolute;
    inset: 0;
    background-image:
        radial-gradient(ellipse 60% 50% at 15% 60%, rgba(0,221,184,.05) 0%, transparent 65%),
        radial-gradient(ellipse 40% 40% at 85% 25%, rgba(255,92,51,.04) 0%, transparent 60%),
        linear-gradient(var(--bdr) 1px, transparent 1px),
        linear-gradient(90deg, var(--bdr) 1px, transparent 1px);
    background-size: 100% 100%, 100% 100%, 56px 56px, 56px 56px;
    mask-image: radial-gradient(ellipse 85% 75% at 50% 50%, black 20%, transparent 100%);
}

.hero-inner {
    position: relative;
    z-index: 1;
    max-width: 1120px;
    margin: 0 auto;
    padding: 5rem 2rem 4rem;
}

.hero-chip {
    display: inline-flex;
    align-items: center;
    gap: .6rem;
    font-size: .62rem;
    letter-spacing: .2em;
    color: var(--txt-lo);
    background: var(--bg-s);
    border: 1px solid var(--bdr);
    padding: 5px 14px;
    border-radius: 100px;
    margin-bottom: 2.5rem;
    animation: fade-in .5s ease both;
}

.chip-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--acc);
    flex-shrink: 0;
}

/* Hero title */
.hero-title {
    font-family: var(--fnt-d);
    font-size: clamp(3rem, 7vw, 5.5rem);
    line-height: .92;
    letter-spacing: .015em;
    margin-bottom: 1rem;
}

.hero-sub {
    font-size: .82rem;
    color: var(--txt);
    margin-bottom: 2.5rem;
    letter-spacing: .02em;
}

.ht {
    display: block;
    color: var(--whi);
    opacity: 0;
    transform: translateY(22px);
    animation: slide-up .6s cubic-bezier(.16,1,.3,1) both;
    animation-delay: calc(var(--i) * 0.09s + 0.05s);
}

.ht--acc {
    color: var(--acc);
    text-shadow: 0 0 80px var(--acc-gl);
}

.ht--dim { color: var(--txt-lo); }

@keyframes slide-up {
    to { opacity:1; transform:translateY(0); }
}

@keyframes fade-in {
    from { opacity:0; }
    to   { opacity:1; }
}

/* Terminal card */
.hero-term {
    background: var(--bg-s);
    border: 1px solid var(--bdr-hi);
    border-radius: 10px;
    max-width: 500px;
    margin-bottom: 2.5rem;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.04);
    animation: fade-in .5s .55s ease both;
}

.term-bar {
    display: flex;
    align-items: center;
    gap: .35rem;
    padding: 9px 13px;
    border-bottom: 1px solid var(--bdr);
    background: rgba(255,255,255,.02);
}

.td { width:11px; height:11px; border-radius:50%; }
.td-r { background:#ff5f57; }
.td-y { background:#febc2e; }
.td-g { background:#28c840; }

.term-bar-title {
    margin-left: auto;
    font-size: .62rem;
    color: var(--txt-lo);
    letter-spacing: .05em;
}

.term-body { padding: .9rem 1.1rem; font-size: .78rem; }

.term-row { display:flex; align-items:center; margin-bottom:.4rem; }

.term-ps { color: var(--acc); font-weight:500; }

#termCmd { color: var(--txt-hi); }

#termCursor {
    color: var(--acc);
    animation: blink-cur 1s step-end infinite;
}

@keyframes blink-cur {
    0%,100% { opacity:1; }
    50%      { opacity:0; }
}

#termOut { font-size:.74rem; line-height:2; }
#termOut .to-info { color: var(--txt-lo); }
#termOut .to-ok   { color: #28c840; }
#termOut .to-url  { color: var(--acc); }

/* Star CTA */
.hero-actions {
    display: flex;
    align-items: center;
    gap: .9rem;
    flex-wrap: wrap;
    animation: fade-in .5s .75s ease both;
}

.star-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 10px 14px 10px 12px;
    background: var(--bg-s);
    border: 1px solid var(--bdr-hi);
    border-radius: 9px;
    transition: border-color .18s, box-shadow .18s, transform .15s;
    min-width: 240px;
}

.star-cta:hover {
    border-color: #f0c040;
    box-shadow: 0 0 18px rgba(240,192,64,.12);
    transform: translateY(-1px);
}

.star-cta-info {
    display: flex;
    align-items: center;
    gap: .7rem;
}

.star-gh-icon {
    font-size: 1.3rem;
    color: var(--txt-hi);
}

.star-cta-name {
    font-size: .76rem;
    font-weight: 600;
    color: var(--txt-hi);
    letter-spacing: .02em;
}

.star-cta-hint {
    font-size: .64rem;
    color: var(--txt-lo);
    margin-top: 1px;
}

.star-cta-badge {
    display: flex;
    align-items: center;
    gap: .35rem;
    padding: 5px 11px;
    background: rgba(240,192,64,.1);
    border: 1px solid rgba(240,192,64,.25);
    border-radius: 6px;
    font-size: .72rem;
    font-weight: 600;
    color: #f0c040;
    white-space: nowrap;
    flex-shrink: 0;
}

/* Hero buttons */
.hero-btns {
    display: flex;
    gap: .9rem;
    flex-wrap: wrap;
    animation: fade-in .5s .75s ease both;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: .45rem;
    padding: 10px 20px;
    border-radius: 7px;
    font-family: var(--fnt-m);
    font-size: .78rem;
    font-weight: 500;
    letter-spacing: .05em;
    transition: transform .15s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease;
    cursor: pointer;
}

.btn-solid {
    background: var(--acc);
    color: #000;
    border: 1px solid var(--acc);
}

.btn-solid:hover {
    background: #00f0cc;
    box-shadow: 0 0 22px var(--acc-gl);
    transform: translateY(-1px);
}

.btn-ghost {
    background: transparent;
    color: var(--txt);
    border: 1px solid var(--bdr-hi);
}

.btn-ghost:hover {
    border-color: var(--acc);
    color: var(--acc);
    transform: translateY(-1px);
}

/* ── Metrics ────────────────────────────────────────── */
.metrics {
    border-top: 1px solid var(--bdr);
    border-bottom: 1px solid var(--bdr);
    background: var(--bg-s);
}

.metrics-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}

.metric {
    padding: 2.8rem 2rem;
    border-right: 1px solid var(--bdr);
    text-align: center;
}

.metric:last-child { border-right: none; }

.metric-val {
    font-family: var(--fnt-d);
    font-size: 3.8rem;
    color: var(--whi);
    line-height: 1;
    letter-spacing: .02em;
    margin-bottom: .5rem;
}

.metric-key {
    font-size: .66rem;
    color: var(--txt-lo);
    letter-spacing: .12em;
    text-transform: uppercase;
}

/* ── Features ───────────────────────────────────────── */
.feats { max-width: 1120px; margin: 0 auto; padding: 5rem 2rem; }

.feats-head { margin-bottom: 2.8rem; }

.eyebrow {
    font-size: .62rem;
    letter-spacing: .22em;
    color: var(--acc);
    margin-bottom: .8rem;
}

.feats-title {
    font-family: var(--fnt-d);
    font-size: clamp(2rem, 5vw, 3.6rem);
    color: var(--whi);
    line-height: 1.05;
    letter-spacing: .02em;
}

.feats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 1px;
    background: var(--bdr);
    border: 1px solid var(--bdr);
    border-radius: 12px;
    overflow: hidden;
}

.fc {
    background: var(--bg-s);
    padding: 2rem;
    transition: background .2s;
    position: relative;
}

.fc:hover { background: var(--bg-t); }

.fc--tall {
    grid-row: span 2;
    display: flex;
    flex-direction: column;
}

.fc--code { grid-column: span 2; }

.fc-icon {
    width: 38px; height: 38px;
    background: var(--acc-bg);
    border: 1px solid rgba(0,221,184,.15);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--acc);
    font-size: .95rem;
    margin-bottom: 1.5rem;
}

.fc-icon--teal { background:rgba(0,196,196,.1); color:#00c4c4; border-color:rgba(0,196,196,.2); }
.fc-icon--org  { background:var(--org-bg); color:var(--org); border-color:rgba(255,92,51,.2); }

.fc-no {
    font-size: .6rem;
    letter-spacing: .16em;
    color: var(--txt-lo);
    margin-bottom: .5rem;
}

.fc-name {
    font-family: var(--fnt-m);
    font-size: .95rem;
    font-weight: 600;
    color: var(--txt-hi);
    margin-bottom: .65rem;
}

.fc-desc {
    font-size: .76rem;
    line-height: 1.75;
    color: var(--txt);
}

.fc-pkg {
    display: inline-block;
    margin-top: auto;
    padding-top: 1.5rem;
    font-size: .62rem;
    color: var(--acc);
    letter-spacing: .04em;
}

/* Code snippet */
.csnap {
    margin-top: 1rem;
    background: rgba(0,0,0,.35);
    border: 1px solid var(--bdr);
    border-radius: 6px;
    padding: .9rem 1.1rem;
    font-size: .76rem;
}

.cs-ln { line-height: 2.1; color: var(--txt); }
.cs-o  { color: var(--txt-hi); }
.cs-f  { color: var(--acc); }
.cs-s  { color: #ff9966; }

/* ── CTA ────────────────────────────────────────────── */
.cta {
    border-top: 1px solid var(--bdr);
    background: var(--bg-s);
}

.cta-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 4rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
    flex-wrap: wrap;
}

.cta-title {
    font-family: var(--fnt-d);
    font-size: clamp(1.9rem, 4vw, 3rem);
    color: var(--whi);
    letter-spacing: .02em;
    margin: .5rem 0;
}

.cta-sub { font-size: .76rem; color: var(--txt-lo); }

.cta-cmd {
    display: flex;
    align-items: center;
    gap: .7rem;
    background: var(--bg);
    border: 1px solid var(--bdr-hi);
    border-radius: 8px;
    padding: .9rem 1.4rem;
    font-size: .78rem;
    flex-shrink: 0;
    white-space: nowrap;
}

.cmd-ps { color: var(--acc); font-weight: 600; }
.cmd-tx { color: var(--txt-hi); }

/* ── Footer ─────────────────────────────────────────── */
.footer { border-top: 1px solid var(--bdr); }

.footer-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 1.4rem 2rem;
    display: flex;
    align-items: center;
    gap: .9rem;
    font-size: .68rem;
    color: var(--txt-lo);
}

.footer-sep { opacity: .35; }

.footer-lnk {
    color: var(--txt-lo);
    transition: color .15s;
}

.footer-lnk:hover { color: var(--acc); }

/* Feature card link */
.fc-link {
    display: inline-flex;
    align-items: center;
    gap: .35rem;
    margin-top: 1rem;
    font-size: .68rem;
    color: var(--acc);
    opacity: .75;
    transition: opacity .15s;
    letter-spacing: .02em;
}

.fc-link:hover { opacity: 1; }

/* ── Benchmark ──────────────────────────────────────── */
.bench {
    border-top: 1px solid var(--bdr);
    border-bottom: 1px solid var(--bdr);
}

.bench-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 4rem 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.bench-title {
    font-family: var(--fnt-d);
    font-size: clamp(1.8rem, 4vw, 3rem);
    color: var(--whi);
    line-height: 1.05;
    letter-spacing: .02em;
    margin: .6rem 0 .9rem;
}

.bench-desc {
    font-size: .76rem;
    color: var(--txt);
    line-height: 1.75;
}

.bench-desc code {
    background: var(--bg-t);
    border: 1px solid var(--bdr);
    padding: 1px 6px;
    border-radius: 4px;
    color: var(--acc);
    font-size: .72rem;
}

.bench-panel {
    background: var(--bg-s);
    border: 1px solid var(--bdr-hi);
    border-radius: 12px;
    padding: 1.8rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}

.bench-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--bdr);
    border: 1px solid var(--bdr);
    border-radius: 8px;
    overflow: hidden;
}

.bstat {
    background: var(--bg-t);
    padding: .9rem .7rem;
    text-align: center;
}

.bstat-val {
    font-family: var(--fnt-d);
    font-size: 1.6rem;
    color: var(--acc);
    line-height: 1;
    letter-spacing: .02em;
    margin-bottom: .25rem;
    transition: color .2s;
}

.bstat-key {
    font-size: .58rem;
    color: var(--txt-lo);
    letter-spacing: .1em;
    text-transform: uppercase;
}

.bench-track {
    height: 4px;
    background: var(--bdr);
    border-radius: 2px;
    overflow: hidden;
}

.bench-fill {
    height: 100%;
    width: 0%;
    background: var(--acc);
    border-radius: 2px;
    transition: width .1s linear;
    box-shadow: 0 0 8px var(--acc-gl);
}

.bench-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    padding: .75rem;
    background: var(--acc-bg);
    border: 1px solid rgba(0,221,184,.2);
    border-radius: 8px;
    color: var(--acc);
    font-family: var(--fnt-m);
    font-size: .8rem;
    font-weight: 500;
    letter-spacing: .06em;
    cursor: pointer;
    transition: background .15s, border-color .15s, transform .12s;
}

.bench-btn:hover:not(:disabled) {
    background: rgba(0,221,184,.14);
    border-color: var(--acc);
    transform: translateY(-1px);
}

.bench-btn:disabled {
    opacity: .55;
    cursor: not-allowed;
}

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 768px) {
    .hero-title { font-size: clamp(2.5rem, 12vw, 4rem); }

    .metrics-inner { grid-template-columns: 1fr; }
    .metric { border-right: none; border-bottom: 1px solid var(--bdr); }
    .metric:last-child { border-bottom: none; }

    .bench-inner { grid-template-columns: 1fr; gap: 2rem; }

    .feats-grid { grid-template-columns: 1fr; }
    .fc--tall  { grid-row: span 1; }
    .fc--code  { grid-column: span 1; }

    .cta-inner { flex-direction: column; align-items: flex-start; }
    .cta-cmd   { width: 100%; overflow-x: auto; }

    .hero-term    { max-width: 100%; }
    .star-cta     { min-width: 0; width: 100%; }
    .hero-actions { flex-direction: column; align-items: stretch; }
}
`;
}

// ─── Main JS ─────────────────────────────────────────────────────────────────

function getMainJsContent() {
  return `(function () {
    'use strict';

    // ── Terminal animation ──────────────────────────
    var CMD    = 'go run main.go';
    var OUTPUT = [
        { txt: '  building...', cls: 'to-info', ms: 1600 },
        { txt: '  \u2713 compiled successfully', cls: 'to-ok',  ms: 2200 },
        { txt: '  \u26a1 http://localhost:3000', cls: 'to-url', ms: 2700 },
    ];

    var cmdEl = document.getElementById('termCmd');
    var curEl = document.getElementById('termCursor');
    var outEl = document.getElementById('termOut');

    if (cmdEl) {
        var i = 0;
        function typeNext() {
            if (i < CMD.length) { cmdEl.textContent += CMD[i++]; setTimeout(typeNext, 55 + Math.random() * 35); }
        }
        setTimeout(typeNext, 500);

        OUTPUT.forEach(function (line) {
            setTimeout(function () {
                var el = document.createElement('div');
                el.className = line.cls;
                el.textContent = line.txt;
                el.style.cssText = 'opacity:0;transition:opacity .3s';
                outEl.appendChild(el);
                requestAnimationFrame(function () { requestAnimationFrame(function () { el.style.opacity = '1'; }); });
                if (line.cls === 'to-url' && curEl) curEl.style.display = 'none';
            }, line.ms);
        });
    }

    // ── Metric counters ─────────────────────────────
    function countUp(el, target, suffix, ms) {
        var t0 = performance.now();
        function tick(now) {
            var p = Math.min((now - t0) / ms, 1);
            var e = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(e * target).toLocaleString('pt-BR') + suffix;
            if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    var metrics = document.querySelectorAll('.metric');
    if (metrics.length && 'IntersectionObserver' in window) {
        var mo = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                var card = en.target;
                countUp(card.querySelector('.metric-val'), parseInt(card.dataset.val, 10), card.dataset.sfx || '', 1500);
                mo.unobserve(card);
            });
        }, { threshold: 0.4 });
        metrics.forEach(function (c) { mo.observe(c); });
    }

    // ── Live benchmark ──────────────────────────────
    var benchBtn  = document.getElementById('benchBtn');
    var bReqsEl   = document.getElementById('bReqs');
    var bAvgEl    = document.getElementById('bAvg');
    var bRpsEl    = document.getElementById('bRps');
    var benchFill = document.getElementById('benchFill');
    var TOTAL     = 200;
    var BATCH     = 20;

    if (benchBtn) {
        var running = false;

        benchBtn.addEventListener('click', function () {
            if (running) return;
            running = true;
            benchBtn.disabled = true;
            benchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>&nbsp; Testando...';

            var done = 0, times = [], t0 = performance.now();
            bReqsEl.textContent = '0';
            bAvgEl.textContent  = '—';
            bRpsEl.textContent  = '—';
            benchFill.style.width = '0%';

            function ui() {
                var avg     = times.length ? (times.reduce(function (a, b) { return a + b; }, 0) / times.length).toFixed(1) : '—';
                var elapsed = (performance.now() - t0) / 1000;
                var rps     = elapsed > 0 ? Math.round(done / elapsed) : '—';
                bReqsEl.textContent       = done;
                bAvgEl.textContent        = avg === '—' ? '—' : avg + ' ms';
                bRpsEl.textContent        = rps;
                benchFill.style.width     = (done / TOTAL * 100).toFixed(1) + '%';
            }

            function batch(offset) {
                var promises = [];
                for (var k = offset; k < Math.min(offset + BATCH, TOTAL); k++) {
                    promises.push((function () {
                        var ts = performance.now();
                        return fetch('/api/ping')
                            .then(function () { times.push(performance.now() - ts); done++; ui(); })
                            .catch(function () { done++; ui(); });
                    })());
                }
                return Promise.all(promises).then(function () {
                    if (done < TOTAL) return batch(offset + BATCH);
                });
            }

            batch(0).then(function () {
                benchBtn.disabled = false;
                benchBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i>&nbsp; Testar Novamente';
                running = false;
            });
        });
    }

    // ── Feature cards scroll reveal ─────────────────
    var cards = document.querySelectorAll('.fc');
    if (cards.length && 'IntersectionObserver' in window) {
        cards.forEach(function (c) { c.style.cssText += 'opacity:0;transform:translateY(14px);transition:opacity .45s ease,transform .45s ease'; });
        var fo = new IntersectionObserver(function (entries) {
            entries.forEach(function (en, idx) {
                if (!en.isIntersecting) return;
                setTimeout(function () { en.target.style.opacity = '1'; en.target.style.transform = 'translateY(0)'; }, idx * 70);
                fo.unobserve(en.target);
            });
        }, { threshold: 0.08 });
        cards.forEach(function (c) { fo.observe(c); });
    }

}());
`;
}

// ─── Ping handler ────────────────────────────────────────────────────────────

function getPingHandlerContent() {
  return `package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func Ping(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"ok": true,
		"ts": time.Now().UnixMilli(),
	})
}
`;
}

// ─── Air / Env ───────────────────────────────────────────────────────────────

function getAirTomlContent() {
  return `root = "."
tmp_dir = "tmp"

[build]
  bin = "./tmp/main"
  cmd = "go build -o ./tmp/main ."
  delay = 1000
  exclude_dir = ["assets", "tmp", "vendor"]
  exclude_regex = ["_test.go"]
  include_ext = ["go", "html", "css", "js"]
  kill_delay = "0s"
  log = "build-errors.log"
  send_interrupt = false
  stop_on_error = true

[color]
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[log]
  time = true

[misc]
  clean_on_exit = true
`;
}

function getEnvContent(port) {
  return `# Configurações do servidor
PORT=${port}
APP_ENV=development

# Adicione suas variáveis aqui
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=meu_banco
# DB_USER=usuario
# DB_PASS=senha
`;
}

// ─── README ──────────────────────────────────────────────────────────────────

function getReadmeContent(projectName, port, version, opts = {}) {
  const { withAir, withEnv } = opts;

  const techStack = [
    "- **Go** - Linguagem de programação",
    "- **Fiber** - Framework web rápido",
    "- **Tailwind CSS** - Framework CSS utilitário (via CDN)",
    "- **Font Awesome** - Ícones (via CDN)",
    withAir ? "- **Air** - Hot reload para desenvolvimento" : "",
    withEnv ? "- **godotenv** - Variáveis de ambiente via .env" : "",
  ].filter(Boolean).join("\n");

  const runCmd = withAir ? "air" : "go run main.go";
  const envNote = withEnv ? "\n```bash\n# Configure suas variáveis\ncp .env .env.local\n```\n" : "";
  const airNote = withAir
    ? "\n> **Hot reload:** `air` reinicia automaticamente ao salvar arquivos Go ou HTML.\n> Instale com: `go install github.com/air-verse/air@latest`\n"
    : "";

  return `# ${projectName}

Projeto Go com Fiber, Tailwind CSS e Font Awesome.

## Tecnologias

${techStack}

## Estrutura

\`\`\`
${projectName}/
├── main.go
├── go.mod
├── .gitignore${withEnv ? "\n├── .env" : ""}${withAir ? "\n├── .air.toml" : ""}
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

## Instalação

\`\`\`bash
go mod tidy
${runCmd}
\`\`\`
${envNote}${airNote}
Acesse: http://localhost:${port}

## Recursos

- [Fiber Docs](https://docs.gofiber.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Font Awesome](https://fontawesome.com/search)

---

Gerado com [srfibergo v${version}](https://github.com/SrTermax/srfibergo) por [SrTermax](https://github.com/SrTermax)
`;
}

module.exports = {
  getMainGoContent,
  getGoModContent,
  getGitignoreContent,
  getHomeHandlerContent,
  getPingHandlerContent,
  getConfigContent,
  getLayoutHtmlContent,
  getIndexHtmlContent,
  getStyleCssContent,
  getMainJsContent,
  getAirTomlContent,
  getEnvContent,
  getReadmeContent,
};
