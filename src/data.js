// ════════════════════════════════════════════════════════════
//  data.js — FONTE ÚNICA DE VERDADE da Rústica Micropadaria
//
//  👉 COMO USAR:
//     - Troque textos, números e links diretamente nos objetos abaixo.
//     - Para trocar uma IMAGEM: substitua o arquivo físico na pasta
//       correspondente (src/assets/sections/...) mantendo o mesmo nome.
//       O site atualiza automaticamente sem tocar em mais nada.
//     - Não altere os arquivos .jsx — eles leem tudo daqui.
// ════════════════════════════════════════════════════════════

// ─── BRAND ───────────────────────────────────────────────────
//  Pasta: src/assets/brand/
import logo from './assets/brand/logo.png';

// ─── STORY ───────────────────────────────────────────────────
//  Pasta: src/assets/sections/story/
import creatorsImg from './assets/sections/story/creators.png';

// ─── GALLERY ─────────────────────────────────────────────────
//  Pasta: src/assets/sections/gallery/
//  Para trocar uma foto: substitua o arquivo .png de mesmo nome.
import vibe1 from './assets/sections/gallery/vibe-1.png';
import vibe2 from './assets/sections/gallery/vibe-2.png';
import vibe3 from './assets/sections/gallery/vibe-3.png';

// ─── MENU / PRODUTOS ─────────────────────────────────────────
//  Pasta: src/assets/sections/menu/
//  Para trocar a foto de um produto: substitua o .png de mesmo nome.
import boloBananaImg    from './assets/sections/menu/bolo-banana.png';
import paoCastanhasImg  from './assets/sections/menu/pao-castanhas.png';
import croissantImg     from './assets/sections/menu/croissant.png';
import pizzaImg         from './assets/sections/menu/pizza.png';
import macaronsImg      from './assets/sections/menu/macarons.png';


// ─── MODO MANUTENÇÃO ──────────────────────────────────────────
//  Mude para true para ativar a página de "fora do ar"
export const siteEmManutencao = true;


// ════════════════════════════════════════════════════════════
//  NAVEGAÇÃO
//  - logo: automático (não precisa mexer)
//  - links: labels e âncoras do menu de navegação
//  - cta: botão "Fazer Pedido" — troque o link do WhatsApp aqui
// ════════════════════════════════════════════════════════════
export const navigation = {
  logo,
  links: [
    { label: "Fornada Ao VIVO", href: "#hero" },
    { label: "Nossa História",  href: "#historia" },
    { label: "Cardápio",        href: "#cardapio" },
    { label: "Nosso Espaço",    href: "#espaco" },
    { label: "Como Funciona",   href: "#como-funciona" },
    { label: "Contato",        href: "#contato" },
  ],
  cta: {
    label: "Fazer Pedido",
    href: "https://wa.me/5511993968023",
  },
};


// ════════════════════════════════════════════════════════════
//  HERO — Seção principal (topo do site)
// ════════════════════════════════════════════════════════════
export const heroContent = {
  titleLine1: "Pão de",
  titleLine2: "Verdade.",
  subtitle:   "Micropadaria artesanal em Perdizes. Fermentação natural de 48h, produção limitada e atenção a cada etapa do processo.",
  meta: [
    { icon: "MapPin", text: "Perdizes, São Paulo" },
    { icon: "Clock",  text: "Qua–Sáb" },
  ],
  ctaPrimary:   { label: "Ver Cardápio", href: "#cardapio" },
  ctaSecondary: { label: "WhatsApp",     href: "https://wa.me/5511993968023" },
  logo,
};


// ════════════════════════════════════════════════════════════
//  FORNADA TRACKER — Widget de cronômetro ao vivo (dentro do Hero)
//  - productName: nome do produto que aparece no widget
//  - whatsapp: link de reserva do botão "Reservar Unidade"
// ════════════════════════════════════════════════════════════
export const fornadaTracker = {
  productName: "Pão de Castanhas",             // ← Troque o produto em destaque
  whatsapp: "https://wa.me/5511993968023",     // ← Troque para redirecionar a reserva
};


// ════════════════════════════════════════════════════════════
//  MARQUEE — Faixa de texto animada
// ════════════════════════════════════════════════════════════
export const marqueeText = "Fermentação Natural • Feito à Mão • Sem Conservantes • Perdizes SP • Produção Limitada • Reservas Abertas • ";


// ════════════════════════════════════════════════════════════
//  IDENTITY — Frase de identidade da marca (strip central)
// ════════════════════════════════════════════════════════════
export const identityPhrase = "Acreditamos que comer bem é um ato gentil — com o corpo, com o tempo e com quem faz.";


// ════════════════════════════════════════════════════════════
//  NOSSA HISTÓRIA — Seção com foto e estatísticas
//  - image: foto das fundadoras (substituir o arquivo em sections/story/)
//  - imageAlt: texto alternativo de acessibilidade da foto
//  - stats: números em destaque (value + label)
// ════════════════════════════════════════════════════════════
export const storyContent = {
  label: "Nossa Essência",
  title: "Por @flaviaounada e @helena_doliveira",
  text:  { text: "A Rústica nasceu de uma ideia simples: pão de verdade, sem pressa e sem atalhos. Fermentação natural de 48 horas, produção em lotes limitados e atenção a cada detalhe do processo. Não é escala — é cuidado.", animate: true },
  image:    creatorsImg,
  imageAlt: "Flávia e Helena, fundadoras da Rústica Micropadaria",
  stats: [
    { value: "48h",  label: "Fermentação", animate: true },
    { value: "100%", label: "Natural", animate: true },
    { value: "0",    label: "Conservantes", animate: false },
  ],
};


