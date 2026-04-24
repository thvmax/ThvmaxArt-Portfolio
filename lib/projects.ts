export interface Project {
  name: string;
  year: string;
  tags: string;
  desc: string;
  hue: number;
  next: number;
}

export const projects: Project[] = [
  {
    name: 'STING Nightlife Campaign',
    year: '2024',
    tags: 'FMCG · TVC Campaign',
    desc: 'Art Direction · Visualization · TVC Production. Led visual direction for Sting Energy nightlife campaign including TV commercial production and digital rollouts.',
    hue: 30,
    next: 1,
  },
  {
    name: 'Pepsi Titan Wall Art Design',
    year: '2023',
    tags: 'FMCG · Wall Art',
    desc: 'Art Direction · Illustration · 3D Visualization. A massive wall art and mural project exploring the scale of the brand through detailed 3D visualization and illustration.',
    hue: 220,
    next: 2,
  },
  {
    name: 'Pepsi Talent Development Program',
    year: '2023',
    tags: 'FMCG · Campaign',
    desc: "Art Direction · Gen Z Campaign KV. Designed the key visual and creative direction for Pepsi's talent development program targeting Gen Z creators and audiences.",
    hue: 280,
    next: 3,
  },
  {
    name: 'Pepsi Meals AR Campaign',
    year: '2022',
    tags: 'FMCG · AR Experience',
    desc: 'Art Direction · AR Filter Visualization. Created the visual identity and 3D assets for an interactive Augmented Reality campaign bridging digital and physical touchpoints for Pepsi meals.',
    hue: 200,
    next: 4,
  },
  {
    name: 'AIA Mandalay Office Opening',
    year: '2022',
    tags: 'Financial · Launch KV',
    desc: "Art Direction · Traditional Myanmar Elements. Handled the key visuals for AIA's regional office launch by integrating traditional cultural elements with modern financial branding.",
    hue: 0,
    next: 0,
  },
];

export interface ShowcaseCard {
  name: string;
  cat: string;
  hue: number;
}

export const showcaseCards: ShowcaseCard[] = [
  { name: 'Pepsi-Cola', cat: 'Social Advertising', hue: 220 },
  { name: 'Logo & Identity', cat: 'Brand Identity', hue: 0 },
  { name: 'Velosi Asset', cat: 'Social Advertising', hue: 30 },
  { name: '7UP Social Series', cat: 'Social Advertising', hue: 140 },
  { name: 'STING & Pepsi', cat: 'Motion Design', hue: 280 },
  { name: 'Iremia App', cat: 'UI Design', hue: 200 },
  { name: 'Product Photography', cat: 'Retouching', hue: 180 },
  { name: 'Pepsi 2024 Calendar', cat: 'Offline Branding', hue: 220 },
];
