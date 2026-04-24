let configSelection = {};
let pcRotation = -18;
let pcTiltX = -6;

function loadConfig() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem('ermak_config') || '{}'); } catch { saved = {}; }
    for (const step of CONFIG_STEPS) {
        const optId = saved[step.id];
        if (optId) {
            const opt = step.options.find(o => o.id === optId);
            if (opt) configSelection[step.id] = opt;
        }
    }
}
loadConfig();

const LAYER_MAP = {
    case: 'case', cpu: 'cpu', mb: 'mb',
    cooler: 'cooler', ram: 'ram', gpu: 'gpu', ssd: 'ssd', psu: 'psu'
};

const TOOLTIP_LABELS = {
    case: 'Корпус', platform: 'Платформа', cpu: 'Процессор', mb: 'Мат. плата',
    cooler: 'Охлаждение', ram: 'Память', gpu: 'Видеокарта', ssd: 'Накопитель', psu: 'Блок питания'
};

function initConfigurator() {
    renderConfig();
    updatePCVisualization();
    initParticles();
    initRotation();
    initPCTooltips();
}

function initParticles() {
    const container = document.getElementById('pc-particles');
    if (!container) return;
    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'pc-particle';
        p.style.cssText = `left:${10+Math.random()*80}%;top:${10+Math.random()*80}%;--dur:${4+Math.random()*6}s;--delay:${Math.random()*5}s;--dx:${-30+Math.random()*60}px;--dy:${-60+Math.random()*30}px;--dx2:${-40+Math.random()*80}px;--dy2:${-90+Math.random()*40}px;width:${1.5+Math.random()*2.5}px;height:${1.5+Math.random()*2.5}px;`;
        container.appendChild(p);
    }
}

function initRotation() {
    const rotateBtn = document.getElementById('builder-rotate');
    if (rotateBtn) {
        rotateBtn.addEventListener('click', () => {
            pcRotation += 30;
            updateModelTransform();
        });
    }

    let isDragging = false, startX, startY;
    const stage = document.querySelector('.config-stage');
    if (!stage) return;

    stage.addEventListener('mousedown', e => {
        if (e.target.closest('.pc-hover-zone') || e.target.closest('.config-stage-empty')) return;
        isDragging = true; startX = e.clientX; startY = e.clientY;
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        pcRotation += (e.clientX - startX) * 0.3;
        pcTiltX = Math.max(-30, Math.min(10, pcTiltX - (e.clientY - startY) * 0.15));
        startX = e.clientX; startY = e.clientY;
        updateModelTransform();
    });
    document.addEventListener('mouseup', () => { isDragging = false; });
}

function updateModelTransform() {
    const floatWrap = document.querySelector('.pc-3d-float');
    const model = document.getElementById('pc-3d-model');
    if (model) model.style.transform = `rotateX(${pcTiltX}deg) rotateY(${pcRotation}deg)`;
}

function initPCTooltips() {
    const tooltip = document.getElementById('pc-tooltip');
    const wrapper = document.querySelector('.config-pc-wrapper');
    if (!tooltip || !wrapper) return;

    document.querySelectorAll('.pc-hover-zone').forEach(zone => {
        zone.addEventListener('mouseenter', () => {
            const stepId = zone.dataset.step;
            const sel = configSelection[stepId];
            if (sel) {
                tooltip.innerHTML = `<span class="pc-tooltip-label">${TOOLTIP_LABELS[stepId]||stepId}</span><span class="pc-tooltip-name">${sel.name}</span>`;
                tooltip.classList.add('visible');
            }
        });
        zone.addEventListener('mousemove', e => {
            const rect = wrapper.getBoundingClientRect();
            let x = e.clientX - rect.left + 16;
            let y = e.clientY - rect.top - 50;
            if (x + 220 > rect.width) x = e.clientX - rect.left - 220;
            if (y < 10) y = e.clientY - rect.top + 20;
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        });
        zone.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
    });
}

