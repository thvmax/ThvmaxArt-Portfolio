// Intrinsic sizes of the artwork in /public/work/<slug>/<name>.jpg,
// so every frame keeps the artwork's own proportions — nothing is cropped
// to fit a box. Regenerate when images are added or replaced.

export const workMedia: Record<string, Record<string, [number, number]>> = {
  'a-hta-identity': { 'bag': [953, 747], 'card': [1800, 1800], 'hero': [1456, 816], 'portrait': [1200, 1800], 'poster': [962, 909], 'silhouette': [1800, 1350], 'tag': [752, 671] },
  'aia-mandalay-office-opening': { 'hero': [1920, 964], 'office': [1536, 846], 'palace': [747, 510], 'umbrellas': [798, 1203], 'visual': [1447, 1800] },
  'aia-member-propositions': { 'benefits': [2000, 1125], 'cover': [2000, 1125], 'foreign-hospitals': [2000, 1125], 'hero': [2400, 1600], 'local-hospitals': [2000, 1125], 'partners': [2000, 1125], 'sports-fitness': [2000, 1125], 'telemedicine': [2000, 1125], 'terms': [2000, 1125] },
  'insight-3d-identity': { 'emboss': [1236, 926], 'hero': [2400, 1200], 'laptop': [983, 743], 'logo': [1600, 1600], 'sphere': [1200, 1800], 'tote': [711, 960] },
  'insurance-social-advertising': { 'aia-aya-pay': [1200, 1500], 'aia-crossword': [1200, 1500], 'aia-push': [1250, 1500], 'aia-sher': [1350, 1080], 'ains-ev': [1500, 1500], 'ains-future': [1500, 1500], 'ains-sleep': [1500, 1500], 'ains-together': [1500, 1500], 'ains-vehicle': [1500, 1500], 'alife-beauty': [1500, 1500], 'alife-dance': [1500, 1500], 'alife-flow': [1500, 1500], 'alife-grow': [1500, 1500], 'alife-journey': [1500, 1500] },
  'iremia-meditation-app': { 'hero': [2400, 1597], 'onboarding': [1800, 1198], 'screens': [2400, 1597], 'session': [1800, 1198] },
  'logofolio': { 'grid': [1612, 1409], 'hero': [2400, 1350] },
  'pepsi-2024-calendar': { 'apr': [1478, 518], 'aug': [1469, 516], 'dec': [1454, 521], 'feb': [1472, 514], 'hero': [1400, 1050], 'jan': [1492, 512], 'jul': [1469, 515], 'jun': [1487, 513], 'may': [1464, 516], 'nov': [1473, 515], 'pages': [1400, 1434], 'sep': [1459, 512] },
  'pepsi-company-profile': { 'contact': [1202, 1700], 'cover': [1202, 1700], 'hero': [2400, 1800], 'page-02': [1202, 1700], 'page-03': [1202, 1700], 'page-04': [1202, 1700], 'page-05': [1202, 1700], 'page-06': [1202, 1700], 'page-07': [1202, 1700], 'page-08': [1202, 1700] },
  'pepsi-meals-ar-campaign': { 'dishes': [427, 951], 'filters': [1800, 1629], 'hero': [1920, 1038], 'kv': [1439, 1800], 'model': [1239, 1404], 'reminder': [1436, 1800] },
  'pepsi-mt-posm': { 'gondola-mixed': [1800, 1800], 'gondola-pepsi': [1800, 1800], 'gondola-sting': [1800, 1800], 'hero': [1920, 1080], 'mirinda-banner': [1800, 1012], 'promotion-calendar': [1282, 1800], 'promotion-cans': [1282, 1800] },
  'pepsi-talent-development': { 'card': [1305, 1620], 'emblem': [1418, 1028], 'hero': [1920, 1080], 'kv': [1270, 1550], 'standee': [2060, 1604], 'thematic': [1280, 1560] },
  'pepsi-titan-wall-art': { 'hero': [1920, 1080], 'merch': [1057, 993], 'office-brand': [1709, 1404], 'render-1': [2026, 1342], 'render-2': [1374, 772], 'stickers': [1473, 1460], 'wall-front': [1374, 474], 'wall': [2233, 773], 'wallpaper': [1646, 1208] },
  'pepsico-social-advertising': { '7up-cooler': [1500, 1500], '7up-feeling-up': [1500, 1500], '7up-hike': [1500, 1500], 'mirinda-clock': [1500, 1500], 'mirinda-girl': [1500, 1500], 'mirinda-green': [1500, 1500], 'mirinda-orange': [1500, 1500], 'mirinda-splash': [1500, 1500], 'pepsi-emoji': [1200, 1500], 'pepsi-hand': [1500, 1500], 'pepsi-ice': [1500, 1500], 'pepsi-kiosk': [1229, 1500], 'pepsi-memofest': [1219, 1500], 'pepsi-new-year': [1500, 1500], 'pepsi-padauk': [1219, 1500], 'pepsi-poster': [1061, 1500], 'pepsi-viber': [1500, 956], 'pepsi-womens-day': [1200, 1500], 'sting-bottles': [1500, 1500], 'sting-can': [1500, 1500], 'sting-cans': [1500, 1500], 'sting-gold': [1500, 1500], 'sting-red': [1500, 1500] },
  'product-retouch': { 'carlsberg': [736, 845], 'lays': [736, 736], 'matcha': [736, 898], 'serum': [736, 898], 'whisky': [736, 845] },
  'skin-town-identity': { 'app': [1600, 1600], 'jar': [1600, 1600], 'logo': [1600, 1600], 'overview': [1600, 1600], 'signage': [1600, 1600] },
  'sting-nightlife-repositioning': { 'booth': [1090, 938], 'crowd': [953, 860], 'dj': [953, 945], 'event-poster': [1475, 1800], 'event': [1718, 688], 'hero': [1920, 1080], 'interior': [1093, 1008], 'kv-draft': [1128, 1694], 'kv-final': [1132, 1698], 'kv-qr': [1800, 1800], 'model': [844, 1472], 'product-kv': [1462, 1800], 'thematic-kv': [1200, 1800] },
  'truemoney-social-advertising': { 'agent': [1500, 1500], 'app': [1500, 1500], 'free': [1500, 1500], 'thank-you': [1500, 1500], 'transfer': [1500, 1500] },
  'velosi-brand-channel': { 'commemoration-day': [1000, 1350], 'eid-al-etihad': [1000, 1350], 'environment-day': [1228, 1500], 'independence-day': [900, 1200], 'ramadan': [1500, 1500], 'womens-day': [1229, 1500] },
};
