# Jornada do Cooperado & BWS_HELP — Roteiro de copy e layout (21 slides)

**Público:** consultoria e atendimento · **Tom:** claro, objetivo, instrutivo · **Palco:** 1920×1080
**Ícones:** lucide-react (outline 1.5–2 px) · **Paleta:** verde `#104726` / `#28972E` ancoram; lima `#AFBF30` para progresso; laranja/dourado `#DCA349` só para alerta.

> Itens marcados com **[CONFIRMAR]** dependem de print ou dado real do sistema. Não foram inventados.

---

## MÓDULO 1 · JORNADA DO COOPERADO

### Slide 1 — Capa
**Layout:** `capa` · fundo verde `#104726` com triângulos arredondados flutuando.

- **Título:** Jornada do Cooperado & BWS_HELP
- **Subtítulo:** Soluções inteligentes para problemas comuns.
- **Rodapé:** Treinamento interno · Consultoria e Atendimento · Outubro 2026
- **Visual:** logo branco no canto superior esquerdo; dois ícones grandes em contorno lima unidos por uma linha: `Route` (Jornada) + `LifeBuoy` (Help).
- **Animação:** título entra em stagger; a linha entre os ícones se desenha.

---

### Slide 2 — Agenda
**Layout:** `process` com 2 nós.

- **Título:** O que vamos ver hoje?
- **Fase 1 · Jornada do Cooperado** — Diagnóstico rápido dentro do atendimento.
- **Fase 2 · BWS_HELP** — Chamados de TI com prazo e rastreio.
- **Visual:** dois cards grandes numerados `01` e `02`, ligados por seta. Ícones `Route` e `LifeBuoy`.
- **Animação:** nó 01 acende → linha corre → nó 02 acende.

---

### Slide 3 — O problema e a solução
**Layout:** `compare` (antes × depois).

- **Título:** Qual dor a Jornada do Cooperado resolve?
- **Antes (cinza, ícone `Hourglass`):**
  - Erro sem explicação trava o atendimento.
  - Consultor depende da TI para entender o problema.
- **Depois (verde, ícone `Zap`):**
  - Resposta rápida para problemas comuns.
  - Diagnóstico e recomendação na tela.
- **Selo "Onde fica":** `MapPin` Novo módulo na área de atendimento do **BWS_365**.
- **Animação:** lado "antes" esmaece quando o lado "depois" entra (step 2).

---

### Slides 4 a 6 — Como utilizar a ferramenta?
**Layout:** `product` · **mockup de tablet** (moldura `#1F2937`, raio 32 px, leve inclinação 3D) com a tela BWS recriada (tokens DESIGN.md).
**Regra de sobreposição (z-index):**
- `z-0` tela do tablet (esmaecida a 40% quando há destaque)
- `z-10` recorte destacado da área (spotlight com borda colorida)
- `z-20` **callout** fora do tablet, ligado ao recorte por linha pontilhada
- Cada slide tem 2 telas, alternadas por `step` (o tablet troca de tela com crossfade).

#### Slide 4 — Início e histórico
- **Título:** Do atendimento à Jornada em 1 clique
- **Tela 1 · Início** — callout `MousePointerClick`
  - Inicie o atendimento.
  - Clique no card **"Jornada do Cooperado"**.
- **Tela 2 · Já acessou o app** — callout `History`
  - Veja as **3 últimas sessões** no app Barracred.
  - Cada sessão mostra o status do que aconteceu.
- **Visual:** cursor animado clica no card; depois 3 linhas de sessão entram em cascata.

#### Slide 5 — Alerta e sucesso
- **Título:** A cor já diz o que fazer
- **Tela 3 · Alerta (laranja `#DCA349` / tint âmbar)** — callout `AlertTriangle`
  - Clique na sessão em laranja.
  - Veja o **diagnóstico** do erro.
  - Siga a **recomendação** de solução.
- **Tela 4 · Sucesso (verde `#28972E`)** — callout `CheckCircle2`
  - Tudo certo nesta sessão.
  - Nenhuma ação necessária.
- **Visual:** a sessão laranja "expande" em um painel lateral (z-20) com dois blocos: *Diagnóstico* e *Recomendação*.

#### Slide 6 — Sem acesso e sem informação
- **Título:** Quando não há dados, abra chamado
- **Tela 5 · Nunca acessou** — callout `UserX`
  - Cooperado ainda não usou o app.
  - Oriente o primeiro acesso.
