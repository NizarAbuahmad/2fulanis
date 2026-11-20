/* ===== LANGUAGE TOGGLE ===== */
let currentLang = 'en';
const PAGE_TITLE = {
  en: 'Two Fulanis — Fuel Your Day the Fonio Way',
  fr: 'Two Fulanis — Faites le plein d’énergie, façon fonio'
};
function setLang(lang){
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en]').forEach(el=>{
    const txt = el.getAttribute('data-'+lang);
    if(txt!==null) el.innerHTML = txt;
  });
  /* Alt text and aria-labels: English is the default, French when chosen. */
  document.querySelectorAll('[data-alt-fr]').forEach(img=>{
    if(!img.dataset.altEn) img.dataset.altEn = img.alt;
    img.alt = lang==='fr' ? img.dataset.altFr : img.dataset.altEn;
  });
  document.querySelectorAll('[data-aria-fr]').forEach(el=>{
    if(!el.dataset.ariaEn) el.dataset.ariaEn = el.getAttribute('aria-label');
    el.setAttribute('aria-label', lang==='fr' ? el.dataset.ariaFr : el.dataset.ariaEn);
  });
  document.title = PAGE_TITLE[lang];
  document.querySelectorAll('#btn-en').forEach(b=>b.classList.toggle('active',lang==='en'));
  document.querySelectorAll('#btn-fr').forEach(b=>b.classList.toggle('active',lang==='fr'));
}

/* ===== MOBILE MENU ===== */
function toggleMenu(){
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  const isOpen = menu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  document.body.classList.toggle('menu-locked', isOpen);
}
/* Close the mobile menu if the window grows past the burger breakpoint (e.g. a tablet rotating) */
matchMedia('(min-width:1201px)').addEventListener('change', e=>{
  if(e.matches && document.getElementById('mobileMenu').classList.contains('open')) toggleMenu();
});

/* ===== NAV SHADOW ON SCROLL ===== */
window.addEventListener('scroll', ()=>{
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
});

/* ===== MARQUEE ===== */
(function(){
  const items = [
    {en:'Gluten Free',fr:'Sans gluten'},
    {en:'No GMO',fr:'Sans OGM'},
    {en:'Low GI',fr:'IG bas'},
    {en:'Vegan',fr:'Végan'},
    {en:'Ancient Wholegrain',fr:'Céréale complète ancestrale'},
    {en:'Sourced from Guinea',fr:'Origine\u00a0: Guinée'},
    {en:'Plant-Based Superfood',fr:'Superaliment végétal'}
  ];
  const track = document.getElementById('marqueeTrack');
  let html = '';
  for(let i=0;i<2;i++){
    items.forEach(it=>{
      html += `<span data-en="${it.en}" data-fr="${it.fr}">${it.en}</span><span class="dot">·</span>`;
    });
  }
  track.innerHTML = html;
})();

/* ===== FORM (Web3Forms — direct delivery to info@twofulanis.com) ===== */
document.getElementById('contactForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitBtn');
  const successBox = document.getElementById('formSuccess');
  const errorBox = document.getElementById('formError');
  successBox.classList.remove('show');
  errorBox.classList.remove('show');

  // Populate subject line dynamically with the interest type and sender name
  const interest = form.interest.value;
  const fname = form.first_name.value.trim();
  const lname = form.last_name.value.trim();
  document.getElementById('hidden-subject').value = `Two Fulanis enquiry — ${interest} — ${fname} ${lname}`;
  document.getElementById('hidden-from-name').value = `${fname} ${lname} (via twofulanis.com)`;

  const originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = currentLang === 'fr' ? 'Envoi en cours…' : 'Sending…';

  try {
    const formData = new FormData(form);
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      successBox.classList.add('show');
      form.reset();
      setTimeout(() => successBox.classList.remove('show'), 10000);
    } else {
      errorBox.classList.add('show');
    }
  } catch (err) {
    errorBox.classList.add('show');
  } finally {
    btn.disabled = false;
    btn.textContent = originalLabel;
  }
});