// ════════════════════════════════════════════════════════════
//  CARDÁPIO — Bloco de produtos (scroll horizontal no desktop)
//  - menuIntro: título e subtítulo do bloco escuro
//  - products: lista de produtos
//    Para adicionar produto: copie um item e adicione no array.
//    Para remover: delete o item correspondente.
//    Para trocar foto: substitua o .png em sections/menu/ e atualize o import acima.
// ════════════════════════════════════════════════════════════
export const menuIntro = {
  title:    "Nossa\nFornada.",    // \n cria quebra de linha
  subtitle: "Produção limitada e respeito ao tempo de cada massa. Reserve pelo WhatsApp.",
};

export const products = [
  {
    id: 1,
    name:  "Bolo de Banana com Nozes",
    desc:  "Fofo, saboroso e perfeito para o café da manhã.",
    tag:   "Todos os dias",
    image: boloBananaImg,
  },
  {
    id: 2,
    name:  "Pão de Castanhas",
    desc:  "Rústico de fermentação natural, com caju, nozes e baru.",
    tag:   "Sábados",
    image: paoCastanhasImg,
  },
  {
    id: 3,
    name:  "Croissant de Limão",
    desc:  "Massa folhada leve com toque cítrico de torta de limão.",
    tag:   "Diário",
    image: croissantImg,
  },
  {
    id: 4,
    name:  "Pizza Artesanal",
    desc:  "Massa leve, fermentação natural e crocância irresistível.",
    tag:   "Sex & Sáb",
    image: pizzaImg,
  },
  {
    id: 5,
    name:  "Macaron de Morango",
    desc:  "Delicadeza francesa com morango fresco.",
    tag:   "Sábados",
    image: macaronsImg,
  },
];


// ════════════════════════════════════════════════════════════
//  COMO FUNCIONA — Passo a passo de como fazer um pedido
// ════════════════════════════════════════════════════════════
export const howItWorks = {
  label: "Para Nossos Clientes",
  title: "Como Funciona",
  steps: [
    {
      num:   "01",
      title: "Acompanhe no Instagram",
      desc:  "Toda semana postamos as novidades da fornada. Fique de olho no @rustica.micropadaria.",
    },
    {
      num:   "02",
      title: "Reserve pelo WhatsApp",
      desc:  "Nossa produção é limitada. Mande uma mensagem pra garantir o seu antes que acabe.",
    },
    {
      num:   "03",
      title: "Retire em Perdizes",
      desc:  "Venha buscar fresquinho na Rua Caraíbas, 1282. Qua–Sex 10h–18h, Sáb 9h–14h.",
    },
  ],
};


// ════════════════════════════════════════════════════════════
//  GALERIA — Fotos do espaço (mosaic grid)
//  Para trocar uma foto: substitua o arquivo em sections/gallery/
//  mantendo o mesmo nome (vibe-1.png, vibe-2.png, vibe-3.png).
// ════════════════════════════════════════════════════════════
export const gallery = {
  label:  "Nosso Espaço",
  title:  "A Vibe Rústica",
  images: [vibe1, vibe2, vibe3],
};


// ════════════════════════════════════════════════════════════
//  CTA BANNER — Faixa de chamada para reserva (antes do footer)
// ════════════════════════════════════════════════════════════
export const ctaBanner = {
  title:    "Quer garantir a fornada da semana?",
  btnLabel: "Reservar Agora",
  whatsapp: "https://wa.me/5511993968023",   // ← Troque o link aqui
};


// ════════════════════════════════════════════════════════════
//  FOOTER
// ════════════════════════════════════════════════════════════
export const footerContent = {
  tagline: "Onde o tempo se transforma em pão de verdade.",

  address: {
    title:   "Endereço",
    text:    "Rua Caraíbas, 1282\nPerdizes, São Paulo\nCEP 05020-000",
    mapLink: "https://www.google.com/maps/search/?api=1&query=Rua+Caraíbas+1282+São+Paulo",
  },

  hours: {
    title: "Horários",
    days: [
      { label: "Quarta a Sexta", time: "10h — 18h" },
      { label: "Sábado",         time: "09h — 14h" },
    ],
  },

  founders: {
    title: "Fundadoras",
    names: ["@flaviaounada", "@helena_doliveira"],
  },

  contact: {
    title:     "Contato",
    phone:     "(11) 99396-8023",
    email:     "contato@rusticamicropadaria.com",
    whatsapp:  "https://wa.me/5511993968023",
    instagram: "https://instagram.com/rustica.micropadaria",
  },

  copyright: "© 2026 Rústica Micropadaria",
  madeBy:    "Feito com 💚 por Flávia e Helena",
};
