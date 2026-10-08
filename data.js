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
    focus: "56%",   // which part of the poster shows when the tab is closed (0% = top, 100% = bottom)
    description: "Presented by David Attenborough and produced by Passion Planet. Broadcast on New Year’s Day 2026, with 6.6 million viewers over January — nominated for a Grierson at the British Documentary Awards 2026."
  },
  {
    title: "Animal Oddballs",
    broadcaster: "National Geographic / Disney+",
    role: "Cinematographer",
    date: "Coming Soon",
    image: "images/animal-oddballs-daringly-different.jpg",
    focus: "42%",   // which part of the poster shows when the tab is closed (0% = top, 100% = bottom)
    description: "Animal Oddballs — narrated by Ryan Reynolds and nominated for a Cinematography award at Jackson Wild, August 2026. Coming soon on National Geographic — Disney+."
  },
  {
    title: "Surviving Earth",
    broadcaster: "NBC / Peacock",
    role: "Drone Operator / AC",
    date: "2026",
    image: "images/surviving-earth-nbc.jpg",
    focus: "8%",   // which part of the poster shows when the tab is closed (0% = top, 100% = bottom)
    description: "Surviving Earth — an eight-part docuseries from the creators of the original ‘Walking with Dinosaurs’. Premiered on NBC, June 2026."
  },
  {
    title: "Nightmares of Nature",
    broadcaster: "Netflix",
    role: "1st AC",
    date: "2025",
    image: "images/nightmares-of-nature-netflix.jpg",
    focus: "20%",   // which part of the poster shows when the tab is closed (0% = top, 100% = bottom)
    description: "Nightmares of Nature — a Blumhouse production for Netflix, narrated by Maya Hawke."
  }
];

/* ---------- DOCUMENTARY (horizontal gallery of 9:16 posters) ---------- */
const DOCUMENTARIES = [
  {
    title: "Human", for: "BBC", role: "1st AC / Drone Operator", date: "2025",
    image: "images/human-bbc-ella-al-shamahi.jpg",
    description: "Paleoanthropologist Ella Al-Shamahi reveals humanity’s incredible story across 300,000 years of human evolution and how – thanks to new discoveries – we’re learning that the story is stranger and more surprising than we ever imagined. When Homo sapiens emerged in Africa we were not alone: there were at least six other human species alive at the time. Human examines how we went from being just one of many types of human to the dominant form of life on the planet."
  },
  {
    title: "Day of the Camel", for: "TBC", role: "Cinematographer", date: "TBC",
    image: "images/day-of-the-camel.jpg",
    description: "Project under NDA, more info coming soon."
  },
  {
    title: "The Earthshot Prize", for: "BBC", role: "1st AC", date: "2021",
    image: "images/earthshot-prize-2021-bbc.jpg",
    description: "Prince William’s star-studded awards ceremony honours five environmental solutions with £1 million each to further their work helping to restore and protect our planet. The broadcast spotlighted fifteen incredible global finalists across five distinct categories — including protecting nature, cleaning our air, reviving oceans, building a waste-free world, and fixing our climate. Interspersed with these inspiring documentary-style profiles, the programme features a special address from Sir David Attenborough alongside world-class musical performances by Billie Eilish, Annie Lennox & Ellie Goulding."
  },
  {
    title: "Dinner to Save the World", for: "PBS", role: "Camera Operator / Focus Puller", date: "2026",
    image: "images/dinner-to-save-the-world.jpg",
    description: "Dinner to Save the World (PBS), presented by M. Sanjayan and Sam Kass, looks at how the global food industry contributes to climate change — and how changing the way we farm, process and eat food can help build a more sustainable future."
  }
];

/* ---------- OTHER WORK (each opens its own page: work.html?s=<key>) ----------
   Pages are built from "projects", each a row of blocks. Block types:
     text        { type:"text", text:["para", …] }
     titletext   { type:"titletext", title:"…", text:["para", …] }
     feature     { type:"feature", video:"clips/…mp4", poster:"clips/…jpg", audio:true, once:true }
     secondary   { type:"secondary", videos:[ {video, poster} ×4 ] }
     hvideo      { type:"hvideo", video:"clips/…mp4" }  (horizontal 16:9)
     hphoto      { type:"hphoto", image:"images/…jpg" } (horizontal)
     fphoto      { type:"fphoto", image:"images/…jpg" } (featured vertical)
     sphoto      { type:"sphoto", images:[ "…", ×4 ] }  (4 vertical)
   audio:true = has a sound button; once:true = plays once (with sound if allowed), then shows Replay.
   Pages without "projects" still use the simple "tiles" list.
   hero:  the full-screen video behind the page title (a Vimeo number),
          or leave it out to use the cover image instead.
   tiles: shown as 9:16 tiles. Each is one of
          { image: "images/…jpg" }  { video: "clips/…mp4" }  { vimeo: "123456" }   */
