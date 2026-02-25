// ===== City Data =====
const CITIES = [
  {
    id: 'delhi',
    name: 'Delhi',
    tagline: 'Where History Meets Modernity',
    color: '#d32f2f',
    emoji: '🏛️',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1400&q=80',
    guidesCount: 0,
    description: `Delhi, India's sprawling capital territory, is a city where ancient monuments stand alongside modern skyscrapers. From the magnificent Red Fort and the towering Qutub Minar to the bustling lanes of Chandni Chowk, every corner tells a story spanning millennia.

The city seamlessly blends Mughal grandeur with British colonial architecture and cutting-edge contemporary design. Connaught Place's Georgian facades contrast with Lutyens' imperial vision, while Hauz Khas Village reinvents medieval ruins as trendy cafes and galleries.

Delhi's food scene is legendary — from the sizzling paranthas of Paranthe Wali Gali to the kebabs of Jama Masjid. Street food here isn't just cuisine; it's a cultural institution. Whether you crave chaat, butter chicken, or the city's iconic chole bhature, every meal is an adventure.`,
    bestTime: 'October to March (pleasant winters, perfect for sightseeing)',
    localFood: ['Chole Bhature', 'Butter Chicken', 'Paranthe', 'Chaat', 'Kebabs', 'Kulfi Falooda'],
    transport: 'Delhi Metro is the best way to navigate. Also use auto-rickshaws and Uber/Ola.',
    attractions: [
      { name: 'Red Fort', icon: 'castle', desc: 'UNESCO World Heritage Site and symbol of Mughal power. The massive red sandstone fortress spans 254 acres along the Yamuna riverbank.' },
      { name: 'Qutub Minar', icon: 'temple_hindu', desc: 'The tallest brick minaret in the world at 72.5 meters. Built in 1193, this Indo-Islamic architectural marvel is surrounded by other medieval structures.' },
      { name: 'Humayun\'s Tomb', icon: 'account_balance', desc: 'The first garden-tomb on the Indian subcontinent, this Mughal masterpiece inspired the Taj Mahal. Set in beautiful charbagh gardens.' },
      { name: 'India Gate', icon: 'landscape', desc: 'The 42-meter war memorial arch stands at the heart of New Delhi. The eternal flame burns for soldiers of the Indian Army.' },
      { name: 'Chandni Chowk', icon: 'storefront', desc: 'One of the oldest and busiest markets in Delhi, dating back to the 17th century. A sensory overload of spices, textiles, jewelry, and street food.' },
      { name: 'Lotus Temple', icon: 'spa', desc: 'The Bahá\'í House of Worship shaped like a lotus flower. This architectural marvel welcomes people of all faiths and is surrounded by lush gardens.' }
    ]
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    tagline: 'City of Dreams',
    color: '#1565c0',
    emoji: '🌊',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1400&q=80',
    guidesCount: 0,
    description: `Mumbai is India's financial powerhouse and entertainment capital. Home to Bollywood, the Bombay Stock Exchange, and some of the most expensive real estate on Earth, this coastal metropolis pulses with unmatched energy 24/7.

The city's iconic skyline stretches along the Arabian Sea, from the colonial grandeur of the Gateway of India to the Art Deco gems of Marine Drive. The contrast between the soaring Antilia tower and the vibrant dharavi community tells the story of a city where billions of dreams coexist.

Mumbai's spirit is captured in its local trains, carrying over 7 million commuters daily, its vada pav vendors on every corner, and the indomitable resilience of its people. When the city floods during monsoon, Mumbaikars don't stop — they wade through waist-deep water to keep their city running.`,
    bestTime: 'November to February (dry, comfortable weather)',
    localFood: ['Vada Pav', 'Pav Bhaji', 'Bombay Sandwich', 'Bhel Puri', 'Seafood', 'Misal Pav'],
    transport: 'Local trains are the lifeline. Supplement with BEST buses, auto-rickshaws (suburbs), and taxis.',
    attractions: [
      { name: 'Gateway of India', icon: 'door_front', desc: 'The iconic 26-meter basalt arch on the waterfront, built to commemorate King George V\'s visit in 1911. The starting point of every Mumbai journey.' },
      { name: 'Marine Drive', icon: 'waves', desc: 'The 3.6 km arc-shaped boulevard along the coastline, nicknamed the "Queen\'s Necklace" for its sparkling nighttime lights. Best experienced at sunset.' },
      { name: 'Elephanta Caves', icon: 'temple_hindu', desc: 'UNESCO World Heritage rock-cut cave temples on an island in Mumbai Harbour. The 6th-century Shiva sculptures are breathtaking.' },
      { name: 'Chhatrapati Shivaji Terminus', icon: 'train', desc: 'This Victorian Gothic railway station is a UNESCO World Heritage Site. A functional masterpiece that handles millions of commuters daily.' },
      { name: 'Dhobi Ghat', icon: 'local_laundry_service', desc: 'The world\'s largest open-air laundry. Over 7,000 workers wash clothes from all over Mumbai in this incredible display of organized chaos.' },
      { name: 'Bandra-Worli Sea Link', icon: 'route', desc: 'The stunning cable-stayed bridge connects Bandra to Worli across Mahim Bay. An engineering marvel and Mumbai\'s most photographed modern landmark.' }
    ]
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    tagline: 'The Pink City',
    color: '#e65100',
    emoji: '🏰',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1400&q=80',
    guidesCount: 0,
    description: `Jaipur, the capital of Rajasthan, is a breathtaking open-air museum of royal heritage. Founded in 1727 by Maharaja Sawai Jai Singh II, it was India's first planned city, designed using principles of Vastu Shastra and ancient Hindu architecture.

The entire old city is painted in terracotta pink — a color scheme originally adopted to welcome Prince Albert in 1876 that became the city's permanent identity. Walking through its bazaars feels like stepping into a Rajput painting: women in vibrant ghagras, camel carts sharing roads with modern traffic, and the fragrance of jasmine garlands mixing with street food spices.

Jaipur is the gateway to Rajasthan's royal heritage. Every palace tells the story of warrior kings and their refined aesthetic sensibility. From the intricate jali work of Hawa Mahal to the astronomical instruments of Jantar Mantar, the city celebrates the marriage of art and science.`,
    bestTime: 'October to March (cool weather ideal for palace visits)',
    localFood: ['Dal Baati Churma', 'Laal Maas', 'Pyaaz Kachori', 'Ghewar', 'Mirchi Vada', 'Kulfi'],
    transport: 'Auto-rickshaws are the most common. Cycle rickshaws for old city. Uber/Ola available.',
    attractions: [
      { name: 'Amber Fort', icon: 'castle', desc: 'The magnificent hilltop fortress overlooking Maota Lake. Built from red sandstone and marble, it blends Hindu and Mughal architecture in stunning fashion.' },
      { name: 'Hawa Mahal', icon: 'grid_view', desc: 'The iconic "Palace of Winds" with 953 small windows (jharokhas). Built in 1799 so royal women could observe street life without being seen.' },
      { name: 'City Palace', icon: 'account_balance', desc: 'A stunning complex that blends Rajasthani and Mughal architecture. Parts of the palace are still the royal residence of the Jaipur royal family.' },
      { name: 'Jantar Mantar', icon: 'architecture', desc: 'UNESCO World Heritage astronomical observation site. The world\'s largest stone sundial and 19 other instruments built in the 1720s.' },
      { name: 'Nahargarh Fort', icon: 'terrain', desc: 'Perched on the Aravalli Hills, this fort offers panoramic views of Jaipur city. Best visited at sunset for breathtaking vistas.' },
      { name: 'Jal Mahal', icon: 'water', desc: 'The "Water Palace" appears to float in the middle of Man Sagar Lake. This five-story structure has four floors submerged underwater.' }
    ]
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    tagline: 'City of Lakes',
    color: '#00838f',
    emoji: '🏖️',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1400&q=80',
    guidesCount: 0,
    description: `Udaipur is arguably India's most romantic city. Nestled in the Aravalli Hills of southern Rajasthan, it's a vision of white marble palaces, shimmering lakes, and lush gardens that has earned it the title "Venice of the East."

Founded in 1559 by Maharana Udai Singh II, Udaipur became the capital of the Mewar kingdom — a dynasty that never surrendered to the Mughals. This fierce independence is woven into the city's identity, from the heroic murals in the City Palace to the pride in local voices when they speak of Maharana Pratap.

The city wraps around Lake Pichola like a jewel in a setting. At sunset, when the white haveli reflect golden light across the water and the Lake Palace seems to float on liquid amber, you understand why James Bond chose this as a filming location. Udaipur isn't just a city — it's a mood.`,
    bestTime: 'September to March (post-monsoon greenery through pleasant winter)',
    localFood: ['Dal Baati Churma', 'Gatte Ki Sabzi', 'Kachori', 'Mawa Kachori', 'Shahi Thali', 'Kulhad Chai'],
    transport: 'Auto-rickshaws everywhere. Walking is pleasant in the old city. Bikes/scooters for lake roads.',
    attractions: [
      { name: 'City Palace', icon: 'castle', desc: 'The largest palace complex in Rajasthan, towering over Lake Pichola. A fusion of Rajasthani and Mughal architecture spanning 400 years of continuous construction.' },
      { name: 'Lake Pichola', icon: 'water', desc: 'The heart and soul of Udaipur. Take a boat ride at sunset to see the Lake Palace and Jag Mandir emerging from the water like dreams made real.' },
      { name: 'Jag Mandir', icon: 'villa', desc: 'The island palace on Lake Pichola where Prince Khurram (future Shah Jahan) took refuge. Its architecture is said to have inspired the Taj Mahal.' },
      { name: 'Saheliyon Ki Bari', icon: 'park', desc: 'The "Garden of Maidens" — a beautiful garden with fountains, marble elephants, and lotus pools. Built for the queen and her 48 maidens.' },
      { name: 'Jagdish Temple', icon: 'temple_hindu', desc: 'A magnificent Indo-Aryan temple from 1651, dedicated to Lord Vishnu. The carved sculptures and brass image of Garuda at the entrance are stunning.' },
      { name: 'Monsoon Palace', icon: 'landscape', desc: 'Perched atop a hill overlooking the city, this hilltop palace offers panoramic views of Udaipur\'s lakes and the Aravalli Range, especially magical at sunset.' }
    ]
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    tagline: 'The Eternal City',
    color: '#ff6f00',
    emoji: '🕉️',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1400&q=80',
    guidesCount: 0,
    description: `Varanasi is one of the oldest continuously inhabited cities in the world, and the spiritual capital of India. Hindus believe that dying here grants moksha — liberation from the cycle of rebirth — making this a city where death and life dance together in profound harmony.

The 84 ghats along the Ganges are the city's lifeline. At dawn, pilgrims bathe in the sacred river while yoga practitioners salute the sun. By evening, the spectacular Ganga Aarti ceremony fills the air with chanting, bells, and the glow of a thousand oil lamps reflected in the dark waters.

Beyond spirituality, Varanasi is a center of learning, music, and craftsmanship. Its Banarasi silk saris are prized worldwide, its classical music tradition has produced legends, and Banaras Hindu University stands as one of Asia's greatest institutions. This is a city that challenges, transforms, and humbles every visitor.`,
    bestTime: 'October to March (avoid scorching summers and humid monsoons)',
    localFood: ['Banarasi Paan', 'Kachori Sabzi', 'Tamatar Chaat', 'Thandai', 'Malaiyo', 'Baati Chokha'],
    transport: 'Walking and cycle rickshaws for ghats/old city. Auto-rickshaws and e-rickshaws elsewhere.',
    attractions: [
      { name: 'Dashashwamedh Ghat', icon: 'local_fire_department', desc: 'The main ghat and site of the spectacular evening Ganga Aarti ceremony. Priests perform synchronized rituals with fire lamps that have continued for centuries.' },
      { name: 'Kashi Vishwanath Temple', icon: 'temple_hindu', desc: 'One of the 12 Jyotirlingas, this is the most sacred Shiva temple in India. The golden spire towers over the narrow lanes of the old city.' },
      { name: 'Assi Ghat', icon: 'water', desc: 'The southernmost and most peaceful ghat, popular with travelers and students. Morning yoga sessions and evening cultural performances happen here.' },
      { name: 'Sarnath', icon: 'self_improvement', desc: 'Where Buddha gave his first sermon after enlightenment. The Dhamek Stupa and museum house incredible Buddhist art and artifacts.' },
      { name: 'Manikarnika Ghat', icon: 'whatshot', desc: 'The primary cremation ghat, where funeral pyres burn 24/7. A profound and humbling experience that puts life in perspective.' },
      { name: 'Ramnagar Fort', icon: 'castle', desc: 'An 18th-century fort across the Ganges that houses a fascinating museum. Vintage cars, royal weapons, and an astronomical clock are highlights.' }
    ]
  },
  {
    id: 'goa',
    name: 'Goa',
    tagline: 'Paradise on the Coast',
    color: '#2e7d32',
    emoji: '🏝️',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1400&q=80',
    guidesCount: 0,
    description: `Goa is India's smallest state but its biggest party destination, blending Portuguese colonial charm with Indian warmth and world-class beaches. The golden coastline stretches for 100 kilometers, dotted with palm-fringed beaches ranging from buzzing party spots to secluded coves.

Beyond the beaches, Goa reveals a rich cultural tapestry. The UNESCO-listed churches of Old Goa — Basilica of Bom Jesus and Sé Cathedral — showcase centuries of Portuguese influence. Colorful Latin Quarter streets in Fontainhas, spice plantations in the hinterland, and vibrant local markets offer depth beyond the beach bar scene.

Goan cuisine is a culinary revelation. The Portuguese-Indian fusion produces dishes found nowhere else: vindaloo (originally "carne de vinha d'alhos"), cafreal, xacuti, and bebinca. Pair these with local feni (cashew or coconut spirit) and you've got a feast that captures Goa's unique cultural identity.`,
    bestTime: 'November to February (dry, pleasant, perfect beach weather)',
    localFood: ['Fish Curry Rice', 'Vindaloo', 'Bebinca', 'Prawn Balchão', 'Xacuti', 'Feni'],
    transport: 'Rent a scooter/bike for freedom. Taxis and Uber/Ola available. Local buses connect major areas.',
    attractions: [
      { name: 'Basilica of Bom Jesus', icon: 'church', desc: 'UNESCO World Heritage church housing the mortal remains of St. Francis Xavier. A masterpiece of Baroque architecture built in 1605.' },
      { name: 'Calangute Beach', icon: 'beach_access', desc: 'The "Queen of Beaches" — Goa\'s largest and most popular beach. Golden sands, water sports, shacks, and vibrant nightlife.' },
      { name: 'Fort Aguada', icon: 'castle', desc: 'A 17th-century Portuguese fort overlooking the Arabian Sea. The lighthouse and panoramic ocean views make it a photographer\'s paradise.' },
      { name: 'Dudhsagar Falls', icon: 'water', desc: 'One of India\'s tallest waterfalls at 310 meters, cascading through a lush forest. The name means "Sea of Milk" — and it lives up to it.' },
      { name: 'Fontainhas', icon: 'palette', desc: 'The charming Latin Quarter in Panaji with colorful Portuguese-era houses, narrow streets, art galleries, and cafes. Like stepping into a European village.' },
      { name: 'Anjuna Flea Market', icon: 'shopping_bag', desc: 'The iconic Wednesday market selling everything from handmade jewelry to vintage clothing. A Goan institution since the hippie era of the 1960s.' }
    ]
  }
];