- **Tela 6 · Sem informações** — callout `FileQuestion`
  - Dados insuficientes para diagnóstico.
  - Recomendação: **Abrir Chamado**.
- **Visual:** na Tela 6, botão "Abrir Chamado" pulsa uma vez (ponte para o slide 8).

---

### Slide 7 — Como funciona por trás das telas
**Layout:** `process` horizontal (3 nós).

- **Título:** A Jornada lê o que o app registra
- **1 · Ação do cooperado** (`Smartphone`) — Ele usa o app Barracred.
- **2 · Registro em log** (`ScrollText`) — Cada passo vira um registro.
- **3 · Diagnóstico** (`Cpu`) — Os logs viram status na Jornada.
- **Faixa de destaque:** **100% baseada em logs.** Sem ação do cooperado, não há dado.
- **Animação:** pontos de dados "viajam" pela linha entre os nós.

---

### Slide 8 — Abrir chamado via Jornada (onde)
**Layout:** `product` (tablet + 3 badges).

- **Título:** Chamado a um clique, em qualquer sessão
- **Badges sobre as sessões:** Erro · Alerta · Sucesso — todos com botão **"Abrir Chamado"**.
- **Apoio:** Viu algo estranho? Registre na hora.
- **Visual:** três linhas de sessão (vermelho, laranja, verde) com o mesmo botão destacado por spotlight. Ícone `TicketPlus`.

### Slide 9 — Abrir chamado via Jornada (passo a passo)
**Layout:** `process` em 3 passos com mini-mockup em cada um.

- **Título:** 3 passos para abrir o chamado
- **1 · Clique** em "Abrir Chamado" (`MousePointerClick`)
- **2 · Descreva** a observação com detalhes (`PencilLine`)
- **3 · Envie** (`Send`)
- **Dica (chip lima):** Quanto mais detalhe, mais rápida a solução.
- **Animação:** cada passo acende por step; no passo 2 o texto "digita" no campo.

---

### Slide 10 — Validação do chamado
**Layout:** `product` · mockup de cliente de e-mail.

- **Título:** Chegou o e-mail? Chamado aberto.
- **Itens:**
  - Confirmação chega logo após a criação.
  - Guarde o **número do chamado**.
- **Visual:** janela de e-mail recriada (remetente, assunto, nº do chamado) com envelope `MailCheck` entrando. **[CONFIRMAR]** print real para copiar remetente e assunto.
- **Animação:** e-mail "cai" na caixa de entrada; badge "Novo" aparece.

---

## MÓDULO 2 · BWS_HELP

### Slide 11 — Capa de transição
**Layout:** `capa` (variante transição) · fundo verde escuro.

- **Selo:** Fase 2
- **Título:** BWS_HELP
- **Linha de apoio:** Seu pedido para a TI, com prazo e rastreio.
- **Visual:** ícone `LifeBuoy` grande em contorno lima; triângulos com parallax.

---

### Slide 12 — Conceitos base
**Layout:** 2 cards lado a lado (definição de dicionário).

- **Título:** Duas palavras que você vai ouvir
- **Card 1 · Help Desk** (`Headset`)
  - Canal único para pedir ajuda à TI.
  - Todo pedido vira um chamado registrado.
- **Card 2 · OLA / SLA** (`Timer`)
  - **SLA:** prazo combinado para resolver o chamado.
  - **OLA:** acordo interno entre áreas para cumprir esse prazo.
- **Animação:** cards viram (flip) revelando a definição.

---

### Slide 13 — Métricas e evolução (setembro)
**Layout:** `chart` + `kpis`.

- **Título:** Setembro em números
- **Faixa de KPIs (3 tiles, CountUp):** Chamados abertos · Resolvidos no prazo (%) · Tempo médio — **[CONFIRMAR valores]**
- **Gráfico principal (esquerda, 60%):** barras por semana/dia = volume de chamados + linha = % no prazo. Barras verdes `#28972E`, linha lima `#AFBF30`.
- **Gráfico secundário (direita, 40%):** barras horizontais por **tipo de chamado**, ordenadas do maior para o menor.
- **Insight (1 linha):** [inserir a leitura principal dos dados].
- **Animação:** barras crescem; linha se desenha; hover mostra valor.

---

### Slide 14 — Interface do BWS_HELP
**Layout:** `product` · tela "Caixa do Help" recriada (ref. `03-help-desk.png`).

- **Título:** Conheça a Caixa do Help
- **Callouts numerados sobre a tela:**
  1. Indicadores do momento (`Gauge`)
  2. Lista de chamados com prioridade (`ListChecks`)
  3. Botão de novo chamado (`Plus`)
  4. Busca e filtros (`Search`)