const OTHER_WORK = {
  restaurants: {
    title: "Restaurants", group: "Commercial",
    cover: "images/commercial-restaurant-radish-harvest.jpg",
    hero: VIDEOS.restaurants,
    heroTitle: "Aulis Phuket Promo",
    heroZoom: 1.07,          // enlarges the opening video slightly to hide thin black bars (17:9 exported as 16:9)
    projects: [
      {
        client: "Simon Rogan", title: "Aulis Phuket",
        blocks: [
          { type: "text", text: [
            "Aulis Phuket is a 15-seat chef’s table restaurant set on the white sands of Natai Beach, on Thailand’s Andaman coast. It opened in December 2023 as the first Thai venture from Simon Rogan, the chef behind the three-Michelin-star L’Enclume in the Lake District.",
            "It brings his farm-to-fork approach to Southeast Asia. Guests sit directly in front of the open kitchen and watch the chefs cook and plate a multi-course tasting menu. The menu is led by what’s available locally, and more than 95% of the ingredients come from nearby farmers, fishermen and growers.",
            "I was brought in as Cinematographer to help tell the Aulis story. That meant capturing Simon Rogan’s philosophy, the relationships with local producers behind every plate, and the close, theatrical feel of the chef’s table. Through a series of short Instagram reels and a master promotional video, the films follow the journey from farm to fork, from the growers and their produce to the precision of the kitchen and the final dish. Shortly after the project was delivered, Aulis Phuket received its first Michelin star, less than a year after opening."
          ] },
          { type: "feature", video: "clips/restaurants/aulis-promo.mp4", poster: "clips/restaurants/aulis-promo.jpg", audio: true, once: true },
          { type: "secondary", videos: [
            { video: "clips/restaurants/aulis-michelin-star.mp4", poster: "clips/restaurants/aulis-michelin-star.jpg" },
            { video: "clips/restaurants/aulis-salad.mp4",         poster: "clips/restaurants/aulis-salad.jpg" },
            { video: "clips/restaurants/aulis-fish.mp4",          poster: "clips/restaurants/aulis-fish.jpg" },
            { video: "clips/restaurants/aulis-fire.mp4",          poster: "clips/restaurants/aulis-fire.jpg" }
          ] }
        ]
      },
      {
        client: "Simon Rogan", title: "ION Harbour",
        blocks: [
          { type: "text", text: [
            "ION Harbour by Simon Rogan sits overlooking Malta’s Grand Harbour, Valletta. It opened in November 2020 and won its first Michelin star less than six months later. In April 2024 it became the first restaurant in Malta to hold two Michelin stars.",
            "ION Harbour takes the farm-to-fork approach Rogan developed at L’Enclume in the Lake District and applies it to the Mediterranean. Its seasonal tasting menu depends on close relationships with Maltese farmers, fishermen and artisans, and it is shaped by whatever the island is producing at its best.",
            "I travelled to Malta to make a series of short videos on the subject of seasonality, hyper-locality and sustainability for ION’s social media accounts. Over the course of a week, I followed Simon and his team as they visited the local producers who are at the heart of the menu. We filmed olive oil, honey, micro-herbs and vegetables at their source, then followed each ingredient into the kitchen. There we watched the team turn it into a dish, from preparation through to the final plate."
          ] },
          { type: "feature", video: "clips/restaurants/ion-harbour-simon-rogan.mp4", poster: "clips/restaurants/ion-harbour-simon-rogan.jpg", audio: true, once: true },
          { type: "feature", video: "clips/restaurants/ion-nature.mp4",        poster: "clips/restaurants/ion-nature.jpg" },
          { type: "secondary", videos: [
            { video: "clips/restaurants/ion-carob.mp4",       poster: "clips/restaurants/ion-carob.jpg" },
            { video: "clips/restaurants/ion-simon-malta.mp4", poster: "clips/restaurants/ion-simon-malta.jpg" },
            { video: "clips/restaurants/ion-farm-to-table.mp4", poster: "clips/restaurants/ion-farm-to-table.jpg" },
            { video: "clips/restaurants/ion-microherbs.mp4",  poster: "clips/restaurants/ion-microherbs.jpg" }
          ] }
        ]
      }
    ]
  },
  hotels: {
    title: "Hotels", group: "Commercial",
    cover: "images/commercial-hotel-suite.jpg",
    hero: VIDEOS.hotels,
    heroTitle: "Iniala Valletta",
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
    heroTitle: "The New York Times — Departures",
    tiles: [ { image: "images/editorial-fashion-hillside.jpg" } ]
  },
  fineart: {
    title: "Fine Art", group: "Exhibitions · Projects",
    cover: "images/fine-art-frost-patterns.jpg",
    tiles: [ { image: "images/fine-art-frost-patterns.jpg" } ]
  }
};

