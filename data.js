/* =====================================================================
   SITE CONTENT — this is the only file you need to edit for updates.
   Anything in [square brackets] is a placeholder waiting for real info.
   Images live in the /images folder: upload the file, then use its name.
   ===================================================================== */

/* ---------- Vimeo videos (the number at the end of the Vimeo link) ---------- */
const VIDEOS = {
  showreel:    "846811194",   // Natural History showreel (hero + showreel section)
  restaurants: "961609288",
  hotels:      "1187804977",
  editorial:   "1188094947"   // The New York Times
};

/* ---------- RELEASED PROJECTS (the "DVD stack") ----------
   Newest first. Copy a { ... } block to add a project.            */
const PROJECTS = [
  {
    title: "Wild London",
    broadcaster: "BBC",
    role: "Cinematographer",
    year: "2026",
    image: "images/wild-london-bbc-attenborough.jpg",
    description: "Presented by David Attenborough and produced by Passion Planet. Broadcast on New Year’s Day to 6.6 million viewers and nominated at the 2026 Grierson British Documentary Awards."
  },
  {
    title: "Ryan Reynolds’ Animal Oddballs",
    broadcaster: "Disney+",
    role: "Cinematographer",
    year: "[Year]",
    image: "",   // [Add Jackson Wild image, e.g. images/animal-oddballs-jackson-wild.jpg]
    description: "Animal Oddballs: Daringly Different — nominated for Cinematography at Jackson Wild, August 2026."
  },
  {
    title: "Nightmares of Nature",
    broadcaster: "Netflix",
    role: "First AC",
    year: "[Year]",
    image: "images/nightmares-of-nature-netflix.jpg",
    description: "Blumhouse Productions for Netflix. [Short description of the series / your work on it]"
  },
  {
    title: "Surviving Earth",
    broadcaster: "NBC",
    role: "[Role]",
    year: "[Year]",
    image: "images/surviving-earth-nbc.jpg",
    description: "[Short description of the series / your work on it]"
  }
];

/* ---------- DOCUMENTARY (horizontal gallery of 9:16 posters) ---------- */
const DOCUMENTARIES = [
  { title: "Day of the Camel",          for: "[Broadcaster]", role: "[Role]", image: "", link: "" },
  { title: "Human",                     for: "[Broadcaster]", role: "[Role]", image: "", link: "" },
  { title: "Dinner to Save the World",  for: "[Broadcaster]", role: "[Role]", image: "", link: "" },
  { title: "The Earthshot Prize",       for: "[Broadcaster]", role: "[Role]", image: "", link: "" }
];

/* ---------- OTHER WORK (each opens its own tiled page: work.html?s=<key>) ----------
   tiles: images or Vimeo clips, shown as 9:16 tiles. Add as many as you like.      */
const OTHER_WORK = {
  restaurants: {
    title: "Restaurants", group: "Commercial",
    cover: "images/commercial-restaurant-radish-harvest.jpg",
    tiles: [ { vimeo: VIDEOS.restaurants }, { image: "images/commercial-restaurant-radish-harvest.jpg" } ]
  },
  hotels: {
    title: "Hotels", group: "Commercial",
    cover: "images/commercial-hotel-suite.jpg",
    tiles: [ { image: "images/commercial-hotel-suite.jpg" }, { vimeo: VIDEOS.hotels } ]
  },
  property: {
    title: "Property", group: "Commercial",
    cover: "images/commercial-property-pool-reflection.jpg",
    tiles: [ { image: "images/commercial-property-pool-reflection.jpg" } ]
  },
  editorial: {
    title: "Editorial", group: "The New York Times",
    cover: "images/editorial-fashion-hillside.jpg",
    tiles: [ { vimeo: VIDEOS.editorial }, { image: "images/editorial-fashion-hillside.jpg" } ]
  },
  fineart: {
    title: "Fine Art", group: "Exhibitions · Projects",
    cover: "images/fine-art-frost-patterns.jpg",
    tiles: [ { image: "images/fine-art-frost-patterns.jpg" } ]
  }
};

/* ---------- SHOOT DIARY (departures / arrivals board) ----------
   status: "Released" (shows under Departures)
           "In production" or "Under NDA" (show under Arrivals)
   Newest first. After each shoot, copy a line and edit it.       */
const LAST_UPDATED = "September 2026";
const DIARY = [
  { dates: "[October – November 2026]", project: "Untitled series",   for: "[Broadcaster]", role: "[Role]",          status: "Under NDA" },
  { dates: "[Month – Month 2026]",      project: "[Project]",         for: "[Broadcaster]", role: "[Role]",          status: "In production" },
  { dates: "[Month – Month 2025]",      project: "Wild London",       for: "BBC",           role: "Cinematographer", status: "Released" },
  { dates: "[Month – Month 2025]",      project: "Animal Oddballs",   for: "Disney+",       role: "Cinematographer", status: "Released" },
  { dates: "[Month – Month 2024]",      project: "Nightmares of Nature", for: "Netflix",    role: "First AC",        status: "Released" }
];
