/* ===== CityGuide — Data Layer (Dexie.js + IndexedDB) ===== */

// --- Database Setup ---
const db = new Dexie('CityGuideDB');
db.version(3).stores({
  guides: 'id, name, city, status, rating, price, createdAt',
  bookings: 'id, guideId, visitorName, city, date, status, createdAt',
  reviews: 'id, guideId, bookingId, rating, createdAt',
  quizAttempts: 'id, guideId, type, score, passed, createdAt',
  activityLog: '++id, type, actor, target, timestamp',
  sessions: '++id, type, sessionId, startedAt, endedAt, data'
});

// --- Activity Logger ---
async function logActivity(type, actor, target, details = {}) {
  try {
    await db.activityLog.add({
      type, actor, target, details,
      timestamp: Date.now(),
      page: location.hash || '#/'
    });
  } catch (e) { console.warn('Log error:', e); }
}

// Track page views
function logPageView(page) { logActivity('page_view', 'visitor', page); }

// Track session
const SESSION_ID = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
async function startSession() {
  await db.sessions.add({ type: 'visitor', sessionId: SESSION_ID, startedAt: Date.now(), data: { userAgent: navigator.userAgent, screen: `${screen.width}x${screen.height}` } });
}
async function endSession() {
  const s = await db.sessions.where('sessionId').equals(SESSION_ID).first();
  if (s) await db.sessions.update(s.id, { endedAt: Date.now() });
}