// ===== Guide Data =====
const GUIDES = [
  // Delhi Guides
  { id: 'g1', name: 'Arjun Sharma', city: 'delhi', avatar: null, bio: 'History professor turned guide with 12 years of experience. Specializing in Mughal and British colonial history. Published author of "Walking Through Delhi."', languages: ['Hindi', 'English', 'Urdu'], specialties: ['Historical Tours', 'Architecture', 'Photography Walks'], pricePerHour: 800, rating: 4.9, totalReviews: 234, verified: true, status: 'approved' },
  { id: 'g2', name: 'Priya Mehta', city: 'delhi', avatar: null, bio: 'Food blogger and culinary guide. I take you beyond the tourist spots to where real Delhi eats. From Paranthe Wali Gali to hidden gems in Nizamuddin.', languages: ['Hindi', 'English', 'Punjabi'], specialties: ['Food Tours', 'Street Food', 'Cooking Classes'], pricePerHour: 1000, rating: 4.8, totalReviews: 189, verified: true, status: 'approved' },
  { id: 'g3', name: 'Rajesh Kumar', city: 'delhi', avatar: null, bio: 'Born and raised in Old Delhi. My family has lived near Chandni Chowk for 6 generations. Nobody knows these lanes better than me.', languages: ['Hindi', 'English'], specialties: ['Old Delhi Walks', 'Cultural Tours', 'Market Tours'], pricePerHour: 600, rating: 4.7, totalReviews: 156, verified: true, status: 'approved' },
  { id: 'g4', name: 'Sana Khan', city: 'delhi', avatar: null, bio: 'Art historian specializing in Indo-Islamic architecture. Former guide at National Museum. I make monuments come alive with stories.', languages: ['Hindi', 'English', 'Urdu', 'French'], specialties: ['Museum Tours', 'Art History', 'Architecture'], pricePerHour: 1200, rating: 4.9, totalReviews: 98, verified: true, status: 'approved' },

  // Mumbai Guides
  { id: 'g5', name: 'Vikram Desai', city: 'mumbai', avatar: null, bio: 'Third-generation Mumbaikar. Ex-journalist who covered the city beat for 15 years. I know every hidden lane, rooftop view, and local legend in this city.', languages: ['Hindi', 'English', 'Marathi', 'Gujarati'], specialties: ['Heritage Walks', 'Bollywood Tours', 'Street Food'], pricePerHour: 900, rating: 4.8, totalReviews: 212, verified: true, status: 'approved' },
  { id: 'g6', name: 'Anjali Nair', city: 'mumbai', avatar: null, bio: 'Marine biologist and eco-guide. I show you Mumbai\'s beautiful coastline and mangrove ecosystems while sharing the city\'s relationship with the sea.', languages: ['Hindi', 'English', 'Malayalam'], specialties: ['Nature Walks', 'Coastal Tours', 'Photography'], pricePerHour: 1100, rating: 4.6, totalReviews: 87, verified: true, status: 'approved' },
  { id: 'g7', name: 'Farhan Patel', city: 'mumbai', avatar: null, bio: 'Bollywood insider and entertainment journalist. Get VIP access to Film City, celebrity haunts, and the real stories behind Indian cinema.', languages: ['Hindi', 'English', 'Gujarati'], specialties: ['Bollywood Tours', 'Nightlife', 'Celebrity Spots'], pricePerHour: 1500, rating: 4.7, totalReviews: 145, verified: true, status: 'approved' },
  { id: 'g8', name: 'Meera Joshi', city: 'mumbai', avatar: null, bio: 'Architecture enthusiast with a focus on Art Deco Mumbai. Featured in Architectural Digest. I\'ll show you why Mumbai has the world\'s second-largest collection of Art Deco buildings.', languages: ['Hindi', 'English', 'Marathi'], specialties: ['Architecture', 'Art Deco', 'Photography Walks'], pricePerHour: 1000, rating: 4.9, totalReviews: 76, verified: true, status: 'approved' },

  // Jaipur Guides
  { id: 'g9', name: 'Mahendra Singh', city: 'jaipur', avatar: null, bio: 'Royal family historian and certified heritage guide. 20 years of experience bringing the stories of Rajput kings to life. Fluent in 4 languages.', languages: ['Hindi', 'English', 'Rajasthani', 'German'], specialties: ['Royal Heritage', 'Palace Tours', 'History'], pricePerHour: 1000, rating: 4.9, totalReviews: 321, verified: true, status: 'approved' },
  { id: 'g10', name: 'Lakshmi Rathore', city: 'jaipur', avatar: null, bio: 'Textile expert and shopping guide. I help you navigate Jaipur\'s famous bazaars for authentic block prints, gems, and handicrafts without getting ripped off.', languages: ['Hindi', 'English', 'Rajasthani'], specialties: ['Shopping Tours', 'Textile Tours', 'Handicrafts'], pricePerHour: 700, rating: 4.6, totalReviews: 198, verified: true, status: 'approved' },
  { id: 'g11', name: 'Deepak Meena', city: 'jaipur', avatar: null, bio: 'Adventure guide specializing in off-beat Jaipur. Hot air balloon rides, village safaris, camel treks, and sunset hikes in the Aravallis.', languages: ['Hindi', 'English'], specialties: ['Adventure', 'Village Tours', 'Nature'], pricePerHour: 800, rating: 4.5, totalReviews: 112, verified: true, status: 'approved' },

  // Udaipur Guides
  { id: 'g12', name: 'Pratap Ranawat', city: 'udaipur', avatar: null, bio: 'Descendant of a Mewar noble family. I share the untold stories of Udaipur\'s warrior kings and the legacy of Maharana Pratap. History is in my blood.', languages: ['Hindi', 'English', 'Mewari'], specialties: ['Royal History', 'Palace Tours', 'Lake Tours'], pricePerHour: 900, rating: 4.9, totalReviews: 267, verified: true, status: 'approved' },
  { id: 'g13', name: 'Kavita Bhatt', city: 'udaipur', avatar: null, bio: 'Artist and cultural guide. Udaipur\'s art scene is thriving — I take you through miniature painting workshops, music sessions, and artisan studios.', languages: ['Hindi', 'English', 'Rajasthani'], specialties: ['Art Tours', 'Cultural Walks', 'Workshops'], pricePerHour: 750, rating: 4.7, totalReviews: 134, verified: true, status: 'approved' },
  { id: 'g14', name: 'Ravi Sisodiya', city: 'udaipur', avatar: null, bio: 'Professional photographer and guide. I know every Instagram-worthy spot in the City of Lakes. Let me help you capture Udaipur at its most magical.', languages: ['Hindi', 'English'], specialties: ['Photography Tours', 'Sunset Tours', 'Lake Tours'], pricePerHour: 1200, rating: 4.8, totalReviews: 89, verified: true, status: 'approved' },
  { id: 'g15', name: 'Sunita Paliwal', city: 'udaipur', avatar: null, bio: 'Food and culture enthusiast. From cooking classes in old havelis to street food crawls in the old city. I show you Udaipur through its flavors.', languages: ['Hindi', 'English', 'Mewari', 'Gujarati'], specialties: ['Food Tours', 'Cooking Classes', 'Cultural Tours'], pricePerHour: 650, rating: 4.6, totalReviews: 78, verified: true, status: 'approved' },

  // Varanasi Guides
  { id: 'g16', name: 'Pandit Ashok Mishra', city: 'varanasi', avatar: null, bio: 'Spiritual guide and Sanskrit scholar from a family of priests at Dashashwamedh Ghat. I help you understand the profound rituals and philosophy of Varanasi.', languages: ['Hindi', 'English', 'Sanskrit'], specialties: ['Spiritual Tours', 'Ghat Walks', 'Temple Tours'], pricePerHour: 800, rating: 4.9, totalReviews: 345, verified: true, status: 'approved' },
  { id: 'g17', name: 'Nandini Tiwari', city: 'varanasi', avatar: null, bio: 'Classical musician and cultural guide. Varanasi is the birthplace of many music gharanas. I take you to intimate performances and share the musical heritage.', languages: ['Hindi', 'English'], specialties: ['Music Tours', 'Cultural Walks', 'Dawn Boat Rides'], pricePerHour: 700, rating: 4.7, totalReviews: 156, verified: true, status: 'approved' },
  { id: 'g18', name: 'Amit Kashyap', city: 'varanasi', avatar: null, bio: 'Silk weaver\'s son turned guide. I show you the incredible artistry behind Banarasi silk saris — from loom to showroom. Plus the best street food in Banaras.', languages: ['Hindi', 'English', 'Bhojpuri'], specialties: ['Silk Tours', 'Artisan Workshops', 'Food Tours'], pricePerHour: 600, rating: 4.5, totalReviews: 203, verified: true, status: 'approved' },
  { id: 'g19', name: 'Dr. Rekha Pandey', city: 'varanasi', avatar: null, bio: 'Professor of Religious Studies at BHU. I provide an academic yet accessible perspective on Varanasi\'s 3,000+ years of spiritual history.', languages: ['Hindi', 'English', 'Sanskrit', 'Japanese'], specialties: ['Academic Tours', 'Buddhist Circuit', 'Philosophy'], pricePerHour: 1100, rating: 4.8, totalReviews: 67, verified: true, status: 'approved' },

  // Goa Guides
  { id: 'g20', name: 'Carlos Fernandes', city: 'goa', avatar: null, bio: 'Born in Fontainhas, Goa\'s Latin Quarter. I bridge the Portuguese and Indian heritage of Goa. Architecture, food, feni — I cover it all with passion.', languages: ['Hindi', 'English', 'Konkani', 'Portuguese'], specialties: ['Heritage Walks', 'Food Tours', 'Architecture'], pricePerHour: 900, rating: 4.8, totalReviews: 178, verified: true, status: 'approved' },
  { id: 'g21', name: 'Tanvi Naik', city: 'goa', avatar: null, bio: 'Marine biologist and beach expert. From dolphin spotting to hidden beaches, I show you Goa\'s stunning coastline beyond the tourist crowds.', languages: ['Hindi', 'English', 'Konkani'], specialties: ['Beach Tours', 'Water Sports', 'Nature Walks'], pricePerHour: 1000, rating: 4.7, totalReviews: 134, verified: true, status: 'approved' },
  { id: 'g22', name: 'Rohan D\'Souza', city: 'goa', avatar: null, bio: 'Nightlife expert and music journalist. I curate the perfect Goa party experience — from sunset sessions to underground electronic music events.', languages: ['Hindi', 'English', 'Konkani'], specialties: ['Nightlife', 'Music Tours', 'Party Planning'], pricePerHour: 1200, rating: 4.6, totalReviews: 98, verified: true, status: 'approved' },
  { id: 'g23', name: 'Anita Desai', city: 'goa', avatar: null, bio: 'Spice plantation owner and eco-tourism advocate. I take you deep into Goa\'s lush hinterland — spice gardens, waterfalls, and traditional Goan village life.', languages: ['Hindi', 'English', 'Konkani', 'Marathi'], specialties: ['Spice Tours', 'Eco-Tourism', 'Village Tours'], pricePerHour: 850, rating: 4.9, totalReviews: 156, verified: true, status: 'approved' },

  // Pending guides (for admin to approve)
  { id: 'g24', name: 'Nikhil Verma', city: 'delhi', avatar: null, bio: 'Street art and graffiti guide. I show you the vibrant urban art scene emerging in Delhi\'s Lodhi Art District and beyond.', languages: ['Hindi', 'English'], specialties: ['Street Art', 'Urban Tours', 'Photography'], pricePerHour: 700, rating: 0, totalReviews: 0, verified: false, status: 'pending', quizScores: { language: 80, city: 90 } },
  { id: 'g25', name: 'Simran Kaur', city: 'jaipur', avatar: null, bio: 'Yoga instructor and wellness guide. Combine heritage tours with sunrise yoga sessions at ancient temples.', languages: ['Hindi', 'English', 'Punjabi'], specialties: ['Wellness', 'Yoga', 'Spiritual Tours'], pricePerHour: 900, rating: 0, totalReviews: 0, verified: false, status: 'pending', quizScores: { language: 90, city: 70 } }
];