/* ===== RECIPE DATA & MODAL ===== */
const recipes = {
  raz: {
    img: 'images/recipe_raz.jpg',
    tag: {en:'Main · 30 min',fr:'Plat principal · 30\u00a0min'},
    title: {en:'Fried Fonio with Ras el Hanout',fr:'Fonio sauté au ras-el-hanout'},
    prep:'10\u00a0min', cook:'20\u00a0min', serves:{en:'4',fr:'4\u00a0personnes'},
    ing:{
      en:['1 cup Two Fulanis fonio grain','2 tbsp olive oil','1 onion, finely chopped','2 garlic cloves, minced','1 tbsp ras el hanout spice blend','1 red bell pepper, diced','1/2 cup cherry tomatoes, halved','Fresh parsley and mint, chopped','Salt and pepper, to taste','Lemon wedges, to serve'],
      fr:['180\u00a0g de fonio Two Fulanis','2\u00a0c. à soupe d’huile d’olive','1\u00a0oignon, finement haché','2\u00a0gousses d’ail, hachées','1\u00a0c. à soupe de ras-el-hanout','1\u00a0poivron rouge, coupé en dés','75\u00a0g de tomates cerises, coupées en deux','Persil et menthe frais, hachés','Sel et poivre, selon le goût','Quartiers de citron, pour servir']
    },
    steps:{
      en:['Bring 2 cups of water to the boil, add the fonio, cover and leave to steam for 5 min. Fluff with a fork.','Heat the oil in a large pan and sauté the onion and garlic for 3 min, until soft.','Add the ras el hanout, red pepper and tomatoes. Cook for 4 min.','Stir in the fonio and toss for 3–4 min, until well combined and lightly fried.','Season, finish with the herbs and serve with lemon wedges.']
,
      fr:['Porter 500\u00a0ml d’eau à ébullition, ajouter le fonio, couvrir et laisser gonfler 5\u00a0min. Égrener à la fourchette.','Chauffer l’huile dans une grande poêle et faire revenir l’oignon et l’ail 3\u00a0min, jusqu’à ce qu’ils soient tendres.','Ajouter le ras-el-hanout, le poivron et les tomates. Cuire 4\u00a0min.','Incorporer le fonio et mélanger 3\u00a0à 4\u00a0min, jusqu’à ce qu’il soit bien enrobé et légèrement doré.','Assaisonner, parsemer d’herbes fraîches et servir avec du citron.']
    }
  },
  peppers: {
    img:'images/recipe_peppers.jpg',
    tag:{en:'Vegan · 40 min',fr:'Végan · 40\u00a0min'},
    title:{en:'Fonio-Stuffed Peppers',fr:'Poivrons farcis au fonio'},
    prep:'15\u00a0min', cook:'25\u00a0min', serves:{en:'4',fr:'4\u00a0personnes'},
    ing:{
      en:['4 large bell peppers (any colour)','1 cup Two Fulanis fonio grain','1 onion, diced','2 garlic cloves, minced','1 courgette (zucchini), diced','1/2 cup cooked chickpeas','2 tbsp olive oil','1 tsp smoked paprika','Fresh basil and parsley','Salt and pepper'],
      fr:['4\u00a0gros poivrons (de la couleur de votre choix)','180\u00a0g de fonio Two Fulanis','1\u00a0oignon, coupé en dés','2\u00a0gousses d’ail, hachées','1\u00a0courgette, coupée en dés','80\u00a0g de pois chiches cuits','2\u00a0c. à soupe d’huile d’olive','1\u00a0c. à café de paprika fumé','Basilic et persil frais','Sel et poivre']
    },
    steps:{
      en:['Preheat the oven to 190°C / 375°F. Halve the peppers and remove the seeds.','Cook the fonio: add 1 cup of grain to 2 cups of boiling water, cover and leave for 5 min.','Sauté the onion, garlic and courgette in 1 tbsp of the oil for 5 min. Add the chickpeas and paprika.','Mix the vegetables with the fonio, season and fold in the herbs.','Fill the pepper halves, drizzle with the remaining oil and bake for 22–25 min, until tender.']
,
      fr:['Préchauffer le four à 190\u00a0°C. Couper les poivrons en deux et retirer les graines.','Cuire le fonio\u00a0: verser 180\u00a0g de fonio dans 500\u00a0ml d’eau bouillante, couvrir et laisser gonfler 5\u00a0min.','Faire revenir l’oignon, l’ail et la courgette dans 1\u00a0c. à soupe d’huile 5\u00a0min. Ajouter les pois chiches et le paprika.','Mélanger les légumes et le fonio, assaisonner, puis incorporer les herbes.','Garnir les moitiés de poivron, arroser avec le reste d’huile et cuire au four 22\u00a0à 25\u00a0min, jusqu’à ce qu’elles soient tendres.']
    }
  },
  mussels: {
    img:'images/recipe_mussels.jpg',
    tag:{en:'Seafood · 25 min',fr:'Fruits de mer · 25\u00a0min'},
    title:{en:'Diablasian Style — Fonio with Mussels & Oysters',fr:'Façon Diablasian — fonio aux moules et aux huîtres'},
    prep:'10\u00a0min', cook:'15\u00a0min', serves:{en:'4',fr:'4\u00a0personnes'},
    ing:{
      en:['1 cup Two Fulanis fonio grain','500 g fresh mussels, cleaned','6 fresh oysters, shucked','3 tbsp olive oil','2 shallots, finely chopped','3 garlic cloves, minced','1 small red chilli, sliced','1 cup cherry tomatoes, halved','1/2 cup dry white wine','Fresh parsley and lemon, to serve'],
      fr:['180\u00a0g de fonio Two Fulanis','500\u00a0g de moules fraîches, nettoyées','6\u00a0huîtres fraîches, ouvertes','3\u00a0c. à soupe d’huile d’olive','2\u00a0échalotes, finement hachées','3\u00a0gousses d’ail, hachées','1\u00a0petit piment rouge, coupé en rondelles','150\u00a0g de tomates cerises, coupées en deux','120\u00a0ml de vin blanc sec','Persil frais et citron, pour servir']
    },
    steps:{
      en:['Cook the fonio: bring 2 cups of water to the boil, add the fonio, cover and leave for 5 min.','In a wide pan, heat the oil and sauté the shallots, garlic and chilli for 2 min.','Add the tomatoes and wine and bring to a simmer.','Add the mussels, cover and steam for 4–5 min, until the shells open.','Place the oysters on top and cover for 1 min. Discard any mussels that have not opened.','Spoon the fonio onto plates and top with the mussels, oysters and pan juices. Garnish with parsley and lemon.']
,
      fr:['Cuire le fonio\u00a0: porter 500\u00a0ml d’eau à ébullition, ajouter le fonio, couvrir et laisser gonfler 5\u00a0min.','Dans une grande poêle, chauffer l’huile et faire revenir les échalotes, l’ail et le piment 2\u00a0min.','Ajouter les tomates et le vin, puis porter à frémissement.','Ajouter les moules, couvrir et cuire à la vapeur 4\u00a0à 5\u00a0min, jusqu’à ce que les coquilles s’ouvrent.','Déposer les huîtres par-dessus et couvrir 1\u00a0min. Jeter les moules restées fermées.','Dresser le fonio dans les assiettes, répartir les moules et les huîtres par-dessus et napper de jus de cuisson. Parsemer de persil et servir avec du citron.']
    }
  },
  energy: {
    img:'images/recipe_energy.jpg',
    tag:{en:'Vegan · Snack',fr:'Végan · En-cas'},
    title:{en:'Fonio Energy Bites',fr:'Bouchées énergétiques au fonio'},
    prep:'15\u00a0min', cook:'0\u00a0min', serves:{en:'12 bites',fr:'12\u00a0bouchées'},
    ing:{
      en:['1/2 cup cooked Two Fulanis fonio (cooled)','1 cup pitted dates','1/2 cup raw almonds','2 tbsp almond butter','2 tbsp cocoa powder','1 tbsp chia seeds','1/2 tsp vanilla extract','A pinch of sea salt','Desiccated coconut, for rolling'],
      fr:['80\u00a0g de fonio Two Fulanis cuit et refroidi','150\u00a0g de dattes dénoyautées','70\u00a0g d’amandes crues','2\u00a0c. à soupe de beurre d’amande','2\u00a0c. à soupe de cacao en poudre','1\u00a0c. à soupe de graines de chia','1/2\u00a0c. à café d’extrait de vanille','Une pincée de sel de mer','Noix de coco râpée, pour l’enrobage']
    },
    steps:{
      en:['Blitz the almonds in a food processor until coarsely ground.','Add the dates, fonio, cocoa, almond butter, vanilla and salt. Pulse until the mixture is sticky.','Stir in the chia seeds.','Roll into 12 small balls, then roll them in the coconut.','Chill for 30 min before serving. Keeps for up to 1 week in the fridge.']
,
      fr:['Mixer les amandes au robot jusqu’à obtenir une mouture grossière.','Ajouter les dattes, le fonio, le cacao, le beurre d’amande, la vanille et le sel. Mixer par impulsions jusqu’à obtenir une pâte collante.','Incorporer les graines de chia.','Former 12\u00a0petites boules, puis les rouler dans la noix de coco râpée.','Réserver 30\u00a0min au frais avant de servir. Se conserve jusqu’à une semaine au réfrigérateur.']
    }
  },
  madeleines: {
    img:'images/recipe_madeleines.jpg',
    tag:{en:'Baking · 35 min',fr:'Pâtisserie · 35\u00a0min'},
    title:{en:'French Madeleines with Fonio Flour',fr:'Madeleines à la farine de fonio'},
    prep:'15\u00a0min', cook:'12\u00a0min', serves:{en:'12 madeleines',fr:'12\u00a0madeleines'},
    ing:{
      en:['100 g Two Fulanis fonio flour','2 large eggs','80 g caster sugar','100 g unsalted butter, melted','1 tsp vanilla extract','Zest of 1 lemon','1 tsp baking powder','A pinch of salt','Icing sugar, for dusting'],
      fr:['100\u00a0g de farine de fonio Two Fulanis','2\u00a0gros œufs','80\u00a0g de sucre en poudre','100\u00a0g de beurre doux, fondu','1\u00a0c. à café d’extrait de vanille','Le zeste d’un citron','1\u00a0c. à café de levure chimique','Une pincée de sel','Sucre glace, pour saupoudrer']
    },
    steps:{
      en:['Whisk the eggs and sugar for 3 min, until pale and thick.','Fold in the fonio flour, baking powder, salt and zest.','Stir in the melted butter and vanilla. Rest the batter for 30 min.','Preheat the oven to 200°C / 400°F. Grease a madeleine tin.','Spoon the batter into the moulds. Bake for 9–11 min, until golden.','Cool for 2 min, then unmould and dust with icing sugar.']
,
      fr:['Fouetter les œufs et le sucre 3\u00a0min, jusqu’à ce que le mélange blanchisse et épaississe.','Incorporer la farine de fonio, la levure, le sel et le zeste.','Ajouter le beurre fondu et la vanille. Laisser reposer la pâte 30\u00a0min.','Préchauffer le four à 200\u00a0°C. Beurrer le moule à madeleines.','Répartir la pâte dans les empreintes. Cuire 9\u00a0à 11\u00a0min, jusqu’à ce que les madeleines soient dorées.','Laisser refroidir 2\u00a0min, démouler et saupoudrer de sucre glace.']
    }
  },
  crepes: {
    img:'images/recipe_crepes.jpg',
    tag:{en:'Dessert · 20 min',fr:'Dessert · 20\u00a0min'},
    title:{en:'Fonio Crêpes',fr:'Crêpes au fonio'},
    prep:'10\u00a0min', cook:'10\u00a0min', serves:{en:'8 crêpes',fr:'8\u00a0crêpes'},
    ing:{
      en:['120 g Two Fulanis fonio flour','2 large eggs','300 ml milk (or oat milk)','30 g melted butter','1 tbsp sugar','A pinch of salt','Butter, for cooking','Toppings: lemon, sugar, honey, fruit'],
      fr:['120\u00a0g de farine de fonio Two Fulanis','2\u00a0gros œufs','300\u00a0ml de lait (ou de lait d’avoine)','30\u00a0g de beurre fondu','1\u00a0c. à soupe de sucre','Une pincée de sel','Beurre pour la cuisson','Garnitures\u00a0: citron, sucre, miel, fruits']
    },
    steps:{
      en:['Whisk the fonio flour, sugar and salt in a bowl.','Make a well, add the eggs and half the milk, and whisk until smooth.','Gradually add the remaining milk and the melted butter. Rest the batter for 15 min.','Heat a non-stick pan and melt a knob of butter.','Pour in a small ladle of batter and swirl to coat the pan thinly. Cook for 1 min on each side.','Stack and serve warm with your chosen toppings.']
,
      fr:['Fouetter la farine de fonio, le sucre et le sel dans un saladier.','Creuser un puits, ajouter les œufs et la moitié du lait. Fouetter jusqu’à obtenir une pâte lisse.','Ajouter progressivement le reste du lait et le beurre fondu. Laisser reposer la pâte 15\u00a0min.','Chauffer une poêle antiadhésive et y faire fondre une noix de beurre.','Verser une petite louche de pâte et l’étaler en couche fine. Cuire 1\u00a0min de chaque côté.','Empiler et servir chaud avec les garnitures de votre choix.']
    }
  }
};

function openRecipe(key){
  const r = recipes[key];
  if(!r) return;
  document.getElementById('modalImg').src = r.img;
  document.getElementById('modalImg').alt = r.title[currentLang];
  document.getElementById('modalTag').textContent = r.tag[currentLang];
  document.getElementById('modalTitle').textContent = r.title[currentLang];
  document.getElementById('modalPrep').textContent = r.prep;
  document.getElementById('modalCook').textContent = r.cook;
  document.getElementById('modalServes').textContent = typeof r.serves === 'object' ? r.serves[currentLang] : r.serves;
  const ing = document.getElementById('modalIngredients');
  ing.innerHTML = r.ing[currentLang].map(x=>`<li>${x}</li>`).join('');
  const stp = document.getElementById('modalInstructions');
  stp.innerHTML = r.steps[currentLang].map(x=>`<li>${x}</li>`).join('');
  document.getElementById('recipeModal').classList.add('open');
  document.body.classList.add('menu-locked');
}
function closeRecipe(e){
  if(e && e.target && !e.target.classList.contains('modal-overlay') && e.type==='click') return;
  document.getElementById('recipeModal').classList.remove('open');
  document.body.classList.remove('menu-locked');
}
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeRecipe(); });