// --- City Data ---
const CITIES = [
  {
    id: 'delhi', name: 'Delhi', tagline: 'Where History Meets Modernity',
    color: '#d32f2f', emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1400&q=80',
    description: `Delhi, India's sprawling capital territory, is where ancient monuments stand alongside modern skyscrapers. From the magnificent Red Fort and the towering Qutub Minar to the bustling lanes of Chandni Chowk, every corner tells a story spanning millennia.\n\nThe city seamlessly blends Mughal grandeur with British colonial architecture and cutting-edge contemporary design. Connaught Place's Georgian facades contrast with Lutyens' imperial vision, while Hauz Khas Village reinvents medieval ruins as trendy cafes.\n\nDelhi's food scene is legendary — from sizzling paranthas of Paranthe Wali Gali to the kebabs of Jama Masjid. Street food here isn't just cuisine; it's a cultural institution.`,
    bestTime: 'October to March',
    localFood: ['Chole Bhature', 'Butter Chicken', 'Paranthe', 'Chaat', 'Kebabs', 'Kulfi Falooda'],
    transport: 'Delhi Metro is the best way to navigate. Also use auto-rickshaws and Uber/Ola.',
    attractions: [
      { name: 'Red Fort', icon: 'castle', desc: 'UNESCO World Heritage Site and symbol of Mughal power. The massive red sandstone fortress spans 254 acres.' },
      { name: 'Qutub Minar', icon: 'temple_hindu', desc: 'The tallest brick minaret in the world at 72.5 meters. Built in 1193, an Indo-Islamic architectural marvel.' },
      { name: "Humayun's Tomb", icon: 'account_balance', desc: 'The first garden-tomb on the Indian subcontinent, this Mughal masterpiece inspired the Taj Mahal.' },
      { name: 'India Gate', icon: 'landscape', desc: 'The 42-meter war memorial arch stands at the heart of New Delhi with an eternal flame.' },
      { name: 'Chandni Chowk', icon: 'storefront', desc: 'One of the oldest and busiest markets, dating back to the 17th century. A sensory overload of spices and textiles.' },
      { name: 'Lotus Temple', icon: 'spa', desc: "The Bahá'í House of Worship shaped like a lotus flower. Welcomes people of all faiths." }
    ]
  },
  {
    id: 'mumbai', name: 'Mumbai', tagline: 'City of Dreams',
    color: '#1565c0', emoji: '🌊',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1400&q=80',
    description: `Mumbai is India's financial powerhouse and entertainment capital. Home to Bollywood, the Bombay Stock Exchange, and some of the most expensive real estate on Earth, this coastal metropolis pulses with energy 24/7.\n\nThe city's iconic skyline stretches along the Arabian Sea, from the colonial grandeur of the Gateway of India to the Art Deco gems of Marine Drive.\n\nMumbai's spirit is captured in its local trains, carrying over 7 million commuters daily, its vada pav vendors on every corner, and the indomitable resilience of its people.`,
    bestTime: 'November to February',
    localFood: ['Vada Pav', 'Pav Bhaji', 'Bombay Sandwich', 'Bhel Puri', 'Seafood', 'Misal Pav'],
    transport: 'Local trains are the lifeline. Supplement with BEST buses, auto-rickshaws, and taxis.',
    attractions: [
      { name: 'Gateway of India', icon: 'door_front', desc: 'The iconic 26-meter basalt arch on the waterfront, built in 1911.' },
      { name: 'Marine Drive', icon: 'waves', desc: 'The 3.6 km arc-shaped boulevard, nicknamed the "Queen\'s Necklace" for its nighttime lights.' },
      { name: 'Elephanta Caves', icon: 'temple_hindu', desc: 'UNESCO World Heritage rock-cut cave temples with breathtaking 6th-century Shiva sculptures.' },
      { name: 'CST Station', icon: 'train', desc: 'Victorian Gothic railway station — a UNESCO World Heritage Site handling millions daily.' },
      { name: 'Dharavi', icon: 'factory', desc: 'One of Asia\'s largest informal settlements — a hub of industry, enterprise, and resilience.' },
      { name: 'Haji Ali Dargah', icon: 'mosque', desc: 'The stunning mosque on an islet connected by a narrow causeway, accessible only at low tide.' }
    ]
  },
  {
    id: 'jaipur', name: 'Jaipur', tagline: 'The Pink City',
    color: '#e65100', emoji: '🏰',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1400&q=80',
    description: `Jaipur, the capital of Rajasthan, is a city where royal heritage meets vibrant everyday life. Known as the Pink City for its signature terracotta-hued buildings, it was India's first planned city, designed in 1727 by Maharaja Sawai Jai Singh II.\n\nEvery street tells a story of Rajput valor and architectural genius. From the honeycomb windows of Hawa Mahal to the mathematical precision of Jantar Mantar, Jaipur celebrates both beauty and intellect.\n\nThe bazaars of Jaipur are legendary — Johari Bazaar for gems, Bapu Bazaar for textiles, and the aroma of dal baati churma drifting from every restaurant.`,
    bestTime: 'October to March',
    localFood: ['Dal Baati Churma', 'Ghevar', 'Pyaaz Kachori', 'Laal Maas', 'Mawa Kachori', 'Kulfi'],
    transport: 'Auto-rickshaws and Uber/Ola. Jaipur Metro covers limited routes.',
    attractions: [
      { name: 'Amber Fort', icon: 'castle', desc: 'Majestic hilltop fort blending Hindu and Mughal architecture. The Sheesh Mahal (Mirror Palace) is breathtaking.' },
      { name: 'Hawa Mahal', icon: 'grid_view', desc: 'The iconic "Palace of Winds" with 953 small windows designed for royal women to observe street life.' },
      { name: 'City Palace', icon: 'account_balance', desc: 'A stunning complex of courtyards, gardens, and buildings blending Rajasthani and Mughal styles.' },
      { name: 'Jantar Mantar', icon: 'architecture', desc: 'UNESCO World Heritage astronomical observation site with the world\'s largest stone sundial.' },
      { name: 'Nahargarh Fort', icon: 'terrain', desc: 'Perched on the Aravalli Hills, offering panoramic views of the Pink City, especially at sunset.' },
      { name: 'Albert Hall Museum', icon: 'museum', desc: 'Rajasthan\'s oldest museum housed in a stunning Indo-Saracenic building in Ram Niwas Garden.' }
    ]
  },
  {
    id: 'udaipur', name: 'Udaipur', tagline: 'City of Lakes',
    color: '#6a1b9a', emoji: '💜',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1400&q=80',
    description: `Udaipur is arguably India's most romantic city. Nestled in the Aravalli Hills of southern Rajasthan, it's a vision of white marble palaces, shimmering lakes, and lush gardens that has earned it the title "Venice of the East."\n\nFounded in 1559 by Maharana Udai Singh II, Udaipur became the capital of the Mewar kingdom — a dynasty that never surrendered to the Mughals. This fierce independence is woven into the city's identity.\n\nThe city wraps around Lake Pichola like a jewel. At sunset, when the white havelis reflect golden light across the water and the Lake Palace seems to float on liquid amber, you understand why James Bond chose this as a filming location.`,
    bestTime: 'September to March',
    localFood: ['Dal Baati Churma', 'Gatte ki Sabzi', 'Kachori', 'Malpua', 'Paan', 'Lassi'],
    transport: 'Auto-rickshaws, Uber/Ola, and walking for the old city areas.',
    attractions: [
      { name: 'City Palace', icon: 'castle', desc: 'Rajasthan\'s largest palace complex overlooking Lake Pichola. A fusion of Rajasthani and Mughal architecture.' },
      { name: 'Lake Pichola', icon: 'waves', desc: 'The heart of Udaipur. Boat rides at sunset offer magical views of the Lake Palace and Jag Mandir.' },
      { name: 'Jagdish Temple', icon: 'temple_hindu', desc: 'A magnificent Indo-Aryan temple dedicated to Lord Vishnu, built in 1651 with intricate carvings.' },
      { name: 'Saheliyon ki Bari', icon: 'park', desc: 'The "Garden of the Maidens" — an ornamental garden with fountains, marble elephants, and a lotus pool.' },
      { name: 'Monsoon Palace', icon: 'villa', desc: 'Perched atop Sajjangarh hill, this hilltop palace offers panoramic views of the lakes and Aravallis.' },
      { name: 'Bagore ki Haveli', icon: 'home_work', desc: 'An 18th-century haveli on Gangaur Ghat showcasing Mewari art and culture with nightly dance shows.' }
    ]
  },
  {
    id: 'varanasi', name: 'Varanasi', tagline: 'The Eternal City',
    color: '#f57f17', emoji: '🙏',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1400&q=80',
    description: `Varanasi is one of the world's oldest continuously inhabited cities, a place where life and death dance together on the banks of the holy Ganges. Mark Twain called it "older than history, older than tradition, older even than legend."\n\nEvery morning, the ghats come alive with pilgrims performing prayers, yoga practitioners greeting the sun, and washermen beating clothes against ancient stones. The evening Ganga Aarti at Dashashwamedh Ghat is a spectacle of fire, chanting, and devotion.\n\nBeyond the ghats, Varanasi is a center of classical music, silk weaving, and Hindu scholarship. The narrow lanes hide centuries-old temples, wrestling akharas, and the world's finest Banarasi saris.`,
    bestTime: 'October to March',
    localFood: ['Kachori Sabzi', 'Banarasi Paan', 'Thandai', 'Malaiyo', 'Chaat', 'Tamatar Chaat'],
    transport: 'Auto-rickshaws, cycle-rickshaws, and boats on the Ganges.',
    attractions: [
      { name: 'Dashashwamedh Ghat', icon: 'water', desc: 'The main ghat where the spectacular Ganga Aarti ceremony takes place every evening at sunset.' },
      { name: 'Kashi Vishwanath Temple', icon: 'temple_hindu', desc: 'One of the twelve Jyotirlingas, dedicated to Lord Shiva. The golden temple is Varanasi\'s spiritual heart.' },
      { name: 'Assi Ghat', icon: 'waves', desc: 'A serene ghat popular with travelers and locals. Great for morning boat rides and cultural events.' },
      { name: 'Sarnath', icon: 'self_improvement', desc: 'Where Buddha delivered his first sermon. The Dhamek Stupa and archaeological museum are magnificent.' },
      { name: 'Ramnagar Fort', icon: 'castle', desc: 'An 18th-century Mughal-era fort on the eastern bank housing a museum of vintage cars and royal artifacts.' },
      { name: 'Manikarnika Ghat', icon: 'local_fire_department', desc: 'The primary cremation ghat where the eternal flame has burned for thousands of years.' }
    ]
  },
  {
    id: 'goa', name: 'Goa', tagline: 'Paradise on the Coast',
    color: '#00897b', emoji: '🏖️',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1400&q=80',
    description: `Goa is India's smallest state but its biggest party. With sun-kissed beaches, Portuguese colonial architecture, and a laid-back vibe that's impossible to resist, Goa has been India's favorite escape since the 1960s hippie trail.\n\nBut Goa is far more than beaches and nightlife. The UNESCO-listed churches of Old Goa rival those of Lisbon. Spice plantations perfume the Western Ghats. And the Goan kitchen — a fusion of Indian and Portuguese flavors — produces dishes like vindaloo, xacuti, and bebinca that exist nowhere else.\n\nNorth Goa buzzes with energy — beach shacks, flea markets, and trance parties. South Goa whispers with pristine beaches, boutique hotels, and quiet fishing villages. Choose your Goa.`,
    bestTime: 'November to February',
    localFood: ['Fish Curry Rice', 'Vindaloo', 'Bebinca', 'Xacuti', 'Prawn Balchão', 'Feni'],
    transport: 'Rent a scooter! Also taxis, buses, and ride-hailing apps.',
    attractions: [
      { name: 'Basilica of Bom Jesus', icon: 'church', desc: 'UNESCO World Heritage church housing the mortal remains of St. Francis Xavier. A masterpiece of Baroque architecture.' },
      { name: 'Fort Aguada', icon: 'castle', desc: 'A well-preserved 17th-century Portuguese fort and lighthouse overlooking the Arabian Sea at Sinquerim Beach.' },
      { name: 'Dudhsagar Falls', icon: 'water', desc: 'One of India\'s tallest waterfalls at 310 meters, cascading down the Western Ghats like a river of milk.' },
      { name: 'Anjuna Flea Market', icon: 'shopping_bag', desc: 'The iconic Wednesday market — a treasure trove of bohemian clothes, jewelry, spices, and souvenirs.' },
      { name: 'Palolem Beach', icon: 'beach_access', desc: 'A crescent-shaped beach in South Goa surrounded by palm trees. Perfect for kayaking and dolphin spotting.' },
      { name: 'Old Goa Churches', icon: 'church', desc: 'A cluster of UNESCO-listed 16th-century churches including Sé Cathedral and Church of St. Cajetan.' }
    ]
  }
];