function isStepLocked(stepId) {
    const p = configSelection.platform?.platform;
    if (stepId === 'case') return false;
    if (stepId === 'platform') return !configSelection.case;
    if (stepId === 'cpu' || stepId === 'mb') return !p;
    if (stepId === 'cooler') return !configSelection.cpu;
    if (['ram','gpu','ssd','psu'].includes(stepId)) return !p;
    return false;
}

function getLockMessage(stepId) {
    if (stepId === 'platform') return 'Сначала выберите корпус';
    if (stepId === 'cpu' || stepId === 'mb') return 'Сначала выберите платформу';
    if (stepId === 'cooler') return 'Сначала выберите процессор';
    if (['ram','gpu','ssd','psu'].includes(stepId)) return 'Сначала выберите платформу';
    return '';
}

function getCompatibilityWarnings(stepId) {
    const cpu = configSelection.cpu, gpu = configSelection.gpu;
    const cooler = configSelection.cooler, psu = configSelection.psu;
    const caseOpt = configSelection.case;
    const warnings = [];
    if (stepId === 'mb' && configSelection.mb && caseOpt && configSelection.mb.formFactor === 'EATX' && !caseOpt.supportsEATX) {
        warnings.push(`${configSelection.mb.name} — форм-фактор E-ATX. Корпус ${caseOpt.name} не поддерживает E-ATX.`);
    }
    if (stepId === 'gpu' && gpu && caseOpt && gpu.gpuLen && caseOpt.maxGpuLen && gpu.gpuLen > caseOpt.maxGpuLen) {
        warnings.push(`${gpu.name} (${gpu.gpuLen} мм) не влезет в ${caseOpt.name} (макс. ${caseOpt.maxGpuLen} мм).`);
    }
    if (stepId === 'case' && caseOpt && configSelection.mb && configSelection.mb.formFactor === 'EATX' && !caseOpt.supportsEATX) {
        warnings.push(`Материнская плата (${configSelection.mb.name}) — E-ATX. Этот корпус её не поддерживает.`);
    }
    if (stepId === 'case' && caseOpt && configSelection.gpu && configSelection.gpu.gpuLen && caseOpt.maxGpuLen && configSelection.gpu.gpuLen > caseOpt.maxGpuLen) {
        warnings.push(`Видеокарта (${configSelection.gpu.name}, ${configSelection.gpu.gpuLen} мм) не влезет (макс. ${caseOpt.maxGpuLen} мм).`);
    }
    if (stepId === 'cooler' && cpu && cooler && cpu.tdp > cooler.maxTdp) {
        warnings.push(`Кулер не справится с ${cpu.name} (TDP ${cpu.tdp} Вт).`);
    }
    if (stepId === 'psu' && gpu && cpu && psu) {
        const needed = (gpu.power||0) + (cpu.tdp||0) + 150;
        if (psu.watts < needed)
            warnings.push(`Мощности ${psu.watts}W может не хватить. Рекомендуем минимум ${Math.ceil(needed/50)*50}W.`);
    }
    return warnings;
}

function hasAnyWarnings() {
    for (const step of CONFIG_STEPS) {
        if (getCompatibilityWarnings(step.id).length > 0) return true;
    }
    return false;
}

