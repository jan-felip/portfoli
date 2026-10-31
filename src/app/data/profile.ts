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

export interface Project {
  title: string;
  description: string;
  year: string;
  tags: string[];
  /** Ruta dins de /public (p. ex. "projects/netscan.png"). Opcional. */
  image?: string;
  /** Icona que es mostra quan no hi ha imatge. */
  icon: string;
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
}

export interface Profile {
  name: string;
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
  email: 'hola@exemple.cat',
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
    eyebrow: 'Sobre mi',
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

export const EXPERIENCE: CvEntry[] = [
  {
    period: '2026 - actualitat',
    title: 'Desenvolupador web (pràctiques)',
    place: 'Empresa de pràctiques',
    description: 'Explica aquí què fas a les pràctiques: tecnologies, projectes i responsabilitats.',
    current: true,
  },
  {
    period: '2025',
    title: 'Projecte freelance',
    place: 'Client',
    description: 'Una línia sobre la feina feta i el resultat.',
  },
];

export const EDUCATION: CvEntry[] = [
  {
    period: '2024 - actualitat',
    title: 'CFGS Desenvolupament d’Aplicacions Web',
    place: 'Nom de l’institut · Ciutat',
    current: true,
  },
  {
    period: '2022 - 2024',
    title: 'Estudis anteriors',
    place: 'Nom del centre · Ciutat',
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
  {
    title: 'Web client dos',
    description: 'Què fa la web i per a qui és, en una frase.',
    year: '2026',
    tags: ['Angular', 'TypeScript'],
    icon: 'window-stack',
    role: 'Components del formulari i validacions',
    involvement: 2,
  },
  {
    title: 'Web client tres',
    description: 'Què fa la web i per a qui és, en una frase.',
    year: '2026',
    tags: ['PHP'],
    icon: 'bug',
    role: 'Correcció d’errors i revisió d’accessibilitat',
    involvement: 1,
  },
];

export const PROJECTS: Project[] = [
  {
    title: 'Netscan',
    description: 'Escàner de xarxa portable amb tauler web, escaneig de ports en viu i terminal SSH.',
    year: '2026',
    tags: ['Python', 'JavaScript', 'Xarxes'],
    icon: 'router',
    featured: true,
  },
  {
    title: 'T1 Energy',
    description: 'Rèplica fidel d’una web corporativa per a la classe d’AWS, amb versió accessible WCAG 2.2.',
    year: '2026',
    tags: ['Angular', 'TypeScript', 'SCSS'],
    icon: 'lightning-charge',
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
    title: 'Projecte quatre',
    description: 'Descripció breu del projecte: què fa i què hi vas aprendre.',
    year: '2025',
    tags: ['Laravel', 'PHP'],
    icon: 'database',
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