// --- Guide Data (23 guides) ---
const GUIDES_DATA = [
  { id:'g1', name:'Arjun Sharma', city:'delhi', bio:'History professor turned guide with 12 years of experience. Specializing in Mughal and British colonial architecture. I bring Delhi\'s stories alive.', languages:['Hindi','English','Urdu'], specialties:['History','Architecture','Food Tours'], price:800, rating:4.7, reviewCount:234, status:'verified', avatar:null, createdAt:Date.now()-86400000*90 },
  { id:'g2', name:'Priya Mehta', city:'delhi', bio:'Food blogger and culinary guide. I take you beyond the tourist spots to where real Delhi eats. From street food to royal kitchens.', languages:['Hindi','English','Punjabi'], specialties:['Food','Culture','Photography'], price:1000, rating:4.8, reviewCount:189, status:'verified', avatar:null, createdAt:Date.now()-86400000*85 },
  { id:'g3', name:'Rajesh Kumar', city:'delhi', bio:'Born and raised in Old Delhi. My family has lived near Chandni Chowk for 6 generations. Nobody knows these lanes better.', languages:['Hindi','English'], specialties:['Heritage Walks','Local Life','Markets'], price:600, rating:4.5, reviewCount:156, status:'verified', avatar:null, createdAt:Date.now()-86400000*80 },
  { id:'g4', name:'Sana Khan', city:'delhi', bio:'Art historian specializing in Indo-Islamic architecture. Former guide at National Museum. I make monuments come alive with forgotten stories.', languages:['Hindi','English','Urdu','French'], specialties:['Art','Museums','Architecture'], price:1200, rating:4.9, reviewCount:98, status:'verified', avatar:null, createdAt:Date.now()-86400000*75 },
  { id:'g5', name:'Vikram Desai', city:'mumbai', bio:'Third-generation Mumbaikar. Ex-journalist who covered the city beat for 15 years. I know every corner, every story, every secret of this city.', languages:['Hindi','English','Marathi','Gujarati'], specialties:['History','Street Food','Bollywood'], price:900, rating:4.6, reviewCount:212, status:'verified', avatar:null, createdAt:Date.now()-86400000*70 },
  { id:'g6', name:'Anjali Nair', city:'mumbai', bio:'Marine biologist and eco-guide. I show you Mumbai\'s beautiful coastline and mangrove ecosystems alongside its urban wonders.', languages:['Hindi','English','Malayalam'], specialties:['Nature','Coastal Tours','Photography'], price:1100, rating:4.7, reviewCount:87, status:'verified', avatar:null, createdAt:Date.now()-86400000*65 },
  { id:'g7', name:'Farhan Patel', city:'mumbai', bio:'Bollywood insider and entertainment journalist. Get VIP access to Film City, celebrity haunts, and the real stories behind the silver screen.', languages:['Hindi','English','Gujarati'], specialties:['Bollywood','Nightlife','Entertainment'], price:1500, rating:4.4, reviewCount:145, status:'verified', avatar:null, createdAt:Date.now()-86400000*60 },
  { id:'g8', name:'Meera Joshi', city:'mumbai', bio:'Architecture enthusiast with a focus on Art Deco Mumbai. Featured in Architectural Digest. I\'ll show you why Mumbai\'s skyline is world-class.', languages:['Hindi','English','Marathi'], specialties:['Architecture','Art Deco','Heritage'], price:1000, rating:4.8, reviewCount:76, status:'verified', avatar:null, createdAt:Date.now()-86400000*55 },
  { id:'g9', name:'Mahendra Singh', city:'jaipur', bio:'Royal family historian and certified heritage guide. 20 years of experience bringing the stories of Rajput kings to life.', languages:['Hindi','English','Rajasthani','French'], specialties:['Royal Heritage','Forts','History'], price:1000, rating:4.8, reviewCount:321, status:'verified', avatar:null, createdAt:Date.now()-86400000*50 },
  { id:'g10', name:'Lakshmi Rathore', city:'jaipur', bio:'Textile expert and shopping guide. I help you navigate Jaipur\'s famous bazaars for authentic block-prints, gems, and crafts.', languages:['Hindi','English','Rajasthani'], specialties:['Shopping','Textiles','Crafts'], price:700, rating:4.5, reviewCount:198, status:'verified', avatar:null, createdAt:Date.now()-86400000*45 },
  { id:'g11', name:'Deepak Meena', city:'jaipur', bio:'Adventure guide specializing in off-beat Jaipur. Hot air balloon rides, village safaris, camel treks, and hidden gems most tourists miss.', languages:['Hindi','English'], specialties:['Adventure','Off-beat','Nature'], price:800, rating:4.6, reviewCount:112, status:'verified', avatar:null, createdAt:Date.now()-86400000*40 },
  { id:'g12', name:'Pratap Ranawat', city:'udaipur', bio:'Descendant of a Mewar noble family. I share the untold stories of Udaipur\'s warrior kings and the romance of the Lake City.', languages:['Hindi','English','Mewari'], specialties:['History','Royal Heritage','Lakes'], price:900, rating:4.7, reviewCount:267, status:'verified', avatar:null, createdAt:Date.now()-86400000*35 },
  { id:'g13', name:'Kavita Bhatt', city:'udaipur', bio:'Artist and cultural guide. Udaipur\'s art scene is thriving — I take you through miniature painting workshops, galleries, and sunset art walks.', languages:['Hindi','English','Rajasthani'], specialties:['Art','Culture','Painting'], price:750, rating:4.4, reviewCount:134, status:'verified', avatar:null, createdAt:Date.now()-86400000*30 },
  { id:'g14', name:'Ravi Sisodiya', city:'udaipur', bio:'Professional photographer and guide. I know every Instagram-worthy spot in the City of Lakes. Let me capture your perfect trip.', languages:['Hindi','English'], specialties:['Photography','Sunrise/Sunset','Lakes'], price:1200, rating:4.3, reviewCount:89, status:'verified', avatar:null, createdAt:Date.now()-86400000*25 },
  { id:'g15', name:'Sunita Paliwal', city:'udaipur', bio:'Food and culture enthusiast. From cooking classes in old havelis to street food crawls in the old city, I show you Udaipur through its flavors.', languages:['Hindi','English','Mewari','Gujarati'], specialties:['Food','Cooking Classes','Culture'], price:650, rating:4.6, reviewCount:78, status:'verified', avatar:null, createdAt:Date.now()-86400000*20 },
  { id:'g16', name:'Pandit Ashok Mishra', city:'varanasi', bio:'Spiritual guide and Sanskrit scholar from a family of priests at Dashashwamedh Ghat. I help you understand the deep spirituality of Kashi.', languages:['Hindi','English','Sanskrit'], specialties:['Spiritual','Temples','Rituals'], price:800, rating:4.9, reviewCount:345, status:'verified', avatar:null, createdAt:Date.now()-86400000*15 },
  { id:'g17', name:'Nandini Tiwari', city:'varanasi', bio:'Classical musician and cultural guide. Varanasi is the birthplace of many music gharanas. I take you to where raga meets the Ganga.', languages:['Hindi','English'], specialties:['Music','Culture','Arts'], price:700, rating:4.5, reviewCount:156, status:'verified', avatar:null, createdAt:Date.now()-86400000*10 },
  { id:'g18', name:'Amit Kashyap', city:'varanasi', bio:'Silk weaver\'s son turned guide. I show you the incredible artistry behind Banarasi silk saris — from loom to drape.', languages:['Hindi','English','Bhojpuri'], specialties:['Textiles','Crafts','Shopping'], price:600, rating:4.4, reviewCount:203, status:'verified', avatar:null, createdAt:Date.now()-86400000*5 },
  { id:'g19', name:'Dr. Rekha Pandey', city:'varanasi', bio:'Professor of Religious Studies at BHU. I provide an academic yet accessible perspective on Varanasi\'s 3000-year spiritual journey.', languages:['Hindi','English','Sanskrit','German'], specialties:['Academic Tours','History','Spirituality'], price:1100, rating:4.7, reviewCount:87, status:'verified', avatar:null, createdAt:Date.now()-86400000*3 },
  { id:'g20', name:'Carlos Fernandes', city:'goa', bio:'Born in Fontainhas, Goa\'s Latin Quarter. I bridge the Portuguese and Indian heritage of Goa. Architecture, cuisine, music, history.', languages:['Hindi','English','Konkani','Portuguese'], specialties:['Heritage','Architecture','Portuguese History'], price:900, rating:4.6, reviewCount:178, status:'verified', avatar:null, createdAt:Date.now()-86400000*2 },
  { id:'g21', name:'Tanvi Naik', city:'goa', bio:'Marine biologist and beach expert. From dolphin spotting to hidden beaches, I show you Goa\'s stunning coastline the way locals experience it.', languages:['Hindi','English','Konkani'], specialties:['Beaches','Nature','Water Sports'], price:1000, rating:4.5, reviewCount:134, status:'verified', avatar:null, createdAt:Date.now()-86400000 },
  { id:'g22', name:'Rohan D\'Souza', city:'goa', bio:'Nightlife expert and music journalist. I curate the perfect Goa party experience — from sunset sessions to underground electronica.', languages:['Hindi','English','Konkani'], specialties:['Nightlife','Music','Beach Parties'], price:1200, rating:4.3, reviewCount:98, status:'verified', avatar:null, createdAt:Date.now()-86400000*7 },
  { id:'g23', name:'Anita Desai', city:'goa', bio:'Spice plantation owner and eco-tourism advocate. I take you deep into Goa\'s lush hinterland — spice farms, waterfalls, wildlife, and village life.', languages:['Hindi','English','Konkani','Marathi'], specialties:['Eco-Tourism','Spice Farms','Nature'], price:850, rating:4.7, reviewCount:156, status:'verified', avatar:null, createdAt:Date.now()-86400000*12 }
];

