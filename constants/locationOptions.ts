export type LocationMap = Record<string, Record<string, string[]>>;

/**
 * Kashmir / J&K district → block → village hierarchy.
 *
 * Extend or replace this data without changing the form logic.
 */
export const LOCATION_MAP: LocationMap = {
  Anantnag: {
    Achabal: ["Achabal", "Brakpora", "Dialgam", "Muniwar", "Salia"],
    Anantnag: ["Anantnag", "Mattan", "Khanabal", "Bumzoo", "Lalan"],
    Bijbehara: ["Bijbehara", "Srigufwara", "Arwani", "Waghama", "Gadiseer"],
    Dachnipora: ["Dachnipora", "Aishmuqam", "Sallar", "Hapatnar", "Dessu"],
    Khoveripora: ["Khoveripora", "Akingam", "Larkipora", "Sagam", "Nowgam"],
    Pahalgam: ["Pahalgam", "Lidroo", "Aru", "Laripora", "Chandanwari"],
    Shangus: ["Shangus", "Chittergul", "Uttersoo", "Ranipora", "Kralpora"],
    Verinag: ["Verinag", "Dooru", "Kapran", "Hiller", "Qazigund"],
  },
  Bandipora: {
    Aloosa: ["Aloosa", "Kehnusa", "Quilmuqam", "Ashtangoo", "Malangam"],
    Arin: ["Arin", "Chuntimulla", "Kudara", "Sumlar", "Athwatoo"],
    Bandipora: ["Bandipora", "Nadihal", "Papchan", "Plan", "Kaloosa"],
    Gurez: ["Dawar", "Badwan", "Markoot", "Wanpora", "Kanzalwan"],
    Hajin: ["Hajin", "Madwan", "Prang", "Shahgund", "Naidkhai"],
    Sumbal: ["Sumbal", "Inderkoot", "Shadipora", "Nesbal", "Wangipora"],
    Tulail: ["Tulail", "Badugam", "Purana Tulail", "Bagtore", "Niru"],
  },
  Baramulla: {
    Baramulla: ["Baramulla", "Delina", "Fatehgarh", "Sheeri", "Nadihal"],
    Boniyar: ["Boniyar", "Bijhama", "Trikanjan", "Pehlipora", "Nowshera"],
    Kunzer: ["Kunzer", "Mulgam", "Hardu Aboora", "Goigam", "Wussan"],
    Pattan: ["Pattan", "Hanjiwera", "Singhpora", "Palhallan", "Zangam"],
    Rafiabad: ["Rafiabad", "Rohama", "Dangiwacha", "Ladoora", "Hadipora"],
    Sopore: ["Sopore", "Zaingeer", "Seer Jagir", "Warpora", "Bomai"],
    Tangmarg: ["Tangmarg", "Gulmarg", "Dobiwan", "Ferozpora", "Drung"],
    Uri: ["Uri", "Lagama", "Gingal", "Chandanwari", "Salamabad"],
    Wagoora: ["Wagoora", "Kreeri", "Nowpora", "Vizer", "Warpora"],
  },
  Budgam: {
    Beerwah: ["Beerwah", "Aripanthan", "Hardu Panzoo", "Ohangam", "Sonpah"],
    "B.K. Pora": ["B.K. Pora", "Wathora", "Nowbugh", "Kralpora", "Chattergam"],
    Budgam: ["Budgam", "Ichgam", "Ompora", "Humhama", "Nasrullahpora"],
    Chadoora: ["Chadoora", "Nagbal", "Kralpora", "Zoolwa", "Hushroo"],
    "Charar-i-Sharief": ["Charar-i-Sharief", "Pakherpora", "Yousmarg", "Kanidajan", "Nowhar"],
    Khag: ["Khag", "Pethzanigam", "Drang", "Shunglipora", "Sugin"],
    Khansahib: ["Khansahib", "Arizal", "Raithan", "Bugroo", "Sursyar"],
    Narbal: ["Narbal", "Mazhom", "Soibugh", "Gund Hassi Bhat", "Hanjik"],
  },
  Ganderbal: {
    Ganderbal: ["Ganderbal", "Duderhama", "Tulmulla", "Bamloora", "Beehama"],
    Gund: ["Gund", "Sonamarg", "Surfraw", "Gagangir", "Rezan"],
    Kangan: ["Kangan", "Wussan", "Prang", "Mammer", "Kijpora"],
    Lar: ["Lar", "Repora", "Watlar", "Manigam", "Yangoora"],
    Sherpathri: ["Sherpathri", "Rabitar", "Haknar", "Batwina", "Shuhama"],
    Wakura: ["Wakura", "Kurhama", "Batpora", "Zazna", "Nunner"],
  },
  Kulgam: {
    Devsar: ["Devsar", "Poniwah", "Kujar", "Kilam", "Lammar"],
    "D.H. Pora": ["D.H. Pora", "Manzgam", "Aharbal", "Noorabad", "Chimmer"],
    Kulgam: ["Kulgam", "Chawalgam", "Laroo", "Pombay", "Ashmuji"],
    Kund: ["Kund", "Waltengoo", "Nihama", "Razloo", "Nagseni"],
    Pahloo: ["Pahloo", "Frisal", "Yaripora", "Bugam", "Khee"],
    Qaimoh: ["Qaimoh", "Redwani", "Khudwani", "Wanpora", "Hawoora"],
    Qazigund: ["Qazigund", "Vessu", "Nipora", "Bonigam", "Panzath"],
  },
  Kupwara: {
    Handwara: ["Handwara", "Chogal", "Zachaldara", "Vilgam", "Qaziabad"],
    Kupwara: ["Kupwara", "Drugmulla", "Bohipora", "Gushi", "Halmatpora"],
    Langate: ["Langate", "Yaroo", "Baderkal", "Shatgund", "Unisoo"],
    Ramhal: ["Ramhal", "Tarathpora", "Kralgund", "Supernaghama", "Nowgam"],
    Sogam: ["Sogam", "Lolab", "Darpora", "Kalaroos", "Lalpora"],
    Tangdar: ["Tangdar", "Chamkote", "Karnah", "Teetwal", "Gabrah"],
    Trehgam: ["Trehgam", "Kunan", "Poshpora", "Hayhama", "Karihama"],
    Wavoora: ["Wavoora", "Khurhama", "Dardpora", "Dever", "Darpora"],
  },
  Pulwama: {
    Awantipora: ["Awantipora", "Padgampora", "Lethpora", "Barsoo", "Reshipora"],
    Kakapora: ["Kakapora", "Ratnipora", "Pahoo", "Hanjan", "Lelhar"],
    Pampore: ["Pampore", "Khrew", "Ladhoo", "Konibal", "Saffron Town"],
    Pulwama: ["Pulwama", "Prichoo", "Gangoo", "Murran", "Tahab"],
    Rajpora: ["Rajpora", "Drabgam", "Achan", "Newa", "Keller"],
    Shadimarg: ["Shadimarg", "Arihal", "Koil", "Litter", "Naira"],
    Tral: ["Tral", "Dadasara", "Noorpora", "Aripal", "Pinglish"],
  },
  Shopian: {
    Hermain: ["Hermain", "Chitragam", "Vehil", "Zainapora", "Reshnagri"],
    Imamsahib: ["Imamsahib", "Aharbal", "Losedenow", "Trenz", "Nagbal"],
    Kanjiullar: ["Kanjiullar", "Hendew", "Wachi", "Melhura", "Reban"],
    Keller: ["Keller", "Sedow", "Kachdora", "Dunaroo", "Batpora"],
    Ramnagri: ["Ramnagri", "Kaprin", "Heff", "Shirmal", "Turkwangam"],
    Shopian: ["Shopian", "Memandar", "Pinjora", "Alyalpora", "Bongam"],
    Zainapora: ["Zainapora", "Wachi", "Safanagri", "Babapora", "Sugan"],
  },
  Srinagar: {
    Harwan: ["Harwan", "Shalimar", "Dara", "Fakir Gujri", "Nishat"],
    Khonmoh: ["Khonmoh", "Balhama", "Zewan", "Pampore Road", "Lasjan"],
    Qamarwari: ["Qamarwari", "Parimpora", "Bemina", "HMT", "Zainakote"],
    Srinagar: ["Srinagar", "Rajbagh", "Lal Chowk", "Dalgate", "Hazratbal"],
  },
};

export const DISTRICT_OPTIONS = Object.keys(LOCATION_MAP).sort();

/** Approximate center coordinates for each district (for map animation). */
export const DISTRICT_COORDS: Record<string, { latitude: number; longitude: number }> = {
  Anantnag: { latitude: 33.7311, longitude: 75.1512 },
  Bandipora: { latitude: 34.4216, longitude: 74.6536 },
  Baramulla: { latitude: 34.1986, longitude: 74.3636 },
  Budgam: { latitude: 34.0201, longitude: 74.7171 },
  Ganderbal: { latitude: 34.2167, longitude: 74.7833 },
  Kulgam: { latitude: 33.6449, longitude: 75.0193 },
  Kupwara: { latitude: 34.5218, longitude: 74.2587 },
  Pulwama: { latitude: 33.8744, longitude: 74.8989 },
  Shopian: { latitude: 33.7227, longitude: 74.8344 },
  Srinagar: { latitude: 34.0837, longitude: 74.7973 },
};

export function getBlockOptions(district: string) {
  return district ? Object.keys(LOCATION_MAP[district] ?? {}).sort() : [];
}

export function getVillageOptions(district: string, block: string) {
  return district && block ? LOCATION_MAP[district]?.[block] ?? [] : [];
}
