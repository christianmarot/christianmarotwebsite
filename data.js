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
  editorial:   "1188094947",  // The New York Times
  property:    "1187870438"   // Pearson Gardens
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
    title: "Day of the Camel", for: "The Edge", role: "Cinematographer", date: "Coming Soon",
    image: "images/day-of-the-camel.jpg",
    description: "Filming over five months, Day of the Camel is a feature documentary exploring the connection between humans and camels across the world, from Kenya to Mongolia, and Saudi Arabia to India. My role on the project was almost exclusively shooting on long lens (CN20), cross-shooting every scene, picking up moments of emotion and connection, and covering some high-octane races and camel events. Aside from the CN20, the entire project was shot on anamorphics, including the aerials. Other kit included RED Raptors, DJI RS4 gimbal, DJI 4D, Inspire 3 and a Mavic 4 Pro."
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
     vimeo       { type:"vimeo", vimeo:"123456" }  (a Vimeo film; once:true plays it once with sound. Shows Vimeo's own
                 thumbnail while it loads, or add  poster:"images/…jpg"  to choose the holding image)
     photo       { type:"photo", image:"images/…", ratio:1.3 }  (one photo at its own shape, ratio = width ÷ height)
     tiled       { type:"tiled", rows:2, dir:"images/…", photos:[ { file, ratio }, … ] }  (photos tiled along the row; click to enlarge)
     tiles12     { type:"tiles12", videos:[ {video, poster} ×12 ] }  (six across, two down)
     gallery     { type:"gallery", dir:"images/…", photos:[ { file:"name", ratio:1.5 }, … ] }
                 (a preview block that opens the full gallery; ratio = width ÷ height; tiles in dir/m, large in dir/l, .webp)
                 add  preview:["file","file","file"]  to choose the three photos on the preview block
   any clip can also take  start: 4.5  (seconds in, where it first starts playing)
   a play-once clip can take  endFrame: 10.9  (the frame it rests on when it finishes, behind Replay)
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
          { type: "photo", image: "images/restaurants/l/aulis-radish.webp", ratio: 0.563 },
          { type: "text", text: [
            "Aulis Phuket is a 15-seat chef’s table restaurant set on the white sands of Natai Beach, on Thailand’s Andaman coast. It opened in December 2023 as the first Thai venture from Simon Rogan, the chef behind the three-Michelin-star L’Enclume in the Lake District.",
            "It brings his farm-to-fork approach to Southeast Asia. Guests sit directly in front of the open kitchen and watch the chefs cook and plate a multi-course tasting menu. The menu is led by what’s available locally, and more than 95% of the ingredients come from nearby farmers, fishermen and growers.",
            "I was brought in as Cinematographer to help tell the Aulis story. That meant capturing Simon Rogan’s philosophy, the relationships with local producers behind every plate, and the close, theatrical feel of the chef’s table. Through a series of short Instagram reels and a master promotional video, the films follow the journey from farm to fork, from the growers and their produce to the precision of the kitchen and the final dish. Shortly after the project was delivered, Aulis Phuket received its first Michelin star, less than a year after opening."
          ] },
          { type: "feature", video: "clips/restaurants/aulis-promo.mp4", poster: "clips/restaurants/aulis-promo.jpg", audio: true, once: true },
          { type: "secondary", videos: [
            { video: "clips/restaurants/aulis-michelin-star.mp4", poster: "clips/restaurants/aulis-michelin-star.jpg", cut: 22.65 },
            { video: "clips/restaurants/aulis-salad.mp4",         poster: "clips/restaurants/aulis-salad.jpg", cut: 12.76 },
            { video: "clips/restaurants/aulis-fish.mp4",          poster: "clips/restaurants/aulis-fish.jpg", cut: 13.77 },
            { video: "clips/restaurants/aulis-fire.mp4",          poster: "clips/restaurants/aulis-fire.jpg", cut: 11.39 }
          ] },
          // stills from the shoot, in a shuffled order; the first three named in preview make the preview block
          { type: "gallery", label: "Stills", dir: "images/restaurants/aulis-stills", preview: ["aulis-still-08", "aulis-still-05", "aulis-still-13"], photos: [
              { file: "aulis-still-06", ratio: 1.896 },
              { file: "aulis-still-18", ratio: 1.894 },
              { file: "aulis-still-21", ratio: 1.897 },
              { file: "aulis-still-16", ratio: 1.894 },
              { file: "aulis-still-08", ratio: 1.896 },
              { file: "aulis-still-15", ratio: 1.899 },
              { file: "aulis-still-22", ratio: 1.894 },
              { file: "aulis-still-20", ratio: 1.897 },
              { file: "aulis-still-07", ratio: 1.896 },
              { file: "aulis-still-19", ratio: 1.899 },
              { file: "aulis-still-14", ratio: 1.894 },
              { file: "aulis-still-17", ratio: 1.894 },
              { file: "aulis-still-09", ratio: 1.896 },
              { file: "aulis-still-01", ratio: 1.896 },
              { file: "aulis-still-10", ratio: 1.896 },
              { file: "aulis-still-12", ratio: 1.896 },
              { file: "aulis-still-04", ratio: 1.896 },
              { file: "aulis-still-03", ratio: 1.896 },
              { file: "aulis-still-02", ratio: 1.896 },
              { file: "aulis-still-13", ratio: 1.778 },
              { file: "aulis-still-05", ratio: 1.896 },
              { file: "aulis-still-11", ratio: 1.896 }
          ] }
        ]
      },
      {
        client: "Simon Rogan", title: "ION Harbour",
        blocks: [
          { type: "photo", image: "images/restaurants/l/ion-renny.webp", ratio: 0.563 },
          { type: "text", text: [
            "ION Harbour by Simon Rogan sits overlooking Malta’s Grand Harbour, Valletta. It opened in November 2020 and won its first Michelin star less than six months later. In April 2024 it became the first restaurant in Malta to hold two Michelin stars.",
            "ION Harbour takes the farm-to-fork approach Rogan developed at L’Enclume in the Lake District and applies it to the Mediterranean. Its seasonal tasting menu depends on close relationships with Maltese farmers, fishermen and artisans, and it is shaped by whatever the island is producing at its best.",
            "I travelled to Malta to make a series of short videos on the subject of seasonality, hyper-locality and sustainability for ION’s social media accounts. Over the course of a week, I followed Simon and his team as they visited the local producers who are at the heart of the menu. We filmed olive oil, honey, micro-herbs and vegetables at their source, then followed each ingredient into the kitchen. There we watched the team turn it into a dish, from preparation through to the final plate."
          ] },
          { type: "feature", video: "clips/restaurants/ion-harbour-simon-rogan.mp4", poster: "clips/restaurants/ion-harbour-simon-rogan.jpg", audio: true, once: true },
          { type: "secondary", videos: [
            { video: "clips/restaurants/ion-carob.mp4",       poster: "clips/restaurants/ion-carob.jpg", cut: 16.6 },
            { video: "clips/restaurants/ion-simon-malta.mp4", poster: "clips/restaurants/ion-simon-malta.jpg", cut: 16.02 },
            { video: "clips/restaurants/ion-nature.mp4",      poster: "clips/restaurants/ion-nature.jpg", cut: 14.27 },
            { video: "clips/restaurants/ion-microherbs.mp4",  poster: "clips/restaurants/ion-microherbs.jpg", cut: 11.93 }
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
    markers: true,           // show the vertical project markers even while there is only one project
    projects: [
      {
        client: "Iniala Hotels", title: "Iniala Beach House",
        blocks: [
          { type: "fphoto", image: "images/hotels/iniala-beach-house/l/bianca-twilight-4x5.webp" },
          { type: "text", text: [
            "Iniala Beach House sits on the quiet white sands of Natai Beach in Phang Nga, Thailand, looking out over the Andaman Sea. It’s a small, design-led retreat made up of private villas, pool residences and a penthouse. Each one was shaped by a different international designer, including the Campana Brothers, Jaime Hayon and Joseph Walsh, so each space feels completely unique. Iniala received a Michelin Key in the guide’s first Thailand selection in 2024. On the beachfront, restaurant Anaalā is led by celebrated Thai chef Ian Kittichai. Its name comes from the Sanskrit word for fire, and it serves flame-grilled dishes from across Thailand’s four culinary regions.",
            "I’ve returned to Iniala five times since 2015, capturing the villas in all their glory. For this latest trip, the brief was to look beyond the architecture: to shine a light on the destination and the experiences Iniala offers, as well as the incredible staff who make a stay at the Beach House so memorable. Alongside a full-length promotional video, I created a series of short-form reels and moments for social media, all aiming to capture the calm, barefoot luxury of life on Natai Beach."
          ] },
          // a full-length film from Vimeo: like the featured clips, it plays once with sound as it arrives
          // (then shows Replay); click it to watch large with full controls
          { type: "vimeo", vimeo: "1187876054", once: true },
          // twelve reels, six across and two down (top row first). Several share shots, so each starts at a
          // different point (start: seconds in) to keep the same shot from playing twice at once
          { type: "tiles12", videos: [
            { video: "clips/hotels/ibh-postcard.mp4", poster: "clips/hotels/ibh-postcard.jpg" },
            { video: "clips/hotels/ibh-womens-day.mp4", poster: "clips/hotels/ibh-womens-day.jpg", start: 15.25 },
            { video: "clips/hotels/ibh-sounds-of-nature.mp4", poster: "clips/hotels/ibh-sounds-of-nature.jpg" },
            { video: "clips/hotels/ibh-bbq-anaala.mp4", poster: "clips/hotels/ibh-bbq-anaala.jpg", start: 8.5 },
            { video: "clips/hotels/ibh-water.mp4", poster: "clips/hotels/ibh-water.jpg", start: 11.25 },
            { video: "clips/hotels/ibh-sunny.mp4", poster: "clips/hotels/ibh-sunny.jpg", start: 3.25 },
            { video: "clips/hotels/ibh-yoga.mp4", poster: "clips/hotels/ibh-yoga.jpg", start: 0.25 },
            { video: "clips/hotels/ibh-experience-food.mp4", poster: "clips/hotels/ibh-experience-food.jpg", start: 1.75 },
            { video: "clips/hotels/ibh-destination.mp4", poster: "clips/hotels/ibh-destination.jpg", start: 12.0 },
            { video: "clips/hotels/ibh-nature-2.mp4", poster: "clips/hotels/ibh-nature-2.jpg", start: 7.75 },
            { video: "clips/hotels/ibh-ambient.mp4", poster: "clips/hotels/ibh-ambient.jpg" },
            { video: "clips/hotels/ibh-nature-3.mp4", poster: "clips/hotels/ibh-nature-3.jpg", start: 10.5 }
          ] },
          { type: "gallery", dir: "images/hotels/iniala-beach-house",
            preview: ["beach-aerial-clone", "bianca-twighlight-sky-replacement-2-copy", "bianca-exterior-to-beach-2-cast-correction"],
            photos: [
              { file: "beach-aerial-clone", ratio: 1.781 },
              { file: "bianca-twighlight-sky-replacement-2-copy", ratio: 1.500 },
              { file: "dji-0110", ratio: 1.778 },
              { file: "bianca-exterior-to-beach-2-cast-correction", ratio: 1.500 },
              { file: "bianca-room-right-landscape-brighter", ratio: 1.500 },
              { file: "dsc-3469", ratio: 0.667 },
              { file: "collectors-twilight-sala", ratio: 1.500 },
              { file: "dsc-2069", ratio: 1.500 },
              { file: "dsc-3786", ratio: 1.500 },
              { file: "penthouse-exterior", ratio: 1.501 },
              { file: "siam-room-1-wb", ratio: 1.497 },
              { file: "collectors-twilight-exterior-3-crop", ratio: 1.778 },
              { file: "dsc-3508", ratio: 0.667 },
              { file: "palm-trees-beach", ratio: 1.500 },
              { file: "collectors-joseph-walsh-bed", ratio: 1.500 },
              { file: "dsc-5426", ratio: 0.667 },
              { file: "collectors-twillight-exteror-2", ratio: 1.500 },
              { file: "penthouse-to-beach-wb", ratio: 1.503 },
              { file: "dsc-2126", ratio: 1.500 },
              { file: "dsc-3511", ratio: 0.667 },
              { file: "lightning-stack-hq", ratio: 1.778 },
              { file: "sea-view-breakfast", ratio: 1.504 },
              { file: "bianca-dining", ratio: 1.500 },
              { file: "dsc-3818", ratio: 1.500 },
              { file: "siam-room-right", ratio: 1.500 },
              { file: "dsc-6305", ratio: 0.665 },
              { file: "mv-living-room-straight", ratio: 1.500 },
              { file: "sea-view-roof-to-beds", ratio: 1.500 },
              { file: "collectors-owners-bathroom-edit", ratio: 1.500 },
              { file: "penthouse-bedroom", ratio: 1.500 },
              { file: "dsc-5449", ratio: 1.500 },
              { file: "sv-drone-down", ratio: 1.778 },
          ] }
        ]
      },
      {
        client: "Iniala Hotels", title: "Iniala Valletta",
        blocks: [
          { type: "fphoto", image: "images/hotels/iniala-valletta/l/show-suite-jungle-room-bed-detail-v2.webp" },
          { type: "text", text: [
            "Iniala Valletta stands on the bastions of Malta’s UNESCO-listed capital, looking out over the Grand Harbour. The hotel is made up of a collection of beautifully restored townhouses and palazzos, some with vaults dating back to the 1600s. It has become one of the most decorated hotels in the Mediterranean – Malta’s only Forbes Five-Star hotel for five years running, and in 2025 the first hotel on the island to receive two Michelin Keys. On the rooftop, ION Harbour by Simon Rogan holds two Michelin stars, which makes it Malta’s only two-star restaurant.",
            "I was brought in to create a full-length promotional video for the hotel (see featured above), along with a series of reels and short moments for social media. Alongside the films, I shot a collection of high-end photography for the hotel’s website and promotional use, which has since appeared in publications including Forbes and Condé Nast. With Iniala Valletta being a design and experience-led hotel, the aim was to capture Malta as a destination, as well as the serenity of the hotel itself."
          ] },
          // endFrame: when a play-once clip finishes, it rests on the frame at this many seconds (behind the Replay button)
          { type: "feature", video: "clips/hotels/iniala-social-malta.mp4?v=3", poster: "clips/hotels/iniala-social-malta.jpg?v=3", audio: true, once: true, endFrame: 10.885 },
          // start: seconds into the clip where it first starts playing. Some of these share shots with each other
          // (and with the featured clip), so they're staggered so the same shot doesn't play twice at once
          { type: "secondary", videos: [
            { video: "clips/hotels/iniala-malta-destination.mp4?v=4", poster: "clips/hotels/iniala-malta-destination.jpg?v=3", cut: 13.333 },
            { video: "clips/hotels/iniala-sunset-sunrise.mp4?v=4",    poster: "clips/hotels/iniala-sunset-sunrise.jpg?v=4", start: 12.5, cut: 13.417 },
            { video: "clips/hotels/iniala-brindis-ocean.mp4?v=4",     poster: "clips/hotels/iniala-brindis-ocean.jpg?v=4",  start: 14.25, cut: 15.5 },
            { video: "clips/hotels/iniala-sailboat.mp4?v=4",          poster: "clips/hotels/iniala-sailboat.jpg?v=3", cut: 12.637 }
          ] },
          // photo gallery: shows as one small preview block; clicking it opens the full gallery (the first three photos make the preview). Files live in  <dir>/m  (tiles) and  <dir>/l  (large)
          { type: "gallery", dir: "images/hotels/iniala-valletta",
            preview: ["dsc-6477", "ion-resuaraunt-table-to-view-cu-test-2", "show-suite-jungle-room-angle-v1"],   // the three photos on the preview block (big one first)
            photos: [
          { file: "dsc-6477", ratio: 1.778 },
          { file: "112-close-to-view", ratio: 0.668 },
          { file: "penthouse-lounge-angle-curtains", ratio: 1.500 },
          { file: "121-bed-to-view-p", ratio: 0.667 },
          { file: "ion-resuaraunt-table-to-view-cu-test-2", ratio: 1.500 },
          { file: "show-suite-jungle-room-angle-v1", ratio: 1.500 },
          { file: "dsc-1131", ratio: 0.667 },
          { file: "show-suite-kitchen-to-lounge", ratio: 1.500 },
          { file: "grand-residence-lounge-to-chair-bright", ratio: 1.500 },
          { file: "121-bed-detail", ratio: 0.667 },
          { file: "ion-restrauant-side", ratio: 1.500 },
          { file: "dsc-6413", ratio: 0.667 },
          { file: "show-suite-jungle-room-straight-to-bed-skew", ratio: 1.500 },
          { file: "show-suite-jungle-room-bed-detail-v2-10x8", ratio: 0.800 },
          { file: "penthouse-lounge-side-to-kitchen-crop", ratio: 1.778 },
          { file: "ion-restaurant-table-to-view-p-10x8-2", ratio: 0.800 },
          { file: "dsc-1133", ratio: 1.500 },
          { file: "penthouse-kitchen-to-lounge", ratio: 0.667 },
          { file: "penthouse-lounge-to-kitchen-l-v2", ratio: 1.500 },
          { file: "show-suite-to-bar-p-10x8", ratio: 0.800 },
          { file: "penthouse-lounge-angle-to-bed-kitchen-blanket", ratio: 1.500 },
          { file: "112-balcony-mid-to-view-10x8", ratio: 0.800 },
          { file: "grand-residence-chair-detial-p-clone", ratio: 0.667 },
          { file: "penthouse-lounge-straight-to-balcony-style-2-21x9", ratio: 2.333 },
          { file: "show-suite-jungle-room-bed-detail-v2", ratio: 0.667 },
          { file: "penthouse-dsc-4112", ratio: 0.667 },
          { file: "122-living-area-doors-closed-p", ratio: 0.667 },
          { file: "the-works-gym-main-room-test", ratio: 1.500 }
          ] }
        ]
      }
      ,{
        client: "Extraordinary Treehouse Escapes", title: "TreeDwellers",
        blocks: [
          { type: "fphoto", image: "images/hotels/treedwellers/treedwellers-4x5.webp" },
          { type: "text", text: [
            "TreeDwellers is tucked away in the ancient woodland of Cornbury Park, a 1,700-acre estate in the Oxfordshire Cotswolds. It opened in 2024 as a collection of seven architecturally designed treehouses raised among the canopy. TreeDwellers sits where luxury and wilderness meet, offering every comfort of a boutique hotel without ever losing touch with the forest around it.",
            "After seeing my natural history cinematography on the BBC’s Wild London (2026), TreeDwellers founder Tim Rees invited me to capture the incredible wildlife that calls the estate its home. Over the course of a weekend, I filmed muntjac, fallow deer, woodpeckers, hares, rabbits, red kites and more. The films were featured across TreeDwellers’ social channels and website."
          ] },
          { type: "feature", video: "clips/hotels/treedwellers-01.mp4", poster: "clips/hotels/treedwellers-01.jpg", audio: true, once: true },
          { type: "feature", video: "clips/hotels/treedwellers-02.mp4", poster: "clips/hotels/treedwellers-02-bluebells.jpg", audio: true, once: true }
        ]
      }
    ]
  },
  property: {
    title: "Property", group: "Commercial",
    cover: "images/commercial-property-pool-reflection.jpg",
    hero: VIDEOS.property,
    heroTitle: "Pearson Gardens",
    // one project told in four parts: the introduction, then a film for each villa. The big title stays
    // "Pearson Gardens"; the small line above it changes to the villa on screen. marker: the label on the
    // divider before each part (noMarker: no divider)
    projects: [
      {
        client: "Pedralbes, Barcelona", title: "Pearson Gardens", noMarker: true,
        blocks: [
          { type: "fphoto", image: "images/property/pearson-gardens/pearson-gardens-4x5.webp" },
          { type: "text", text: [
            "Pearson Gardens sits on Avenida Pearson in Pedralbes, Barcelona’s most exclusive neighbourhood, set against the green slopes of Collserola Natural Park with views across the city to the Mediterranean. Completed in 2024, it is a collection of three private villas: Villa Grande, Villa Alta and Villa Botanica. Priced from €14 million to €21 million, each is set in its own landscaped gardens, with a private pool and a rooftop terrace.",
            "Over two trips to Barcelona, I created a dedicated film for each of the three villas, made to reflect its own character. The films were made to support sales and were shown on large screens inside the villas during open houses, as well as at promotional events across the country, bringing each home to life for potential buyers."
          ] }
        ]
      },
      { client: "Villa Grande",   title: "Pearson Gardens", marker: "Villa Grande",   blocks: [ { type: "vimeo", vimeo: "1187866350", once: true } ] },
      { client: "Villa Alta",     title: "Pearson Gardens", marker: "Villa Alta",     blocks: [ { type: "vimeo", vimeo: "1187856259", once: true } ] },
      { client: "Villa Botanica", title: "Pearson Gardens", marker: "Villa Botanica", blocks: [ { type: "vimeo", vimeo: "1187861141", once: true } ] }
    ]
  },
  editorial: {
    title: "Editorial", group: "The New York Times",
    cover: "images/editorial-fashion-hillside.jpg",
    hero: VIDEOS.editorial,
    heroTitle: "The New York Times — Departures",
    projects: [
      {
        client: "The New York Times", title: "Departures",
        blocks: [
          { type: "photo", image: "images/editorial/departures/l/000058100007.webp", ratio: 1.294 },
          { type: "text", text: [
            "A collaboration with London-based photographer and director Bex Day on Departures, a project for The New York Times. Bex’s work explores gender, identity and diversity and challenges rigid beauty ideals. For this project, eight models travelled to a series of locations across Wales and the Brecon Beacons, placing them in the rugged, open landscapes of the Welsh countryside. As drone operator, I captured the aerial perspective, showing the scale of the landscape around the models. The project was styled by Leith Clark, with music by Patrick James Fitzroy, grading by Anna Barsukova and editing by David Zbrika."
          ] },
          // a tiled gallery laid out along the row (rows: how many rows of photos); click a photo to see it large
          { type: "tiled", rows: 2, dir: "images/editorial/departures", photos: [
              { file: "000058080004-bd", ratio: 1.277 },
              { file: "dji-0082", ratio: 1.334 },
              { file: "000058090009", ratio: 0.800 },
              { file: "dji-0149", ratio: 1.334 },
              { file: "000058110007", ratio: 1.250 },
              { file: "dji-0185-bd", ratio: 1.335 },
              { file: "dji-0113", ratio: 1.167 },
              { file: "dji-0400", ratio: 1.333 },
              { file: "dji-0016", ratio: 1.410 },
              { file: "dji-0133", ratio: 1.334 },
              { file: "dji-0025", ratio: 1.333 },
              { file: "dji-0317-bd", ratio: 1.333 },
              { file: "dji-0124", ratio: 1.250 }
          ] }
        ]
      }
    ]
  },
  fineart: {
    title: "Fine Art", group: "Exhibitions · Projects", midText: true, gap: 28, tileGap: 20,
    cover: "images/fine-art-frost-patterns.jpg",
    // no film here: the opening screen is a slideshow of the work, in a random order that avoids showing two
    // pictures from the same project back to back. "project" is the name shown as Featured project
    slides: [
      { image: "images/fine-art/l/thai-0616.webp", project: "Europa — Exhibition" },
      { image: "images/fine-art/l/thai-0602.webp", project: "Europa — Exhibition" },
      { image: "images/fine-art/l/thai-0608.webp", project: "Europa — Exhibition" },
      { image: "images/fine-art/l/thai-0611.webp", project: "Europa — Exhibition" },
      { image: "images/fine-art/l/thai-0655.webp", project: "Europa — Exhibition" },
      { image: "images/fine-art/l/europa-tray-frame.webp", project: "Europa" },
      { image: "images/fine-art/l/europa-neg-11.webp", project: "Europa" },
      { image: "images/fine-art/l/europa-thud-4.webp", project: "Europa" },
      { image: "images/fine-art/l/europa-albedo.webp", project: "Europa" },
      { image: "images/fine-art/l/europa-thud-2.webp", project: "Europa" },
      { image: "images/fine-art/l/europa-thud-1.webp", project: "Europa" },
      { image: "images/fine-art/l/kcx-2095.webp", project: "Kerrejja Causi — Exhibition" },
      { image: "images/fine-art/l/kcx-2192.webp", project: "Kerrejja Causi — Exhibition" },
      { image: "images/fine-art/l/kcx-2332.webp", project: "Kerrejja Causi — Exhibition" },
      { image: "images/fine-art/l/kcx-2268.webp", project: "Kerrejja Causi — Exhibition" },
      { image: "images/fine-art/l/kcx-stack-4.webp", project: "Kerrejja Causi — Exhibition" },
      { image: "images/fine-art/l/kcx-stack-1.webp", project: "Kerrejja Causi — Exhibition" },
      { image: "images/fine-art/l/kcx-2161.webp", project: "Kerrejja Causi — Exhibition" },
      { image: "images/fine-art/l/kcx-2340.webp", project: "Kerrejja Causi — Exhibition" },
      { image: "images/fine-art/l/kc-529.webp", project: "Kerrejja Causi" },
      { image: "images/fine-art/l/kc-532.webp", project: "Kerrejja Causi" },
      { image: "images/fine-art/l/kc-170010-c.webp", project: "Kerrejja Causi" },
      { image: "images/fine-art/l/kc-150002.webp", project: "Kerrejja Causi" },
      { image: "images/fine-art/l/kc-100007.webp", project: "Kerrejja Causi" },
      { image: "images/fine-art/l/pr-130009.webp", project: "Predannack" },
      { image: "images/fine-art/l/pr-120003.webp", project: "Predannack" },
      { image: "images/fine-art/l/pr-150001.webp", project: "Predannack" },
      { image: "images/fine-art/l/pr-130006.webp", project: "Predannack" },
      { image: "images/fine-art/l/mnn-350005.webp", project: "Morning, Noon, Night" },
      { image: "images/fine-art/l/mnn-350004.webp", project: "Morning, Noon, Night" },
      { image: "images/fine-art/l/mnn-350002.webp", project: "Morning, Noon, Night" },
      { image: "images/fine-art/l/kcx-2319.webp", project: "Predannack & Morning, Noon, Night · Exhibition" },
      { image: "images/fine-art/l/kcx-2322.webp", project: "Predannack & Morning, Noon, Night · Exhibition" }
    ],
    // each project is numbered (01, 02 …); an exhibition follows its project behind a smaller, unnumbered
    // divider (sub: true). The big title stays the project name; the small line reads Project / Exhibition
    projects: [
      {
        client: "Project", title: "Europa",
        blocks: [
          { type: "photo", image: "images/fine-art/l/europa-tray-frame.webp", ratio: 1.223, zoom: true },
          { type: "text", text: [
            "Using an array of camera-less photographic techniques, the ongoing series ‘Europa’ explores unfamiliar and otherworldly landscapes that could perhaps be mistaken for the icy surface of Jupiter’s smallest Galilean moon. Whilst the images resemble these barren lunar landscapes, in reality they have been created in a darkroom using large format film, a selection of minerals and compounds found throughout the solar system, and the intervention of light. The use of such minerals and compounds – namely salt, water and ice – means that the process is indexically bound to Europa itself, whose icy surface encases an ocean of salty water that lies below. The works intend to provoke a dialogue and encourage audiences to question the process and reality of what they are looking at."
          ] },
          { type: "tiled", rows: 1, h: 0.82, dir: "images/fine-art", photos: [
              { file: "europa-neg-11", ratio: 0.782 },
              { file: "europa-thud-2", ratio: 0.805 },
              { file: "europa-thud-1", ratio: 0.813 },
              { file: "europa-thud-3", ratio: 0.805 },
              { file: "europa-neg-7-10x8", ratio: 0.787 },
              { file: "europa-neg-1", ratio: 0.804 },
              { file: "europa-neg-8-5x4", ratio: 0.803 },
              { file: "europa-untitled-13", ratio: 0.793 },
              { file: "europa-thud-4", ratio: 0.806 },
              { file: "europa-neg-8-10x8", ratio: 0.798 },
              { file: "europa-neg-3", ratio: 0.800 }
          ] }
        ]
      },
      {
        client: "Exhibition", title: "Europa", sub: true, marker: "Europa · Exhibition",
        blocks: [
          { type: "titletext", k: "Exhibition installation", title: "THUD —\nLondon", text: ["BA (Hons) Photography\nThe Truman Brewery, Brick Lane · 2017"] },
          { type: "photo", image: "images/fine-art/l/thud-1062.webp", ratio: 0.667 },
          { type: "textdetail", caption: "Cascade — Artwork detail", dir: "images/fine-art", photos: [{ file: "europa-cascade", ratio: 1.056 }, { file: "europa-cascade-2", ratio: 1.046 }], text: [
            "Following the work’s debut in the Arts University Bournemouth graduate exhibition in 2017, selected pieces featured in several smaller exhibitions across the city, including ‘The Raw Project’ (2017) and ‘Contained Exhibition’ (2018), before ending up in the collective exhibition ‘THUD’ (2017), held at The Truman Brewery on Brick Lane, London.",
            "After a successful two years of shows across the UK, I was offered the opportunity to exhibit the entire series in my debut solo exhibition at the Iniala Gallery in Phuket, Thailand, where the show ran for a month."
          ] },
          { type: "gallery", join: true, label: "THUD — London", preview: ["thud-6021", "thud-1080", "thud-1106"], dir: "images/fine-art", photos: [
              { file: "thud-6021", ratio: 2.995 },
              { file: "thud-1080", ratio: 1.500 },
              { file: "thud-1106", ratio: 1.500 },
              { file: "thud-1108", ratio: 0.667 },
              { file: "thud-5962", ratio: 1.333 },
              { file: "thud-5972", ratio: 1.333 }
          ] },
          { type: "titletext", k: "Solo exhibition", title: "Europa —\nThailand", text: ["Iniala Gallery, Phuket"] },
          { type: "gallery", join: true, label: "Europa — Thailand", preview: ["thai-0292", "thai-0616", "thai-0601"], dir: "images/fine-art", photos: [
              { file: "thai-0292", ratio: 1.502 },
              { file: "thai-0302", ratio: 1.502 },
              { file: "thai-0308", ratio: 0.666 },
              { file: "thai-0606", ratio: 1.502 },
              { file: "thai-0601", ratio: 1.502 },
              { file: "thai-0602", ratio: 1.502 },
              { file: "thai-0607", ratio: 1.502 },
              { file: "thai-0608", ratio: 1.503 },
              { file: "thai-0611", ratio: 1.502 },
              { file: "thai-0616", ratio: 1.502 },
              { file: "thai-0615", ratio: 1.502 },
              { file: "thai-0619", ratio: 1.502 },
              { file: "thai-0621", ratio: 1.502 },
              { file: "thai-0653", ratio: 1.502 },
              { file: "thai-0655", ratio: 1.500 },
              { file: "thai-0685", ratio: 0.667 },
              { file: "thai-0668", ratio: 0.667 },
              { file: "thai-0665", ratio: 1.500 },
              { file: "thai-0661", ratio: 1.500 },
              { file: "thai-0646", ratio: 1.502 },
              { file: "thai-0631", ratio: 1.502 },
              { file: "thai-0696", ratio: 0.667 },
              { file: "thai-0707", ratio: 0.667 },
              { file: "thai-0719", ratio: 1.500 },
              { file: "thai-0253", ratio: 1.502 },
              { file: "thai-0258", ratio: 0.666 }
          ] }
        ]
      },
      {
        client: "Project", title: "Kerrejja Causi",
        blocks: [
          { type: "photo", image: "images/fine-art/l/kc-150002.webp", ratio: 1.284 },
          { type: "text", text: [
            "Kerrejja Causi tells the story of an abandoned 16th century tenement building, or ‘Kerrejja’, that stands in the heart of Valletta. A series of moments captured on medium format film, alongside a collection of found artefacts, helps to build up the sense that it was deserted on a single day, with knives and forks left laid on tables. Kerrejja Causi is full of character, and it represents a past Malta which will be lost in the natural passage of time and modern development."
          ] },
          { type: "vimeo", vimeo: "395745520", once: true },
          { type: "text", text: [
            "The building ‘Kerrejja Causi’, otherwise known as ‘Casa Causi’, was originally built in the 1500s by the noble Testaferrata family. Throughout its history, the nobility endowed many churches, built many fine palazzi and patronised the arts. This home was a statement of grandeur. Split across five floors, it was decorated with the finest of furnishings, paintings, jewellery and objets d’art. There was even a tunnel built in the basement which led under Valletta and out to the grand palace.",
            "In the summer months of 1565, Malta and the Knights of the Order of St John came under attack from the Turks. In the mid-1500s the Ottoman Empire was reaching its zenith. The Turks had spread their reach far into Europe, North Africa and the Mediterranean. Severely outnumbered, the Maltese and 10,000 Knights fought off a force of 40,000 Turks. This event formed one of the most iconic events in Maltese history, ‘The Great Siege’. Fast forward 350 years: Malta had once again found itself in the midst of another violent and bloody battle – the First World War. Although not a direct participant, the Great War had a profound impact on Malta due to its strategic location."
          ] },
          { type: "text", text: [
            "It was during World War Two (1942) that Malta was hit the worst. The island holds the record for the heaviest sustained bombing attack. For 154 days and nights, 6,700 tons of bombs fell on the island. From April throughout the summer that year, the island was pushed to the brink, leaving Malta devastated. The Maltese people are the only entire population ever to be awarded the George Cross, Britain’s highest civilian honour for bravery.",
            "Given Malta’s turbulent history, it is a miracle that Kerrejja Causi has remained unscathed. Over the 400 years it has been standing, it has certainly seen a lot. From the grand 16th century palazzo it once was, to the separate apartments or ‘Kerrejja’ it has become, there is an overwhelming sense of history. The building even featured in Alan Parker’s ‘Midnight Express’ in 1978.",
            "With tenants disappearing over the decades and with little work done to maintain it, the building became a living museum, frozen in time, haunted by neglect and full of memories and treasures."
          ] },
          { type: "photo", image: "images/fine-art/l/kc-529.webp", ratio: 1.225 },
          { type: "tiled", rows: 2, dir: "images/fine-art", photos: [
              { file: "kc-170010-c", ratio: 1.211 },
              { file: "kc-532", ratio: 1.227 },
              { file: "kc-170010-a", ratio: 1.212 },
              { file: "kc-531", ratio: 1.227 },
              { file: "kc-530", ratio: 1.225 },
              { file: "kc-170010-b", ratio: 1.212 },
              { file: "kc-100001", ratio: 1.284 },
              { file: "kc-100007", ratio: 1.253 }
          ] }
        ]
      },
      {
        client: "Exhibition", title: "Kerrejja Causi", sub: true, marker: "Kerrejja Causi · Exhibition",
        blocks: [
          { type: "titletext", k: "Solo exhibition", title: "Kerrejja\nCausi —\nValletta", text: ["9 – 19 May 2019"] },
          { type: "photo", image: "images/fine-art/l/kcx-2352.webp", ratio: 0.667 },
          { type: "text", text: [
            "In Malta’s quaint capital Valletta, and nestled within the same grand arches as the National Library, Christian Marot’s second international solo exhibition ‘Kerrejja Causi’ took place for 10 days between 9th – 19th May 2019.",
            "The exhibition tells the story of an abandoned 16th century tenement building, or ‘Kerrejja’, that stands in the heart of Valletta. A series of moments captured on medium format film, alongside a collection of found artefacts, helps to build up the sense that it was deserted on a single day, with knives and forks left laid on tables. Kerrejja Causi is full of character, and it represents a past Malta which will be lost in the natural passage of time and modern development."
          ] },
          { type: "gallery", join: true, label: "Kerrejja Causi — Valletta", preview: ["kcx-stack-1", "kcx-2340", "kcx-2293"], dir: "images/fine-art", photos: [
              { file: "kcx-stack-1", ratio: 1.500 },
              { file: "kcx-2340", ratio: 1.500 },
              { file: "kcx-2167", ratio: 0.667 },
              { file: "kcx-2194", ratio: 1.500 },
              { file: "kcx-2192", ratio: 1.500 },
              { file: "kcx-2268", ratio: 1.500 },
              { file: "kcx-2090", ratio: 0.667 },
              { file: "kcx-2188", ratio: 1.500 },
              { file: "kcx-stack-3", ratio: 1.500 },
              { file: "kcx-stack-4", ratio: 1.499 },
              { file: "kcx-2095", ratio: 1.500 },
              { file: "kcx-2332", ratio: 1.500 },
              { file: "kcx-stack-2", ratio: 1.500 },
              { file: "kcx-2319", ratio: 1.500 },
              { file: "kcx-2322", ratio: 1.500 },
              { file: "kcx-2098", ratio: 0.667 },
              { file: "kcx-2161", ratio: 1.500 },
              { file: "kcx-2100", ratio: 0.667 },
              { file: "kcx-2293", ratio: 1.500 }
          ] }
        ]
      },
      {
        client: "Project", title: "Morning, Noon, Night",
        blocks: [
          { type: "tiled", rows: 1, dir: "images/fine-art", photos: [
              { file: "mnn-350004", ratio: 1.226 },
              { file: "mnn-350005", ratio: 1.226 },
              { file: "mnn-350002", ratio: 1.226 },
              { file: "mnn-0008", ratio: 0.816 }
          ] }
        ]
      },
      {
        client: "Project", title: "Predannack",
        blocks: [
          { type: "photo", image: "images/fine-art/l/pr-130009.webp", ratio: 1.225 },
          { type: "tiled", rows: 2, dir: "images/fine-art", photos: [
              { file: "pr-120003", ratio: 1.226 },
              { file: "pr-120008", ratio: 1.225 },
              { file: "pr-130003", ratio: 1.225 },
              { file: "pr-130006", ratio: 1.225 },
              { file: "pr-130007", ratio: 1.226 },
              { file: "pr-150001", ratio: 1.226 }
          ] }
        ]
      }
    ]
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
  { dates: "Oct 2026",          project: "Day of the Camel",          dest: "Saudi Arabia",            for: "The Edge",                      role: "Cinematographer",                   status: "Coming soon" },
  { dates: "Sept 2026",         project: "Planet Pet",                dest: "Switzerland",             for: "Wildstar · Nat Geo / Disney+",  role: "Focus Puller / Drone Operator",     status: "In production" },
  { dates: "Sept 2026",         project: "Dinner to Save the World",  dest: "Dumfries, Scotland",      for: "PBS",                           role: "Camera Operator / Focus Puller",      status: "In production" },
  { dates: "Aug – Sept 2026",    project: "Planet Pet",                dest: "California, USA",         for: "Wildstar · Nat Geo / Disney+",  role: "Focus Puller / Drone Operator",     status: "In production" },
  { dates: "Jul 2026",          project: "Planet Pet",                dest: "UK",                      for: "Wildstar · Nat Geo / Disney+",  role: "Focus Puller / Drone Operator",     status: "In production" },
  { dates: "Jul 2026",           project: "Jodi Arias (Miniatures)",   dest: "London, UK",              for: "Dorothy Street Pictures · Netflix", role: "Focus Puller / 1st AC",        status: "In production" },
  { dates: "Jul 2026",            project: "Dinner to Save the World",  dest: "Norway",                  for: "PBS",                           role: "Camera Operator / Focus Puller",      status: "In production" },
  { dates: "Jun – Jul 2026",     project: "Dinner to Save the World",  dest: "France",                  for: "PBS",                           role: "Camera Operator / Focus Puller",      status: "In production" },
  { dates: "Jun 2026",          project: "Dinner to Save the World",  dest: "London, UK",              for: "PBS",                           role: "Camera Operator / Focus Puller",      status: "In production" },
  { dates: "Jun 2026",            project: "Just a Fly",                dest: "London & Exeter, UK",                       for: "Razorbill Films · Short film",  role: "Focus Puller",                      status: "Coming soon" },
  { dates: "May – Jun 2026",     project: "Day of the Camel",          dest: "Saudi Arabia",            for: "The Edge",                      role: "Cinematographer",                   status: "Coming soon" },
  { dates: "Mar 2026",           project: "Day of the Camel",          dest: "India",                   for: "The Edge",                      role: "Cinematographer",                   status: "Coming soon" },
  { dates: "Jan – Feb 2026",    project: "Day of the Camel",          dest: "Mongolia",                for: "The Edge",                      role: "Cinematographer",                   status: "Coming soon" },
  { dates: "Jan 2026",          project: "Day of the Camel",          dest: "Kenya",                   for: "The Edge",                      role: "Cinematographer",                   status: "Coming soon" },
  { dates: "Nov – Dec 2025",     project: "Day of the Camel",          dest: "Saudi Arabia",            for: "The Edge",                      role: "Cinematographer",                   status: "Coming soon" },
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
  "Day of the Camel": "Filming over five months, Day of the Camel is a feature documentary exploring the connection between humans and camels across the world, from Kenya to Mongolia, and Saudi Arabia to India. My role on the project was almost exclusively shooting on long lens (CN20), cross-shooting every scene, picking up moments of emotion and connection, and covering some high-octane races and camel events. Aside from the CN20, the entire project was shot on anamorphics, including the aerials. Other kit included RED Raptors, DJI RS4 gimbal, DJI 4D, Inspire 3 and a Mavic 4 Pro.",
  "Planet Pet": "Planet Pet takes a deep dive into the bodies and minds of the animals closest to us: our pets. Filmed across the UK, California and Switzerland. Kit included RED V Raptor, Sigma Primes, Ronin 4D & Typoch Simera Primes, Inspire 3 & Mavic 4 Pro.",
  "Jodi Arias (Miniatures)": "Focus pulling for Simon De Glanville on a Netflix true crime documentary produced by Dorothy Street Pictures, about the murderer Jodi Arias. Based out of 69 Drop Studios, we spent a week filming a miniature set of the crime scene using a RED Raptor on a 6-axis motion-control rig with Contax Primes & Laowa Probe2Probes.",
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