// --- Sample Bookings ---
const SAMPLE_BOOKINGS = [
  { id:'b1', guideId:'g1', visitorName:'Rahul Verma', visitorEmail:'rahul@example.com', visitorPhone:'+91-9876543210', city:'delhi', date:'2026-03-15', time:'09:00', duration:4, groupSize:2, tourType:'Heritage Walk', totalPrice:3200, status:'confirmed', notes:'Interested in Mughal architecture', createdAt:Date.now()-86400000*5 },
  { id:'b2', guideId:'g9', visitorName:'Emily Johnson', visitorEmail:'emily@example.com', visitorPhone:'+1-555-0123', city:'jaipur', date:'2026-03-20', time:'10:00', duration:6, groupSize:4, tourType:'Royal Heritage', totalPrice:6000, status:'confirmed', notes:'Want to see all major forts', createdAt:Date.now()-86400000*3 },
  { id:'b3', guideId:'g16', visitorName:'Akiko Tanaka', visitorEmail:'akiko@example.com', visitorPhone:'+81-90-1234', city:'varanasi', date:'2026-03-10', time:'05:00', duration:3, groupSize:1, tourType:'Spiritual Tour', totalPrice:2400, status:'completed', notes:'Early morning Ganga Aarti', createdAt:Date.now()-86400000*10 },
  { id:'b4', guideId:'g20', visitorName:'Marco Silva', visitorEmail:'marco@example.com', visitorPhone:'+55-11-98765', city:'goa', date:'2026-03-25', time:'14:00', duration:5, groupSize:3, tourType:'Heritage Walk', totalPrice:4500, status:'pending', notes:'Portuguese heritage focus', createdAt:Date.now()-86400000*1 },
  { id:'b5', guideId:'g12', visitorName:'Sarah Williams', visitorEmail:'sarah@example.com', visitorPhone:'+44-7700-900', city:'udaipur', date:'2026-02-28', time:'16:00', duration:3, groupSize:2, tourType:'Sunset Lake Tour', totalPrice:2700, status:'completed', notes:'Lake Pichola sunset', createdAt:Date.now()-86400000*15 }
];

