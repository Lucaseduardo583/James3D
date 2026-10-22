/**
 * James 3D - Interactive Engine & Logic
 * Three.js 3D Viewer, Instant Quote Calculator, Portfolio Filter & UX Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initHero3DViewer();
  initBudgetCalculator();
  initPortfolioFilters();
  initTestimonialSlider();
  initFaqAccordion();
  initMobileMenu();
  initScrollEffects();
});

/* ==========================================================================
   1. THREE.JS 3D HERO INTERACTIVE VIEWER
   ========================================================================== */
let scene, camera, renderer, controls, main3dObject;
let isWireframe = false;

function initHero3DViewer() {
  const container = document.getElementById('hero-3d-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 450;
  const height = container.clientHeight || 450;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a101d);

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(3.5, 3.2, 4.5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  // OrbitControls
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 10;
    controls.minDistance = 2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.6;
    controls.enablePan = false;
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);

  // Blue Accent Rim Light
  const blueRim = new THREE.PointLight(0x0ea5e9, 2.5, 10);
  blueRim.position.set(-4, -2, -3);
  scene.add(blueRim);

  // Neon Orange Accent Light
  const orangeGlow = new THREE.PointLight(0xf97316, 2.2, 10);
  orangeGlow.position.set(3, -2, 4);
  scene.add(orangeGlow);

  // 3D Build Plate Grid (Simulates 3D printer bed)
  const gridHelper = new THREE.GridHelper(5, 20, 0x0ea5e9, 0x1e293b);
  gridHelper.position.y = -1.2;
  scene.add(gridHelper);

  // Build the 3D Mechanical Turbine/Bracket Model
  main3dObject = createTechnical3DModel(0xf97316);
  scene.add(main3dObject);

  // Event Listeners for 3D UI Controls
  setup3DControls();

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    if (!container || !renderer || !camera) return;
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  });
}

/**
 * Creates an intricate procedural mechanical turbine/bracket mesh
 */
function createTechnical3DModel(filamentColorHex) {
  const group = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({
    color: filamentColorHex,
    roughness: 0.28,
    metalness: 0.15,
    wireframe: isWireframe
  });

  // Central Core Hub
  const hubGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.4, 32);
  const hub = new THREE.Mesh(hubGeo, material);
  hub.castShadow = true;
  group.add(hub);

  // Inner Central Bore Hole (Dark interior ring)
  const boreGeo = new THREE.CylinderGeometry(0.32, 0.32, 1.42, 32);
  const boreMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
  const bore = new THREE.Mesh(boreGeo, boreMat);
  group.add(bore);

  // Outer Flange Ring
  const ringGeo = new THREE.TorusGeometry(1.4, 0.14, 16, 64);
  ringGeo.rotateX(Math.PI / 2);
  const ring = new THREE.Mesh(ringGeo, material);
  ring.position.y = 0;
  group.add(ring);

  // Aerodynamic Impeller Blades / Mechanical Spokes
  const bladeCount = 8;
  for (let i = 0; i < bladeCount; i++) {
    const angle = (i / bladeCount) * Math.PI * 2;
    const bladeGeo = new THREE.BoxGeometry(0.12, 0.8, 0.95);
    bladeGeo.rotateZ(0.28);
    bladeGeo.rotateY(angle);

    const blade = new THREE.Mesh(bladeGeo, material);
    blade.position.x = Math.cos(angle) * 0.95;
    blade.position.z = Math.sin(angle) * 0.95;
    blade.position.y = 0;
    group.add(blade);
  }

  // Exterior Mechanical Teeth / Mounting Lugs
  const lugCount = 12;
  for (let i = 0; i < lugCount; i++) {
    const angle = (i / lugCount) * Math.PI * 2;
    const lugGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16);
    const lug = new THREE.Mesh(lugGeo, material);
    lug.position.x = Math.cos(angle) * 1.5;
    lug.position.z = Math.sin(angle) * 1.5;
    lug.position.y = 0;
    group.add(lug);
  }

  group.position.y = -0.3;
  return group;
}

/**
 * Filament color switches & wireframe toggle
 */
