# James 3D - Landing Page Profissional de Manufatura Aditiva

> **"Transformando ideias em realidade tridimensional"**

Landing page moderna, responsiva (Mobile-First) e de alta performance criada para a **James 3D**, empresa especializada em serviços, prototipagem e peças em Impressão 3D FDM e Resina SLA.

---

## 🚀 Destaques & Funcionalidades

### 1. 🎨 Identidade Visual & Design System
- **Paleta de Cores Tecnológica:** Fundo escuro grafite (`#070B14`), azul tecnológico (`#0EA5E9`), toques em laranja neon filamento (`#F97316`) e dourado seda (`#F59E0B`).
- **Glassmorphism & Neumorfismo:** Efeitos de desfoque de fundo (`backdrop-blur`), bordas sutis translúcidas e iluminação ambiente cibernética.
- **Tipografia Moderna:** Combinação das fontes *Space Grotesk* para títulos de impacto, *Plus Jakarta Sans* para legibilidade de texto e *JetBrains Mono* para métricas técnicas e tags.

### 2. 🧊 Experiência 3D Interativa em Tempo Real (Three.js)
- **Visualizador 3D no Hero:**
  - Renderização de peça mecânica complexa com iluminação dinâmica (luz ambiente + luz direcional + rim lights azul e laranja).
  - **OrbitControls:** O usuário pode clicar e arrastar para girar a peça em 360°, dar zoom e inspecionar detalhes.
  - **Seletor de Filamento em Tempo Real:** Botões para trocar a cor do filamento instantaneamente (Laranja Neon, Azul Cyber, Dourado Silk e Branco Técnico).
  - **Modo Malha (Wireframe):** Alternância entre visualização sólida e estrutura de arame/polígonos.
  - **Cama de Impressão (Build Plate) & Linha de Laser:** Efeito de escaneamento a laser simulando a deposição de camadas.
  - **Suporte a Arquivos .STL Próprios:** Ao arrastar um arquivo `.stl` no simulador, o Three.js STLLoader renderiza a peça do próprio cliente na tela!

### 3. ⚡ Simulador de Orçamento Imediato
- **Seleção de Materiais Técnicos:**
  - **PLA+ Premium:** Excelente acabamento estético, ideal para maquetes e protótipos visuais.
  - **PETG Ultra-Tough:** Resistente a intempéries, raios UV e impactos leves.
  - **ABS High-Impact:** Alta resistência mecânica e térmica (até 100°C), para peças automotivas.
  - **Resina SLA 8K:** Resolução microscópica (camadas de 0.05mm), sem linhas visíveis.
- **Controle de Preenchimento (Infill):** Slider com presets inteligentes (15% Baixa, 30% Média, 60% Alta, 100% Sólido) e orientações técnicas de engenharia.
- **Estimador de Peso & Volume:** Ajuste deslizante com cálculo de consumo em gramas.
- **Área Drag & Drop para Arquivos 3D:** Suporte a arquivos `.STL`, `.OBJ`, `.STEP` e `.3MF` com validação de formato e tamanho.
- **Cálculo em Tempo Real:** Exibe investimento estimado em R$, tempo de impressão previsto e desconto progressivo por quantidade.
- **Integração Direta com WhatsApp:** O botão principal dispara uma chuva de confetes (`canvas-confetti`) e abre a conversa no WhatsApp já com a mensagem totalmente preenchida e formatada com todos os dados da cotação.
- **Opção de Cotação por E-mail:** Gera e-mail pré-formatado para solicitações formais B2B.

### 4. 🛠️ Seção de Serviços Especializados
- **Prototipagem Rápida:** Ciclos de 24 horas para validação de forma e função.
- **Peças Técnicas Finais:** Produção de componentes de alta carga e substituição de peças descontinuadas.
- **Maquetes & Colecionáveis:** Detalhes em Resina 8K para arquitetura, dioramas e colecionáveis.
- **Consultoria & Manutenção:** Calibração, upgrades de hotend/bico e treinamentos.

### 5. 🎯 Portfólio com Filtros Dinâmicos
- Grid responsivo com cartões informativos e fotos em alta resolução.
- Filtros por categoria: *Todos*, *Técnico & Peças*, *Protótipos*, *Arte & Colecionáveis*.
- Efeitos suaves de transição e zoom no hover.

### 6. ⭐ Depoimentos & Avaliações
- Carrossel interativo com avaliações de clientes reais, estrelas, depoimentos detalhados, indicadores por pontos (*dots*) e transição automática.

### 7. ❓ FAQ (Perguntas Frequentes)
- Accordion sanfonado para dúvidas recorrentes (formatos aceitos, prazos, escolha de materiais e assinatura de NDA/sigilo).

### 8. 🟢 Botão Flutuante do WhatsApp
- Botão no canto inferior direito com anel de pulso (*pulse animation*), balão de notificação ("Orçamento em 15 min") e link direto.

---

## 📁 Estrutura de Arquivos

```
Antigravity/
├── index.html        # Estrutura semântica HTML5 com Tailwind CSS
├── styles.css        # Animações, glassmorphism, estilos de sliders e laser scan
├── script.js         # Lógica Three.js, calculador de orçamento, carrossel e filtros
└── README.md         # Documentação completa do projeto
```

---

## 💻 Como Visualizar / Testar Localmente

### Opção 1: Abrir diretamente no Navegador
Dê um duplo clique no arquivo `index.html` ou clique com o botão direito e selecione seu navegador de preferência (Google Chrome, Microsoft Edge, Firefox, Brave, etc.).

### Opção 2: Via Servidor Local Rápido (Recomendado para carregar STLs sem restrições de CORS)
Se tiver Node.js instalado:
```bash
# Iniciar servidor estático leve
npx serve .
# Ou usando python:
python -m http.server 8000
```
Em seguida, acesse no navegador: `http://localhost:3000` ou `http://localhost:8000`.

---

## ⚙️ Personalização Rápida

1. **Alterar o Número do WhatsApp:**
   - No arquivo `index.html` e `script.js`, procure por `5511999999999` e substitua pelo número oficial com DDD (ex: `5511987654321`).
2. **Alterar o E-mail de Contato:**
   - Procure por `contato@james3d.com.br` e substitua pelo seu e-mail corporativo.
3. **Ajustar Taxas do Simulador:**
   - No arquivo `script.js`, ajuste a constante `materialRates`:
     ```javascript
     const materialRates = {
       pla: { name: 'PLA+ Premium', rate: 0.28, timeMult: 1.0 },
       petg: { name: 'PETG Ultra-Tough', rate: 0.36, timeMult: 1.15 },
       abs: { name: 'ABS High-Impact', rate: 0.42, timeMult: 1.25 },
       resina: { name: 'Resina SLA 8K', rate: 0.88, timeMult: 1.5 }
     };
     ```

---

## 🌐 Publicação / Deploy Fácil

A aplicação é 100% estática (JAMstack) e pronta para hospedagem gratuita e ultrarrápida em:
- **Vercel:** Basta arrastar a pasta ou conectar ao GitHub.
- **Netlify:** Drag & Drop da pasta do projeto.
- **GitHub Pages:** Ativar na aba *Settings > Pages* do repositório.