// --- Sample Reviews ---
const SAMPLE_REVIEWS = [
  { id:'r1', guideId:'g1', bookingId:'b1', visitorName:'Rahul Verma', rating:5, text:'Arjun is absolutely phenomenal! His knowledge of Mughal history made the Red Fort come alive. Worth every rupee.', createdAt:Date.now()-86400000*4 },
  { id:'r2', guideId:'g9', bookingId:'b2', visitorName:'Emily Johnson', rating:5, text:'Mahendra made our Jaipur trip unforgettable. The stories about the royal family were fascinating. Highly recommend!', createdAt:Date.now()-86400000*2 },
  { id:'r3', guideId:'g16', bookingId:'b3', visitorName:'Akiko Tanaka', rating:5, text:'The early morning Ganga Aarti with Pandit ji was a spiritual experience I\'ll never forget. Truly life-changing.', createdAt:Date.now()-86400000*8 },
  { id:'r4', guideId:'g12', bookingId:'b5', visitorName:'Sarah Williams', rating:4, text:'Pratap showed us the most amazing sunset spots. The boat ride on Lake Pichola was magical. Would book again!', createdAt:Date.now()-86400000*12 },
  { id:'r5', guideId:'g5', bookingId:null, visitorName:'James Brown', rating:5, text:'Vikram knows every lane of Mumbai. The street food tour was incredible — we ate at places no tourist would find.', createdAt:Date.now()-86400000*20 },
  { id:'r6', guideId:'g2', bookingId:null, visitorName:'Neha Kapoor', rating:4, text:'Priya\'s food tour was excellent. She took us to hidden gems in Old Delhi. The paranthe were to die for!', createdAt:Date.now()-86400000*25 },
  { id:'r7', guideId:'g20', bookingId:null, visitorName:'Ana Costa', rating:5, text:'Carlos is the best guide in Goa. His knowledge of Portuguese history combined with local Goan culture is unmatched.', createdAt:Date.now()-86400000*30 },
  { id:'r8', guideId:'g23', bookingId:null, visitorName:'David Lee', rating:4, text:'Anita\'s spice plantation tour was fantastic! Great food, beautiful nature, and so much to learn about Goan spices.', createdAt:Date.now()-86400000*18 }
];

