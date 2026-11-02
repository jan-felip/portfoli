/**
 * Tota la informació personal del portfoli viu aquí.
 * Canvia aquests valors i la web s'actualitza sola.
 */

export interface Link {
  label: string;
  href: string;
  /** Nom d'icona de Bootstrap Icons, sense el prefix "bi-". */
  icon: string;
}

export interface Stat {
  label: string;
  value: string;
  icon: string;
}

/** Marca d'un projecte: el nom amb la seva tipografia i la icona a sobre. */
export interface ProjectBrand {
  name: string;
  /** Icona de Bootstrap Icons, sense el prefix "bi-". */
  icon: string;
  color: string;
  /** font-family CSS; la font s'ha de carregar a index.html. */
  font: string;
}

export interface Project {
  title: string;
  description: string;
  year: string;
  tags: string[];
  /** Ruta dins de /public (p. ex. "projects/netscan.png"). Opcional. */
  image?: string;
  /** Icona que es mostra quan no hi ha imatge. */
  icon: string;
  /** Portada de marca (fons blanc, icona i nom) en lloc d'imatge o icona. */
  brand?: ProjectBrand;
  url?: string;
  repo?: string;
  /** Es mostra a la portada. */
  featured?: boolean;
  /** Webs col·laboratives: què hi has fet tu (p. ex. "Maquetació i accessibilitat"). */
  role?: string;
  /** Webs col·laboratives: quanta feina hi has fet, d'1 (puntual) a 3 (principal). */
  involvement?: 1 | 2 | 3;
}

export interface Company {
  name: string;
  /** Ruta dins de /public (p. ex. "logos/empresa.svg"). Si no n'hi ha, es mostra el nom. */
  logo?: string;
  url?: string;
}

export interface CvEntry {
  /** Text lliure que es mostra a la targeta (p. ex. "Estiu de 2023"). */
  period: string;
  /** Inici en format "AAAA-MM": ordena i col·loca l'entrada a la cronologia. */
  start?: string;
  /** Final "AAAA-MM" (mes inclòs). Si no hi és, l'entrada continua fins avui. */
  end?: string;
  title: string;
  place: string;
  description?: string;
  /** Marca l'entrada com a actual (punt de color). */
  current?: boolean;
  url?: string;
  /** Logo del lloc dins de /public. */
  logo?: string;
  /** Imatge de dalt de la targeta de la cronologia, dins de /public (p. ex. "timeline/escola.jpg"). */
  image?: string;
  /** Què has fet en aquest lloc, una línia per punt. */
  tasks?: string[];
  tags?: string[];
}

export interface Profile {
  name: string;
  /** Nom complet de la pàgina Sobre mi: la segona línia va sota la primera. */
  fullName: [string, string];
  /** Foto quadrada dins de /public (p. ex. "photo.jpg"). Si no n'hi ha, es mostra un marc buit. */
  photo?: string;
  initials: string;
  tagline: string;
  /** Frases que escriu la màquina d'escriure de la portada. */
  roles: string[];
  rolePrefix: string;
  location: string;
  email: string;
  /** PDF del currículum dins de /public. */
  cvFile: string;
  links: Link[];
  /** Contactes que només surten al peu, davant de "links". */
  footerLinks: Link[];
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  stats: Stat[];
}