function setup3DControls() {
  const colorBtns = document.querySelectorAll('.color-btn');
  colorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const hex = parseInt(btn.getAttribute('data-color'), 16);
      if (main3dObject) {
        main3dObject.traverse(child => {
          if (child.isMesh && child.material && child.material.color) {
            // Keep inner dark bore intact
            if (child.geometry.parameters && child.geometry.parameters.radiusTop === 0.32) return;
            child.material.color.setHex(hex);
          }
        });
      }

      // Update ring UI active states
      colorBtns.forEach(b => {
        b.classList.remove('ring-2', 'ring-white/80');
        b.classList.add('ring-1', 'ring-white/20');
      });
      btn.classList.remove('ring-1', 'ring-white/20');
      btn.classList.add('ring-2', 'ring-white/80');
    });
  });

  // Wireframe toggle button
  const wireframeBtn = document.getElementById('toggle-wireframe-btn');
  if (wireframeBtn) {
    wireframeBtn.addEventListener('click', () => {
      isWireframe = !isWireframe;
      if (main3dObject) {
        main3dObject.traverse(child => {
          if (child.isMesh && child.material) {
            child.material.wireframe = isWireframe;
          }
        });
      }
      wireframeBtn.classList.toggle('bg-brand-cyan/20', isWireframe);
      wireframeBtn.classList.toggle('text-brand-cyan', isWireframe);
    });
  }

  // Reset Camera button
  const resetCamBtn = document.getElementById('reset-cam-btn');
  if (resetCamBtn && controls && camera) {
    resetCamBtn.addEventListener('click', () => {
      camera.position.set(3.5, 3.2, 4.5);
      controls.target.set(0, 0, 0);
      controls.update();
    });
  }
}

/* ==========================================================================
   2. SIMULADOR DE ORÇAMENTO RÁPIDO INTERATIVO
   ========================================================================== */
const calculatorState = {
  material: 'pla',
  materialName: 'PLA+ Premium',
  ratePerGram: 0.28,
  infill: 25,
  weight: 80,
  quantity: 1,
  uploadedFile: null,
  detectedVolumeCm3: null
};

const materialRates = {
  pla: { name: 'PLA+ Premium', rate: 0.28, timeMult: 1.0 },
  petg: { name: 'PETG Ultra-Tough', rate: 0.36, timeMult: 1.15 },
  abs: { name: 'ABS High-Impact', rate: 0.42, timeMult: 1.25 },
  resina: { name: 'Resina SLA 8K', rate: 0.88, timeMult: 1.5 }
};