// --- Quiz Data ---
const LANGUAGE_QUIZZES = {
  hindi: [
    { q: 'What does "Namaste" mean?', options: ['Hello/Greetings', 'Goodbye', 'Thank you', 'Sorry'], correct: 0 },
    { q: 'How do you say "How are you?" in Hindi?', options: ['Kya haal hai?', 'Aap kaise hain?', 'Kahan ja rahe ho?', 'Kya kar rahe ho?'], correct: 1 },
    { q: 'What is "Dhanyavaad"?', options: ['Please', 'Sorry', 'Thank you', 'Welcome'], correct: 2 },
    { q: '"Kitna" means:', options: ['Where', 'When', 'How much/many', 'Why'], correct: 2 },
    { q: 'The Hindi word for "water" is:', options: ['Dudh', 'Paani', 'Chai', 'Roti'], correct: 1 },
    { q: '"Bahut accha" translates to:', options: ['Very bad', 'Very good', 'Very big', 'Very small'], correct: 1 },
    { q: 'What does "Kripya" mean?', options: ['Please', 'Quickly', 'Slowly', 'Carefully'], correct: 0 },
    { q: '"Mera naam ___ hai" means:', options: ['I live in ___', 'My name is ___', 'I want ___', 'I like ___'], correct: 1 },
    { q: 'Which is the correct Hindi greeting for evening?', options: ['Shubh prabhat', 'Shubh ratri', 'Shubh sandhya', 'Shubh din'], correct: 2 },
    { q: '"Maaf kijiye" is used to say:', options: ['Thank you', 'Excuse me/Sorry', 'Please help', 'Good morning'], correct: 1 }
  ],
  english: [
    { q: 'What is the past tense of "go"?', options: ['Goed', 'Gone', 'Went', 'Going'], correct: 2 },
    { q: 'Choose the correct sentence:', options: ['He don\'t know', 'He doesn\'t knows', 'He doesn\'t know', 'He not know'], correct: 2 },
    { q: '"Ubiquitous" means:', options: ['Rare', 'Found everywhere', 'Expensive', 'Underground'], correct: 1 },
    { q: 'The plural of "phenomenon" is:', options: ['Phenomenons', 'Phenomena', 'Phenomenae', 'Phenomeni'], correct: 1 },
    { q: 'Which word means "a person who shows tourists around"?', options: ['Tourist', 'Traveler', 'Guide', 'Explorer'], correct: 2 },
    { q: '"Could you please..." is an example of:', options: ['A command', 'A polite request', 'A question', 'An exclamation'], correct: 1 },
    { q: 'What does "itinerary" mean?', options: ['A type of hotel', 'A travel plan/route', 'A landmark', 'A vehicle'], correct: 1 },
    { q: 'Choose the correct usage:', options: ['Their going home', 'They\'re going home', 'There going home', 'Theyre going home'], correct: 1 },
    { q: '"Heritage" refers to:', options: ['Modern buildings', 'Future plans', 'Cultural traditions/legacy', 'Natural disasters'], correct: 2 },
    { q: 'An "anecdote" is:', options: ['A type of medicine', 'A short amusing story', 'A historical fact', 'A map'], correct: 1 }
  ]
};