export const PROFILE: Profile = {
  name: 'Jan Felip',
  fullName: ['Jan Felip', 'Urgell'],
  photo: 'jo.webp',
  initials: 'JF',
  tagline: 'Desenvolupo webs i eines a mida, del disseny al servidor.',
  // Prefix fix davant de cada frase (deixa'l buit si les frases ja són completes).
  rolePrefix: '',
  roles: [
    'Sóc desenvolupador web full stack',
    'Cursant un Cicle Superior de Desenvolupament d’Aplicacions Web',
    'Apassionat de les xarxes i els servidors',
    'Algú que cuida cada píxel',
  ],
  location: 'Tàrrega, Lleida',
  email: 'hola@walker.cat',
  cvFile: 'cv.pdf',
  links: [
    { label: 'GitHub', href: 'https://github.com/jan-felip', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jan-felip/', icon: 'linkedin' },
  ],
  footerLinks: [
    { label: 'Discord', href: 'https://discord.com/users/736374081330348032/', icon: 'discord' },
  ],
  about: {
    eyebrow: 'Qui sóc',
    title: 'Codi net, disseny cuidat i ganes d’aprendre.',
    paragraphs: [
      'Déu vos guard, benvingut al meu portafoli. Sóc un desenvolupador web en formació, actualment estudiant a iLERNA Lleida i intern de pràctiques a USE-IT.',
      'Tot coneixement és poc, i jo estic aquí per aprendre i créixer com a programador i com a persona.',
    ],
  },
  stats: [
    { label: 'Projectes', value: '12', icon: 'grid-1x2' },
    { label: 'Tecnologies', value: '15', icon: 'stack' },
    { label: 'Anys programant', value: '3', icon: 'calendar3' },
    { label: 'Cafès', value: '∞', icon: 'cup-hot' },
  ],
};

/** Grup d'eines de la secció "Amb què treballo". */
export interface ToolGroup {
  title: string;
  /** Icona de Bootstrap Icons, sense el prefix "bi-". */
  icon: string;
  tools: string[];
}

/** Eines amb què treballes, agrupades. Canvia, treu o afegeix el que calgui. */
export const TOOLS: ToolGroup[] = [
  { title: 'Frontend', icon: 'window', tools: ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'SCSS'] },
  { title: 'Backend', icon: 'hdd-stack', tools: ['PHP', 'Laravel', 'Drupal', 'Java', 'Python', 'Node.js', 'MySQL'] },
  { title: 'Eines', icon: 'tools', tools: ['Git', 'VS Code', 'Figma', 'npm', 'Docker', 'OnlyOffice'] },
];

/** Empreses amb qui has treballat o col·laborat. */
export const COMPANIES: Company[] = [
  { name: 'SoluTec Tàrrega', logo: 'logos/solutec-tarrega.svg', url: 'https://www.solutec.cat' },
  { name: 'USE-IT Lleida', logo: 'logos/use-it-lleida.png', url: 'https://useit.es/ca' },
  { name: 'Cubecat', logo: 'logos/cubecat.png', url: 'https://www.cubecat.cat' },
];

// On has treballat. "tasks" és la llista de coses fetes a cada lloc, com a LinkedIn.
export const EXPERIENCE: CvEntry[] = [
  {
    period: 'Estiu de 2023',
    image: 'timeline/solutec-tarrega-1.webp',
    start: '2023-06',
    end: '2023-08',
    title: 'Instal·lació i manteniment',
    place: 'SoluTec · Tàrrega',
    logo: 'logos/solutec-tarrega_small.svg',
    url: 'https://www.solutec.cat',
    current: true,
    description: 'Treball a l’empresa familiar; sempre va bé adquirir coneixements.',
    tasks: [
      'Instal·lació, revisió i manteniment d’aparells d’aire condicionat.',
      'Instal·lació, revisió i manteniment de calderes de gas i gasoil.',
    ],
  },
  {
    period: 'Hivern de 2024 a 2025',
    image: 'timeline/solutec-tarrega-2.webp',
    start: '2024-12',
    end: '2025-02',
    title: 'Instal·lació i manteniment',
    place: 'SoluTec · Tàrrega',
    logo: 'logos/solutec-tarrega_small.svg',
    url: 'https://www.solutec.cat',
    current: true,
    description: 'Treball a l’empresa familiar; sempre va bé adquirir coneixements.',
    tasks: [
      'Revisió, neteja i manteniment d’estufes de pellets i calderes de gas i gasoil.',
    ],
  },
  {
    period: 'Hivern de 2024 a estiu de 2026',
    image: 'timeline/cubecat-online.webp',
    start: '2024-12',
    end: '2025-02',
    title: 'Programació i gestió de comunitat',
    place: 'Cubecat · Online',
    logo: 'logos/cubecat_small.png',
    url: 'https://www.cubecat.cat',
    current: true,
    description: 'Un hobbie que va anar escalant.',
    tasks: [
      'Encarregat i responsable de la secció de desenvolupament durant any i mig.',
      'Desenvolupament de mecàniques, esdeveniments i continguts en llenguatges adaptats a Minecraft.',
      'Programació i manteniment de bots de Dsicord amb JavaScript i Python.',
      'Gestió de la comunitat.',
      'Membre fundador de l’Associació sense ànim de lucre Cubecat.',
    ],
  },
  {
    period: '2026 - actualitat',
    image: 'timeline/useit-lleida.webp',
    start: '2026-03',
    title: 'Desenvolupador web (pràctiques)',
    place: 'USE-IT · Lleida',
    logo: 'logos/use-it-lleida_small.png',
    url: 'https://useit.es/ca',
    current: true,
    description: 'Treball en equip rotant entre projectes web de clients.',
    tasks: [
      'Adaptació de dissenys en webs Drupal amb SCSS.',
      'Introducció i revisió de continguts.',
      'Control de versions amb Git.',
      'Creació de mòduls Drupal amb PHP i Twig.',
      'Manteniment de servidors.',
    ],
    tags: ['Drupal', 'PHP', 'SCSS', 'JavaScript', 'Twig', 'Git'],
  },
];

