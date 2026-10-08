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
          { type: "secondary", videos: [
            { video: "clips/restaurants/ion-carob.mp4",       poster: "clips/restaurants/ion-carob.jpg" },
            { video: "clips/restaurants/ion-simon-malta.mp4", poster: "clips/restaurants/ion-simon-malta.jpg" },
            { video: "clips/restaurants/ion-nature.mp4",      poster: "clips/restaurants/ion-nature.jpg" },
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

/* ===================== FIELD MAP: WHERE EACH DESTINATION SITS =====================
   Where each "Destination" on the credits board sits on the map.
   Key = the destination exactly as written on the board. Add a line here when a new destination appears.
   [place name, country, longitude, latitude] — several entries when one row covers more than one place. */
const PLACES = {
  "Saudi Arabia":               [["Saudi Arabia", "Saudi Arabia", 45.1, 24.4]],
  "Switzerland":                [["Switzerland", "Switzerland", 8.23, 46.8]],
  "Dumfries, Scotland":         [["Dumfries", "United Kingdom", -3.61, 55.07]],
  "California, USA":            [["California", "United States", -119.4, 36.8]],
  "UK":                         [["United Kingdom", "United Kingdom", -1.6, 52.6]],
  "London, UK":                 [["London", "United Kingdom", -0.12, 51.51]],
  "Norway":                     [["Norway", "Norway", 8.47, 60.47]],
  "France":                     [["France", "France", 2.35, 46.6]],
  "London & Exeter, UK":        [["London", "United Kingdom", -0.12, 51.51], ["Exeter", "United Kingdom", -3.53, 50.72]],
  "India":                      [["India", "India", 78.96, 21.6]],
  "Mongolia":                   [["Mongolia", "Mongolia", 103.85, 46.86]],
  "Kenya":                      [["Kenya", "Kenya", 37.9, 0.02]],
  "Seychelles":                 [["Seychelles", "Seychelles", 55.49, -4.68]],
  "Wadi Rum, Jordan":           [["Wadi Rum", "Jordan", 35.42, 29.57]],
  "Madagascar":                 [["Madagascar", "Madagascar", 46.87, -18.77]],
  "Rio de Janeiro, Brazil":     [["Rio de Janeiro", "Brazil", -43.17, -22.91]],
  "Bristol, UK":                [["Bristol", "United Kingdom", -2.59, 51.45]],
  "Kirindy, Madagascar":        [["Kirindy", "Madagascar", 44.65, -20.07]],
  "Costa Rica":                 [["Costa Rica", "Costa Rica", -84.0, 9.75]],
  "Hallingskarvet, Norway":     [["Hallingskarvet", "Norway", 7.95, 60.62]],
  "New Mexico, USA & Peru":     [["New Mexico", "United States", -106.0, 34.5], ["Peru", "Peru", -75.0, -9.19]],
  "Istanbul, Turkey":           [["Istanbul", "Turkey", 28.98, 41.01]],
  "Atlanta & Los Angeles, USA": [["Atlanta", "United States", -84.39, 33.75], ["Los Angeles", "United States", -118.24, 34.05]],
  "Buñol, Spain":               [["Buñol", "Spain", -0.79, 39.42]],
  "Papua New Guinea":           [["Papua New Guinea", "Papua New Guinea", 143.96, -6.31]],
  "California & Utah, USA":     [["California", "United States", -119.4, 36.8], ["Utah", "United States", -111.09, 39.32]],
  "Delhi, India":               [["Delhi", "India", 77.21, 28.61]],
  "Chiang Mai, Thailand":       [["Chiang Mai", "Thailand", 98.99, 18.79]],
  "New Caledonia":              [["New Caledonia", "New Caledonia", 165.6, -21.3]],
  "Kathmandu, Nepal":           [["Kathmandu", "Nepal", 85.32, 27.72]],
  "High Andes, Peru":           [["High Andes", "Peru", -71.97, -13.53]],
  "Romania":                    [["Danube Delta", "Romania", 29.2, 45.1]],
  "United Kingdom":             [["United Kingdom", "United Kingdom", -2.4, 54.2]]
};
const HOME = ["London", "United Kingdom", -0.12, 51.51];

/* ===================== FIELD MAP =====================
   Shown when someone taps a pin on the Field Map, under each shoot.
   Taken from the CV — update these when a new CV goes in, alongside DIARY above.
   Key: "Project — Destination" exactly as in DIARY (for one shoot), or just "Project" (for every shoot of it).
   Shoots marked "Under NDA" never show a description. */
const CV_NOTES = {
  "Planet Pet": "Planet Pet takes a deep dive into the bodies and minds of the animals closest to us: our pets. Filmed across the UK, California and Switzerland. Kit included RED V Raptor, Sigma Primes, Ronin 4D & Typoch Simera Primes, Inspire 3 & Mavic 4 Pro.",
  "Jodi Arias (Miniatures)": "Focus pulling for Simon De Glanville on a Netflix true crime documentary about Jodi Arias, produced by Dorothy Street Pictures. Based out of 69 Drop Studios, we spent a week filming a miniature set of the crime scene using a RED Raptor on a 6-axis motion-control rig with Contax Primes & Laowa Probe2Probes.",
  "Dinner to Save the World": "Dinner to Save the World (PBS), presented by M. Sanjayan and Sam Kass, looks at how the global food industry contributes to climate change. The series shows how changing the way we farm, process and eat food can help build a more sustainable future. Between June and September 2026 we filmed in the UK, France, Norway & Scotland with a Sony FX6, Ronin 4D, Typoch Simera Primes & Angenieux EZ Zooms.",
  "Just a Fly": "Focus pulling for Ruben Woodin Dechamps on the short film ‘Just a Fly’, produced by Iian Mitchell. Just a Fly questions the sentience of flies — should they be treated any differently to any other being? Many of the interviews and scenes were shot as a fly POV. Kit included RED Raptor and specialist fisheye lenses: Century Optics (S16) 3.5mm, Laowa 8-15mm PL Fisheye & the Laowa Probe 24mm T14.",
  "Animal Oddballs — Seychelles": "Operating 2nd Unit, filming White Terns on an uninhabited island in the Seychelles for ‘Animal Oddballs’ with Ryan Reynolds. Filming the behaviour brought creative challenges, including high-speed ‘egg drops’ with a camera falling at the same pace as the eggs — a Raptor with a Probe2b, on an RS4 gimbal, on a Teris Mini Jib. The shoot also needed aerials (Inspire 3) and remote cameras (FR7s) mounted in trees to monitor nests. On the ground my unit shot polished slider shots of the nest locations and built a montage sequence using Disney’s ‘Up’ as a reference.",
  "Home: Asia": "Operating 2nd Unit alongside Pete Cayless, filming a sequence about dung beetles in Wadi Rum, Jordan for three weeks. With a combination of studio and location setups, we used RED Raptors, Phantom VEOs and a selection of specialist macro lenses and lighting to capture the story.",
  "Wild London": "Wild London received 5-star reviews from the Guardian & Telegraph and was the BBC’s 4th most watched programme in January 2026 (6.6M), airing on BBC One on New Year’s Day 2026. The one-off show tells the stories of the wildlife that call London home. As principal camera I owned sequences such as Fallow Deer in East London, Pigeons on the Underground and Snakes along Regent’s Canal. I also helped film pieces to camera with David Attenborough, and played a part in filming the Peregrine Falcons, Hedgehogs, Field Mice, Honey Bees, Dragonflies & Beavers, as well as GVs across the city.",
  "Animal Oddballs — Madagascar": "Drone operating, time-lapse and focus pulling for Simon De Glanville on the second block of the Madagascar Labord’s Chameleon sequence for Animal Oddballs. My time-lapses captured some crucial behaviour, including a male Labord’s death. Kit included DJI Inspire 3, 4-axis motion-control rig, Kessler Cine Shooter & Slider, Laowa Probe2Probe, Laowa Swords and Aputure lighting.",
  "Animal Oddballs — Rio de Janeiro, Brazil": "Focus pulling for Simon De Glanville on the second season of Underdogs with Ryan Reynolds: a macro sequence about Pumpkin Toadlets, filmed in a cloud forest above Rio de Janeiro, Brazil for four weeks. Kit included Sony Venice 2, Phantom VEO, 4-axis motion-control rig, Aputure lighting, Infini Probe, and the new Laowa Swords & Probe2Probe lenses.",
  "Nightmares of Nature — Bristol, UK": "Focus pulling for Simon De Glanville on block two of the macro Jumping Spider sequence for ‘Nightmares of Nature’ (ITV / Netflix). Kit included Sony Venice 2, Phantom VEO, 4-axis motion-control rig, Samsung Terrace, Aputure lighting, Infini Probe and Laowa Probe2Probe lenses.",
  "Animal Oddballs — Kirindy, Madagascar": "Drone operating, time-lapse and focus pulling for Simon De Glanville for the second season of Underdogs with Ryan Reynolds: a macro sequence following freshly hatched Labord’s Chameleons in Kirindy Forest Reserve, Madagascar. Kit included Sony Venice 2, Phantom VEO, DJI Inspire 3, 4-axis motion-control rig, Kessler Cine Shooter & Slider, Laowa Probe2Probe, Laowa Swords and Aputure lighting.",
  "Nightmares of Nature — Costa Rica": "Focus pulling for Simon De Glanville on a number of Jumping Spider macro sequences set in Costa Rica. Kit included Sony Venice 2, Phantom VEO, 4-axis motion-control rig, Samsung Terrace, Aputure lighting, Infini Probe and the new Laowa Probe2Probe lenses.",
  "Sentient — Hallingskarvet, Norway": "Operating second camera alongside DOP Brendan McGinty and Director Luke Wiles, filming several snow scenes near Hallingskarvet National Park, Norway. Kit included 2x RED V Raptors, Ronin 4D, Sony FX3, Mavic 3 Cine & Canon CN20.",
  "Human": "Operating second camera and drones, and assisting DOP Tom Hayward and PD Andrew Thompson, on a new landmark presenter-led series for BBC Science on the evolution of humankind. The shoot began in New Mexico, USA, before heading south to Peru, into the Amazon rainforest and on to the Andes, to the first discovered city in the Americas. Kit included Sony Venice, FX6, A7SIII, Canon CN-E primes, TLS Morpheus zoom and my Mavic 3 Cine drone.",
  "Sentient — Istanbul, Turkey": "Operating second camera alongside DOP Brendan McGinty and Director Luke Wiles, filming whirling dervishes and several other street scenes around Istanbul, Turkey. Kit included RED V Raptor, Ronin 4D, Panasonic S1H, Angenieux EZs and various other cine primes.",
  "Sentient — Atlanta & Los Angeles, USA": "Operating second camera (long lens) and drone alongside DOP Simon De Glanville across Atlanta and Los Angeles. Over two weeks we filmed human interstitials, a lab experiment looking into fairness in primates, and a master interview with primatologist and ethologist Frans de Waal, used throughout the six episodes of the landmark series. Kit included Sony Venice 2, Canon CN20 & Mavic 3 Cine.",
  "Sentient — Buñol, Spain": "Operating second camera (long lens) alongside DOP Brendan McGinty, filming the ‘La Tomatina’ festival in Buñol, Spain. Kit included RED V Raptor, Canon CN20 and an S1H combined with the Bright Tangerine ‘Prodigy’ air deflector for shots in amongst the tomato fight.",
  "Underdogs": "Underdogs is a series brought to Wildstar by Ryan Reynolds, focusing on the ‘underdogs’ of the animal kingdom. I operated as second unit camera & drone and assisted DOP Simon De Glanville, filming a behavioural sequence in Papua New Guinea about a species that relies on an active volcano as a source of heat for incubation. Kit included RED Raptor S35, Canon CN20, a remote S1H camera kit, DJI Inspire 2 (X7) and Mavic 3 Cine drones.",
  "Sentient — UK": "Operating second camera alongside DOP Paul Stewart and PD Joe Loncraine on a macro shoot about parasite-infected molluscs, filmed in a studio and partly out in the field. The molluscs’ mind-altered state let us get creative with the colour palette, ambitious camera moves and cinematic references, using Mohan Sandhu’s ‘Wazzmatron’ motorised 7-axis rig, a modular roll axis, macro positioners and the motorised TED Tango. Lenses included the Laowa Peri Probe, Tokina 100mm Macro, Laowa 25mm (2.5-5x), Laowa 15mm Macro and Sigma Cine Primes, on my RED Raptor S35, Sony Venice 2, a RED Helium and an X7 on the Inspire 2.",
  "Surviving Earth — California & Utah, USA": "Surviving Earth is the brainchild of Timothy Haynes, creator of Walking with Dinosaurs (1999). I operated drones and assisted DOP Xavier Amoros, working closely with the VFX and SFX teams and PD Dan Smith across challenging US locations — flying an Inspire through dense redwood forest in Northern California, at speed through narrow slot canyons, and low across dry riverbeds in Utah. Kit included RED Raptor XL, Fujinon Premista 80-250mm, Zeiss Supreme Primes, Vaxis wireless with multiple director’s monitors, DJI Inspire 2 (X7) and my Mavic 3 Cine.",
  "Sentient — Delhi, India": "Operating second camera and assisting DOP Simon De Glanville and PD Joe Loncraine, filming a sequence for Sentient around a Jain bird hospital in the heart of Delhi, India. Kit included RED Raptor VV, Canon CN20 and a set of Sigma Cine Primes.",
  "Sentient — Chiang Mai, Thailand": "Operating second camera and assisting DOP Brendan McGinty and PD Joe Loncraine, filming across multiple sequences for two Sentient episodes in Chiang Mai, Thailand. Kit included rain deflection devices (Schulz SprayOff & Bright Tangerine Prodigy), 2x RED Raptor VV, Canon CN20 and Angenieux 22-60 & 45-135 FF zooms.",
  "Surviving Earth — New Caledonia": "Operating second camera and drone, and assisting DOPs Simon De Glanville & Teemu Liakka, on another episode of the VFX series Surviving Earth, produced by Mathew Dyas. Six weeks in New Caledonia filming topside and underwater. I specced the entire Surviving Earth kit purchase for the eight episodes, and worked as AC (topside and underwater), drone operator (Inspire 2 and Mavic 3 Cine) and second shooter. Kit included RED Raptor XL, Raptor VV, Chris Watts’ borescope, Fujinon Premista 80-250mm, Zeiss Supreme Primes, Teradek wireless and Nauticam housings for the Raptor VV.",
  "Sentient — Kathmandu, Nepal": "Assisting DOP Simon De Glanville and PD Joe Loncraine on a mainly city-based human–wildlife story shot in the centre of Kathmandu, Nepal. Sound was important, so there was a lot of sync. The ARRI Alexa 35 was the main camera, paired with an A7SIII & Ninja V+ for gimbal work, with Sigma and Zeiss primes and some long lens.",
  "Sentient — High Andes, Peru": "Operating second camera and shooting a sequence with DOP Tom Rowland for the first episode of Wildstar’s landmark series ‘Sentient’, directed by Darren Aronofsky for Nat Geo / Disney+. Based in the High Andes of Peru at 4,800m, we covered a sensitive wildlife story over four weeks, supported by a team of 13. Kit included Sony Venice 2, RED Helium, Canon CN20, Sigma Primes and Fujinon 19-90.",
  "The Danube Delta": "Shooting AP at Razorbill Films on a 60-minute feature about the Danube Delta for Japanese broadcaster NHK. Driving from London to Romania and filming along the Danube, we ended at the mouth of the Delta for six weeks, filming Dalmatian Pelicans, White-tailed Eagles, Golden Jackals, Cormorants, Bee-eaters and other species that rely on the Delta. We deployed several custom-built rigs, including a floating hide and a partially solar-powered remote camera on a jackal den, operated from a hide 300m away.",
  "Fallow Deer": "Shooting AP at Razorbill Films on a 60-minute feature about Fallow Deer for Japanese broadcaster NHK: writing pitches, shooting scripts and research documents, contacting scientists and researchers, designing custom camera rigs and housings, self-shooting and drone operating, then ingesting, building behavioural sequences, editing, HLG HDR grading and delivering 4K broadcast masters.",
  "The Earthshot Prize": "Assisting cinematographer Brendan McGinty over five days on BBC One’s ‘The Earthshot Prize’, Episode 5 ‘Build a Waste-Free World’, narrated by Sir David Attenborough and Prince William. Roles included camera assisting, DIT, sound recording, stills photography & field running."
};
