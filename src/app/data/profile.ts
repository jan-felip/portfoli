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
  period: string;
  title: string;
  place: string;
  description?: string;
  /** Marca l'entrada com a actual (punt de color). */
  current?: boolean;
  url?: string;
  /** Logo del lloc dins de /public. */
  logo?: string;
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
  photo: undefined,
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
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  ],
  footerLinks: [
    // Posa-hi el teu enllaç: https://discord.com/users/<el-teu-id> o una invitació.
    { label: 'Discord', href: 'https://discord.com/', icon: 'discord' },
  ],
  about: {
    eyebrow: 'Qui sóc',
    title: 'Codi net, disseny cuidat i ganes d’aprendre.',
    paragraphs: [
      'Escriu aquí qui ets, què estudies i què t’agrada fer. Dues o tres frases curtes funcionen millor que un paràgraf llarg.',
      'Pots afegir-hi la teva formació, les tecnologies que fas servir o què busques ara mateix.',
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
    period: '2026 - actualitat',
    title: 'Desenvolupador web (pràctiques)',
    place: 'USE-IT · Lleida',
    logo: 'logos/use-it-lleida.png',
    url: 'https://useit.es/ca',
    current: true,
    description: 'Treball en equip rotant entre projectes web de clients.',
    tasks: [
      'Maquetació i adaptació de dissenys en webs Drupal amb SCSS',
      'Hovers, animacions i ajustos de disseny',
      'Gràfics SVG generats en PHP a partir d’APIs i CSVs',
      'Introducció i revisió de continguts',
    ],
    tags: ['Drupal', 'PHP', 'SCSS'],
  },
];

// On has estudiat.
export const EDUCATION: CvEntry[] = [
  {
    period: '2024 - actualitat',
    title: 'CFGS Desenvolupament d’Aplicacions Web',
    place: 'Ilerna · Lleida',
    url: 'https://www.ilerna.es/',
    current: true,
    tasks: [
      'Programació frontend i backend: Angular, TypeScript, PHP, Laravel i Java',
      'Bases de dades, desplegament i control de versions amb Git',
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
