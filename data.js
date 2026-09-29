/* =====================================================================
   SITE CONTENT — this is the only file you need to edit for updates.
   Anything in [square brackets] is a placeholder waiting for real info.
   Images live in /images, short clips in /clips: upload the file, then
   type its name here.
   ===================================================================== */

/* ---------- Vimeo videos (the number at the end of the Vimeo link) ---------- */
const VIDEOS = {
  showreel:    "846811194",   // Natural History showreel (homepage hero + showreel section)
  restaurants: "961609288",
  hotels:      "1187804977",
  editorial:   "1188094947"   // The New York Times
};

/* ---------- RELEASED PROJECTS (the "DVD stack") ----------
   Top to bottom in this order. Copy a { ... } block to add one.   */
const PROJECTS = [
  {
    title: "Wild London",
    broadcaster: "BBC",
    role: "Cinematographer",
    date: "2026",
    image: "images/wild-london-bbc-attenborough.jpg",
    description: "Presented by David Attenborough and produced by Passion Planet. Broadcast on New Year’s Day 2026, with 6.6 million viewers over January — nominated for a Grierson at the British Documentary Awards 2026."
  },
  {
    title: "Animal Oddballs",
    broadcaster: "National Geographic / Disney+",
    role: "Cinematographer",
    date: "TBC",
    image: "images/animal-oddballs-daringly-different.jpg",
    description: "Animal Oddballs — narrated by Ryan Reynolds and nominated for a Cinematography award at Jackson Wild, August 2026. Coming soon on National Geographic — Disney+."
  },
  {
    title: "Surviving Earth",
    broadcaster: "NBC / Peacock",
    role: "Drone Operator / AC",
    date: "2026",
    image: "images/surviving-earth-nbc.jpg",
    description: "Surviving Earth — an eight-part docuseries from the creators of the original ‘Walking with Dinosaurs’. Premiered on NBC, June 2026."
  },
  {
    title: "Nightmares of Nature",
    broadcaster: "Netflix",
    role: "First AC",
    date: "2025",
    image: "images/nightmares-of-nature-netflix.jpg",
    description: "Nightmares of Nature — a Blumhouse production for Netflix, narrated by Maya Hawke."
  }
];

/* ---------- DOCUMENTARY (horizontal gallery of 9:16 posters) ---------- */
const DOCUMENTARIES = [
  {
    title: "Human", for: "BBC", role: "First AC / Drone Operator", date: "2025",
    image: "images/human-bbc-ella-al-shamahi.jpg",
    description: "Paleoanthropologist Ella Al-Shamahi reveals humanity’s incredible story across 300,000 years of human evolution and how – thanks to new discoveries – we’re learning that the story is stranger and more surprising than we ever imagined. When Homo sapiens emerged in Africa we were not alone: there were at least six other human species alive at the time. Human examines how we went from being just one of many types of human to the dominant form of life on the planet."
  },
  {
    title: "Day of the Camel", for: "TBC", role: "Cinematographer", date: "TBC",
    image: "images/day-of-the-camel.jpg",
    description: "Project under NDA, more info coming soon."
  },
  {
    title: "The Earthshot Prize", for: "BBC", role: "First AC", date: "2021",
    image: "images/earthshot-prize-2021-bbc.jpg",
    description: "Prince William’s star-studded awards ceremony honours five environmental solutions with £1 million each to further their work helping to restore and protect our planet. The broadcast spotlighted fifteen incredible global finalists across five distinct categories — including protecting nature, cleaning our air, reviving oceans, building a waste-free world, and fixing our climate. Interspersed with these inspiring documentary-style profiles, the programme features a special address from Sir David Attenborough alongside world-class musical performances by Billie Eilish, Annie Lennox & Ellie Goulding."
  },
  {
    title: "Dinner to Save the World", for: "TBC", role: "Camera Operator", date: "TBC",
    image: "images/dinner-to-save-the-world.jpg",
    description: "Project under NDA, more info coming soon."
  }
];

/* ---------- OTHER WORK (each opens its own page: work.html?s=<key>) ----------
   hero:  the full-screen video behind the page title (a Vimeo number),
          or leave it out to use the cover image instead.
   tiles: shown as 9:16 tiles. Each is one of
          { image: "images/…jpg" }  { video: "clips/…mp4" }  { vimeo: "123456" }   */
const OTHER_WORK = {
  restaurants: {
    title: "Restaurants", group: "Commercial",
    cover: "images/commercial-restaurant-radish-harvest.jpg",
    hero: VIDEOS.restaurants,
    tiles: [ { image: "images/commercial-restaurant-radish-harvest.jpg" } ]
  },
  hotels: {
    title: "Hotels", group: "Commercial",
    cover: "images/commercial-hotel-suite.jpg",
    hero: VIDEOS.hotels,
    tiles: [ { image: "images/commercial-hotel-suite.jpg" } ]
  },
  property: {
    title: "Property", group: "Commercial",
    cover: "images/commercial-property-pool-reflection.jpg",
    tiles: [ { image: "images/commercial-property-pool-reflection.jpg" } ]
  },
  editorial: {
    title: "Editorial", group: "The New York Times",
    cover: "images/editorial-fashion-hillside.jpg",
    hero: VIDEOS.editorial,
    tiles: [ { image: "images/editorial-fashion-hillside.jpg" } ]
  },
  fineart: {
    title: "Fine Art", group: "Exhibitions · Projects",
    cover: "images/fine-art-frost-patterns.jpg",
    tiles: [ { image: "images/fine-art-frost-patterns.jpg" } ]
  }
};