function renderConfig() {
    const platform = configSelection.platform?.platform;
    const cpu = configSelection.cpu, gpu = configSelection.gpu;
    const cooler = configSelection.cooler, psu = configSelection.psu;
    const el = document.getElementById('config-sections');
    if (!el) return;

    el.innerHTML = CONFIG_STEPS.map((step, i) => {
        let opts = step.options.filter(opt => step.id === 'platform' || !opt.platform || opt.platform === platform);
        const isLocked = isStepLocked(step.id);
        const warns = getCompatibilityWarnings(step.id);
        const warning = warns.length ? warns.map(w => `<div class="config-warn">⚠ ${w}</div>`).join('') : '';
        const done = configSelection[step.id] && !isLocked;
        return `<div class="config-section ${isLocked?'locked':''} ${done?'completed':''}" style="animation-delay:${i*60}ms">
            <div class="config-section-head">
                <div class="config-section-icon ${done?'done':''}">${done?'✓':step.icon}</div>
                <div><h3><span class="config-section-num">Шаг ${String(i+1).padStart(2,'0')}</span>${step.title}</h3><p>${step.desc}</p></div>
            </div>
            ${isLocked?`<div class="config-lock-msg">${getLockMessage(step.id)}</div>`:`
            <div class="config-options">${opts.map(opt=>{
                const sel=configSelection[step.id]?.id===opt.id;
                return `<div class="config-option ${sel?'selected':''}" onclick="selectConfigOption('${step.id}','${opt.id}')">
                    <div class="config-opt-left"><div class="config-opt-name">${opt.name}${opt.badge?`<span class="config-opt-badge">${opt.badge}</span>`:''}</div><div class="config-opt-desc">${opt.desc}</div></div>
                    <div class="config-opt-price">${opt.price===0?'включено':'+'+formatPrice(opt.price)+' ₽'}</div>
                </div>`;
            }).join('')}</div>${warning}`}
        </div>`;
    }).join('');

    renderConfigSummary(); updatePCVisualization(); updatePartsTicker(); updateProgress();
}

function selectConfigOption(stepId, optId) {
    const step = CONFIG_STEPS.find(s=>s.id===stepId);
    const opt = step.options.find(o=>o.id===optId);
    if (stepId==='platform' && configSelection.platform && configSelection.platform.id!==optId)
        ['cpu','mb','cooler'].forEach(k=>delete configSelection[k]);
    const was = configSelection[stepId]?.id===optId;
    configSelection[stepId] = opt;
    saveConfig();
    renderConfig();
    if (!was) { animateLayerIn(stepId); flashPrice(); }
}

function saveConfig() {
    const ids = {};
    for (const key in configSelection) { ids[key] = configSelection[key].id; }
    localStorage.setItem('ermak_config', JSON.stringify(ids));
}

function resetConfig() {
    configSelection = {};
    saveConfig();
    pcRotation = -18;
    pcTiltX = -6;
    updateModelTransform();
    renderConfig();
    const empty = document.getElementById('stage-empty');
    if (empty) empty.classList.remove('hidden');
    const glow = document.getElementById('pc-ambient-glow');
    if (glow) glow.classList.remove('intense');
    const ref = document.getElementById('pc-reflection');
    if (ref) ref.classList.remove('visible');
}

function animateLayerIn(stepId) {
    const n = LAYER_MAP[stepId]; if (!n) return;
    document.querySelectorAll(`.pc-layer-3d[data-layer="${n}"]`).forEach(l=>{
        l.classList.remove('visible'); void l.offsetWidth;
        setTimeout(()=>l.classList.add('visible'),50);
    });
    const e=document.getElementById('stage-empty');
    if(e&&Object.keys(configSelection).length>0) e.classList.add('hidden');
}

function flashPrice() {
    const t=document.getElementById('config-total'); if(!t) return;
    t.classList.remove('price-flash'); void t.offsetWidth; t.classList.add('price-flash');
}

function updatePCVisualization() {
    document.querySelectorAll('.pc-layer-3d').forEach(l=>{
        const n=l.dataset.layer;
        const s=Object.keys(LAYER_MAP).find(k=>LAYER_MAP[k]===n);
        if(s&&configSelection[s]) l.classList.add('visible'); else l.classList.remove('visible');
    });
    const gp=document.querySelector('.pc-glass-panel');
    if(gp){ if(configSelection.case) gp.classList.add('visible'); else gp.classList.remove('visible'); }
    document.querySelectorAll('.pc-hover-zone').forEach(z=>{
        const s=z.dataset.step;
        if(configSelection[s]) z.classList.add('active'); else z.classList.remove('active');
    });
    const empty=document.getElementById('stage-empty');
    if(empty){ if(Object.keys(configSelection).length>0) empty.classList.add('hidden'); else empty.classList.remove('hidden'); }
    const glow=document.getElementById('pc-ambient-glow');
    if(glow){ if(CONFIG_STEPS.every(s=>configSelection[s.id])) glow.classList.add('intense'); else glow.classList.remove('intense'); }
    const ref=document.getElementById('pc-reflection');
    if(ref){ if(configSelection.case) ref.classList.add('visible'); else ref.classList.remove('visible'); }
}