function initBudgetCalculator() {
  const materialBtns = document.querySelectorAll('.material-card');
  const infillSlider = document.getElementById('infill-slider');
  const infillDisplay = document.getElementById('infill-display-val');
  const infillAdvice = document.getElementById('infill-advice');
  const infillPresets = document.querySelectorAll('.infill-preset-btn');
  const weightSlider = document.getElementById('weight-slider');
  const weightDisplay = document.getElementById('weight-display-val');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyVal = document.getElementById('qty-val');

  // Material selection
  materialBtns.forEach(card => {
    card.addEventListener('click', () => {
      materialBtns.forEach(c => {
        c.classList.remove('active', 'border-brand-accent', 'bg-brand-accent/10');
        c.classList.add('border-slate-700/80', 'bg-slate-800/40');
      });
      card.classList.add('active', 'border-brand-accent', 'bg-brand-accent/10');
      card.classList.remove('border-slate-700/80', 'bg-slate-800/40');

      const matKey = card.getAttribute('data-material');
      const matData = materialRates[matKey];
      if (matData) {
        calculatorState.material = matKey;
        calculatorState.materialName = matData.name;
        calculatorState.ratePerGram = matData.rate;
        document.getElementById('selected-material-badge').textContent = matData.name;
        document.getElementById('summary-material').textContent = matData.name;
      }
      recalculateQuote();
    });
  });

  // Infill Slider
  if (infillSlider) {
    infillSlider.addEventListener('input', (e) => {
      setInfill(parseInt(e.target.value, 10));
    });
  }

  // Infill Presets
  infillPresets.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-val'), 10);
      if (infillSlider) infillSlider.value = val;
      setInfill(val);
    });
  });

  function setInfill(val) {
    calculatorState.infill = val;
    let label = `${val}%`;
    let advice = 'Balanço ideal entre custo e integridade para protótipos funcionais.';

    if (val <= 15) {
      label += ' (Baixa / Leve)';
      advice = 'Ideal para maquetes volumosas, protótipos visuais e peças sem esforço mecânico.';
    } else if (val <= 35) {
      label += ' (Padrão)';
      advice = 'Excelente equilíbrio entre resistência mecânica, acabamento e custo.';
    } else if (val <= 75) {
      label += ' (Alta Resistência)';
      advice = 'Recomendado para suportes, encaixes industriais e peças que sofrerão carga.';
    } else {
      label += ' (100% Maciço)';
      advice = 'Máxima robustez mecânica, resistência a impactos severos e roscas usinadas.';
    }

    if (infillDisplay) infillDisplay.textContent = label;
    if (infillAdvice) infillAdvice.textContent = advice;
    document.getElementById('summary-infill').textContent = `${val}%`;
    recalculateQuote();
  }

  // Weight Slider
  if (weightSlider) {
    weightSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      calculatorState.weight = val;
      if (weightDisplay) {
        let label = `~${val}g`;
        if (val < 30) label = `Pequeno (~${val}g)`;
        else if (val < 150) label = `Médio (~${val}g)`;
        else if (val < 350) label = `Grande (~${val}g)`;
        else label = `Industrial (~${val}g)`;
        weightDisplay.textContent = label;
      }
      document.getElementById('summary-weight').textContent = `${val}g`;
      recalculateQuote();
    });
  }

  // Quantity Counter
  if (qtyMinus && qtyPlus && qtyVal) {
    qtyMinus.addEventListener('click', () => {
      if (calculatorState.quantity > 1) {
        calculatorState.quantity--;
        qtyVal.textContent = calculatorState.quantity;
        recalculateQuote();
      }
    });

    qtyPlus.addEventListener('click', () => {
      calculatorState.quantity++;
      qtyVal.textContent = calculatorState.quantity;
      recalculateQuote();
    });
  }

  // Drag & Drop File Upload Handler
  initDropZone();

  // Quote Action Triggers
  initQuoteActions();

  // Initial Calculation
  recalculateQuote();
}

/**
 * Calculates budget dynamically with realistic additive manufacturing metrics
 */
