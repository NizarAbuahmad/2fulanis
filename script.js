/* ===== LANGUAGE TOGGLE ===== */
let currentLang = 'en';
function setLang(lang){
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en]').forEach(el=>{
    const txt = el.getAttribute('data-'+lang);
    if(txt!==null) el.innerHTML = txt;
  });
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

/* ===== NAV SHADOW ON SCROLL ===== */
window.addEventListener('scroll', ()=>{
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 30);
});

/* ===== MARQUEE ===== */
(function(){
  const items = [
    {en:'Gluten Free',fr:'Sans Gluten'},
    {en:'No GMO',fr:'Sans OGM'},
    {en:'Low Glycemic',fr:'IG Bas'},
    {en:'Vegan',fr:'Végan'},
    {en:'Ancient Wholegrain',fr:'Grain Entier Ancien'},
    {en:'Sourced from Guinea',fr:'Sourcé de Guinée'},
    {en:'Plant-Based Superfood',fr:'Superaliment Végétal'}
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
    tag: {en:'Main · 30 min',fr:'Plat · 30 min'},
    title: {en:'Fried Fonio with Raz-el-Hanout',fr:'Fonio Frit au Ras-el-Hanout'},
    prep:'10 min', cook:'20 min', serves:'4',
    ing:{
      en:['1 cup Two Fulanis fonio grain','2 tbsp olive oil','1 onion, finely chopped','2 garlic cloves, minced','1 tbsp raz-el-hanout spice blend','1 red bell pepper, diced','1/2 cup cherry tomatoes, halved','Fresh parsley and mint, chopped','Salt and pepper to taste','Lemon wedges to serve'],
      fr:['1 tasse de grain de fonio Two Fulanis','2 c. à soupe d\'huile d\'olive','1 oignon finement haché','2 gousses d\'ail émincées','1 c. à soupe de ras-el-hanout','1 poivron rouge en dés','1/2 tasse de tomates cerises coupées','Persil et menthe frais hachés','Sel et poivre','Quartiers de citron']
    },
    steps:{
      en:['Boil 2 cups water, add fonio, cover and steam 5 min. Fluff with fork.','Heat oil in a large pan, sauté onion and garlic 3 min until soft.','Add raz-el-hanout, pepper and tomatoes. Cook 4 min.','Stir in fonio, toss until well combined and lightly fried, 3–4 min.','Season, finish with herbs and serve with lemon.']
,
      fr:['Faire bouillir 2 tasses d\'eau, ajouter le fonio, couvrir et cuire vapeur 5 min. Aérer à la fourchette.','Chauffer l\'huile dans une grande poêle, faire revenir oignon et ail 3 min.','Ajouter ras-el-hanout, poivron et tomates. Cuire 4 min.','Incorporer le fonio, mélanger jusqu\'à doré, 3–4 min.','Assaisonner, terminer avec les herbes et servir avec citron.']
    }
  },
  peppers: {
    img:'images/recipe_peppers.jpg',
    tag:{en:'Vegan · 40 min',fr:'Végan · 40 min'},
    title:{en:'Peppers Stuffed with Fonio',fr:'Poivrons Farcis au Fonio'},
    prep:'15 min', cook:'25 min', serves:'4',
    ing:{
      en:['4 large bell peppers (any colour)','1 cup Two Fulanis fonio grain','1 onion, diced','2 garlic cloves, minced','1 zucchini, diced','1/2 cup cooked chickpeas','2 tbsp olive oil','1 tsp smoked paprika','Fresh basil and parsley','Salt and pepper'],
      fr:['4 gros poivrons (toutes couleurs)','1 tasse de grain de fonio Two Fulanis','1 oignon coupé en dés','2 gousses d\'ail émincées','1 courgette coupée en dés','1/2 tasse de pois chiches cuits','2 c. à soupe d\'huile d\'olive','1 c. à café de paprika fumé','Basilic et persil frais','Sel et poivre']
    },
    steps:{
      en:['Preheat oven to 190°C / 375°F. Halve peppers, remove seeds.','Cook fonio: 1 cup grain to 2 cups boiling water, cover 5 min.','Sauté onion, garlic, zucchini in oil 5 min. Add chickpeas, paprika.','Mix vegetables with fonio, season, fold in herbs.','Fill pepper halves, drizzle oil, bake 22–25 min until tender.']
,
      fr:['Préchauffer four à 190°C. Couper poivrons en deux, retirer graines.','Cuire le fonio : 1 tasse pour 2 tasses d\'eau bouillante, couvert 5 min.','Faire revenir oignon, ail, courgette à l\'huile 5 min. Ajouter pois chiches, paprika.','Mélanger légumes avec fonio, assaisonner, ajouter herbes.','Garnir les poivrons, arroser d\'huile, cuire 22–25 min.']
    }
  },
  mussels: {
    img:'images/recipe_mussels.jpg',
    tag:{en:'Seafood · 25 min',fr:'Fruits de Mer · 25 min'},
    title:{en:'Diablasian Style — Fonio with Mussels & Oysters',fr:'Style Diablasian — Fonio aux Moules & Huîtres'},
    prep:'10 min', cook:'15 min', serves:'4',
    ing:{
      en:['1 cup Two Fulanis fonio grain','500g fresh mussels, cleaned','6 fresh oysters, shucked','3 tbsp olive oil','2 shallots, finely chopped','3 garlic cloves, minced','1 small red chilli, sliced','1 cup cherry tomatoes, halved','1/2 cup dry white wine','Fresh parsley, lemon to serve'],
      fr:['1 tasse de grain de fonio Two Fulanis','500g de moules fraîches nettoyées','6 huîtres fraîches ouvertes','3 c. à soupe d\'huile d\'olive','2 échalotes finement hachées','3 gousses d\'ail émincées','1 petit piment rouge tranché','1 tasse de tomates cerises','1/2 tasse de vin blanc sec','Persil frais, citron']
    },
    steps:{
      en:['Cook fonio: bring 2 cups water to boil, add fonio, cover 5 min.','In wide pan, heat oil, sauté shallots, garlic, chilli 2 min.','Add tomatoes and wine, bring to simmer.','Add mussels, cover and steam 4–5 min until shells open.','Place oysters on top, cover 1 min. Discard any unopened mussels.','Spoon fonio onto plates, top with mussels, oysters and pan juices. Garnish parsley and lemon.']
,
      fr:['Cuire le fonio : 2 tasses d\'eau, ajouter le fonio, couvert 5 min.','Dans une grande poêle, chauffer l\'huile, faire revenir échalotes, ail, piment 2 min.','Ajouter tomates et vin, porter à frémissement.','Ajouter les moules, couvrir et cuire vapeur 4–5 min jusqu\'à ouverture.','Déposer les huîtres dessus, couvrir 1 min. Jeter les moules fermées.','Servir le fonio, garnir de moules, huîtres et jus de cuisson. Persil et citron.']
    }
  },
  energy: {
    img:'images/recipe_energy.jpg',
    tag:{en:'Vegan · Snack',fr:'Végan · Collation'},
    title:{en:'Fonio Energy Bites',fr:'Bouchées Énergétiques au Fonio'},
    prep:'15 min', cook:'0 min', serves:'12 bites',
    ing:{
      en:['1/2 cup cooked Two Fulanis fonio (cooled)','1 cup pitted dates','1/2 cup raw almonds','2 tbsp almond butter','2 tbsp cocoa powder','1 tbsp chia seeds','1/2 tsp vanilla extract','Pinch of sea salt','Desiccated coconut to roll'],
      fr:['1/2 tasse de fonio Two Fulanis cuit (refroidi)','1 tasse de dattes dénoyautées','1/2 tasse d\'amandes crues','2 c. à soupe de beurre d\'amande','2 c. à soupe de cacao en poudre','1 c. à soupe de graines de chia','1/2 c. à café d\'extrait de vanille','Pincée de sel','Noix de coco râpée pour rouler']
    },
    steps:{
      en:['Blitz almonds in food processor until coarsely ground.','Add dates, fonio, cocoa, almond butter, vanilla, salt. Pulse until sticky.','Stir in chia seeds.','Roll into 12 small balls, then in coconut.','Chill 30 min before serving. Keeps 1 week refrigerated.']
,
      fr:['Mixer les amandes au robot jusqu\'à mouture grossière.','Ajouter dattes, fonio, cacao, beurre d\'amande, vanille, sel. Mixer jusqu\'à pâte collante.','Incorporer les graines de chia.','Former 12 petites boules, rouler dans la noix de coco.','Réfrigérer 30 min avant de servir. Se conserve 1 semaine au frais.']
    }
  },
  madeleines: {
    img:'images/recipe_madeleines.jpg',
    tag:{en:'Baking · 35 min',fr:'Pâtisserie · 35 min'},
    title:{en:'French Madeleines with Fonio Flour',fr:'Madeleines Françaises à la Farine de Fonio'},
    prep:'15 min', cook:'12 min', serves:'12 madeleines',
    ing:{
      en:['100g Two Fulanis fonio flour','2 large eggs','80g caster sugar','100g unsalted butter, melted','1 tsp vanilla extract','Zest of 1 lemon','1 tsp baking powder','Pinch of salt','Icing sugar to dust'],
      fr:['100g de farine de fonio Two Fulanis','2 gros œufs','80g de sucre en poudre','100g de beurre doux fondu','1 c. à café d\'extrait de vanille','Zeste d\'1 citron','1 c. à café de levure chimique','Pincée de sel','Sucre glace pour saupoudrer']
    },
    steps:{
      en:['Whisk eggs and sugar 3 min until pale and thick.','Fold in fonio flour, baking powder, salt, zest.','Stir in melted butter and vanilla. Rest batter 30 min.','Preheat oven 200°C / 400°F. Grease madeleine tin.','Spoon batter into moulds. Bake 9–11 min until golden.','Cool 2 min, unmould, dust with icing sugar.']
,
      fr:['Fouetter œufs et sucre 3 min jusqu\'à blanchiment.','Incorporer farine de fonio, levure, sel, zeste.','Ajouter beurre fondu et vanille. Laisser reposer 30 min.','Préchauffer four à 200°C. Beurrer le moule.','Verser la pâte dans les empreintes. Cuire 9–11 min.','Démouler après 2 min, saupoudrer de sucre glace.']
    }
  },
  crepes: {
    img:'images/recipe_crepes.jpg',
    tag:{en:'Dessert · 20 min',fr:'Dessert · 20 min'},
    title:{en:'Fonio Crêpes',fr:'Crêpes au Fonio'},
    prep:'10 min', cook:'10 min', serves:'8 crêpes',
    ing:{
      en:['120g Two Fulanis fonio flour','2 large eggs','300ml milk (or oat milk)','30g melted butter','1 tbsp sugar','Pinch of salt','Butter for cooking','Toppings: lemon, sugar, honey, fruits'],
      fr:['120g de farine de fonio Two Fulanis','2 gros œufs','300ml de lait (ou lait d\'avoine)','30g de beurre fondu','1 c. à soupe de sucre','Pincée de sel','Beurre pour la cuisson','Garnitures : citron, sucre, miel, fruits']
    },
    steps:{
      en:['Whisk fonio flour, sugar and salt in a bowl.','Make a well, add eggs and half the milk. Whisk smooth.','Gradually add remaining milk and melted butter. Rest 15 min.','Heat a non-stick pan, melt a knob of butter.','Pour a small ladle of batter, swirl thin. Cook 1 min each side.','Stack and serve warm with your chosen toppings.']
,
      fr:['Fouetter la farine de fonio, le sucre et le sel.','Creuser un puits, ajouter les œufs et la moitié du lait. Fouetter.','Ajouter progressivement le reste du lait et le beurre. Reposer 15 min.','Chauffer une poêle anti-adhésive, faire fondre une noix de beurre.','Verser une petite louche, étaler finement. Cuire 1 min de chaque côté.','Empiler et servir chaud avec les garnitures choisies.']
    }
  }
};

function openRecipe(key){
  const r = recipes[key];
  if(!r) return;
  document.getElementById('modalImg').src = r.img;
  document.getElementById('modalImg').alt = r.title.en;
  document.getElementById('modalTag').textContent = r.tag[currentLang];
  document.getElementById('modalTitle').textContent = r.title[currentLang];
  document.getElementById('modalPrep').textContent = r.prep;
  document.getElementById('modalCook').textContent = r.cook;
  document.getElementById('modalServes').textContent = r.serves;
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