/* ---------- SHOOT DIARY (departures / arrivals board) ----------
   status: "Released"                                  → Departures
           "In production", "Under NDA", "Coming soon" → Arrivals
   Newest first. After each shoot, copy a line and edit it.        */
const LAST_UPDATED = "September 2026";
const DIARY = [
  { dates: "Nov 2025 – Mar 2026",  project: "Day of the Camel",         for: "The Edge",                               role: "Cinematographer",                 status: "Under NDA" },
  { dates: "TBC",                  project: "Dinner to Save the World", for: "TBC",                                    role: "Camera Operator",                 status: "Under NDA" },
  { dates: "Sept – Oct 2025",      project: "Animal Oddballs",          for: "Wildstar · Nat Geo / Disney+",           role: "Cinematographer",                 status: "Coming soon" },
  { dates: "May 2025",             project: "Home",                     for: "BBC NHU · National Geographic",          role: "Cinematographer",                 status: "Coming soon" },
  { dates: "Apr – Nov 2025",       project: "Wild London",              for: "Passion Planet · BBC",                   role: "Cinematographer",                 status: "Released" },
  { dates: "Feb – Mar 2025",       project: "Animal Oddballs",          for: "Wildstar · Nat Geo / Disney+",           role: "Focus Puller / Time-lapse / Drone", status: "Coming soon" },
  { dates: "Jan – Feb 2025",       project: "Animal Oddballs",          for: "Wildstar · Nat Geo / Disney+",           role: "Focus Puller / Second Camera",    status: "Coming soon" },
  { dates: "Dec 2024",             project: "Nightmares of Nature",     for: "Plimsoll · Netflix",                     role: "First AC",                        status: "Released" },
  { dates: "Oct – Nov 2024",       project: "Animal Oddballs",          for: "Wildstar · Nat Geo / Disney+",           role: "Focus Puller / Time-lapse / Drone", status: "Coming soon" },
  { dates: "Sept – Oct 2024",      project: "Nightmares of Nature",     for: "Plimsoll · Netflix",                     role: "First AC",                        status: "Released" },
  { dates: "Feb 2024",             project: "Sentient",                 for: "Wildstar · Nat Geo / Disney+",           role: "Cinematographer",                 status: "Coming soon" },
  { dates: "Nov 2023",             project: "Human",                    for: "BBC",                                    role: "First AC / Drone Operator",       status: "Released" },
  { dates: "Oct 2023",             project: "Sentient",                 for: "Wildstar · Nat Geo / Disney+",           role: "Second Camera / AC",              status: "Coming soon" },
  { dates: "Sept – Oct 2023",      project: "Sentient",                 for: "Wildstar · Nat Geo / Disney+",           role: "Second Camera / Drone Operator",  status: "Coming soon" },
  { dates: "Aug 2023",             project: "Sentient",                 for: "Wildstar · Nat Geo / Disney+",           role: "Cinematographer",                 status: "Coming soon" },
  { dates: "Jul 2023",             project: "Underdogs",                for: "Wildstar · Nat Geo",                     role: "Second Camera / AC",              status: "Released" },
  { dates: "Jun 2023",             project: "Sentient",                 for: "Wildstar · Nat Geo / Disney+",           role: "Cinematographer",                 status: "Coming soon" },
  { dates: "May 2023",             project: "Surviving Earth",          for: "Loud Minds · NBC / Peacock",             role: "Drone Operator / AC",             status: "Released" },
  { dates: "Apr 2023",             project: "Sentient",                 for: "Wildstar · Nat Geo / Disney+",           role: "Second Camera / AC",              status: "Coming soon" },
  { dates: "Jan – Feb 2023",       project: "Surviving Earth",          for: "Loud Minds · NBC / Peacock",             role: "Drone Operator / AC",             status: "Released" },
  { dates: "Oct 2022",             project: "Sentient",                 for: "Wildstar · Nat Geo / Disney+",           role: "AC",                              status: "Coming soon" },
  { dates: "Aug – Sept 2022",      project: "Sentient",                 for: "Wildstar · Nat Geo / Disney+",           role: "Cinematographer",                 status: "Coming soon" },
  { dates: "Mar 2022 –",           project: "The Danube Delta",         for: "Razorbill Films · NHK",                  role: "Shooting AP",                     status: "Released" },
  { dates: "Mar 2021 – Feb 2022",  project: "Fallow Deer",              for: "Razorbill Films · NHK",                  role: "Shooting AP",                     status: "Released" },
  { dates: "Apr – Jul 2021",       project: "The Earthshot Prize",      for: "Studio Silverback · BBC One",            role: "First AC",                        status: "Released" }
];