/* ---------- CREDITS (departures / arrivals board) ----------
   status: "Released"                                  → Outbound (released)
           "In production", "Under NDA", "Coming soon" → Inbound (coming)
   Newest first. After each shoot, copy a line and edit it.
   NOTE: projects that are condensed on the CV (Day of the Camel, Dinner to Save
   the World, Planet Pet …) are listed here shoot by shoot — keep them split.   */
const LAST_UPDATED = "October 2026";
const DIARY = [
  { dates: "Oct 2026",          project: "Day of the Camel",          dest: "Saudi Arabia",            for: "The Edge",                      role: "Cinematographer",                   status: "Under NDA" },
  { dates: "Sept 2026",         project: "Planet Pet",                dest: "Switzerland",             for: "Wildstar · Nat Geo / Disney+",  role: "Focus Puller / Drone Operator",     status: "In production" },
  { dates: "Sept 2026",         project: "Dinner to Save the World",  dest: "Dumfries, Scotland",      for: "PBS",                           role: "Camera Operator / Focus Puller",      status: "In production" },
  { dates: "Aug – Sept 2026",    project: "Planet Pet",                dest: "California, USA",         for: "Wildstar · Nat Geo / Disney+",  role: "Focus Puller / Drone Operator",     status: "In production" },
  { dates: "Jul 2026",          project: "Planet Pet",                dest: "UK",                      for: "Wildstar · Nat Geo / Disney+",  role: "Focus Puller / Drone Operator",     status: "In production" },
  { dates: "Jul 2026",           project: "Jodi Arias (Miniatures)",   dest: "London, UK",              for: "Dorothy Street Pictures · Netflix", role: "Focus Puller / 1st AC",        status: "In production" },
  { dates: "Jul 2026",            project: "Dinner to Save the World",  dest: "Norway",                  for: "PBS",                           role: "Camera Operator / Focus Puller",      status: "In production" },
  { dates: "Jun – Jul 2026",     project: "Dinner to Save the World",  dest: "France",                  for: "PBS",                           role: "Camera Operator / Focus Puller",      status: "In production" },
  { dates: "Jun 2026",          project: "Dinner to Save the World",  dest: "London, UK",              for: "PBS",                           role: "Camera Operator / Focus Puller",      status: "In production" },
  { dates: "Jun 2026",            project: "Just a Fly",                dest: "London & Exeter, UK",                       for: "Razorbill Films · Short film",  role: "Focus Puller",                      status: "Coming soon" },
  { dates: "May – Jun 2026",     project: "Day of the Camel",          dest: "Saudi Arabia",            for: "The Edge",                      role: "Cinematographer",                   status: "Under NDA" },
  { dates: "Mar 2026",           project: "Day of the Camel",          dest: "India",                   for: "The Edge",                      role: "Cinematographer",                   status: "Under NDA" },
  { dates: "Jan – Feb 2026",    project: "Day of the Camel",          dest: "Mongolia",                for: "The Edge",                      role: "Cinematographer",                   status: "Under NDA" },
  { dates: "Jan 2026",          project: "Day of the Camel",          dest: "Kenya",                   for: "The Edge",                      role: "Cinematographer",                   status: "Under NDA" },
  { dates: "Nov – Dec 2025",     project: "Day of the Camel",          dest: "Saudi Arabia",            for: "The Edge",                      role: "Cinematographer",                   status: "Under NDA" },
  { dates: "Sept – Oct 2025",         project: "Animal Oddballs",           dest: "Seychelles",              for: "Wildstar · Nat Geo / Disney+",  role: "Cinematographer",                   status: "Coming soon" },
  { dates: "May 2025",                project: "Home: Asia",                dest: "Wadi Rum, Jordan",        for: "BBC NHU · National Geographic", role: "Cinematographer",                   status: "Coming soon" },
  { dates: "Apr – Nov 2025",          project: "Wild London",               dest: "London, UK",              for: "Passion Planet · BBC",          role: "Cinematographer",                   status: "Released" },
  { dates: "Feb – Mar 2025",          project: "Animal Oddballs",           dest: "Madagascar",              for: "Wildstar · Nat Geo / Disney+",  role: "Focus Puller / Time-lapse / Drone", status: "Coming soon" },
  { dates: "Jan – Feb 2025",          project: "Animal Oddballs",           dest: "Rio de Janeiro, Brazil",  for: "Wildstar · Nat Geo / Disney+",  role: "Focus Puller / Second Camera",      status: "Coming soon" },
  { dates: "Dec 2024",                project: "Nightmares of Nature",      dest: "Bristol, UK",                       for: "Plimsoll · Netflix",            role: "1st AC",                          status: "Released" },
  { dates: "Oct – Nov 2024",          project: "Animal Oddballs",           dest: "Kirindy, Madagascar",     for: "Wildstar · Nat Geo / Disney+",  role: "Focus Puller / Time-lapse / Drone", status: "Coming soon" },
  { dates: "Sept – Oct 2024",         project: "Nightmares of Nature",      dest: "Costa Rica",              for: "Plimsoll · Netflix",            role: "1st AC",                          status: "Released" },
  { dates: "Feb 2024",                project: "Sentient",                  dest: "Hallingskarvet, Norway",  for: "Wildstar · Nat Geo / Disney+",  role: "Cinematographer",                   status: "Coming soon" },
  { dates: "Nov 2023",                project: "Human",                     dest: "New Mexico, USA & Peru",  for: "BBC",                           role: "1st AC / Drone Operator",         status: "Released" },
  { dates: "Oct 2023",                project: "Sentient",                  dest: "Istanbul, Turkey",        for: "Wildstar · Nat Geo / Disney+",  role: "Second Camera / AC",                status: "Coming soon" },
  { dates: "Sept – Oct 2023",         project: "Sentient",                  dest: "Atlanta & Los Angeles, USA", for: "Wildstar · Nat Geo / Disney+", role: "Second Camera / Drone Operator", status: "Coming soon" },
  { dates: "Aug 2023",                project: "Sentient",                  dest: "Buñol, Spain",            for: "Wildstar · Nat Geo / Disney+",  role: "Cinematographer",                   status: "Coming soon" },
  { dates: "Jul 2023",                project: "Underdogs",                 dest: "Papua New Guinea",        for: "Wildstar · Nat Geo",            role: "Second Camera / AC",                status: "Released" },
  { dates: "Jun 2023",                project: "Sentient",                  dest: "UK",                      for: "Wildstar · Nat Geo / Disney+",  role: "Cinematographer",                   status: "Coming soon" },
  { dates: "May 2023",                project: "Surviving Earth",           dest: "California & Utah, USA",  for: "Loud Minds · NBC / Peacock",    role: "Drone Operator / AC",               status: "Released" },
  { dates: "Apr 2023",                project: "Sentient",                  dest: "Delhi, India",            for: "Wildstar · Nat Geo / Disney+",  role: "Second Camera / AC",                status: "Coming soon" },
  { dates: "Apr 2023",                project: "Sentient",                  dest: "Chiang Mai, Thailand",    for: "Wildstar · Nat Geo / Disney+",  role: "Second Camera / AC",                status: "Coming soon" },
  { dates: "Jan – Feb 2023",          project: "Surviving Earth",           dest: "New Caledonia",           for: "Loud Minds · NBC / Peacock",    role: "Drone Operator / AC",               status: "Released" },
  { dates: "Oct 2022",                project: "Sentient",                  dest: "Kathmandu, Nepal",        for: "Wildstar · Nat Geo / Disney+",  role: "AC",                                status: "Coming soon" },
  { dates: "Aug – Sept 2022",         project: "Sentient",                  dest: "High Andes, Peru",        for: "Wildstar · Nat Geo / Disney+",  role: "Cinematographer",                   status: "Coming soon" },
  { dates: "Mar – Dec 2022",              project: "The Danube Delta",          dest: "Romania",                 for: "Razorbill Films · NHK",         role: "Shooting AP",                       status: "Released" },
  { dates: "Mar 2021 – Feb 2022",     project: "Fallow Deer",               dest: "United Kingdom",                       for: "Razorbill Films · NHK",         role: "Shooting AP",                       status: "Released" },
  { dates: "Apr – Jul 2021",          project: "The Earthshot Prize",       dest: "London, UK",                       for: "Studio Silverback · BBC One",   role: "1st AC",                          status: "Released" }
];