- **Visual:** mini-KPIs com barra esquerda, lista com badge de prioridade. **[CONFIRMAR]** nomes exatos das áreas.
- **Animação:** spotlight percorre 1 → 4 por step.

---

### Slide 15 — Abertura de chamados
**Layout:** `process` em 4 passos (vale para qualquer categoria).

- **Título:** Abra um chamado em 4 passos
- **1 · Novo chamado** — Clique em "+ Novo" (`Plus`)
- **2 · Categoria** — Escolha o assunto certo (`LayoutGrid`)
- **3 · Detalhe** — Descreva e anexe prints (`Paperclip`)
- **4 · Enviar** — Confirme o envio (`Send`)
- **Visual:** cada passo com mini-recorte da tela. **[CONFIRMAR]** rótulos reais dos botões.

---

### Slide 16 — Notificação BWS
**Layout:** `product` · mockup de e-mail (mesmo componente do slide 10, para criar padrão).

- **Título:** Aberto? O e-mail confirma.
- **Itens:**
  - E-mail automático na abertura.
  - Traz número e categoria do chamado.
- **Visual:** `MailCheck` + e-mail recriado. **[CONFIRMAR]** print real.

---

### Slide 17 — Acompanhamento
**Layout:** `product` + linha do tempo lateral.

- **Título:** Acompanhe sem precisar perguntar
- **Onde:** Caixa do Help → **Meus chamados** (`Inbox`) **[CONFIRMAR nome do menu]**
- **O que ver:**
  - Status atual (`Activity`)
  - Histórico de respostas (`MessagesSquare`)
  - Prazo do SLA (`Timer`)
- **Visual:** card de chamado expandido com timeline vertical; o ponto atual pulsa.

---

### Slide 18 — Status dos chamados
**Layout:** legenda em badges tint (DESIGN.md), uma linha por status.

- **Título:** O que cada status significa
- **Sugestão de legenda** (ajustar aos status reais do sistema) **[CONFIRMAR]**:
  - 🔵 **Aberto** — Chamado registrado, aguardando triagem.
  - 🟢 **Em atendimento** — TI já está trabalhando.
  - 🟡 **Aguardando você** — Falta informação sua.
  - ✅ **Resolvido / Fechado** — Solução entregue.
- **Visual:** badge + ícone (`CircleDot`, `Loader`, `UserRoundCheck`, `CheckCircle2`) + frase de 1 linha. Máx. 4 por tela; se houver mais, dividir em steps.
- **Animação:** badges entram em cascata.

---

### Slide 19 — Avaliação
**Layout:** `product` · tela de avaliação recriada.

- **Título:** Sua nota melhora o atendimento
- **Itens:**
  - Ao fechar o chamado, avalie o atendimento.
  - Leva segundos e orienta melhorias.
- **Visual:** 5 estrelas (`Star`) que acendem uma a uma + campo de comentário. **[CONFIRMAR]** escala real (estrelas, notas ou emojis).

---

### Slide 20 — E o Teams?
**Layout:** `statement` · fundo verde escuro.

- **Título (display):** "E aí, nunca mais usarei o Teams para falar com a TI?"
- **Resposta (step 2):** Usa, sim. Mas **depois** do chamado.
- **Regra de ouro (faixa lima):** `TicketPlus` 1º Abra o chamado → `MessageCircle` 2º Teams só se for prioridade.
- **Animação:** a pergunta entra; pausa; a resposta aparece por step.

### Slide 21 — Combinado de comunicação
**Layout:** `compare` (Faça × Evite) + rodapé com frase-mãe.

- **Título:** Cada coisa no seu lugar
- **Chamado** (`Ticket`) — Todo pedido começa aqui.
- **Teams** (`MessageCircle`) — Apenas casos prioritários. O resto segue a fila.
- **SharePoint** (`FolderOpen`) — Arquivos e planilhas pesadas.
- **Evite (chip vermelho tint):** anexos pesados no chat do Teams.
- **Fechamento:** *Cooperar para transformar vidas do nosso cooperado.*
- **Animação:** três colunas entram em stagger; arquivo "pula" do chat para a pasta SharePoint.

---

## Pendências para gerar o projeto
- Prints reais: telas da Jornada (1–6), e-mails de confirmação (slides 10 e 16), Caixa do Help, tela de avaliação.
- Dados de setembro (slide 13).
- Lista oficial de status (slide 18) e rótulos dos botões (slide 15).
