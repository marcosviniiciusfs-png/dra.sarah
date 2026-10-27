/* EDITAR AQUI: número com DDI+DDD (somente dígitos), preços, checkout, redes e IDs. */
const CONFIG = {
  whatsapp: '', // Ex.: 5511999999999. Vazio abre aviso, nunca número fictício.
  checkout: '', // Se vazio, o pedido é encaminhado ao WhatsApp configurado.
  instagram: '',
  metaPixelId: '',
  googleTagId: '',
  policy: '', // URL da política de trocas definitiva.
  privacy: ''
};
const dialog = document.querySelector('#info-dialog');
function showInfo(title, message) {
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#dialog-text').textContent = message;
  if (!dialog.open) dialog.showModal();
}
document.querySelectorAll('.dialog-close,.dialog-ok').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
function track(action, label) {
  // Não enviar dados de saúde/cirurgia aos provedores de analytics.
  if (typeof window.fbq === 'function') window.fbq('trackCustom', action, { placement: label });
  if (typeof window.gtag === 'function') window.gtag('event', action, { placement: label });
}
function whatsappLink(message) { return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`; }
document.querySelectorAll('[data-wa]').forEach(link => {
  const message = `Olá! Quero saber mais sobre a faixa pós-operatória${link.dataset.surgery ? ` para ${link.dataset.surgery}` : ''}.`;
  if (/^\d{10,15}$/.test(CONFIG.whatsapp)) { link.href = whatsappLink(message); link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  link.addEventListener('click', event => {
    if (!/^\d{10,15}$/.test(CONFIG.whatsapp)) { event.preventDefault(); showInfo('Atendimento em preparação.', 'O número de WhatsApp da loja ainda será adicionado. Em breve você poderá consultar tamanhos, valores e entrega por aqui.'); return; }
    track('WhatsAppClick', link.closest('section')?.id || 'navigation');
  });
});
document.querySelectorAll('[data-buy]').forEach(button => button.addEventListener('click', () => {
  let destination = CONFIG.checkout;
  if (!destination && /^\d{10,15}$/.test(CONFIG.whatsapp)) destination = whatsappLink(`Olá! Tenho interesse em ${button.dataset.buy}. Gostaria de confirmar tamanho, preço e frete.`);
  if (!destination) { showInfo('Sua faixa, com atenção.', 'Os valores e o canal de compra ainda estão em preparação. O pedido será liberado após a loja confirmar essas informações.'); return; }
  track('BuyClick', button.dataset.buy); // Clique de intenção; não dispara Purchase sem pagamento confirmado.
  window.open(destination, '_blank', 'noopener,noreferrer');
}));
document.querySelectorAll('[data-info]').forEach(button => button.addEventListener('click', () => {
  const urls = {social: CONFIG.instagram, policy: CONFIG.policy, privacy: CONFIG.privacy};
  if (urls[button.dataset.info]) { window.open(urls[button.dataset.info], '_blank', 'noopener,noreferrer'); return; }
  const content = {social:['Acompanhe nosso cuidado.', 'O perfil oficial da loja será adicionado em breve.'],policy:['Trocas e devoluções.', 'A política comercial está em preparação. Consulte as condições de troca, devolução e atendimento antes de finalizar sua compra.'],privacy:['Sua privacidade.', 'Esta página não possui formulário nem grava dados de clientes no navegador. Quando o WhatsApp for configurado, o contato abrirá em um serviço externo. Os rastreadores de anúncios estão desativados até a configuração de consentimento e da política de privacidade.']};
  showInfo(...content[button.dataset.info]);
}));
document.querySelector('#year').textContent = new Date().getFullYear();
/* Rastreamento opt-in: chamar window.enableMarketingTracking() somente após consentimento
   informado no gerenciador de consentimento escolhido pela loja. Nenhum cookie criado por padrão. */
window.enableMarketingTracking = function () {
  if (window.marketingTrackingEnabled) return;
  window.marketingTrackingEnabled = true;
  if (/^\d+$/.test(CONFIG.metaPixelId)) {
    const f = window.fbq = window.fbq || function () { f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments); };
    f.queue = f.queue || []; f.loaded = true; f.version = '2.0';
    const script = document.createElement('script'); script.async = true; script.src = 'https://connect.facebook.net/en_US/fbevents.js'; document.head.append(script);
    f('init', CONFIG.metaPixelId); f('track', 'PageView');
  }
  if (/^G-[A-Z0-9]+$/.test(CONFIG.googleTagId)) {
    window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
    const script = document.createElement('script'); script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.googleTagId}`; document.head.append(script);
    window.gtag('js', new Date()); window.gtag('config', CONFIG.googleTagId);
  }
};
// Fotos reais: colocar perfil.webp, frente.webp e tres-quartos.webp em assets/img.
// O fallback evita imagens quebradas enquanto os arquivos não estiverem disponíveis.
const photoCache = new Map();
function loadPhoto(file) {
  if (!photoCache.has(file)) photoCache.set(file, new Promise(resolve => { const image = new Image(); image.onload = () => resolve(image.src); image.onerror = () => resolve(null); image.src = `assets/img/${file}`; }));
  return photoCache.get(file);
}
document.querySelectorAll('[data-photo]').forEach(async image => {
  const src = await loadPhoto(image.dataset.photo);
  if (src) { image.src = src; image.alt = 'Modelo com faixa facial pós-operatória preta, com abertura para as orelhas e apoio ao queixo e pescoço';  }
});
const angles = [
  { file:'frente.webp', label:'Frente', text:'O encaixe envolve o queixo. As aberturas laterais acomodam as orelhas.' },
  { file:'tres-quartos.webp', label:'Três quartos', text:'O tecido macio e elástico acompanha a região do queixo e as laterais da face.' },
  { file:'perfil.webp', label:'Perfil', text:'O fecho em velcro no topo permite adaptar o encaixe conforme a orientação do cirurgião.' }
];
let activeAngle = -1;
async function setAngle(index) {
  if (index === activeAngle) return;
  activeAngle = index;
  document.querySelectorAll('[data-angle]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.angle) === index)));
  document.querySelector('#angle-description').textContent = angles[index].text;
  const src = await loadPhoto(angles[index].file);
  if (activeAngle !== index) return;
  const image = document.querySelector('#angle-photo'); image.src = src || 'assets/img/perfil.webp';
  image.alt = src ? `Faixa facial pós-operatória preta vista de ${angles[index].label.toLowerCase()}` : 'Modelo com faixa facial preta';
  document.querySelector('#angle-status').hidden = Boolean(src);
}
document.querySelectorAll('[data-angle]').forEach(button => button.addEventListener('click', () => setAngle(Number(button.dataset.angle))));
setAngle(0);
const reviewPlaceholders = ['Cada recuperação tem sua própria história.', 'O cuidado também está em ouvir.', 'Uma experiência de cada vez.'];
let reviewIndex = 0;
function changeReview(direction) { reviewIndex = (reviewIndex + direction + 3) % 3; document.querySelector('#review-text').textContent = reviewPlaceholders[reviewIndex]; document.querySelector('#review-count').textContent = `0${reviewIndex + 1} / 03`; }
document.querySelector('#review-prev').addEventListener('click', () => changeReview(-1));
document.querySelector('#review-next').addEventListener('click', () => changeReview(1));
// A página continua totalmente legível se a CDN de animação não carregar.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add({desktop:'(min-width: 768px)',mobile:'(max-width: 767px)',reduced:'(prefers-reduced-motion: reduce)'}, context => {
    const {mobile,reduced} = context.conditions;
    if (reduced) {
      gsap.utils.toArray('.section').forEach(section => gsap.from(section, {opacity:.7,duration:.2,scrollTrigger:{trigger:section,start:'top 95%',once:true}}));
      return;
    }
    // Fold only a short transition at section boundaries, preserving readable content.
    const cleanups = [];
    gsap.utils.toArray('.fold-section').forEach((section,index) => {
      if (section.id === 'angulos' || section.id === 'como-usar') return;
      const shell = document.createElement('div'); shell.className = 'fold-shell';
      section.before(shell); shell.append(section);
      const shade = document.createElement('span'); shade.className = 'fold-shade'; shade.setAttribute('aria-hidden','true'); section.append(shade);
      cleanups.push(() => { shade.remove(); shell.before(section); shell.remove(); });
      if (index > 0) {
        const vertical = index % 2 === 0;
        const tl = gsap.timeline({scrollTrigger:{trigger:shell,start:'top 98%',end:mobile?'top 76%':'top 65%',scrub:.65,invalidateOnRefresh:true}});
        tl.fromTo(section, {rotationX:vertical?0:(mobile?10:18),rotationY:vertical?(mobile?-7:-12):0,transformOrigin:vertical?'left center':'top center',opacity:.68}, {rotationX:0,rotationY:0,opacity:1,ease:'none'},0)
          .fromTo(shade,{opacity:.85},{opacity:0,ease:'none'},0);
      }
    });
    gsap.utils.toArray('.accordion-fold').forEach(group => {
      gsap.from(group.children,{rotationX:mobile ? 18 : 38,y:mobile ? 12 : 24,opacity:.3,stagger:.18,ease:'none',scrollTrigger:{trigger:group,start:'top 94%',end:'top 60%',scrub:.6}});
    });
    // Restore wrapper DOM only after GSAP has reverted its pins and transforms.
    return () => { cleanups.reverse().forEach(fn => fn()); };
  });
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), {once:true});
}