const CITY_QUIZZES = {
  delhi: [
    { q: 'Who built the Red Fort?', options: ['Akbar', 'Shah Jahan', 'Humayun', 'Aurangzeb'], correct: 1 },
    { q: 'Qutub Minar was built in which century?', options: ['10th', '12th', '15th', '8th'], correct: 1 },
    { q: 'India Gate commemorates soldiers from which war?', options: ['1857 Revolt', 'World War I', 'Kargil War', '1971 War'], correct: 1 },
    { q: 'Chandni Chowk was designed by:', options: ['Shah Jahan\'s daughter', 'Akbar', 'Edwin Lutyens', 'Mir Taqi Mir'], correct: 0 },
    { q: 'Which temple in Delhi is shaped like a lotus?', options: ['Akshardham', 'ISKCON', 'Lotus Temple', 'Birla Mandir'], correct: 2 },
    { q: 'What is Delhi\'s most famous street food?', options: ['Vada Pav', 'Chole Bhature', 'Idli', 'Dhokla'], correct: 1 },
    { q: 'The Mughal Gardens are located in:', options: ['Red Fort', 'Rashtrapati Bhavan', 'India Gate', 'Humayun Tomb'], correct: 1 },
    { q: 'Old Delhi was known as:', options: ['Dilli', 'Shahjahanabad', 'Indraprastha', 'Mehrauli'], correct: 1 },
    { q: 'Which river flows through Delhi?', options: ['Ganga', 'Saraswati', 'Yamuna', 'Narmada'], correct: 2 },
    { q: 'Connaught Place is named after:', options: ['An Indian king', 'A British duke', 'A Mughal emperor', 'A river'], correct: 1 }
  ],
  mumbai: [
    { q: 'Gateway of India was built to commemorate:', options: ['Indian Independence', 'King George V visit', 'Queen Victoria', 'World War I'], correct: 1 },
    { q: 'Marine Drive is nicknamed:', options: ['Golden Mile', 'Queen\'s Necklace', 'Pearl String', 'Silver Arc'], correct: 1 },
    { q: 'Mumbai was originally a group of how many islands?', options: ['5', '7', '9', '3'], correct: 1 },
    { q: 'Which is Mumbai\'s iconic street food?', options: ['Pani Puri', 'Vada Pav', 'Samosa', 'Dosa'], correct: 1 },
    { q: 'Chhatrapati Shivaji Terminus was designed by:', options: ['Edwin Lutyens', 'F.W. Stevens', 'Herbert Baker', 'Le Corbusier'], correct: 1 },
    { q: 'Bollywood is based in which area?', options: ['Bandra', 'Film City, Goregaon', 'Juhu', 'Andheri'], correct: 1 },
    { q: 'The Bombay Stock Exchange is located at:', options: ['Nariman Point', 'Dalal Street', 'Marine Drive', 'Colaba'], correct: 1 },
    { q: 'Elephanta Caves are dedicated to:', options: ['Vishnu', 'Brahma', 'Shiva', 'Ganesha'], correct: 2 },
    { q: 'Mumbai\'s local trains carry how many passengers daily?', options: ['3 million', '5 million', '7+ million', '10 million'], correct: 2 },
    { q: 'What connects Mumbai\'s islands today?', options: ['Bridges only', 'Tunnels', 'Land reclamation', 'Ferries'], correct: 2 }
  ],
  jaipur: [
    { q: 'Why is Jaipur called the Pink City?', options: ['Pink flowers', 'Buildings painted pink for royal visit', 'Pink marble', 'Sunset color'], correct: 1 },
    { q: 'Jaipur was founded by:', options: ['Prithviraj Chauhan', 'Maharaja Sawai Jai Singh II', 'Man Singh I', 'Akbar'], correct: 1 },
    { q: 'Hawa Mahal has how many windows?', options: ['365', '500', '953', '1000'], correct: 2 },
    { q: 'Amber Fort is known for its:', options: ['Gold walls', 'Sheesh Mahal (Mirror Palace)', 'Water fountains', 'Underground tunnels'], correct: 1 },
    { q: 'Jantar Mantar is a collection of:', options: ['Temples', 'Astronomical instruments', 'Water tanks', 'Royal tombs'], correct: 1 },
    { q: 'Which is a famous Jaipur dessert?', options: ['Rasgulla', 'Ghevar', 'Jalebi', 'Gulab Jamun'], correct: 1 },
    { q: 'Nahargarh Fort means:', options: ['Tiger Fort', 'Lion Fort', 'Abode of Tigers', 'Eagle Fort'], correct: 2 },
    { q: 'Jaipur is part of which tourist triangle?', options: ['Golden Triangle', 'Heritage Triangle', 'Royal Triangle', 'Desert Triangle'], correct: 0 },
    { q: 'Block printing originated in which Jaipur village?', options: ['Sanganer', 'Amber', 'Chomu', 'Samode'], correct: 0 },
    { q: 'City Palace houses which unique artifact?', options: ['Akbar\'s sword', 'World\'s largest silver vessels', 'Golden throne', 'Diamond crown'], correct: 1 }
  ],
  udaipur: [
    { q: 'Udaipur was founded by:', options: ['Maharana Pratap', 'Maharana Udai Singh II', 'Rana Sanga', 'Rana Kumbha'], correct: 1 },
    { q: 'Udaipur is called:', options: ['City of Palaces', 'Venice of the East', 'Lake City', 'All of these'], correct: 3 },
    { q: 'Which James Bond film was shot in Udaipur?', options: ['Goldfinger', 'Octopussy', 'Casino Royale', 'Skyfall'], correct: 1 },
    { q: 'Lake Pichola was created in:', options: ['14th century', '15th century', '16th century', '17th century'], correct: 0 },
    { q: 'The Lake Palace hotel sits on which island?', options: ['Jag Niwas', 'Jag Mandir', 'Arsi Vilas', 'Mohan Mandir'], correct: 0 },
    { q: 'Mewar dynasty is known for never surrendering to:', options: ['British', 'Mughals', 'Marathas', 'Portuguese'], correct: 1 },
    { q: 'Which festival sees a huge procession in Udaipur?', options: ['Diwali', 'Holi', 'Gangaur', 'Navratri'], correct: 2 },
    { q: 'Sajjangarh Palace is also known as:', options: ['Rain Palace', 'Monsoon Palace', 'Cloud Palace', 'Wind Palace'], correct: 1 },
    { q: 'Udaipur\'s famous miniature paintings belong to which school?', options: ['Mughal', 'Mewar', 'Kangra', 'Pahari'], correct: 1 },
    { q: 'Which hills surround Udaipur?', options: ['Vindhya', 'Satpura', 'Aravalli', 'Western Ghats'], correct: 2 }
  ],
  varanasi: [
    { q: 'Varanasi is approximately how old?', options: ['1000 years', '3000+ years', '500 years', '2000 years'], correct: 1 },
    { q: 'Varanasi sits on the banks of:', options: ['Yamuna', 'Ganga', 'Godavari', 'Saraswati'], correct: 1 },
    { q: 'The Ganga Aarti takes place at:', options: ['Assi Ghat', 'Manikarnika Ghat', 'Dashashwamedh Ghat', 'Harishchandra Ghat'], correct: 2 },
    { q: 'Sarnath is significant because:', options: ['Rama was born', 'Buddha gave first sermon', 'Krishna lived', 'Mahavira meditated'], correct: 1 },
    { q: 'Banarasi saris are famous for:', options: ['Cotton weaving', 'Silk and gold zari', 'Tie-dye', 'Block printing'], correct: 1 },
    { q: 'Mark Twain said Varanasi is:', options: ['Beautiful', 'Older than legend', 'The soul of India', 'Eternal'], correct: 1 },
    { q: 'Kashi Vishwanath Temple is dedicated to:', options: ['Vishnu', 'Shiva', 'Brahma', 'Hanuman'], correct: 1 },
    { q: 'Which Indian classical music form thrives in Varanasi?', options: ['Carnatic', 'Hindustani', 'Bhajan only', 'Qawwali'], correct: 1 },
    { q: 'BHU (Banaras Hindu University) was founded by:', options: ['Mahatma Gandhi', 'Madan Mohan Malaviya', 'Jawaharlal Nehru', 'Rabindranath Tagore'], correct: 1 },
    { q: 'How many ghats does Varanasi have?', options: ['About 50', 'About 84', 'About 100', 'About 30'], correct: 1 }
  ],
  goa: [
    { q: 'Goa was a colony of which country?', options: ['Britain', 'France', 'Portugal', 'Netherlands'], correct: 2 },
    { q: 'Goa was liberated from colonial rule in:', options: ['1947', '1954', '1961', '1971'], correct: 2 },
    { q: 'What is "Feni"?', options: ['A dance form', 'A local spirit/alcohol', 'A fish dish', 'A festival'], correct: 1 },
    { q: 'Basilica of Bom Jesus holds the remains of:', options: ['St. Peter', 'St. Francis Xavier', 'St. Paul', 'St. Thomas'], correct: 1 },
    { q: 'Dudhsagar Falls means:', options: ['Golden water', 'Sea of milk', 'Thunder falls', 'Mountain spring'], correct: 1 },
    { q: 'Which is Goa\'s signature curry?', options: ['Butter Chicken', 'Fish Curry Rice', 'Dal Makhani', 'Sambar'], correct: 1 },
    { q: 'Old Goa is also known as:', options: ['Nova Goa', 'Velha Goa', 'Porto Goa', 'Latin Quarter'], correct: 1 },
    { q: 'Fontainhas in Goa is known as:', options: ['Beach district', 'Latin Quarter', 'Fishing village', 'Market area'], correct: 1 },
    { q: 'Carnival in Goa happens in:', options: ['January', 'February/March', 'December', 'October'], correct: 1 },
    { q: 'What separates North and South Goa?', options: ['A mountain', 'Zuari River', 'Mandovi River', 'A highway'], correct: 1 }
  ]
};

// --- DB Initialization ---
async function initDB() {
  const guideCount = await db.guides.count();
  if (guideCount === 0) {
    await db.guides.bulkAdd(GUIDES_DATA);
    await logActivity('system', 'system', 'db', { action: 'seeded_guides', count: GUIDES_DATA.length });
  }
  const bookingCount = await db.bookings.count();
  if (bookingCount === 0) {
    await db.bookings.bulkAdd(SAMPLE_BOOKINGS);
    await logActivity('system', 'system', 'db', { action: 'seeded_bookings', count: SAMPLE_BOOKINGS.length });
  }
  const reviewCount = await db.reviews.count();
  if (reviewCount === 0) {
    await db.reviews.bulkAdd(SAMPLE_REVIEWS);
    await logActivity('system', 'system', 'db', { action: 'seeded_reviews', count: SAMPLE_REVIEWS.length });
  }
  await startSession();
}