function updatePartsTicker() {
    const t=document.getElementById('parts-ticker'); if(!t) return;
    const sel=CONFIG_STEPS.filter(s=>configSelection[s.id]&&s.id!=='platform').map(s=>({step:s,opt:configSelection[s.id]}));
    if(!sel.length){t.innerHTML='';return;}
    t.innerHTML=sel.map(x=>`<span class="part-chip">${x.step.icon} ${x.opt.name.split(/[(\s—]/)[0]}</span>`).join('');
}

function updateProgress() {
    const total=CONFIG_STEPS.length, done=Object.keys(configSelection).length;
    const pct=Math.round(done/total*100);
    const bar=document.getElementById('config-progress-bar');
    const pe=document.getElementById('config-progress-percent');
    const te=document.getElementById('config-progress-text');
    if(bar) bar.style.width=pct+'%';
    if(pe) pe.textContent=pct+'%';
    if(te){ if(!done) te.textContent='Шаг 1 из '+total; else if(done===total) te.textContent='Готово к заказу'; else te.textContent=`Шаг ${done+1} из ${total}`; }
}

function renderConfigSummary() {
    const sel=CONFIG_STEPS.map(s=>({step:s,opt:configSelection[s.id]})).filter(x=>x.opt);
    const ct=sel.reduce((s,x)=>s+(x.opt.price||0),0);
    const all=sel.length===CONFIG_STEPS.length;
    const total=all?ct+ASSEMBLY_FEE:ct;
    const html=sel.length===0?'<p class="config-empty">Начните с выбора корпуса</p>'
        :sel.filter(x=>x.step.id!=='platform').map(x=>`<div class="config-summary-row">
            <span class="label">${x.step.title}</span><span class="val">${x.opt.name.split('(')[0].trim()}</span>
            <span class="val-price">${x.opt.price>0?formatPrice(x.opt.price)+' ₽':'—'}</span></div>`).join('')
        +(all?`<div class="config-summary-row fee"><span class="label">Сборка + тест 48ч</span><span class="val">включено</span><span class="val-price">${formatPrice(ASSEMBLY_FEE)} ₽</span></div>`:'');
    document.getElementById('config-summary-list').innerHTML=html;
    document.getElementById('config-total').textContent=formatPrice(total)+' ₽';
    const btn=document.getElementById('config-action-btn');
    if(btn){
        const blocked = hasAnyWarnings();
        if(all && !blocked){btn.textContent='Добавить в корзину →';btn.disabled=false;}
        else if(blocked){btn.textContent='Есть проблемы совместимости';btn.disabled=true;}
        else{btn.textContent=`Ещё ${CONFIG_STEPS.length-sel.length} из ${CONFIG_STEPS.length}`;btn.disabled=true;}
    }
}

function addConfigToCart() {
    const sel=CONFIG_STEPS.map(s=>({step:s,opt:configSelection[s.id]})).filter(x=>x.opt);
    if(sel.length<CONFIG_STEPS.length){showToast('Выберите все комплектующие',true);return;}
    const ct=sel.reduce((s,x)=>s+(x.opt.price||0),0);
    const total=ct+ASSEMBLY_FEE;
    const id='custom_'+Date.now();
    const customProduct = {
        id: id,
        name: 'Сборка под заказ',
        catName: configSelection.platform.name,
        price: total,
        bg: 'linear-gradient(135deg,#2a1a3a 0%,#1a0a2a 100%)',
        glow: 'rgba(255,87,34,0.5)',
        custom: true,
        specs: sel.filter(x=>x.step.id!=='platform').map(x=>`${x.step.title}: ${x.opt.name}`)
    };
    cart.push({...customProduct, qty: 1});
    saveCart(); updateCartCount(); showToast('Сборка добавлена в корзину');
    setTimeout(()=>nav('cart'),600);
}