function recalculateQuote() {
  const { material, ratePerGram, infill, weight, quantity } = calculatorState;
  const matInfo = materialRates[material] || materialRates.pla;

  // Base machine setup and slicing fee
  const baseSetupFee = 16.0;

  // Infill weight factor (higher infill increases internal solid plastic)
  const infillMultiplier = 0.8 + (infill / 100) * 0.45;

  // Material cost
  const rawMaterialCost = weight * ratePerGram * infillMultiplier;

  // Total unit cost
  let unitPrice = baseSetupFee + rawMaterialCost;

  // Volume discount for batch orders
  if (quantity >= 10) {
    unitPrice *= 0.85; // 15% discount
  } else if (quantity >= 5) {
    unitPrice *= 0.92; // 8% discount
  }

  const totalPrice = unitPrice * quantity;

  // Print time estimation
  const hoursPerUnit = (weight * (infill / 50) * 0.045 * matInfo.timeMult) + 1.2;
  const totalHours = Math.max(2, Math.round(hoursPerUnit * quantity));

  // Update DOM
  const priceEl = document.getElementById('calculated-price');
  if (priceEl) {
    priceEl.textContent = totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  const timeEl = document.getElementById('calculated-time');
  if (timeEl) {
    if (totalHours <= 6) {
      timeEl.textContent = '4 a 6 horas';
    } else if (totalHours <= 24) {
      timeEl.textContent = `Aprox. ${totalHours} horas (Mesmo dia)`;
    } else {
      const days = Math.ceil(totalHours / 16);
      timeEl.textContent = `Aprox. ${days} dias úteis`;
    }
  }
}

/**
 * Drag and Drop File Handlers with real STL / OBJ parsing inspection
 */
function initDropZone() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const dropIdle = document.getElementById('drop-zone-idle');
  const dropFile = document.getElementById('drop-zone-file');
  const fileNameEl = document.getElementById('uploaded-file-name');
  const fileSizeEl = document.getElementById('uploaded-file-size');
  const removeFileBtn = document.getElementById('remove-file-btn');

  if (!dropZone || !fileInput) return;

  // Drag over states
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('dropzone-active');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('dropzone-active');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) handleUploadedFile(files[0]);
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleUploadedFile(e.target.files[0]);
  });

  if (removeFileBtn) {
    removeFileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      calculatorState.uploadedFile = null;
      fileInput.value = '';
      dropIdle.classList.remove('hidden');
      dropFile.classList.add('hidden');
      showToast('Arquivo Removido', 'Você pode anexar outro arquivo STL ou OBJ.', 'info');
    });
  }

  function handleUploadedFile(file) {
    const validExtensions = ['.stl', '.obj', '.step', '.3mf'];
    const nameLower = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => nameLower.endsWith(ext));

    if (!isValid) {
      showToast('Formato Inválido', 'Por favor envie arquivos .STL, .OBJ, .STEP ou .3MF', 'alert-circle');
      return;
    }

    calculatorState.uploadedFile = file;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = `${sizeMb} MB • Pronto para Fatiamento`;

    dropIdle.classList.add('hidden');
    dropFile.classList.remove('hidden');

    // Auto-adjust simulated weight based on file size heuristic
    const simulatedWeight = Math.min(350, Math.max(35, Math.round(file.size / (1024 * 70))));
    const weightSlider = document.getElementById('weight-slider');
    if (weightSlider) {
      weightSlider.value = simulatedWeight;
      weightSlider.dispatchEvent(new Event('input'));
    }

    showToast('Modelo Carregado com Sucesso!', `${file.name} pronto para análise técnica.`, 'check-circle');

    // If STLLoader is available and file is STL, load it into the 3D hero viewer!
    if (nameLower.endsWith('.stl') && typeof THREE.STLLoader !== 'undefined') {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const loader = new THREE.STLLoader();
          const geometry = loader.parse(e.target.result);
          geometry.center();
          geometry.computeVertexNormals();

          if (main3dObject && scene) {
            scene.remove(main3dObject);
            const mat = new THREE.MeshStandardMaterial({
              color: 0xf97316,
              roughness: 0.3,
              metalness: 0.1,
              wireframe: isWireframe
            });
            const newMesh = new THREE.Mesh(geometry, mat);

            // Scale geometry to fit nicely in the view
            geometry.computeBoundingBox();
            const b = geometry.boundingBox;
            const maxDim = Math.max(b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z);
            const scale = 2.4 / (maxDim || 1);
            newMesh.scale.set(scale, scale, scale);
            newMesh.position.y = 0;

            main3dObject = new THREE.Group();
            main3dObject.add(newMesh);
            scene.add(main3dObject);

            showToast('Visualização 3D Atualizada!', 'Seu modelo STL foi renderizado no visualizador 3D do topo!', 'box');
          }
        } catch (err) {
          console.warn('Erro ao carregar STL customizado:', err);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }
}

/**
 * Prepares the formatted WhatsApp quote message and triggers fireworks/confetti
 */
function initQuoteActions() {
  const sendWhatsAppBtn = document.getElementById('send-whatsapp-btn');
  const emailQuoteBtn = document.getElementById('email-quote-btn');

  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      // Confetti celebration
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#F97316', '#0EA5E9', '#10B981']
        });
      }

      const { materialName, infill, weight, quantity, uploadedFile } = calculatorState;
      const priceText = document.getElementById('calculated-price')?.textContent || '48,00';
      const timeText = document.getElementById('calculated-time')?.textContent || '4 a 6 horas';

      const fileName = uploadedFile ? uploadedFile.name : 'Arquivo será enviado pelo chat';

      const message = 