// Set avatar URLs using DiceBear
GUIDES.forEach(g => {
  if (!g.avatar) {
    g.avatar = `https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(g.name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  }
});

// Update city guide counts
CITIES.forEach(c => {
  c.guidesCount = GUIDES.filter(g => g.city === c.id && g.status === 'approved').length;
});

// ===== Reviews =====
const SAMPLE_REVIEWS = [
  { guideId: 'g1', author: 'Sarah M.', rating: 5, text: 'Arjun is incredible! His knowledge of Mughal history is unmatched. The 4-hour tour of Red Fort felt like time travel. Absolutely worth every rupee.', date: '2026-01-15' },
  { guideId: 'g1', author: 'David L.', rating: 5, text: 'Best guide I\'ve had anywhere in the world. Arjun took us to hidden corners of Old Delhi we\'d never have found. His storytelling is captivating.', date: '2026-01-20' },
  { guideId: 'g2', author: 'Jennifer K.', rating: 5, text: 'Priya\'s food tour was the highlight of our India trip! She took us to 12 different spots and every single one was amazing. The stories behind each dish added so much.', date: '2026-02-01' },
  { guideId: 'g5', author: 'Michael T.', rating: 5, text: 'Vikram showed us the REAL Mumbai — not the tourist version. We went to local chai stalls, hidden Art Deco buildings, and a Bollywood studio. Mind-blowing day.', date: '2026-01-28' },
  { guideId: 'g9', author: 'Emma R.', rating: 5, text: 'Mahendra is a walking encyclopedia of Rajput history. He made every palace feel alive with incredible stories of battles, romance, and royal intrigue.', date: '2025-12-15' },
  { guideId: 'g12', author: 'Pierre D.', rating: 5, text: 'Pratap\'s family connection to Mewar royalty makes this tour unique. He shared stories you won\'t find in any guidebook. The sunset boat ride he arranged was perfection.', date: '2026-02-10' },
  { guideId: 'g16', author: 'Yuki T.', rating: 5, text: 'Pandit ji made Varanasi accessible to me as a foreigner. He explained the rituals with patience and depth. The dawn boat ride with his commentary was deeply moving.', date: '2026-01-05' },
  { guideId: 'g20', author: 'Ana S.', rating: 5, text: 'Carlos bridged the Portuguese-Indian culture beautifully. His tour of Old Goa churches and then Fontainhas was like visiting two different worlds in one day.', date: '2026-02-08' },
  { guideId: 'g12', author: 'Aisha M.', rating: 4, text: 'Wonderful tour of Udaipur! Pratap is passionate and knowledgeable. Only wish we had more time. Booking a 2-day tour next visit for sure.', date: '2026-01-22' },
  { guideId: 'g5', author: 'Tom H.', rating: 4, text: 'Vikram\'s heritage walk through South Mumbai was excellent. Great mix of history, food stops, and photography opportunities. Highly recommend!', date: '2026-02-12' }
];

// ===== Quiz Questions =====
const LANGUAGE_QUIZ = {
  hindi: [
    { q: 'What does "Namaste" mean?', options: ['Goodbye', 'Hello/Greetings', 'Thank you', 'Sorry'], answer: 1 },
    { q: 'How do you say "Thank you" in Hindi?', options: ['Shukriya', 'Kripya', 'Maaf kijiye', 'Accha'], answer: 0 },
    { q: 'What is "Paani" in English?', options: ['Food', 'Money', 'Water', 'Road'], answer: 2 },
    { q: 'How do you ask "How much?" in Hindi?', options: ['Kab?', 'Kitna?', 'Kaise?', 'Kahan?'], answer: 1 },
    { q: '"Ghar" means:', options: ['Car', 'House', 'Garden', 'Market'], answer: 1 },
    { q: 'Which greeting is used in the evening?', options: ['Suprabhat', 'Shubh Ratri', 'Shubh Sandhya', 'Namaskar'], answer: 2 },
    { q: '"Dost" translates to:', options: ['Enemy', 'Brother', 'Friend', 'Neighbor'], answer: 2 },
    { q: 'What does "Bahut Accha" mean?', options: ['Very bad', 'Very good', 'Very hot', 'Very big'], answer: 1 },
    { q: '"Khana" refers to:', options: ['Clothing', 'Food/Eating', 'Sleeping', 'Walking'], answer: 1 },
    { q: 'How do you say "Right side" in Hindi?', options: ['Baayein', 'Seedha', 'Daayein', 'Peeche'], answer: 2 }
  ],
  english: [
    { q: 'What is the past tense of "go"?', options: ['Goed', 'Gone', 'Went', 'Going'], answer: 2 },
    { q: 'Choose the correct sentence:', options: ['She don\'t like it', 'She doesn\'t likes it', 'She doesn\'t like it', 'She not like it'], answer: 2 },
    { q: '"Magnificent" means:', options: ['Terrible', 'Ordinary', 'Impressive/Grand', 'Small'], answer: 2 },
    { q: 'Complete: "I have been working here ___ 5 years"', options: ['since', 'for', 'from', 'at'], answer: 1 },
    { q: 'What is the plural of "monument"?', options: ['Monumentes', 'Monuments', 'Monumenti', 'Monument\'s'], answer: 1 },
    { q: '"To navigate" means to:', options: ['Destroy', 'Find your way', 'Build', 'Sleep'], answer: 1 },
    { q: 'Choose the correct spelling:', options: ['Accomodation', 'Accommodation', 'Acomodation', 'Acommodation'], answer: 1 },
    { q: '"Heritage" refers to:', options: ['Future plans', 'Cultural traditions/history', 'Modern technology', 'Money'], answer: 1 },
    { q: 'Complete: "The temple is ___ the river"', options: ['besides', 'beside', 'besides of', 'beside of'], answer: 1 },
    { q: '"Itinerary" means:', options: ['A type of food', 'Travel plan/schedule', 'A temple', 'A language'], answer: 1 }
  ]
};

const CITY_QUIZ = {
  delhi: [
    { q: 'Who built the Red Fort?', options: ['Akbar', 'Shah Jahan', 'Humayun', 'Aurangzeb'], answer: 1 },
    { q: 'What is the height of Qutub Minar?', options: ['52.5m', '62.5m', '72.5m', '82.5m'], answer: 2 },
    { q: 'Chandni Chowk was designed by:', options: ['Shah Jahan\'s daughter Jahanara', 'Mumtaz Mahal', 'Nur Jahan', 'Akbar'], answer: 0 },
    { q: 'India Gate commemorates soldiers of:', options: ['1857 Revolt', 'World War I', 'Kargil War', 'World War II'], answer: 1 },
    { q: 'The Lotus Temple belongs to which faith?', options: ['Hinduism', 'Buddhism', 'Bahá\'í', 'Jainism'], answer: 2 },
    { q: 'Which dynasty built Humayun\'s Tomb?', options: ['Lodi', 'Mughal', 'Tughlaq', 'Slave'], answer: 1 },
    { q: 'Old Delhi was known as:', options: ['Indraprastha', 'Shahjahanabad', 'Dillika', 'Firozabad'], answer: 1 },
    { q: 'Connaught Place was designed in which style?', options: ['Mughal', 'Gothic', 'Georgian', 'Art Deco'], answer: 2 },
    { q: 'Which monument has 953 small windows?', options: ['Red Fort', 'Hawa Mahal', 'India Gate', 'Lotus Temple'], answer: 1 },
    { q: 'Delhi\'s famous street food "Chole Bhature" originated from:', options: ['South India', 'Punjab', 'Rajasthan', 'Gujarat'], answer: 1 }
  ],
  mumbai: [
    { q: 'The Gateway of India was built for the visit of:', options: ['Queen Victoria', 'King George V', 'King Edward VII', 'Queen Elizabeth'], answer: 1 },
    { q: 'CST (Victoria Terminus) is built in which architectural style?', options: ['Art Deco', 'Victorian Gothic', 'Indo-Saracenic', 'Baroque'], answer: 1 },
    { q: 'Marine Drive is also known as:', options: ['Gold Coast', 'Queen\'s Necklace', 'Pearl Ring', 'Diamond Bay'], answer: 1 },
    { q: 'How many people ride Mumbai\'s local trains daily?', options: ['3 million', '5 million', '7 million', '10 million'], answer: 2 },
    { q: 'Elephanta Caves are dedicated to:', options: ['Vishnu', 'Shiva', 'Buddha', 'Brahma'], answer: 1 },
    { q: 'Which is the iconic street food of Mumbai?', options: ['Chole Bhature', 'Vada Pav', 'Dosa', 'Poha'], answer: 1 },
    { q: 'Bollywood is located in which suburb?', options: ['Bandra', 'Andheri', 'Goregaon', 'Juhu'], answer: 2 },
    { q: 'Mumbai was originally a group of how many islands?', options: ['5', '7', '9', '11'], answer: 1 },
    { q: 'Dhobi Ghat is the world\'s largest:', options: ['Fish market', 'Open-air laundry', 'Flower market', 'Train station'], answer: 1 },
    { q: 'Which style makes up Mumbai\'s second-largest collection globally?', options: ['Victorian', 'Art Deco', 'Baroque', 'Modernist'], answer: 1 }
  ],
  jaipur: [
    { q: 'Who founded Jaipur?', options: ['Maharaja Man Singh', 'Maharaja Sawai Jai Singh II', 'Maharana Pratap', 'Prithviraj Chauhan'], answer: 1 },
    { q: 'Why is Jaipur called the "Pink City"?', options: ['Pink flowers', 'Painted for Prince Albert\'s visit', 'Pink stone', 'Royal decree'], answer: 1 },
    { q: 'In what year was Jaipur founded?', options: ['1527', '1627', '1727', '1827'], answer: 2 },
    { q: 'Hawa Mahal was built for:', options: ['The king', 'Royal women to watch streets', 'Soldiers', 'Merchants'], answer: 1 },
    { q: 'Amber Fort overlooks which lake?', options: ['Man Sagar', 'Maota', 'Pichola', 'Fateh Sagar'], answer: 1 },
    { q: 'Jantar Mantar has the world\'s largest stone:', options: ['Clock', 'Sundial', 'Telescope', 'Calendar'], answer: 1 },
    { q: 'Jal Mahal sits in which lake?', options: ['Maota Lake', 'Man Sagar Lake', 'Ana Sagar', 'Pushkar Lake'], answer: 1 },
    { q: 'Which famous Rajasthani dish features baked wheat balls?', options: ['Laal Maas', 'Dal Baati Churma', 'Gatte Ki Sabzi', 'Ker Sangri'], answer: 1 },
    { q: 'Jaipur is part of which tourist circuit?', options: ['Diamond Triangle', 'Golden Triangle', 'Royal Circuit', 'Heritage Route'], answer: 1 },
    { q: 'Nahargarh Fort\'s name means:', options: ['Tiger Fort', 'Lion Fort', 'Eagle Fort', 'Abode of Tigers'], answer: 3 }
  ],
  udaipur: [
    { q: 'Who founded Udaipur?', options: ['Maharana Pratap', 'Maharana Udai Singh II', 'Maharana Kumbha', 'Rana Sanga'], answer: 1 },
    { q: 'Udaipur is known as:', options: ['Pink City', 'City of Lakes', 'City of Joy', 'Golden City'], answer: 1 },
    { q: 'Which James Bond movie was filmed in Udaipur?', options: ['Goldfinger', 'Octopussy', 'Skyfall', 'Casino Royale'], answer: 1 },
    { q: 'The Lake Palace sits on which lake?', options: ['Fateh Sagar', 'Udai Sagar', 'Pichola', 'Jaisamand'], answer: 2 },
    { q: 'Which Mewar hero never surrendered to the Mughals?', options: ['Udai Singh', 'Maharana Pratap', 'Rana Kumbha', 'Raj Singh'], answer: 1 },
    { q: 'Saheliyon Ki Bari means:', options: ['Garden of Kings', 'Garden of Maidens', 'Garden of Flowers', 'Garden of Lions'], answer: 1 },
    { q: 'Udaipur belongs to which region of Rajasthan?', options: ['Marwar', 'Shekhawati', 'Mewar', 'Hadoti'], answer: 2 },
    { q: 'City Palace of Udaipur is the largest in:', options: ['India', 'Rajasthan', 'Asia', 'Mewar'], answer: 1 },
    { q: 'Jagdish Temple is dedicated to:', options: ['Shiva', 'Vishnu', 'Brahma', 'Hanuman'], answer: 1 },
    { q: 'The best time to visit Udaipur is:', options: ['April-June', 'July-September', 'September-March', 'January only'], answer: 2 }
  ],
  varanasi: [
    { q: 'Varanasi is situated on the banks of:', options: ['Yamuna', 'Ganges', 'Narmada', 'Godavari'], answer: 1 },
    { q: 'How many ghats does Varanasi have?', options: ['52', '64', '84', '108'], answer: 2 },
    { q: 'The Ganga Aarti is performed at:', options: ['Assi Ghat', 'Dashashwamedh Ghat', 'Manikarnika Ghat', 'Tulsi Ghat'], answer: 1 },
    { q: 'Varanasi is one of the oldest cities, approximately how old?', options: ['1,000 years', '2,000 years', '3,000+ years', '500 years'], answer: 2 },
    { q: 'Kashi Vishwanath Temple is dedicated to:', options: ['Vishnu', 'Rama', 'Shiva', 'Krishna'], answer: 2 },
    { q: 'Where did Buddha give his first sermon near Varanasi?', options: ['Bodh Gaya', 'Sarnath', 'Kushinagar', 'Lumbini'], answer: 1 },
    { q: 'Banarasi silk is famous for its:', options: ['Cotton weave', 'Gold/silver brocade', 'Block printing', 'Tie-dye'], answer: 1 },
    { q: 'Which university is located in Varanasi?', options: ['JNU', 'BHU', 'AMU', 'DU'], answer: 1 },
    { q: 'Manikarnika Ghat is known for:', options: ['Boat rides', 'Morning yoga', 'Cremation ceremonies', 'Festival celebrations'], answer: 2 },
    { q: 'The famous drink "Thandai" from Varanasi contains:', options: ['Tea and milk', 'Almonds, spices & milk', 'Mango pulp', 'Rose water only'], answer: 1 }
  ],
  goa: [
    { q: 'Goa was a colony of which European power?', options: ['British', 'French', 'Portuguese', 'Dutch'], answer: 2 },
    { q: 'In which year was Goa liberated from colonial rule?', options: ['1947', '1950', '1955', '1961'], answer: 3 },
    { q: 'Basilica of Bom Jesus holds the remains of:', options: ['St. Thomas', 'St. Francis Xavier', 'St. Paul', 'St. Augustine'], answer: 1 },
    { q: 'What is "Feni" made from?', options: ['Rice', 'Cashew or coconut', 'Sugarcane', 'Grapes'], answer: 1 },
    { q: 'Which is the largest beach in Goa?', options: ['Baga', 'Calangute', 'Anjuna', 'Palolem'], answer: 1 },
    { q: 'Fontainhas is Goa\'s:', options: ['Beach area', 'Latin Quarter', 'Fish market', 'Fort'], answer: 1 },
    { q: 'Dudhsagar Falls\' name means:', options: ['Golden river', 'Sea of Milk', 'Silver stream', 'Cloud water'], answer: 1 },
    { q: 'Goa\'s traditional cuisine is heavily influenced by:', options: ['Chinese', 'Thai', 'Portuguese', 'French'], answer: 2 },
    { q: 'What is the local language of Goa?', options: ['Marathi', 'Portuguese', 'Konkani', 'Hindi'], answer: 2 },
    { q: 'Fort Aguada was built in which century?', options: ['15th', '16th', '17th', '18th'], answer: 2 }
  ]
};

// ===== Booking Data =====
const SAMPLE_BOOKINGS = [
  { id: 'b1', guideId: 'g12', date: '2026-03-15', time: '09:00', duration: 4, groupSize: 2, tourType: 'Royal History', status: 'confirmed', totalPrice: 3600, visitorName: 'You', visitorPhone: '+91 9876543210' },
  { id: 'b2', guideId: 'g2', date: '2026-03-20', time: '11:00', duration: 3, groupSize: 4, tourType: 'Food Tour', status: 'pending', totalPrice: 3000, visitorName: 'You', visitorPhone: '+91 9876543210' },
  { id: 'b3', guideId: 'g16', date: '2026-02-10', time: '05:00', duration: 3, groupSize: 2, tourType: 'Spiritual Tour', status: 'completed', totalPrice: 2400, visitorName: 'You', visitorPhone: '+91 9876543210' }
];

// ===== Admin Credentials =====
const ADMIN_CREDS = { email: 'admin@cityguide.com', password: 'admin123' };