// On has estudiat.
export const EDUCATION: CvEntry[] = [
  {
    period: '2009 - 2018',
    image: 'timeline/jacint-verdaguer-tarrega.webp',
    start: '2009-09',
    end: '2018-06',
    title: 'L’escola que em va acollir des de petit',
    place: 'Jacint Verdaguer · Tàrrega',
    url: 'https://agora.xtec.cat/ceip-jacint-verdaguer-tarrega/',
    current: false,
    tasks: [
      'Educació primària. Tot i demostrar un fort interès per la informàtica des de petit, no hi ha gran cosa a destacar d’aquests anys encara...',
    ],
  },
  {
    period: '2018 - 2022',
    image: 'timeline/manuel-de-pedrolo-tarrega-1.webp',
    start: '2018-09',
    end: '2022-06',
    title: 'L’institut on vaig començar a prosperar',
    place: 'Manuel de Pedrolo · Tàrrega',
    url: 'https://insmanueldepedrolo2.ieduca.com/',
    current: false,
    tasks: [
      'Educació secundària. Amb més eines a l’abast, vaig començar a aprendre per mi mateix i a fer els meus primers projectes de programació. Coses simples però útils per assentar bases i conèixer noves tecnologies.',
    ],
  },
  {
    period: '2022 - 2024',
    image: 'timeline/manuel-de-pedrolo-tarrega-2.webp',
    start: '2022-09',
    end: '2024-06',
    title: 'Batxillerat tecnològic',
    place: 'Manuel de Pedrolo · Tàrrega',
    url: 'https://insmanueldepedrolo2.ieduca.com/',
    current: false,
    tasks: [
      'Havent finalitzat l’ESO, vaig decidir seguir amb un batxillerat tecnològic per aprofundir en informàtica i programació. Malauradament, a classe poca cosa vaig aprendre de programació més enllà d’algunes pràctiques amb C++ i Arduino, però en destaco les classes de física, matemàtiques i tecnologia, que em van ajudar a entendre millor el món que m’envolta i a desenvolupar el pensament lògic.',
    ],
  },
  {
    period: '2024 - 2025',
    image: 'timeline/marius-torres-lleida.webp',
    start: '2024-09',
    end: '2025-06',
    title: 'Batxillerat tecnològic',
    place: 'Marius Torres · Lleida',
    url: 'https://ioc.xtec.cat/educacio/',
    current: false,
    tasks: [
      'Per falta de temps el segon any, vaig repartir-me les assignatures per acabar-lo en dos cursos, pel que el vaig estudiar a distància el darrer any a través de l’Institut Obert de Catalunya matriculat al Marius Torres de Lleida. Tot i la controvèrsia, vaig poder acabar el batxillerat amb un bon nivell.',
    ],
  },
  {
    period: '2025 - actualitat',
    image: 'timeline/ilerna-lleida.webp',
    start: '2025-09',
    title: 'CFGS Desenvolupament d’Aplicacions Web',
    place: 'iLERNA · Lleida',
    url: 'https://www.ilerna.es/',
    current: true,
    tasks: [
      'Amb anhels d’accedir a un cicle superior relacionat amb el que m’apassionava, vaig acabar entrant a iLerna. Aquí finalment vaig aprendre nous llenguatges de programació i metodologies, i així segueix sent fins avui. A hores d’ara, compagino els estudis amb les pràctiques de l’estada a l’empresa.',
      'En destaco la programació frontend i backend amb Angular, TypeScript, PHP, Laravel, Java, bases de dades relacionals i no relacionals, desplegament de Dockers i control de versions amb Git.',
    ],
  },
];

export const CERTIFICATIONS: CvEntry[] = [
  { period: '2026', title: 'Nom del certificat', place: 'Entitat emissora', url: '#' },
  { period: '2025', title: 'Nom del certificat', place: 'Entitat emissora', url: '#' },
];