`Olá, James 3D! 👋
Gostaria de solicitar a validação e orçamento para o meu projeto de impressão 3D:

*DETALHES DO PEDIDO:*
📁 *Arquivo:* ${fileName}
🧱 *Material:* ${materialName}
⚙️ *Preenchimento:* ${infill}%
⚖️ *Peso Estimado:* ~${weight}g
🔢 *Quantidade:* ${quantity} unidade(s)
💰 *Estimativa Simulada:* R$ ${priceText}
⏱️ *Prazo Previsto:* ${timeText}

Podem validar a viabilidade técnica e confirmar o prazo de entrega? Obrigado!`;

      showToast('Abrindo WhatsApp...', 'Conectando com o laboratório da James 3D.', 'message-circle');

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/5511999999999?text=${encodedMessage}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 700);
    });
  }

  if (emailQuoteBtn) {
    emailQuoteBtn.addEventListener('click', () => {
      const { materialName, infill, weight, quantity, uploadedFile } = calculatorState;
      const priceText = document.getElementById('calculated-price')?.textContent || '48,00';
      const fileName = uploadedFile ? uploadedFile.name : 'Arquivo em anexo';

      const subject = encodeURIComponent(`Solicitação de Cotação - James 3D (${materialName})`);
      const body = encodeURIComponent(
`Olá equipe James 3D,

Solicito proposta formal de orçamento com os seguintes parâmetros:

- Arquivo: ${fileName}
- Material: ${materialName}
- Densidade / Infill: ${infill}%
- Peso unitário estimado: ${weight}g
- Quantidade: ${quantity} unidade(s)
- Valor preliminar do simulador: R$ ${priceText}

Aguardo confirmação e dados para pagamento / faturamento.
Atenciosamente.`
      );

      window.location.href = `mailto:contato@james3d.com.br?subject=${subject}&body=${body}`;
    });
  }
}

/* ==========================================================================
   3. FILTROS DO PORTFÓLIO
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-brand-accent', 'text-white', 'shadow-md', 'shadow-brand-accent/30');
        b.classList.add('text-slate-400');
      });
      btn.classList.add('active', 'bg-brand-accent', 'text-white', 'shadow-md', 'shadow-brand-accent/30');
      btn.classList.remove('text-slate-400');

      const filterVal = btn.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          item.style.display = 'block';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease';
            item.style.opacity = '1';
          }, 20);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. CARROSSEL DE DEPOIMENTOS
   ========================================================================== */
function initTestimonialSlider() {
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dots = document.querySelectorAll('.dot-btn');

  if (!track || dots.length === 0) return;

  let currentSlide = 0;
  const totalSlides = dots.length;
  let autoplayTimer;

  function updateSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('bg-brand-accent');
        dot.classList.remove('bg-slate-700');
      } else {
        dot.classList.remove('bg-brand-accent');
        dot.classList.add('bg-slate-700');
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlide(currentSlide + 1);
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlide(currentSlide - 1);
      resetAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateSlide(idx);
      resetAutoplay();
    });
  });

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      updateSlide(currentSlide + 1);
    }, 6000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();
}

/* ==========================================================================
   5. ACCORDION DE PERGUNTAS FREQUENTES (FAQ)
   ========================================================================== */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const icon = trigger.querySelector('.faq-icon');
      const isExpanded = !content.classList.contains('hidden');

      // Close all other FAQs
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

      // If it wasn't open, open it
      if (!isExpanded) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });
}

/* ==========================================================================
   6. MENU MOBILE & HEADER SCROLL
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

function initScrollEffects() {
  const header = document.getElementById('main-header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('bg-[#070B14]/95', 'shadow-xl', 'border-brand-border');
    } else {
      header.classList.remove('bg-[#070B14]/95', 'shadow-xl', 'border-brand-border');
    }
  });
}

/* ==========================================================================
   7. TOAST NOTIFICATION HELPER
   ========================================================================== */
let toastTimeout;
function showToast(title, message, iconType = 'info') {
  const toast = document.getElementById('toast');
  const titleEl = document.getElementById('toast-title');
  const msgEl = document.getElementById('toast-msg');
  const iconEl = document.getElementById('toast-icon');

  if (!toast || !titleEl || !msgEl) return;

  titleEl.textContent = title;
  msgEl.textContent = message;

  if (iconEl && typeof lucide !== 'undefined') {
    iconEl.setAttribute('data-lucide', iconType);
    lucide.createIcons();
  }

  clearTimeout(toastTimeout);
  toast.classList.remove('translate-y-[-150%]', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[-150%]', 'opacity-0');
  }, 4500);
}

