/* EDITAR AQUI: tudo o que ainda falta definir. Campo vazio = o trecho correspondente fica oculto na página.
   Textos prontos (ex.: price1: 'R$ 197,00') aparecem exatamente como escritos. */
const CONFIG = {
  whatsapp: '', // DDI+DDD+número, só dígitos. Ex.: 5511999999999. Vazio abre aviso, nunca número fictício.
  checkout: '', // URL do checkout. Se vazio, o pedido é encaminhado ao WhatsApp configurado.
  instagram: '',
  metaPixelId: '',
  googleTagId: '',
  policy: '', // URL da página de trocas e devoluções.
  privacy: '', // URL da política de privacidade.
  terms: '', // URL dos termos de uso.
  // Preços e condições
  price1: 'R$ 139,90', price1Detail: '', // ex.: 'R$ 197,00' e 'ou 3x de R$ 65,67'
  price2: '', price2Save: '',   // ex.: 'R$ 337,00' e 'economize R$ 57,00'
  price3: '', price3Save: '',   // opcional: kit com 3
  pix: '',                      // ex.: '5% off no Pix'
  payments: '',                 // ex.: 'Pix, cartão em até 3x e boleto'
  shipDays: '',                 // ex.: '2' (dias úteis para postagem)
  returnPolicy: '',             // frase curta da política de troca
  sizeExchange: '',             // frase da troca de tamanho, se a política permitir
  // Produto (confirmar com o fornecedor)
  washable: '', fabric: '', closure: '', washing: '', box: '', heat: '', men: '',
  // Tabela de medidas
  howToMeasure: '', sizeBetween: '', sizeP: '', sizeM: '', sizeG: '',
  // Prova social (somente dados reais e autorizados)
  rating: '', customers: '',
  testimonials: [], // [{name:'Maria, Barueri', procedure:'Lipo de papada', text:'...'}] — mínimo 3 para a seção aparecer
  // Rodapé
  company: '', cnpj: '', address: '', email: '', hours: '', invoice: ''
};
document.querySelectorAll('[data-cfg]').forEach(el => { el.textContent = CONFIG[el.dataset.cfg] || ''; });
document.querySelectorAll('[data-if]').forEach(el => { if (!CONFIG[el.dataset.if]) el.hidden = true; });
if (Array.isArray(CONFIG.testimonials) && CONFIG.testimonials.length >= 3) {
  const list = document.querySelector('#testimonial-list');
  CONFIG.testimonials.forEach(t => {
    const card = document.createElement('article'); card.className = 'card';
    const quote = document.createElement('p'); quote.textContent = `“${t.text}”`;
    const who = document.createElement('h3'); who.textContent = t.name;
    const proc = document.createElement('p'); proc.className = 'note'; proc.textContent = t.procedure || '';
    card.append(quote, who, proc); list.append(card);
  });
  document.querySelector('#depoimentos').hidden = false;
}
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
  const urls = {social: CONFIG.instagram, policy: CONFIG.policy, privacy: CONFIG.privacy, terms: CONFIG.terms};
  if (urls[button.dataset.info]) { window.open(urls[button.dataset.info], '_blank', 'noopener,noreferrer'); return; }
  const content = {social:['Acompanhe nosso cuidado.', 'O perfil oficial da loja será adicionado em breve.'],policy:['Trocas e devoluções.', 'A política comercial está em preparação. Consulte as condições de troca, devolução e atendimento antes de finalizar sua compra.'],terms:['Termos de uso.', 'Os termos de uso estão em preparação e serão publicados antes da abertura das vendas.'],privacy:['Sua privacidade.', 'Esta página não possui formulário nem grava dados de clientes no navegador. Quando o WhatsApp for configurado, o contato abrirá em um serviço externo. Os rastreadores de anúncios estão desativados até a configuração de consentimento e da política de privacidade.']};
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
// Barra fixa no celular: aparece depois que a cliente rola além do hero.
const bar = document.querySelector('#mobile-bar');
const hero = document.querySelector('#inicio');
if (bar && hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => bar.classList.toggle('show', !entry.isIntersecting && entry.boundingClientRect.top < 0)).observe(hero);
}
// Fade-in suave com subida (sem rotação nem parallax). A página continua legível se a CDN não carregar.
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add({desktop:'(min-width: 768px)',mobile:'(max-width: 767px)',reduced:'(prefers-reduced-motion: reduce)'}, context => {
    const {mobile,reduced} = context.conditions;
    if (reduced) return;
    const y = mobile ? 16 : 28;
    const reveal = (targets, trigger, stagger = 0) => gsap.from(targets, {opacity:0, y, duration:.9, ease:'power2.out', stagger, clearProps:'opacity,transform', scrollTrigger:{trigger, start:'top 88%', once:true}});
    gsap.utils.toArray('[data-reveal]').forEach(el => reveal(el, el));
    gsap.utils.toArray('[data-reveal-group]').forEach(group => reveal(group.children, group, .14));
  });
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), {once:true});
}