export const LANGUAGES: string[] = ['Català', 'Castellà', 'Anglès'];

/**
 * Webs de l'empresa on has col·laborat. Ordena-les de més a menys feina teva.
 * involvement: 3 = principal, 2 = parcial, 1 = puntual.
 */
export const COLLABORATIONS: Project[] = [
  {
    title: 'Redisseny 2026',
    description: 'Institut Municipal d’Hisenda de Barcelona',
    year: '2026',
    tags: ['Drupal', 'SCSS'],
    icon: 'globe2',
    image: 'projects/hisenda.jpg',
    url: 'https://ajuntament.barcelona.cat/hisenda/ca',
    role: 'Adaptació de tot el disseny al nou estil de les webs de l’Ajuntament de Barcelona',
    involvement: 3,
  },
  // Etiquetes de tecnologia per revisar.
  {
    title: 'PEUSA',
    description: 'Comercialitzadora d’energia, manteniment i instal·lacions',
    year: '2026',
    tags: ['Drupal', 'PHP', 'SCSS'],
    icon: 'globe2',
    image: 'projects/peusa.jpg',
    url: 'https://www.peusa.org/',
    role: 'Ajustaments del disseny i gràfics SVGs generats en PHP a partir d’APIs i CSVs',
    involvement: 2,
  },
  {
    title: 'SJD Terres de Lleida',
    description: 'Sant Joan de Déu Terres de Lleida',
    year: '2026',
    tags: ['Drupal', 'SCSS'],
    icon: 'globe2',
    image: 'projects/sjd.jpg',
    url: 'https://www.sjd-lleida.org/',
    role: 'Introducció de tot el contingut, hovers i ajust de les animacions',
    involvement: 2,
  },
  {
    title: 'PEUSA Distribució',
    description: 'Distribuïdora elèctrica: talls, avaries i accés a la xarxa',
    year: '2026',
    tags: ['Drupal', 'SCSS'],
    icon: 'globe2',
    image: 'projects/peusadist.jpg',
    url: 'http://www.peusadistribucio.org/',
    role: 'Ajustos d’animacions, detalls de disseny i petits canvis a l’estructura i les vistes',
    involvement: 1,
  },
  {
    title: 'COIM',
    description: 'Centre d’Odontologia Integrada de Mollerussa',
    year: '2026',
    tags: ['Drupal', 'SCSS'],
    icon: 'globe2',
    image: 'projects/coim.jpg',
    url: 'https://clinicadentalmollerussa.com/',
    role: 'Ajustos puntuals de codi i canvis de contingut',
    involvement: 1,
  },
];

export const PROJECTS: Project[] = [
  {
    title: 'Netscan',
    description: 'Escàner de xarxa portable amb tauler web, escaneig de ports en viu i terminal SSH, amb una interfície amigable.',
    year: '2026',
    tags: ['Python', 'JavaScript', 'Xarxes'],
    icon: 'router',
    // Mateix nom, tipografia i verd que la capçalera del tauler de netscan.
    brand: { name: 'netscan', icon: 'router-fill', color: '#58cc02', font: '"Nunito", system-ui, sans-serif' },
    featured: true,
  },
  {
    title: 'SoluTec',
    description: 'Web per a un servei tècnic local amb mapa de cobertura i animacions de marca.',
    year: '2026',
    tags: ['Angular', 'GSAP', 'Disseny'],
    icon: 'tools',
    featured: true,
  },
  {
    title: 'Tempad',
    description: 'Un panell de gestió de dockers, entre altres coses, inspirat en les Tempads de la sèrie Loki.',
    year: '2024 - 2026',
    tags: ['HTML', 'JavaScript', 'SCSS', 'Python', 'Flask', 'Docker'],
    image: 'projects/tempad.jpg',
    url: 'https://tempad.walker.cat/',
    icon: 'database',
    featured: true,
  },
  {
    title: 'Projecte cinc',
    description: 'Descripció breu del projecte: què fa i què hi vas aprendre.',
    year: '2025',
    tags: ['JavaScript', 'Disseny'],
    icon: 'palette',
  },
  {
    title: 'Projecte sis',
    description: 'Descripció breu del projecte: què fa i què hi vas aprendre.',
    year: '2024',
    tags: ['Python'],
    icon: 'terminal',
  },
];
