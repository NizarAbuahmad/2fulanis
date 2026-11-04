/* Processing & Packing page.
   Has its own script because /script.js expects the main page's form and modal and would throw here. */

/* ===== LANGUAGE TOGGLE (same behaviour as the main site, plus alt text, tab title and button state) ===== */

/* The email template lives here once, rather than in every button. */
const MAIL = {
  en: {
    subject: 'Processing services enquiry',
    body: 'Hello,\n\nI would like a quote for contract processing.\n\n' +
          'Product (fonio or rice):\n' +
          'State (raw or already cleaned):\n' +
          'Result wanted (cleaned grain, flour or packed pouches):\n' +
          'Quantity and frequency (one-off or ongoing):\n' +
          'Pack size and format:\n' +
          'Packaging (who supplies the pouches):\n' +
          'Destination:\n' +
          'Company and contact name:\n' +
          'Phone / WhatsApp:\n\n' +
          'Kind regards,\n'
  },
  fr: {
    subject: 'Demande de devis : transformation à façon',
    body: 'Bonjour,\n\nJe souhaite obtenir un devis pour une prestation de transformation.\n\n' +
          'Produit (fonio ou riz) :\n' +
          'État (brut ou déjà nettoyé) :\n' +
          'Résultat souhaité (grain nettoyé, farine ou produit conditionné en sachets) :\n' +
          'Quantité et fréquence (commande ponctuelle ou régulière) :\n' +
          'Format et poids des sachets :\n' +
          'Emballage (qui fournit les sachets) :\n' +
          'Destination :\n' +
          'Société et nom du contact :\n' +
          'Téléphone / WhatsApp :\n\n' +
          'Cordialement,\n'
  }
};

const TITLE = {
  en: 'Processing & Packing Services — Two Fulanis',
  fr: 'Transformation et conditionnement à façon — Two Fulanis'
};

function setLang(lang){
  document.documentElement.lang = lang;
  document.title = TITLE[lang];

  document.querySelectorAll('[data-en]').forEach(el=>{
    const txt = el.getAttribute('data-'+lang);
    if(txt!==null) el.innerHTML = txt;
  });

  /* Images keep their English alt as the default; French is applied when chosen. */
  document.querySelectorAll('img[data-alt-fr]').forEach(img=>{
    if(!img.dataset.altEn) img.dataset.altEn = img.alt;
    img.alt = lang==='fr' ? img.dataset.altFr : img.dataset.altEn;
  });

  const m = MAIL[lang];
  const href = 'mailto:info@twofulanis.com?subject=' + encodeURIComponent(m.subject) +
               '&body=' + encodeURIComponent(m.body.replace(/\n/g, '\r\n'));
  document.querySelectorAll('a[data-mail]').forEach(a=>{ a.href = href; });

  ['en','fr'].forEach(l=>{
    const b = document.getElementById('btn-'+l);
    b.classList.toggle('active', lang===l);
    b.setAttribute('aria-pressed', lang===l);
  });
}

document.getElementById('btn-en').addEventListener('click', ()=>setLang('en'));
document.getElementById('btn-fr').addEventListener('click', ()=>setLang('fr'));

/* Share a French link with ?lang=fr */
const wanted = (new URLSearchParams(location.search).get('lang') || '').toLowerCase();
setLang(wanted === 'fr' ? 'fr' : 'en');

/* ===== NAV SHADOW ON SCROLL ===== */
window.addEventListener('scroll', ()=>{
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
}, {passive:true});
