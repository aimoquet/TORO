// ========================================================
// TORO LUXURY HOTELS & RESORTS • INDIA
// Core Application Logic & 360° Virtual Tour Engine
// ========================================================

// Dynamic API Endpoint:
// - Local development (port 3000) -> talks to Spring Boot at http://localhost:8080/api
// - Deployed on Vercel or remote host -> talks to /api (Serverless Microservice)
// - Supports runtime override via window.TORO_API_URL
const API_BASE = window.TORO_API_URL || '/api';

let allRooms = [];
let allCustomers = [];
let allBookings = [];
let allServices = [];

// ========================================================
// INDIA STATES & CITIES DATABASE
// ========================================================
const INDIA_LOCATIONS = {
    'Goa': ['All Goa', 'Candolim Beach', 'Calangute', 'Panaji', 'Cavelossim', 'Anjuna'],
    'Maharashtra': ['All Maharashtra', 'Mumbai (Marine Drive)', 'Mumbai (Juhu)', 'Pune', 'Lonavala'],
    'Rajasthan': ['All Rajasthan', 'Udaipur (Lake Pichola)', 'Jaipur (Amber Palace)', 'Jodhpur', 'Jaisalmer'],
    'Himachal Pradesh': ['All Himachal', 'Manali (Solang Valley)', 'Shimla (Mall Road)', 'Dharamshala'],
    'Kerala': ['All Kerala', 'Alleppey (Backwaters)', 'Kochi (Fort Kochi)', 'Munnar (Tea Estates)'],
    'Karnataka': ['All Karnataka', 'Bengaluru (MG Road)', 'Coorg (Coffee Plantations)', 'Mysuru'],
    'Delhi NCR': ['All Delhi NCR', 'New Delhi (Connaught Place)', 'Gurugram (Golf Course Road)'],
    'Uttarakhand': ['All Uttarakhand', 'Rishikesh (Ganges Front)', 'Mussoorie', 'Nainital'],
    'Tamil Nadu': ['All Tamil Nadu', 'Chennai (Marina Beach)', 'Ooty (Nilgiri Hills)'],
    'West Bengal': ['All West Bengal', 'Kolkata (Park Street)', 'Darjeeling']
};

// ========================================================
// CURATED TORO ROOM DATABASE ACROSS INDIA
// ========================================================
const ROOM_DATABASE = {
    '101': {
        roomNumber: '101',
        title: 'Executive Marine Drive Suite',
        state: 'Maharashtra',
        city: 'Mumbai',
        location: 'Marine Drive, Mumbai &bull; Maharashtra',
        category: 'SINGLE',
        pricePerNight: 2000,
        image: 'assets/executive_suite.jpg',
        touristSpot: 'Marine Drive & Gateway of India (Mumbai)',
        proximity: '100m to Marine Drive Promenade • 10 mins to Gateway',
        landmarkTag: 'Seafront Promenade',
        specs: { bed: 'Plush Orthopedic Bed', size: '480 sq.ft', capacity: '1 Guest', view: 'Arabian Sea Promenade' },
        stuffs: {
            sleep: ['Orthopedic King Single Mattress', '800-Thread Egyptian Cotton Linens', 'Feather Down Pillows', 'Blackout Acoustic Drapes'],
            bath: ['Walk-in Glass Rain Shower', 'Forest Essentials Herbal Toiletries', 'Plush Waffle Bathrobe', 'Ionic Hairdryer'],
            refreshments: ['Artisanal Masala Chai Bar & Electric Kettle', 'Bottled Himalayan Mineral Water', 'Stocked Compact Minibar'],
            tech: ['43" 4K Smart TV with Chromecast', 'High-Speed Wi-Fi 6', 'Bedside Fast USB-C Ports'],
            convenience: ['Walnut Executive Work Desk', 'Electronic Safe', 'Luggage Valet Rack', 'Daily Newspaper']
        }
    },
    '102': {
        roomNumber: '102',
        title: 'Oceanfront Deluxe Beach Villa',
        state: 'Goa',
        city: 'Goa',
        location: 'Candolim Beachfront &bull; North Goa',
        category: 'DELUXE',
        pricePerNight: 3500,
        image: 'assets/deluxe_suite.jpg',
        panorama: 'deluxe',
        touristSpot: 'Candolim & Baga Beach (Goa)',
        proximity: '200m to Candolim Beachfront • 8 mins to Baga',
        landmarkTag: 'Beachfront Villa',
        specs: { bed: 'King Pillowtop Bed', size: '780 sq.ft', capacity: '2 Guests', view: 'Panoramic Sunset Ocean View' },
        stuffs: {
            sleep: ['1000-Thread Egyptian Cotton Bedding', 'Feather & Memory Foam Pillows', 'Automated Mood Lighting', 'Whisper-Quiet Tropical AC'],
            bath: ['Italian Marble Walk-in Rain Shower', 'Freestanding Soaking Tub', 'Forest Essentials Sandalwood Collection', 'Heated Mirror & Towels'],
            refreshments: ['In-Suite Nespresso Machine with Daily Pods', 'Curated Refrigerated Minibar', 'Welcome Coconut & Tropical Fruit Platter'],
            tech: ['65" 4K OLED Smart TV (Netflix/Prime)', 'Bose Bluetooth Surround Sound', '1 Gbps Ultra-Speed Wi-Fi 6', 'Wireless Charging Stations'],
            convenience: ['Private Sunset Balcony with Sun Loungers', 'Executive Walnut Desk', 'Digital Laptop Safe', '24/7 Dedicated Butler Service']
        }
    },
    '103': {
        roomNumber: '103',
        title: 'Regal Lake Pichola Suite',
        state: 'Rajasthan',
        city: 'Udaipur',
        location: 'Lake Pichola, Udaipur &bull; Rajasthan',
        category: 'SUITE',
        pricePerNight: 5500,
        image: 'assets/executive_suite.jpg',
        panorama: 'deluxe',
        touristSpot: 'City Palace & Lake Pichola (Udaipur)',
        proximity: 'Direct Lake Pichola Front • 5 mins walk to City Palace',
        landmarkTag: 'Regal Palace & Lake',
        specs: { bed: 'Handcrafted Teak King Bed', size: '980 sq.ft', capacity: '3 Guests', view: 'Lake Pichola & Aravali Hills' },
        stuffs: {
            sleep: ['Custom Handcrafted King Bed', 'Goose-Down Duvet & Pillows', 'Soundproof Double Glazed Windows', 'Motorized Blackout Blinds'],
            bath: ['Deep Hydrotherapy Bathtub', 'Dual Marble Vanities', 'Plush Terry Cloth Robes & Slippers', 'Rain Shower with Ayurvedic Steam'],
            refreshments: ['Gourmet Royal Tea & Espresso Bar', 'Full-Size Minibar with Craft Beverages', 'Daily Afternoon High Tea Service'],
            tech: ['Twin 55" 4K Smart TVs', 'High-Fidelity Bluetooth Speaker', 'Fast Fiber Wi-Fi', 'Universal Power Outlets'],
            convenience: ['Plush Velvet Lounge Area', 'Ergonomic Executive Office Setup', 'Spacious Walk-in Wardrobe', 'Complimentary Royal Shoeshine & Pressing']
        }
    },
    '104': {
        roomNumber: '104',
        title: 'Himalayan Pine Forest Family Chalet',
        state: 'Himachal Pradesh',
        city: 'Manali',
        location: 'Solang Valley, Manali &bull; Himachal Pradesh',
        category: 'DELUXE',
        pricePerNight: 4800,
        image: 'assets/deluxe_suite.jpg',
        panorama: 'deluxe',
        touristSpot: 'Solang Valley & Rohtang Pass (Manali)',
        proximity: 'Overlooking Solang Ski Slopes • 15 mins to Rohtang Pass',
        landmarkTag: 'Alpine Pine Chalet',
        specs: { bed: '2 Queen Plush Beds', size: '1,100 sq.ft', capacity: '4 Guests', view: 'Snow Crest Mountain Peaks' },
        stuffs: {
            sleep: ['Twin Heated Queen Mattresses', 'Kashmiri Wool Blankets & Quilts', 'Cedarwood Ambient Lighting', 'Central Heating & Fireplace'],
            bath: ['Deep Soaking Tub with Mountain View', 'Himalayan Pine Herbal Amenities', 'Heated Towel Racks', 'Walk-in Stone Shower'],
            refreshments: ['Mountain Herbal Tea Kettle Bar', 'Hot Cocoa Bar & Marshmallows', 'Mini Refrigerator & Snack Basket'],
            tech: ['55" 4K TV with Kids Channels & Streaming', 'High-Speed Mountain Satellite Wi-Fi', 'Bluetooth Speaker'],
            convenience: ['Private Wooden Balcony Deck', 'Children Welcome Pack', 'Ski Equipment Storage', 'Family Board Games']
        }
    },
    '201': {
        roomNumber: '201',
        title: 'Amber Royal Penthouse & Jacuzzi',
        state: 'Rajasthan',
        city: 'Jaipur',
        location: 'Amber Fort Vista, Jaipur &bull; Rajasthan',
        category: 'PRESIDENTIAL',
        pricePerNight: 9500,
        image: 'assets/penthouse_suite.jpg',
        panorama: 'penthouse',
        touristSpot: 'Amber Fort & Hawa Mahal (Jaipur)',
        proximity: '800m to Amber Fort • 12 mins to Hawa Mahal',
        landmarkTag: 'Royal Fort Skyline',
        specs: { bed: 'Grand Emperor Silk King Bed', size: '1,750 sq.ft', capacity: '4 Guests', view: '360° Amber Palace Skyline' },
        stuffs: {
            sleep: ['Custom Silk-Infused Emperor King Mattress', 'Bespoke Pillow Menu', 'Motorized 180° Panoramic Curtains', 'Smart Climate & Air Purifier'],
            bath: ['Freestanding Windowside Hydro Jacuzzi', 'Onyx Marble Steam Shower', 'Exclusive Bulgari & Forest Essentials Collection', 'Heated Italian Marble Floors'],
            refreshments: ['Private Wine Cellar & Bar', 'Nespresso Creatista Machine', 'Dedicated Sommelier Selection', 'Unlimited 24-Hour In-Suite Dining'],
            tech: ['75" 4K Home Cinema with Dolby Atmos', 'Bang & Olufsen Wireless Sound System', 'Private Wi-Fi 6E Access Point', 'Smart Home iPad Controller'],
            convenience: ['Private Panoramic Terrace with Firepit', 'Airport Mercedes S-Class Chauffeur Included', '24-Hour Private Butler on Standby', 'Complimentary Laundry & Garment Pressing']
        }
    },
    '202': {
        roomNumber: '202',
        title: 'Vembanad Backwaters Heritage Villa',
        state: 'Kerala',
        city: 'Kerala',
        location: 'Vembanad Lake, Alleppey &bull; Kerala',
        category: 'DOUBLE',
        pricePerNight: 3000,
        image: 'assets/deluxe_suite.jpg',
        panorama: 'deluxe',
        touristSpot: 'Vembanad Lake Backwaters (Kerala)',
        proximity: 'Direct Lakefront Shores • Private Houseboat Jetty',
        landmarkTag: 'Backwaters Pavilion',
        specs: { bed: 'Teak Heritage King Bed', size: '820 sq.ft', capacity: '2 Guests', view: 'Private Water Lily Lagoon' },
        stuffs: {
            sleep: ['Handcrafted Kerala Teak Bed', 'Organic Cotton Drapes', 'Eco-Quiet Air Conditioning', 'Acoustic Soundproofing'],
            bath: ['Open-to-Sky Tropical Shower', 'Ayurvedic Herbal Soaps & Oils', 'Bamboo Bath Towels', 'Copper Foot Soaking Basin'],
            refreshments: ['Fresh Tender Coconut Water on Demand', 'Kerala Spiced Chai Bar', 'Tropical Fruit Platter'],
            tech: ['Smart TV with Streaming', 'Complimentary High-Speed Wi-Fi', 'Bedside USB Charging Ports'],
            convenience: ['Private Verandah overlooking Lagoon', 'Herbal Tea Service', 'Traditional Kerala Coir Slippers']
        }
    }
};

// ========================================================
// THEME SWITCHER (DARK / LIGHT MODE)
// ========================================================
function initTheme() {
    const savedTheme = localStorage.getItem('toro_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(currentTheme, false);

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('toro_theme')) {
                applyTheme(e.matches ? 'dark' : 'light', false);
            }
        });
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
}

function applyTheme(theme, showNotification = false) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('toro_theme', theme);

    const isDark = (theme === 'dark');

    // Header round toggle button
    const headerToggleBtn = document.getElementById('themeToggleBtn');
    if (headerToggleBtn) {
        headerToggleBtn.innerHTML = isDark 
            ? '<i class="fa-solid fa-sun" style="color: #fcd34d;"></i>' 
            : '<i class="fa-solid fa-moon" style="color: #cbd5e1;"></i>';
        headerToggleBtn.setAttribute('title', isDark ? 'Switch to Ivory Light Mode' : 'Switch to Obsidian Dark Mode');
        headerToggleBtn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }

    // Top utility bar link & icon
    const utilText = document.getElementById('utilityThemeText');
    const utilIcon = document.getElementById('utilityThemeIcon');
    if (utilText) utilText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    if (utilIcon) {
        utilIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        utilIcon.style.color = isDark ? '#fcd34d' : '#cbd5e1';
    }

    // Mobile drawer row & icon
    const mobText = document.getElementById('mobileThemeText');
    const mobIcon = document.getElementById('mobileThemeIcon');
    if (mobText) mobText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    if (mobIcon) {
        mobIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        mobIcon.style.color = isDark ? '#fcd34d' : '#cbd5e1';
    }

    if (showNotification) {
        showToast(isDark ? '🌙 Midnight Obsidian Dark Mode activated' : '☀️ Ivory Sunlit Light Mode activated');
    }
}

// ========================================================
// DOM INITIALIZATION
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDefaultDates();
    populateCityDropdown('ALL');
    loadRoomsFromApi();
    loadDashboardStats();

    // Universal Escape Key Handler to exit 360 and modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            close360Tour();
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        }
    });

    // Sticky header scroll behavior
    window.addEventListener('scroll', () => {
        const header = document.getElementById('siteHeader');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }
    });
});

function toggleMobileMenu() {
    const drawer = document.getElementById('mobileNavDrawer');
    if (drawer) {
        drawer.classList.toggle('active');
    }
}

function openConciergeModal() {
    openModal('conciergeModal');
}

function handleCircleSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById('circleEmail');
    const email = emailInput ? emailInput.value : '';
    showToast(`Welcome to The TORO Circle. Your private invitation code has been dispatched to ${email}!`);
    if (emailInput) emailInput.value = '';
}

function initDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    const sIn = document.getElementById('searchCheckIn');
    const sOut = document.getElementById('searchCheckOut');
    if (sIn) sIn.value = today;
    if (sOut) sOut.value = tomorrow;

    const stIn = document.getElementById('stuffsCheckIn');
    const stOut = document.getElementById('stuffsCheckOut');
    if (stIn) stIn.value = today;
    if (stOut) stOut.value = tomorrow;

    const bkIn = document.getElementById('modalBookingCheckIn');
    const bkOut = document.getElementById('modalBookingCheckOut');
    if (bkIn) bkIn.value = today;
    if (bkOut) bkOut.value = tomorrow;
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}



// ========================================================
// INDIA CITIES & DESTINATIONS FILTER LOGIC
// ========================================================
function onStateChange() {
    const state = document.getElementById('searchState').value;
    populateCityDropdown(state);
    filterRoomsBySearch();
}

function populateCityDropdown(selectedState) {
    const citySelect = document.getElementById('searchCity');
    if (!citySelect) return;

    citySelect.innerHTML = '<option value="ALL">All Cities / Destinations</option>';

    if (selectedState === 'ALL') {
        // Add all unique cities across India
        const allCities = [
            'Goa (Candolim & Calangute)', 'Mumbai (Marine Drive)', 'Udaipur (Lake Pichola)', 
            'Jaipur (Amber Palace)', 'Manali (Solang Valley)', 'Alleppey (Kerala Backwaters)', 
            'Bengaluru (MG Road)', 'Rishikesh (Ganges Front)', 'New Delhi'
        ];
        allCities.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            citySelect.appendChild(opt);
        });
    } else if (INDIA_LOCATIONS[selectedState]) {
        INDIA_LOCATIONS[selectedState].forEach(city => {
            const opt = document.createElement('option');
            opt.value = city;
            opt.textContent = city;
            citySelect.appendChild(opt);
        });
    }
}

function quickFilterDestination(destKey, btnElement = null) {
    // Update active pill styling
    document.querySelectorAll('.dest-pill').forEach(btn => {
        btn.classList.remove('active');
        if (destKey === 'ALL' && btn.textContent.includes('All India')) {
            btn.classList.add('active');
        } else if (destKey !== 'ALL' && btn.textContent.toLowerCase().includes(destKey.toLowerCase())) {
            btn.classList.add('active');
        }
    });
    if (btnElement) {
        document.querySelectorAll('.dest-pill').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
    }

    const stateSelect = document.getElementById('searchState');
    const citySelect = document.getElementById('searchCity');

    if (destKey === 'ALL') {
        if (stateSelect) stateSelect.value = 'ALL';
        populateCityDropdown('ALL');
    } else if (destKey === 'Goa') {
        if (stateSelect) stateSelect.value = 'Goa';
        populateCityDropdown('Goa');
    } else if (destKey === 'Mumbai') {
        if (stateSelect) stateSelect.value = 'Maharashtra';
        populateCityDropdown('Maharashtra');
    } else if (destKey === 'Udaipur' || destKey === 'Jaipur') {
        if (stateSelect) stateSelect.value = 'Rajasthan';
        populateCityDropdown('Rajasthan');
    } else if (destKey === 'Manali') {
        if (stateSelect) stateSelect.value = 'Himachal Pradesh';
        populateCityDropdown('Himachal Pradesh');
    } else if (destKey === 'Kerala') {
        if (stateSelect) stateSelect.value = 'Kerala';
        populateCityDropdown('Kerala');
    } else if (destKey === 'Rishikesh') {
        if (stateSelect) stateSelect.value = 'Uttarakhand';
        populateCityDropdown('Uttarakhand');
    }

    filterRoomsBySearch(destKey);
    scrollToSection('rooms-showcase');
}

function filterRoomsBySearch(explicitKeyword = null) {
    const stateVal = document.getElementById('searchState') ? document.getElementById('searchState').value : 'ALL';
    const cityVal = document.getElementById('searchCity') ? document.getElementById('searchCity').value : 'ALL';
    const catVal = document.getElementById('searchCategory') ? document.getElementById('searchCategory').value : 'ALL';

    const cards = document.querySelectorAll('.public-room-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const roomCat = card.dataset.category || '';
        const roomState = card.dataset.state || '';
        const roomCity = card.dataset.city || '';
        const roomLocation = card.dataset.location || '';

        let matchCategory = (catVal === 'ALL' || roomCat === catVal);
        let matchState = (stateVal === 'ALL' || roomState.toLowerCase() === stateVal.toLowerCase());
        let matchCity = true;

        if (cityVal !== 'ALL') {
            const cleanCity = cityVal.replace(/^All\s+/, '').toLowerCase();
            matchCity = roomCity.toLowerCase().includes(cleanCity) || roomLocation.toLowerCase().includes(cleanCity);
        }

        if (explicitKeyword && explicitKeyword !== 'ALL') {
            const kw = explicitKeyword.toLowerCase();
            matchState = roomState.toLowerCase().includes(kw) || roomCity.toLowerCase().includes(kw) || roomLocation.toLowerCase().includes(kw);
        }

        if (matchCategory && matchState && matchCity) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Handle no results feedback
    let emptyMsg = document.getElementById('noRoomsFoundMsg');
    const grid = document.getElementById('publicRoomsGrid');
    if (visibleCount === 0) {
        if (!emptyMsg && grid) {
            emptyMsg = document.createElement('div');
            emptyMsg.id = 'noRoomsFoundMsg';
            emptyMsg.style.gridColumn = '1 / -1';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.padding = '40px 20px';
            emptyMsg.style.background = '#ffffff';
            emptyMsg.style.borderRadius = '16px';
            emptyMsg.style.border = '1px solid var(--border)';
            emptyMsg.innerHTML = `
                <i class="fa-solid fa-hotel" style="font-size: 32px; color: var(--primary); margin-bottom: 12px; display: block;"></i>
                <h3 style="font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 8px;">No Suites Available for this Selection</h3>
                <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 18px;">Try selecting another Indian state or explore all luxury accommodations.</p>
                <button class="btn btn-primary" onclick="quickFilterDestination('ALL')">View All India Stays</button>
            `;
            grid.appendChild(emptyMsg);
        }
    } else if (emptyMsg) {
        emptyMsg.remove();
    }
}

function executeSearchAndScroll() {
    filterRoomsBySearch();
    scrollToSection('rooms-showcase');
}

function onSearchDateChange() {
    const sIn = document.getElementById('searchCheckIn').value;
    const sOut = document.getElementById('searchCheckOut').value;
    const stIn = document.getElementById('stuffsCheckIn');
    const stOut = document.getElementById('stuffsCheckOut');
    const bkIn = document.getElementById('modalBookingCheckIn');
    const bkOut = document.getElementById('modalBookingCheckOut');
    if (stIn && sIn) stIn.value = sIn;
    if (stOut && sOut) stOut.value = sOut;
    if (bkIn && sIn) bkIn.value = sIn;
    if (bkOut && sOut) bkOut.value = sOut;
}

// ========================================================
// PUBLIC ROOMS SHOWCASE & FILTERING
// ========================================================
async function loadRoomsFromApi() {
    try {
        const res = await fetch(`${API_BASE}/rooms`);
        if (res.ok) {
            allRooms = await res.json();
            renderPublicRooms(allRooms);
            renderMgmtRooms(allRooms);
            populateBookingRoomSelect(allRooms);
        }
    } catch (err) {
        console.error('Error fetching rooms from API, loading local registry:', err);
        allRooms = Object.values(ROOM_DATABASE).map(r => ({
            id: parseInt(r.roomNumber, 10),
            roomNumber: r.roomNumber,
            roomType: r.category,
            pricePerNight: r.pricePerNight,
            status: 'AVAILABLE',
            capacity: r.specs.capacity.includes('4') ? 4 : (r.specs.capacity.includes('3') ? 3 : 2),
            amenities: 'WiFi, AC, Jacuzzi, Balcony, Forest Essentials',
            description: r.title
        }));
        renderPublicRooms(allRooms);
        renderMgmtRooms(allRooms);
        populateBookingRoomSelect(allRooms);
    }
}

function renderPublicRooms(rooms) {
    const grid = document.getElementById('publicRoomsGrid');
    if (!grid) return;
    if (!rooms || rooms.length === 0) return;

    grid.innerHTML = rooms.map(room => {
        const meta = ROOM_DATABASE[room.roomNumber] || {
            title: `Room ${room.roomNumber} - ${formatStatus(room.roomType)}`,
            state: 'India',
            city: 'TORO Resort',
            location: 'Prime Destination &bull; India',
            image: (room.roomType === 'PRESIDENTIAL' ? 'assets/penthouse_suite.jpg' : (room.roomType === 'DELUXE' ? 'assets/deluxe_suite.jpg' : 'assets/executive_suite.jpg')),
            panorama: (room.roomType === 'PRESIDENTIAL' ? 'penthouse' : 'deluxe'),
            specs: { bed: 'King Bed', size: '750 sq.ft', capacity: `${room.capacity || 2} Guests`, view: 'Ocean / Mountain Vista' },
            stuffs: {
                sleep: ['Custom Orthopedic Mattress', 'Fine Egyptian Linens', 'Climate Control'],
                bath: ['Marble Rain Shower', 'Forest Essentials Herbal Amenities', 'Plush Bathrobes'],
                refreshments: ['Gourmet Coffee & Tea Bar', 'Curated Minibar', 'Himalayan Mineral Water'],
                tech: ['Smart 4K TV with Streaming', 'High-Speed Wi-Fi 6', 'Bedside Power Docks'],
                convenience: ['Private Balcony / Vista', 'Executive Work Desk', 'Digital Electronic Safe']
            }
        };

        const panoramaKey = (room.roomType === 'PRESIDENTIAL' || room.roomNumber === '201') ? 'penthouse' : 'deluxe';
        const isAvailable = room.status.toUpperCase() === 'AVAILABLE';
        const statusBadge = isAvailable 
            ? `<span class="badge-status-float badge-available"><i class="fa-solid fa-check" style="font-size: 10px;"></i> Available</span>`
            : `<span class="badge-status-float badge-booked">${formatStatus(room.status)}</span>`;

        // Highlight summary line crafted from high-end amenities
        const highlightSummary = meta.stuffs 
            ? `${meta.stuffs.sleep[0]}, ${meta.stuffs.bath[0]}, and ${meta.stuffs.convenience[0]}.`
            : 'Artisan furnishings, marble bath, and 24-hour dedicated concierge service.';

        return `
            <div class="public-room-card" data-category="${room.roomType.toUpperCase()}" data-state="${meta.state || 'India'}" data-city="${meta.city || 'India'}" data-location="${meta.location || ''}" data-tourist-spot="${meta.touristSpot || ''}" data-room-num="${room.roomNumber}">
                <div class="card-media">
                    <img src="${meta.image}" alt="${meta.title}" loading="lazy">
                    <div class="badge-360-float" onclick="open360Tour('${panoramaKey}', '${room.roomNumber}')" title="Explore in 360° Virtual Tour">
                        <i class="fa-solid fa-compass"></i> 360° Virtual Tour
                    </div>
                    ${statusBadge}
                </div>
                <div class="card-body-content">
                    <!-- Tourism Spot Proximity Tag -->
                    <div class="landmark-proximity-tag">
                        <i class="fa-solid fa-map-pin"></i> <strong>Near:</strong> ${meta.touristSpot || meta.city} <span class="proximity-dist">(${meta.proximity || 'Prime Location'})</span>
                    </div>

                    <div class="room-location-tag">
                        <i class="fa-solid fa-location-dot"></i> ${meta.location || 'India'} &bull; ${formatStatus(room.roomType)}
                    </div>
                    
                    <h3 class="room-card-title">${escapeHtml(meta.title)}</h3>
                    
                    <div class="room-specs-line">
                        <span><i class="fa-solid fa-bed"></i> ${meta.specs.bed}</span>
                        <span class="specs-dot">&bull;</span>
                        <span><i class="fa-solid fa-ruler-combined"></i> ${meta.specs.size}</span>
                        <span class="specs-dot">&bull;</span>
                        <span><i class="fa-solid fa-user-group"></i> ${room.capacity || 2} Guests</span>
                    </div>

                    <p class="room-highlight-text">${escapeHtml(highlightSummary)}</p>

                    <div class="card-price-row">
                        <div class="price-container">
                            <span class="per-day-label">Nightly Rate</span>
                            <span class="price-amount">${formatCurrency(room.pricePerNight)}</span> <span class="price-unit">/ night</span>
                        </div>
                        <div class="room-card-buttons">
                            <button class="btn-360-card" onclick="open360Tour('${panoramaKey}', '${room.roomNumber}')" title="Look inside in 360°">
                                <i class="fa-solid fa-compass"></i> 360° View
                            </button>
                            <button class="btn-gold" onclick="openStuffsModal('${room.roomNumber}')">
                                Reserve Suite
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Filter rooms by nearby tourist attraction
function filterByTouristSpot(spotKey, cardElement = null) {
    document.querySelectorAll('.tourism-card').forEach(c => c.classList.remove('active'));
    if (cardElement) {
        cardElement.classList.add('active');
    }

    const cards = document.querySelectorAll('.public-room-card');
    let visibleCount = 0;
    const cleanKey = spotKey.toLowerCase();

    cards.forEach(card => {
        const roomState = (card.dataset.state || '').toLowerCase();
        const roomCity = (card.dataset.city || '').toLowerCase();
        const roomLoc = (card.dataset.location || '').toLowerCase();
        const roomTourist = (card.dataset.touristSpot || '').toLowerCase();

        let match = false;
        if (cleanKey === 'goa' && (roomState.includes('goa') || roomCity.includes('goa') || roomTourist.includes('goa') || roomTourist.includes('candolim') || roomTourist.includes('baga'))) {
            match = true;
        } else if (cleanKey === 'udaipur' && (roomCity.includes('udaipur') || roomLoc.includes('udaipur') || roomTourist.includes('pichola') || roomTourist.includes('city palace'))) {
            match = true;
        } else if (cleanKey === 'manali' && (roomCity.includes('manali') || roomLoc.includes('manali') || roomTourist.includes('solang') || roomTourist.includes('rohtang'))) {
            match = true;
        } else if (cleanKey === 'mumbai' && (roomCity.includes('mumbai') || roomLoc.includes('mumbai') || roomTourist.includes('marine drive') || roomTourist.includes('gateway'))) {
            match = true;
        } else if (cleanKey === 'jaipur' && (roomCity.includes('jaipur') || roomLoc.includes('jaipur') || roomTourist.includes('amber') || roomTourist.includes('hawa mahal'))) {
            match = true;
        } else if (cleanKey === 'kerala' && (roomState.includes('kerala') || roomCity.includes('kerala') || roomLoc.includes('vembanad') || roomTourist.includes('vembanad') || roomTourist.includes('backwater'))) {
            match = true;
        } else if (roomState.includes(cleanKey) || roomCity.includes(cleanKey) || roomLoc.includes(cleanKey) || roomTourist.includes(cleanKey)) {
            match = true;
        }

        if (match) {
            card.style.display = 'flex';
            card.classList.add('highlight-tourist-match');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.remove('highlight-tourist-match');
        }
    });

    const emptyMsg = document.getElementById('noRoomsFoundMsg');
    if (emptyMsg && visibleCount > 0) emptyMsg.remove();

    scrollToSection('rooms-showcase');
}


function filterRoomCards(category, btn) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cards = document.querySelectorAll('.public-room-card');
    cards.forEach(card => {
        if (category === 'ALL' || card.dataset.category === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// ========================================================
// 360° INTERACTIVE VIRTUAL TOUR (THREE.JS ENGINE)
// With Guaranteed, Foolproof Exit Features
// ========================================================
let scene360, camera360, renderer360, sphereMesh;
let isTourInitialized = false;
let isUserInteracting = false;
let onPointerDownMouseX = 0, onPointerDownMouseY = 0;
let lon = 0, onPointerDownLon = 0;
let lat = 0, onPointerDownLat = 0;
let phi = 0, theta = 0;
let isAutoRotating = true;
let current360RoomNum = '102';
let animationFrameId = null;

const SCENE_TEXTURES = {
    'deluxe': {
        url: 'assets/deluxe_360.jpg',
        title: 'Deluxe Ocean Suite 360° Virtual Tour (Goa Coast)',
        price: '₹3,500 / night',
        roomNumber: '102'
    },
    'penthouse': {
        url: 'assets/penthouse_360.jpg',
        title: 'Amber Royal Penthouse & Jacuzzi 360° Tour (Jaipur)',
        price: '₹9,500 / night',
        roomNumber: '201'
    }
};

function init360Three() {
    const container = document.getElementById('canvas360Container');
    if (!container || isTourInitialized) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (window.innerHeight - 80);

    // Camera
    camera360 = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    camera360.target = new THREE.Vector3(0, 0, 0);

    // Scene
    scene360 = new THREE.Scene();

    // Inverted Sphere for equirectangular 360 panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert inside out

    const material = new THREE.MeshBasicMaterial();
    sphereMesh = new THREE.Mesh(geometry, material);
    scene360.add(sphereMesh);

    // Renderer
    renderer360 = new THREE.WebGLRenderer({ antialias: true });
    renderer360.setPixelRatio(window.devicePixelRatio);
    renderer360.setSize(width, height);
    container.appendChild(renderer360.domElement);

    // Event listeners
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('wheel', onDocumentMouseWheel, { passive: false });
    window.addEventListener('resize', on360Resize);

    isTourInitialized = true;
}

function open360Tour(sceneKey = 'deluxe', roomNum = null) {
    const modal = document.getElementById('modal360');
    if (!modal) return;
    
    modal.style.display = 'flex';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent page scrolling behind 360 view

    if (!isTourInitialized) {
        init360Three();
    }

    switch360Scene(sceneKey, roomNum);
    on360Resize();
    start360Loop();
}

/**
 * Robust, foolproof function to leave the 360° view page immediately.
 * Called by:
 * - Top-left "Exit 360° Tour" button
 * - Top-right "X" close button
 * - Top-right floating emergency exit pill
 * - Banner "Exit View" button
 * - Bottom controls bar "Exit" button
 * - Keyboard Escape key
 */
function close360Tour() {
    const modal = document.getElementById('modal360');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }

    // Exit browser fullscreen if active
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }

    // Stop 360 animation loop
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // Clean up pointer events
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    isUserInteracting = false;

    // Restore body scrolling
    document.body.style.overflow = 'auto';

    showToast('Returned from 360° Virtual Tour.');
}

function switch360Scene(sceneKey, roomNum = null) {
    const data = SCENE_TEXTURES[sceneKey] || SCENE_TEXTURES['deluxe'];
    current360RoomNum = roomNum || data.roomNumber;

    document.getElementById('tourRoomTitle').innerHTML = `<i class="fa-solid fa-compass fa-spin" style="--fa-animation-duration: 8s; color: #2dd4bf;"></i> ${data.title}`;
    document.getElementById('tourRoomPrice').innerHTML = `${data.price}`;

    // Switch active buttons
    document.getElementById('btnSwitchDeluxe').classList.toggle('active', sceneKey === 'deluxe');
    document.getElementById('btnSwitchPenthouse').classList.toggle('active', sceneKey === 'penthouse');

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(data.url, (texture) => {
        sphereMesh.material.map = texture;
        sphereMesh.material.needsUpdate = true;
    });

    lon = 0;
    lat = 0;
}

function start360Loop() {
    if (animationFrameId) return;

    function animate() {
        animationFrameId = requestAnimationFrame(animate);

        if (isAutoRotating && !isUserInteracting) {
            lon += 0.08;
        }

        lat = Math.max(-85, Math.min(85, lat));
        phi = THREE.MathUtils.degToRad(90 - lat);
        theta = THREE.MathUtils.degToRad(lon);

        camera360.target.x = 500 * Math.sin(phi) * Math.cos(theta);
        camera360.target.y = 500 * Math.cos(phi);
        camera360.target.z = 500 * Math.sin(phi) * Math.sin(theta);

        camera360.lookAt(camera360.target);
        renderer360.render(scene360, camera360);
    }
    animate();
}

function onPointerDown(event) {
    if (event.isPrimary === false) return;
    isUserInteracting = true;

    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
}

function onPointerMove(event) {
    if (event.isPrimary === false) return;
    lon = (onPointerDownMouseX - event.clientX) * 0.15 + onPointerDownLon;
    lat = (event.clientY - onPointerDownMouseY) * 0.15 + onPointerDownLat;
}

function onPointerUp(event) {
    if (event.isPrimary === false) return;
    isUserInteracting = false;
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
}

function onDocumentMouseWheel(event) {
    event.preventDefault();
    const fov = camera360.fov + event.deltaY * 0.05;
    camera360.fov = THREE.MathUtils.clamp(fov, 35, 95);
    camera360.updateProjectionMatrix();
}

function zoom360(delta) {
    if (!camera360) return;
    camera360.fov = THREE.MathUtils.clamp(camera360.fov + delta, 35, 95);
    camera360.updateProjectionMatrix();
}

function reset360View() {
    lon = 0;
    lat = 0;
    if (camera360) {
        camera360.fov = 75;
        camera360.updateProjectionMatrix();
    }
}

function toggleAutoRotate() {
    isAutoRotating = !isAutoRotating;
    const icon = document.getElementById('rotateIcon');
    if (icon) {
        icon.className = isAutoRotating ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }
}

function toggleFullscreen360() {
    const el = document.getElementById('modal360');
    if (!document.fullscreenElement) {
        el.requestFullscreen().catch(err => console.log(err));
    } else {
        document.exitFullscreen();
    }
}

function on360Resize() {
    const container = document.getElementById('canvas360Container');
    if (!container || !renderer360 || !camera360) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera360.aspect = width / height;
    camera360.updateProjectionMatrix();
    renderer360.setSize(width, height);
}

function bookFromCurrent360() {
    close360Tour();
    openStuffsModal(current360RoomNum);
}

// ========================================================
// "THE STUFFS" & ROOM DETAILS INSPECTION MODAL
// ========================================================
let selectedStuffsExperiences = [];
let selectedBookingExperiences = [];

function onExperienceToggle(inputElement, cardId) {
    const card = document.getElementById(cardId);
    if (card) {
        if (inputElement.checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    }
    calculateStuffsTotal();
}

function onBookingExpToggle(inputElement, cardId) {
    const card = document.getElementById(cardId);
    if (card) {
        if (inputElement.checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    }
    calculateBookingTotal();
}

function openStuffsModal(roomNumber) {
    const room = allRooms.find(r => r.roomNumber === roomNumber) || {
        roomNumber: roomNumber,
        pricePerNight: (roomNumber === '201' ? 9500 : (roomNumber === '103' ? 5500 : 3500)),
        roomType: (roomNumber === '201' ? 'PRESIDENTIAL' : (roomNumber === '103' ? 'SUITE' : 'DELUXE'))
    };

    const meta = ROOM_DATABASE[roomNumber] || ROOM_DATABASE['102'];

    document.getElementById('stuffsRoomId').value = room.id || '';
    document.getElementById('stuffsModalTitle').textContent = `${meta.title} (Room ${roomNumber})`;
    document.getElementById('stuffsModalSubtitle').textContent = `${meta.location || 'India'} • ${meta.specs.bed} • ${meta.specs.size} • ${meta.specs.capacity}`;
    document.getElementById('stuffsModalImage').src = meta.image;
    document.getElementById('stuffsModalPriceDisplay').textContent = formatCurrency(room.pricePerNight);

    // Reset experience checkboxes
    document.querySelectorAll('#stuffsModal .experience-check-card input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    document.querySelectorAll('#stuffsModal .experience-check-card').forEach(card => {
        card.classList.remove('selected');
    });
    selectedStuffsExperiences = [];

    // Build the category grid for "The Stuffs"
    const grid = document.getElementById('stuffsCategoryGrid');
    grid.innerHTML = `
        <div class="stuff-category-card">
            <div class="stuff-cat-header"><i class="fa-solid fa-bed"></i> Sleeping & Comfort</div>
            <ul class="stuff-cat-list">
                ${meta.stuffs.sleep.map(item => `<li><i class="fa-solid fa-check"></i> ${escapeHtml(item)}</li>`).join('')}
            </ul>
        </div>

        <div class="stuff-category-card">
            <div class="stuff-cat-header"><i class="fa-solid fa-bath"></i> Luxury Bath & Spa</div>
            <ul class="stuff-cat-list">
                ${meta.stuffs.bath.map(item => `<li><i class="fa-solid fa-check"></i> ${escapeHtml(item)}</li>`).join('')}
            </ul>
        </div>

        <div class="stuff-category-card">
            <div class="stuff-cat-header"><i class="fa-solid fa-wine-glass"></i> Refreshments & Minibar</div>
            <ul class="stuff-cat-list">
                ${meta.stuffs.refreshments.map(item => `<li><i class="fa-solid fa-check"></i> ${escapeHtml(item)}</li>`).join('')}
            </ul>
        </div>

        <div class="stuff-category-card">
            <div class="stuff-cat-header"><i class="fa-solid fa-tv"></i> Media, Tech & Wi-Fi</div>
            <ul class="stuff-cat-list">
                ${meta.stuffs.tech.map(item => `<li><i class="fa-solid fa-check"></i> ${escapeHtml(item)}</li>`).join('')}
            </ul>
        </div>

        <div class="stuff-category-card" style="grid-column: 1 / -1;">
            <div class="stuff-cat-header"><i class="fa-solid fa-bell-concierge"></i> Balcony, Convenience & Butler</div>
            <ul class="stuff-cat-list" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                ${meta.stuffs.convenience.map(item => `<li><i class="fa-solid fa-check"></i> ${escapeHtml(item)}</li>`).join('')}
            </ul>
        </div>
    `;

    // Calculate dates & total
    calculateStuffsTotal(room.pricePerNight);
    openModal('stuffsModal');
}

function launch360FromStuffs() {
    const roomId = document.getElementById('stuffsRoomId').value;
    const room = allRooms.find(r => String(r.id) === String(roomId));
    const roomNum = room ? room.roomNumber : '102';
    const sceneKey = (roomNum === '201') ? 'penthouse' : 'deluxe';
    closeModal('stuffsModal');
    open360Tour(sceneKey, roomNum);
}

function calculateStuffsTotal(unitPrice = null) {
    const inDateVal = document.getElementById('stuffsCheckIn').value;
    const outDateVal = document.getElementById('stuffsCheckOut').value;

    let price = unitPrice;
    if (!price) {
        const text = document.getElementById('stuffsModalPriceDisplay').textContent.replace(/[^0-9]/g, '');
        price = parseFloat(text) || 3500;
    }

    if (!inDateVal || !outDateVal) return;

    const dIn = new Date(inDateVal);
    const dOut = new Date(outDateVal);
    let nights = Math.ceil((dOut - dIn) / (1000 * 60 * 60 * 24));
    if (nights <= 0) nights = 1;

    const roomSubtotal = price * nights;

    // Collect checked experiences
    let expSubtotal = 0;
    const selectedList = [];
    document.querySelectorAll('#stuffsModal .experience-check-card input[type="checkbox"]:checked').forEach(cb => {
        const cost = parseFloat(cb.dataset.cost) || 0;
        expSubtotal += cost;
        selectedList.push(cb.value);
    });
    selectedStuffsExperiences = selectedList;

    const grandTotal = roomSubtotal + expSubtotal;

    const nightsLabel = document.getElementById('stuffsNightsLabel');
    const roomSubtotalEl = document.getElementById('stuffsRoomSubtotal');
    const expLine = document.getElementById('stuffsExpSummaryLine');
    const expLabel = document.getElementById('stuffsExpSummaryLabel');
    const expSubtotalEl = document.getElementById('stuffsExpSubtotal');
    const totalEl = document.getElementById('stuffsTotalCalculated');
    const btnConfirm = document.getElementById('btnConfirmStuffsReservation');

    if (nightsLabel) nightsLabel.textContent = `Suite Stay: ${nights} night(s)`;
    if (roomSubtotalEl) roomSubtotalEl.textContent = formatCurrency(roomSubtotal);

    if (expLine) {
        if (selectedList.length > 0) {
            expLine.style.display = 'flex';
            if (expLabel) expLabel.textContent = `+ Curated Experiences (${selectedList.length}):`;
            if (expSubtotalEl) expSubtotalEl.textContent = `+${formatCurrency(expSubtotal)}`;
        } else {
            expLine.style.display = 'none';
        }
    }

    if (totalEl) totalEl.textContent = formatCurrency(grandTotal);
    if (btnConfirm) btnConfirm.innerHTML = `<i class="fa-solid fa-check-circle" style="margin-right: 6px;"></i> Confirm & Reserve Now &bull; ${formatCurrency(grandTotal)}`;
}

async function submitStuffsBooking(e) {
    e.preventDefault();

    const name = document.getElementById('stuffsGuestName').value.trim();
    const email = document.getElementById('stuffsGuestEmail').value.trim();
    const phone = document.getElementById('stuffsGuestPhone').value.trim();
    const inDate = document.getElementById('stuffsCheckIn').value;
    const outDate = document.getElementById('stuffsCheckOut').value;
    const payment = document.getElementById('stuffsPayment').value;
    const roomId = document.getElementById('stuffsRoomId').value;

    let targetRoomId = roomId ? parseInt(roomId, 10) : null;
    let targetRoomNum = null;
    if (!targetRoomId) {
        const title = document.getElementById('stuffsModalTitle').textContent;
        const match = title.match(/Room\s+(\d+)/);
        if (match) targetRoomNum = match[1];
    } else {
        const found = allRooms.find(r => r.id === targetRoomId);
        if (found) targetRoomNum = found.roomNumber;
    }

    const priceText = document.getElementById('stuffsModalPriceDisplay').textContent.replace(/[^0-9]/g, '');
    const pricePerNight = parseFloat(priceText) || 3500;
    const dIn = new Date(inDate);
    const dOut = new Date(outDate);
    let nights = Math.max(1, Math.ceil((dOut - dIn) / (1000 * 60 * 60 * 24)));
    
    let expSubtotal = 0;
    const selectedList = [];
    document.querySelectorAll('#stuffsModal .experience-check-card input[type="checkbox"]:checked').forEach(cb => {
        expSubtotal += (parseFloat(cb.dataset.cost) || 0);
        selectedList.push(cb.value);
    });

    const totalAmount = (pricePerNight * nights) + expSubtotal;

    const payload = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        roomId: targetRoomId,
        roomNumber: targetRoomNum,
        checkInDate: inDate,
        checkOutDate: outDate,
        totalAmount: totalAmount,
        paymentStatus: payment,
        selectedServices: selectedList,
        specialRequests: selectedList.length > 0 ? `Selected Curated Experiences: ${selectedList.join(', ')}` : 'Direct Suite Reservation'
    };

    const roomMeta = ROOM_DATABASE[String(targetRoomNum)] || { roomNumber: targetRoomNum, title: 'Luxury Suite', pricePerNight: pricePerNight };

    if (payment === 'PAID') {
        closeModal('stuffsModal');
        initiatePaymentFlow(payload, roomMeta, totalAmount);
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const created = await res.json();
            closeModal('stuffsModal');
            showToast(`Reservation Confirmed for ${name}! Welcome to TORO.`);
            loadRoomsFromApi();
            loadDashboardStats();
            finalizeBookingAndShowVoucher(created);
        } else {
            closeModal('stuffsModal');
            showToast(`Reservation Confirmed for ${name}!`);
            loadRoomsFromApi();
            loadDashboardStats();
        }
    } catch (err) {
        console.error('Error in booking:', err);
        closeModal('stuffsModal');
        showToast(`Reservation Confirmed for ${name}!`);
        loadRoomsFromApi();
        loadDashboardStats();
    }
}

function openQuickBook() {
    populateBookingGuestSelect();
    populateBookingRoomSelect(allRooms);
    calculateBookingTotal();
    openModal('bookingModal');
}

function openPublicServiceOrder(name, cost) {
    openServiceModal(name, cost);
}

// ========================================================
// STAFF MANAGEMENT PORTAL TOGGLE & CONTROLS
// ========================================================
function toggleManagementPortal() {
    const portal = document.getElementById('managementPortalOverlay');
    portal.classList.toggle('active');
    if (portal.classList.contains('active')) {
        loadDashboardStats();
        loadMgmtBookings();
    }
}

function showDashboardSection(id) {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const nav = document.getElementById(`dashnav-${id}`);
    if (nav) nav.classList.add('active');

    document.querySelectorAll('.dash-section').forEach(el => el.style.display = 'none');
    const sec = document.getElementById(`dash-${id}`);
    if (sec) sec.style.display = 'block';

    if (id === 'dashboard') loadDashboardStats();
    else if (id === 'rooms') loadMgmtRooms(allRooms);
    else if (id === 'customers') loadMgmtCustomers();
    else if (id === 'bookings') loadMgmtBookings();
    else if (id === 'services') loadMgmtServices();
}

async function loadDashboardStats() {
    try {
        const res = await fetch(`${API_BASE}/dashboard/stats`);
        if (res.ok) {
            const s = await res.json();
            document.getElementById('mgmtTotalRooms').textContent = s.totalRooms;
            document.getElementById('mgmtAvailBadge').textContent = `${s.availableRooms} Available`;
            document.getElementById('mgmtTotalGuests').textContent = s.totalCustomers;
            document.getElementById('mgmtActiveBookings').textContent = s.activeBookings;
            document.getElementById('mgmtTotalBookingsCount').textContent = `${s.totalBookings} Total`;
            document.getElementById('mgmtTotalRevenue').textContent = formatCurrency(s.totalRevenue);

            // Users who booked hotel stats
            const usersBooked = s.totalUsersBooked || s.uniqueGuestsBooked || (s.allBookedGuests ? s.allBookedGuests.length : 0);
            if (document.getElementById('mgmtUsersBookedCount')) {
                document.getElementById('mgmtUsersBookedCount').textContent = usersBooked;
            }
            if (document.getElementById('mgmtUsersBookedSub')) {
                document.getElementById('mgmtUsersBookedSub').textContent = `${usersBooked} Unique Paying Guests`;
            }
            if (document.getElementById('bookedGuestsTotalBadge')) {
                document.getElementById('bookedGuestsTotalBadge').textContent = `${usersBooked} Users Booked`;
            }

            // Render Booked Guests Directory
            if (s.allBookedGuests && document.getElementById('mgmtBookedGuestsTable')) {
                renderMgmtBookedGuestsRegistry(s.allBookedGuests);
            }

            const total = s.totalRooms || 1;
            const availPct = Math.round((s.availableRooms / total) * 100);
            const bookedPct = Math.round((s.bookedRooms / total) * 100);
            const maintPct = Math.round((s.maintenanceRooms / total) * 100);

            if (document.getElementById('mgmtBarAvail')) document.getElementById('mgmtBarAvail').style.width = `${availPct}%`;
            if (document.getElementById('mgmtBarBooked')) document.getElementById('mgmtBarBooked').style.width = `${bookedPct}%`;
            if (document.getElementById('mgmtBarMaint')) document.getElementById('mgmtBarMaint').style.width = `${maintPct}%`;
            if (document.getElementById('mgmtOccupancyRate')) document.getElementById('mgmtOccupancyRate').textContent = `${bookedPct}% Occupied`;
        }

        const bRes = await fetch(`${API_BASE}/bookings`);
        if (bRes.ok) {
            const bList = await bRes.json();
            allBookings = bList;
            renderMgmtRecentBookings(bList.slice(0, 8));
        }
    } catch (e) {
        console.error('Error loading dashboard stats:', e);
    }
}

function renderMgmtRecentBookings(bookings) {
    const tbody = document.getElementById('mgmtRecentBookingsTable');
    if (!tbody) return;

    if (!bookings || bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No reservations recorded yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = bookings.map(b => {
        const servicesList = b.selectedServices && Array.isArray(b.selectedServices) && b.selectedServices.length > 0
            ? b.selectedServices.map(s => `<span class="badge-exp-tag">${escapeHtml(typeof s === 'string' ? s.split('(')[0].trim() : s.name)}</span>`).join(' ')
            : `<span style="color: var(--text-muted); font-size: 11px;">Standard Room</span>`;

        return `
            <tr>
                <td><strong>#BK-${b.id}</strong></td>
                <td><strong>${escapeHtml(b.customer ? b.customer.name : 'Guest')}</strong></td>
                <td>Room ${escapeHtml(b.room ? b.room.roomNumber : 'N/A')}</td>
                <td>${formatDate(b.checkInDate)} &rarr; ${formatDate(b.checkOutDate)}</td>
                <td>${servicesList}</td>
                <td><strong>${formatCurrency(b.totalAmount)}</strong></td>
                <td><span class="badge badge-${b.status.toLowerCase()}">${formatStatus(b.status)}</span></td>
                <td><button class="btn btn-sm btn-secondary" onclick="showDashboardSection('bookings')">Details</button></td>
            </tr>
        `;
    }).join('');
}

function renderMgmtBookedGuestsRegistry(guests) {
    const tbody = document.getElementById('mgmtBookedGuestsTable');
    if (!tbody) return;

    if (!guests || guests.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No booked guests recorded yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = guests.map(g => {
        const servicesList = g.selectedServices && Array.isArray(g.selectedServices) && g.selectedServices.length > 0
            ? g.selectedServices.map(s => `<span class="badge-exp-tag">${escapeHtml(typeof s === 'string' ? s.split('(')[0].trim() : s.name)}</span>`).join(' ')
            : `<span style="color: var(--text-muted); font-size: 11.5px;">Room Only</span>`;

        return `
            <tr>
                <td>
                    <div style="font-weight: 700; color: var(--text-main); font-size: 13.5px;">${escapeHtml(g.guestName)}</div>
                    <span style="font-size: 11px; color: var(--text-muted);">Booking #BK-${g.bookingId}</span>
                </td>
                <td>
                    <div style="font-size: 12.5px;"><i class="fa-regular fa-envelope" style="color: var(--primary); margin-right: 4px;"></i> ${escapeHtml(g.email)}</div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;"><i class="fa-solid fa-phone" style="color: var(--primary); margin-right: 4px;"></i> ${escapeHtml(g.phone)}</div>
                </td>
                <td>
                    <strong>Room ${escapeHtml(g.roomNumber)}</strong> 
                    <small style="color: var(--text-muted); display: block;">${escapeHtml(g.roomType)}</small>
                </td>
                <td><span style="font-size: 12.5px;">${formatDate(g.checkInDate)} &rarr; ${formatDate(g.checkOutDate)}</span></td>
                <td>${servicesList}</td>
                <td><strong style="color: var(--primary); font-size: 14px;">${formatCurrency(g.totalAmount)}</strong></td>
                <td><span class="badge badge-${(g.status || 'CONFIRMED').toLowerCase()}">${formatStatus(g.status || 'CONFIRMED')}</span></td>
            </tr>
        `;
    }).join('');
}

function renderMgmtRooms(rooms) {
    const grid = document.getElementById('mgmtRoomsGrid');
    if (!grid) return;
    grid.innerHTML = rooms.map(r => `
        <div class="room-card">
            <div class="room-card-header">
                <div><h3>Room ${escapeHtml(r.roomNumber)}</h3><span>${escapeHtml(r.roomType)}</span></div>
                <span class="badge badge-${r.status.toLowerCase()}">${formatStatus(r.status)}</span>
            </div>
            <div class="room-card-body">
                <div class="room-price">${formatCurrency(r.pricePerNight)} <small>/ night</small></div>
                <p class="room-desc">${escapeHtml(r.description || 'Luxury TORO accommodation')}</p>
            </div>
            <div class="room-card-footer">
                <button class="btn btn-sm btn-secondary" onclick="toggleRoomStatus(${r.id}, '${r.status}')"><i class="fa-solid fa-rotate"></i> Status</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRoom(${r.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

async function loadMgmtCustomers() {
    const tbody = document.getElementById('mgmtCustomerTable');
    try {
        const res = await fetch(`${API_BASE}/customers`);
        if (res.ok) {
            allCustomers = await res.json();
            tbody.innerHTML = allCustomers.map(c => `
                <tr>
                    <td><strong>${escapeHtml(c.name)}</strong></td>
                    <td>${escapeHtml(c.email)}</td>
                    <td>${escapeHtml(c.phone)}</td>
                    <td>${escapeHtml(c.idProofNumber || 'N/A')}</td>
                    <td>${escapeHtml(c.address || 'N/A')}</td>
                    <td><button class="btn btn-sm btn-danger" onclick="deleteCustomer(${c.id})"><i class="fa-solid fa-trash"></i></button></td>
                </tr>
            `).join('');
        }
    } catch (e) {
        console.error(e);
    }
}

async function loadMgmtBookings() {
    const tbody = document.getElementById('mgmtBookingsTable');
    try {
        const res = await fetch(`${API_BASE}/bookings`);
        if (res.ok) {
            allBookings = await res.json();
            tbody.innerHTML = allBookings.map(b => {
                let act = '';
                if (b.status === 'CONFIRMED') {
                    act = `<button class="btn btn-sm btn-success" onclick="updateBookingStatus(${b.id}, 'CHECKED_IN')">Check In</button> <button class="btn btn-sm btn-danger" onclick="updateBookingStatus(${b.id}, 'CANCELLED')">Cancel</button>`;
                } else if (b.status === 'CHECKED_IN') {
                    act = `<button class="btn btn-sm btn-primary" onclick="updateBookingStatus(${b.id}, 'CHECKED_OUT')">Check Out</button>`;
                } else {
                    act = `<button class="btn btn-sm btn-secondary" onclick="deleteBooking(${b.id})"><i class="fa-solid fa-trash"></i></button>`;
                }

                return `
                    <tr>
                        <td><strong>#BK-${b.id}</strong></td>
                        <td><strong>${escapeHtml(b.customer ? b.customer.name : 'Guest')}</strong></td>
                        <td>Room ${escapeHtml(b.room ? b.room.roomNumber : '')}</td>
                        <td>${formatDate(b.checkInDate)} &rarr; ${formatDate(b.checkOutDate)}</td>
                        <td><strong>${formatCurrency(b.totalAmount)}</strong></td>
                        <td><span class="badge badge-paid">${escapeHtml(b.paymentStatus || 'PAID')}</span></td>
                        <td><span class="badge badge-${b.status.toLowerCase()}">${formatStatus(b.status)}</span></td>
                        <td>${act}</td>
                    </tr>
                `;
            }).join('');
        }
    } catch (e) {
        console.error(e);
    }
}

async function loadMgmtServices() {
    const tbody = document.getElementById('mgmtServicesTable');
    try {
        const res = await fetch(`${API_BASE}/services`);
        if (res.ok) {
            allServices = await res.json();
            tbody.innerHTML = allServices.map(s => `
                <tr>
                    <td><strong>#SRV-${s.id}</strong></td>
                    <td><strong>${escapeHtml(s.serviceName)}</strong></td>
                    <td>Room ${escapeHtml(s.roomNumber)}</td>
                    <td>${escapeHtml(s.customerName)}</td>
                    <td>${formatCurrency(s.cost)}</td>
                    <td>${escapeHtml(s.notes || '-')}</td>
                    <td><span class="badge badge-${s.status.toLowerCase()}">${formatStatus(s.status)}</span></td>
                    <td>
                        ${s.status === 'PENDING' ? `<button class="btn btn-sm btn-secondary" onclick="updateServiceStatus(${s.id}, 'IN_PROGRESS')">Start</button>` : ''}
                        ${s.status === 'IN_PROGRESS' ? `<button class="btn btn-sm btn-success" onclick="updateServiceStatus(${s.id}, 'COMPLETED')">Complete</button>` : ''}
                    </td>
                </tr>
            `).join('');
        }
    } catch (e) {
        console.error(e);
    }
}

// Modal Helpers & Crud Functions
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3800);
}

async function toggleRoomStatus(id, currentStatus) {
    let nextStatus = currentStatus === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
    try {
        await fetch(`${API_BASE}/rooms/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: nextStatus })
        });
        showToast(`Room status updated to ${nextStatus}`);
        loadRoomsFromApi();
        loadDashboardStats();
    } catch (err) {
        console.error(err);
    }
}

async function deleteRoom(id) {
    if (!confirm('Are you sure you want to remove this room?')) return;
    try {
        await fetch(`${API_BASE}/rooms/${id}`, { method: 'DELETE' });
        showToast('Room inventory updated.');
        loadRoomsFromApi();
        loadDashboardStats();
    } catch (e) {
        console.error(e);
    }
}

async function updateBookingStatus(id, newStatus) {
    try {
        await fetch(`${API_BASE}/bookings/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        showToast(`Reservation marked as ${formatStatus(newStatus)}`);
        loadMgmtBookings();
        loadDashboardStats();
        loadRoomsFromApi();
    } catch (e) {
        console.error(e);
    }
}

async function deleteBooking(id) {
    if (!confirm('Cancel and delete this reservation record?')) return;
    try {
        await fetch(`${API_BASE}/bookings/${id}`, { method: 'DELETE' });
        showToast('Reservation record removed.');
        loadMgmtBookings();
        loadDashboardStats();
    } catch (e) {
        console.error(e);
    }
}

async function deleteCustomer(id) {
    if (!confirm('Delete guest profile?')) return;
    try {
        await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
        showToast('Guest profile removed.');
        loadMgmtCustomers();
        loadDashboardStats();
    } catch (e) {
        console.error(e);
    }
}

async function updateServiceStatus(id, newStatus) {
    try {
        await fetch(`${API_BASE}/services/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        showToast(`Service order marked as ${formatStatus(newStatus)}`);
        loadMgmtServices();
    } catch (e) {
        console.error(e);
    }
}

function openRoomModal() {
    document.getElementById('roomForm').reset();
    document.getElementById('editRoomId').value = '';
    openModal('roomModal');
}

async function saveRoomSubmit(e) {
    e.preventDefault();
    const payload = {
        roomNumber: document.getElementById('modalRoomNumber').value.trim(),
        roomType: document.getElementById('modalRoomType').value,
        pricePerNight: parseFloat(document.getElementById('modalRoomPrice').value),
        capacity: parseInt(document.getElementById('modalRoomCapacity').value, 10),
        amenities: document.getElementById('modalRoomAmenities').value.trim(),
        description: document.getElementById('modalRoomDesc').value.trim(),
        status: 'AVAILABLE'
    };

    try {
        const res = await fetch(`${API_BASE}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            closeModal('roomModal');
            showToast('New room successfully added to inventory!');
            loadRoomsFromApi();
            loadDashboardStats();
        }
    } catch (err) {
        console.error(err);
    }
}

function openCustomerModal() {
    document.getElementById('customerFormModal').reset();
    document.getElementById('editCustomerId').value = '';
    openModal('customerModal');
}

async function saveCustomerSubmit(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('modalCustName').value.trim(),
        email: document.getElementById('modalCustEmail').value.trim(),
        phone: document.getElementById('modalCustPhone').value.trim(),
        idProofNumber: document.getElementById('modalCustIdProof').value.trim(),
        address: document.getElementById('modalCustAddress').value.trim()
    };

    try {
        const res = await fetch(`${API_BASE}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            closeModal('customerModal');
            showToast('Guest registered successfully!');
            loadMgmtCustomers();
            loadDashboardStats();
        }
    } catch (err) {
        console.error(err);
    }
}

function openServiceModal(prefillName = '', prefillCost = 0) {
    document.getElementById('serviceFormModal').reset();
    if (prefillName) document.getElementById('modalServiceName').value = prefillName;
    if (prefillCost) document.getElementById('modalServiceCost').value = prefillCost;
    openModal('serviceModal');
}

async function saveServiceSubmit(e) {
    e.preventDefault();
    const payload = {
        serviceName: document.getElementById('modalServiceName').value.trim(),
        roomNumber: document.getElementById('modalServiceRoom').value.trim(),
        customerName: document.getElementById('modalServiceGuest').value.trim() || 'Valued Guest',
        cost: parseFloat(document.getElementById('modalServiceCost').value) || 0,
        notes: document.getElementById('modalServiceNotes').value.trim(),
        status: 'PENDING'
    };

    try {
        const res = await fetch(`${API_BASE}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            closeModal('serviceModal');
            showToast('Service order dispatched to concierge desk!');
            loadMgmtServices();
        }
    } catch (err) {
        console.error(err);
    }
}

function populateBookingGuestSelect() {
    const sel = document.getElementById('modalBookingGuestSelect');
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Select Registered Guest or Create New --</option><option value="NEW">+ Register New Guest</option>';
    allCustomers.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.name} (${c.phone})`;
        sel.appendChild(opt);
    });
}

function onGuestSelectChange() {
    const val = document.getElementById('modalBookingGuestSelect').value;
    const newGuestBox = document.getElementById('newGuestFields');
    if (newGuestBox) {
        newGuestBox.style.display = (val === 'NEW') ? 'block' : 'none';
    }
}

function populateBookingRoomSelect(rooms) {
    const sel = document.getElementById('modalBookingRoomSelect');
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Choose Available Suite --</option>';
    rooms.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r.id;
        opt.dataset.price = r.pricePerNight;
        opt.textContent = `Room ${r.roomNumber} - ${r.roomType} (${formatCurrency(r.pricePerNight)}/night) [${r.status}]`;
        sel.appendChild(opt);
    });
}

function calculateBookingTotal() {
    const sel = document.getElementById('modalBookingRoomSelect');
    const inDateVal = document.getElementById('modalBookingCheckIn').value;
    const outDateVal = document.getElementById('modalBookingCheckOut').value;
    const totalEl = document.getElementById('bookingCalculatedTotal');
    const durEl = document.getElementById('bookingStayDuration');

    if (!sel || !sel.selectedOptions || sel.selectedOptions.length === 0) return;
    const price = parseFloat(sel.selectedOptions[0].dataset.price) || 3500;

    let nights = 1;
    if (inDateVal && outDateVal) {
        const dIn = new Date(inDateVal);
        const dOut = new Date(outDateVal);
        nights = Math.ceil((dOut - dIn) / (1000 * 60 * 60 * 24));
        if (nights <= 0) nights = 1;
    }

    // Collect checked experiences in bookingModal
    let expSubtotal = 0;
    const selectedList = [];
    document.querySelectorAll('#bookingModal .experience-check-card input[type="checkbox"]:checked').forEach(cb => {
        expSubtotal += (parseFloat(cb.dataset.cost) || 0);
        selectedList.push(cb.value);
    });
    selectedBookingExperiences = selectedList;

    const total = (price * nights) + expSubtotal;
    if (durEl) durEl.textContent = `${nights} night(s) stay${selectedList.length > 0 ? ` + ${selectedList.length} experience(s)` : ''}`;
    if (totalEl) totalEl.textContent = formatCurrency(total);
}

async function saveBookingSubmit(e) {
    e.preventDefault();
    const guestVal = document.getElementById('modalBookingGuestSelect').value;
    const roomId = document.getElementById('modalBookingRoomSelect').value;
    const inDate = document.getElementById('modalBookingCheckIn').value;
    const outDate = document.getElementById('modalBookingCheckOut').value;
    const payment = document.getElementById('modalBookingPayment').value;

    let custName = 'Guest';
    let custEmail = 'guest@example.com';
    let custPhone = '+91 98765 43210';

    if (guestVal === 'NEW') {
        custName = document.getElementById('modalNewGuestName').value.trim();
        custEmail = document.getElementById('modalNewGuestEmail').value.trim();
        custPhone = document.getElementById('modalNewGuestPhone').value.trim();
    } else if (guestVal) {
        const found = allCustomers.find(c => String(c.id) === String(guestVal));
        if (found) {
            custName = found.name;
            custEmail = found.email;
            custPhone = found.phone;
        }
    }

    const roomMeta = ROOM_DATABASE[String(roomId)] || allRooms.find(r => r.id === parseInt(roomId, 10)) || { roomNumber: roomId, title: 'Luxury Suite', pricePerNight: 3500 };
    const checkIn = new Date(inDate);
    const checkOut = new Date(outDate);
    const diffNights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));

    let expSubtotal = 0;
    const selectedList = [];
    document.querySelectorAll('#bookingModal .experience-check-card input[type="checkbox"]:checked').forEach(cb => {
        expSubtotal += (parseFloat(cb.dataset.cost) || 0);
        selectedList.push(cb.value);
    });

    const totalAmount = ((roomMeta.pricePerNight || 3500) * diffNights) + expSubtotal;

    const payload = {
        customerName: custName,
        customerEmail: custEmail,
        customerPhone: custPhone,
        roomId: parseInt(roomId, 10),
        checkInDate: inDate,
        checkOutDate: outDate,
        totalAmount: totalAmount,
        paymentStatus: payment,
        selectedServices: selectedList,
        specialRequests: selectedList.length > 0 ? `Selected Experiences: ${selectedList.join(', ')}` : 'Booked via TORO Reservation Desk'
    };

    // If Prepaid, launch luxury payment settlement gateway
    if (payment === 'PAID') {
        closeModal('bookingModal');
        initiatePaymentFlow(payload, roomMeta, totalAmount);
        return;
    }

    // Direct booking (Pay at check-in)
    try {
        const res = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const createdBooking = res.ok ? await res.json() : null;
        closeModal('bookingModal');
        showToast('Reservation registered! Welcome to TORO.');
        loadRoomsFromApi();
        loadDashboardStats();
        loadMgmtBookings();
        finalizeBookingAndShowVoucher(createdBooking || {
            id: Math.floor(10000 + Math.random() * 90000),
            customer: { name: custName, email: custEmail },
            room: { roomNumber: String(roomId), roomType: roomMeta.category || 'DELUXE' },
            checkInDate: inDate,
            checkOutDate: outDate,
            totalAmount: totalAmount,
            paymentStatus: 'PENDING'
        });
    } catch (err) {
        console.error('Error saving booking:', err);
        closeModal('bookingModal');
        showToast('Reservation confirmed in offline mode.');
        loadRoomsFromApi();
        loadDashboardStats();
        finalizeBookingAndShowVoucher({
            id: Math.floor(10000 + Math.random() * 90000),
            customer: { name: custName, email: custEmail },
            room: { roomNumber: String(roomId), roomType: roomMeta.category || 'DELUXE' },
            checkInDate: inDate,
            checkOutDate: outDate,
            totalAmount: totalAmount,
            paymentStatus: 'PENDING'
        });
    }
}

// ========================================================
// FORMATTING HELPERS
// ========================================================
function formatCurrency(val) {
    if (!val && val !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(val);
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatStatus(status) {
    if (!status) return '';
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ========================================================
// ROADMAP FEATURE 4: MULTI-PROPERTY MULTI-TENANCY ENGINE
// ========================================================
const PROPERTY_DIRECTORY = {
    'PROP-GOA': { id: 'PROP-GOA', name: 'TORO Oceanfront Sanctuary (Goa)', state: 'Goa', city: 'Goa', rooms: ['102'] },
    'PROP-UDAIPUR': { id: 'PROP-UDAIPUR', name: 'TORO Grand Palace & Lake Resort (Udaipur)', state: 'Rajasthan', city: 'Udaipur', rooms: ['103'] },
    'PROP-MANALI': { id: 'PROP-MANALI', name: 'TORO Himalayan Chalet & Spa (Manali)', state: 'Himachal Pradesh', city: 'Manali', rooms: ['104'] },
    'PROP-MUMBAI': { id: 'PROP-MUMBAI', name: 'TORO Imperial Seafront Towers (Mumbai)', state: 'Maharashtra', city: 'Mumbai', rooms: ['101'] },
    'PROP-JAIPUR': { id: 'PROP-JAIPUR', name: 'TORO Amber Royal Penthouse (Jaipur)', state: 'Rajasthan', city: 'Jaipur', rooms: ['201'] },
    'PROP-KERALA': { id: 'PROP-KERALA', name: 'TORO Vembanad Heritage Pavilion (Kerala)', state: 'Kerala', city: 'Kerala', rooms: ['202'] }
};

let activePmsProperty = 'ALL';

function onGlobalPropertyChange(propertyId) {
    if (!propertyId || propertyId === 'ALL') {
        quickFilterDestination('ALL');
        showToast('Viewing Consolidated Collection across India.');
        return;
    }
    const prop = PROPERTY_DIRECTORY[propertyId];
    if (prop) {
        quickFilterDestination(prop.state);
        showToast(`Filtered to: ${prop.name}`);
    }
}

async function onPmsPropertyFilterChange(propertyId) {
    activePmsProperty = propertyId || 'ALL';
    const queryParam = activePmsProperty !== 'ALL' ? `?property=${encodeURIComponent(activePmsProperty)}` : '';

    try {
        const statsRes = await fetch(`${API_BASE}/dashboard/stats${queryParam}`);
        if (statsRes.ok) {
            const stats = await statsRes.json();
            renderDashboardStats(stats);
        }
        const roomsRes = await fetch(`${API_BASE}/rooms${queryParam}`);
        if (roomsRes.ok) {
            const propRooms = await roomsRes.json();
            renderMgmtRooms(propRooms);
        }
    } catch (err) {
        console.warn('Filtering local PMS data for property:', activePmsProperty);
        if (activePmsProperty === 'ALL') {
            loadDashboardStats();
            renderMgmtRooms(allRooms);
        } else {
            const allowedRooms = PROPERTY_DIRECTORY[activePmsProperty]?.rooms || [];
            const filtered = allRooms.filter(r => allowedRooms.includes(String(r.roomNumber)));
            renderMgmtRooms(filtered);
            renderDashboardStats({
                totalRooms: filtered.length,
                availableRooms: filtered.filter(r => r.status.toUpperCase() === 'AVAILABLE').length,
                bookedRooms: filtered.filter(r => r.status.toUpperCase() === 'BOOKED').length,
                maintenanceRooms: filtered.filter(r => r.status.toUpperCase() === 'MAINTENANCE').length,
                totalCustomers: allCustomers.length,
                totalBookings: allBookings.filter(b => b.room && allowedRooms.includes(String(b.room.roomNumber))).length,
                activeBookings: 1,
                totalRevenue: filtered.reduce((s, r) => s + (r.pricePerNight * 3), 0)
            });
        }
    }
}

// ========================================================
// ROADMAP FEATURE 1: SPATIAL WEBVR & POSITIONAL AUDIO
// ========================================================
let audioCtx = null;
let spatialAudioActive = false;
let ambientGainNode = null;
let ambientPannerNode = null;
let ambientInterval = null;
let webVrGyroActive = false;

function initAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function toggleSpatialAudio() {
    initAudioContext();
    const btn = document.getElementById('btnSpatialAudio');
    const icon = document.getElementById('spatialAudioIcon');
    const label = document.getElementById('spatialAudioSubtext');

    if (!spatialAudioActive) {
        startSpatialSoundscape();
        spatialAudioActive = true;
        if (icon) icon.className = 'fa-solid fa-volume-high';
        if (label) label.textContent = 'Audio ON';
        if (btn) btn.style.color = '#2dd4bf';
        showToast('3D Spatial Soundscape Activated (Ocean Waves & Courtyard Resonance)');
    } else {
        stopSpatialSoundscape();
        spatialAudioActive = false;
        if (icon) icon.className = 'fa-solid fa-volume-xmark';
        if (label) label.textContent = 'Muted';
        if (btn) btn.style.color = '#94a3b8';
        showToast('Spatial Audio Muted');
    }
}

function startSpatialSoundscape() {
    if (!audioCtx) return;
    try {
        ambientPannerNode = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
        ambientGainNode = audioCtx.createGain();
        ambientGainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);

        if (ambientPannerNode) {
            ambientPannerNode.connect(ambientGainNode);
            ambientGainNode.connect(audioCtx.destination);
        } else {
            ambientGainNode.connect(audioCtx.destination);
        }

        // Procedural Ocean Waves Synthesizer using Pink Noise & Low Pass Filter
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            output[i] = (b0 + b1 + b2) * 0.3;
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, audioCtx.currentTime);

        whiteNoise.connect(filter);
        if (ambientPannerNode) {
            filter.connect(ambientPannerNode);
        } else {
            filter.connect(ambientGainNode);
        }
        whiteNoise.start();

        // Rhythmic swell oscillator to simulate rolling ocean waves
        ambientInterval = setInterval(() => {
            if (!audioCtx || !spatialAudioActive) return;
            const now = audioCtx.currentTime;
            filter.frequency.cancelScheduledValues(now);
            filter.frequency.setValueAtTime(260, now);
            filter.frequency.exponentialRampToValueAtTime(750, now + 2.5);
            filter.frequency.exponentialRampToValueAtTime(260, now + 5.0);

            // Update binaural panning based on current 360 yaw
            if (ambientPannerNode && typeof lon !== 'undefined') {
                const panVal = Math.sin((lon * Math.PI) / 180);
                ambientPannerNode.pan.setValueAtTime(Math.max(-1, Math.min(1, panVal)), now);
            }
        }, 5000);
    } catch (e) {
        console.warn('Web Audio synthesis error:', e);
    }
}

function stopSpatialSoundscape() {
    if (ambientInterval) {
        clearInterval(ambientInterval);
        ambientInterval = null;
    }
    if (ambientGainNode && audioCtx) {
        ambientGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

function toggleWebVR() {
    if (navigator.xr && navigator.xr.isSessionSupported) {
        navigator.xr.isSessionSupported('immersive-vr').then(supported => {
            if (supported) {
                showToast('Launching WebXR Spatial Session for Apple Vision Pro / Meta Quest 3...');
                return;
            }
            fallbackMobileGyroVR();
        }).catch(() => fallbackMobileGyroVR());
    } else {
        fallbackMobileGyroVR();
    }
}

function fallbackMobileGyroVR() {
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(permissionState => {
            if (permissionState === 'granted') {
                enableGyroTracking();
            } else {
                showToast('Entering VR Fullscreen Mode (Swipe to look around)');
                toggleFullscreen360();
            }
        }).catch(() => toggleFullscreen360());
    } else if (window.DeviceOrientationEvent) {
        enableGyroTracking();
    } else {
        toggleFullscreen360();
        showToast('WebVR Headset Mode Activated &bull; Press ESC to exit');
    }
}

function enableGyroTracking() {
    if (!webVrGyroActive) {
        window.addEventListener('deviceorientation', onDeviceGyroChange);
        webVrGyroActive = true;
        toggleFullscreen360();
        showToast('Gyroscope Head-Tracking Activated! Move device to look around.');
    } else {
        window.removeEventListener('deviceorientation', onDeviceGyroChange);
        webVrGyroActive = false;
        showToast('Head-tracking deactivated.');
    }
}

function onDeviceGyroChange(e) {
    if (e.alpha !== null && typeof lon !== 'undefined' && typeof lat !== 'undefined') {
        lon = e.alpha + 180;
        lat = Math.max(-85, Math.min(85, (e.beta || 90) - 90));
    }
}

// ========================================================
// ROADMAP FEATURE 2: LUXURY PAYMENT GATEWAY FLOW
// ========================================================
let pendingBooking = null;
let upiTimerTimer = null;

function initiatePaymentFlow(payload, roomMeta, totalAmount) {
    pendingBooking = {
        payload: payload,
        roomMeta: roomMeta,
        totalAmount: totalAmount
    };

    const roomTypeEl = document.getElementById('paySummaryRoomType');
    const titleEl = document.getElementById('paySummaryTitle');
    const datesEl = document.getElementById('paySummaryDates');
    const totalEl = document.getElementById('paySummaryTotal');

    if (roomTypeEl) roomTypeEl.textContent = (roomMeta.category || 'DELUXE SUITE').toUpperCase();
    if (titleEl) titleEl.textContent = roomMeta.title || `Suite ${payload.roomId}`;
    if (datesEl) datesEl.textContent = `${formatDate(payload.checkInDate)} → ${formatDate(payload.checkOutDate)}`;
    if (totalEl) totalEl.textContent = formatCurrency(totalAmount);

    switchPaymentTab('upi');
    startUpiTimer();
    openModal('paymentModal');
}

function switchPaymentTab(tabName) {
    document.querySelectorAll('.pay-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.pay-tab-content').forEach(c => c.classList.remove('active'));

    const btn = document.getElementById(`tabBtn${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    const content = document.getElementById(`payTab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);

    if (btn) btn.classList.add('active');
    if (content) content.classList.add('active');
}

function startUpiTimer() {
    if (upiTimerTimer) clearInterval(upiTimerTimer);
    let secondsLeft = 300; // 5 minutes
    const timerEl = document.getElementById('upiTimer');

    upiTimerTimer = setInterval(() => {
        secondsLeft--;
        if (secondsLeft <= 0) {
            clearInterval(upiTimerTimer);
            if (timerEl) timerEl.textContent = '00:00 (Expired)';
            return;
        }
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        if (timerEl) timerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }, 1000);
}

function copyUpiId() {
    navigator.clipboard.writeText('toro.luxury@icici').then(() => {
        showToast('UPI ID "toro.luxury@icici" copied to clipboard!');
    }).catch(() => {
        showToast('UPI ID: toro.luxury@icici');
    });
}

function simulateUpiApproval() {
    showToast('Verifying instant UPI bank settlement with NPCI...');
    setTimeout(() => {
        completeBookingSettlement('UPI_INSTANT_TRANSFER');
    }, 1200);
}

function processCardPayment(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitCardPay');
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating with 3D Secure...';
        btn.disabled = true;
    }

    setTimeout(() => {
        if (btn) {
            btn.innerHTML = '<i class="fa-solid fa-lock"></i> Authorize & Pay via Razorpay Secure';
            btn.disabled = false;
        }
        completeBookingSettlement('RAZORPAY_CREDIT_CARD');
    }, 1500);
}

function simulateStripeCheckout(method) {
    showToast(`Authorizing ${method} biometric payment token...`);
    setTimeout(() => {
        completeBookingSettlement(`STRIPE_${method.toUpperCase().replace(/\s+/g, '_')}`);
    }, 1200);
}

function proceedPayAtDesk() {
    closeModal('paymentModal');
    completeBookingSettlement('PAY_ON_ARRIVAL');
}

async function completeBookingSettlement(paymentChannel) {
    if (!pendingBooking) return;
    const payload = {
        ...pendingBooking.payload,
        paymentStatus: paymentChannel === 'PAY_ON_ARRIVAL' ? 'PENDING' : 'PAID',
        specialRequests: `Settled via ${paymentChannel}`
    };

    try {
        const res = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const saved = res.ok ? await res.json() : null;
        closeModal('paymentModal');
        showToast('Payment Settled Successfully! Your luxury stay is confirmed.');
        loadRoomsFromApi();
        loadDashboardStats();
        loadMgmtBookings();

        finalizeBookingAndShowVoucher(saved || {
            id: Math.floor(10000 + Math.random() * 90000),
            customer: { name: payload.customerName, email: payload.customerEmail },
            room: { roomNumber: String(payload.roomId), roomType: pendingBooking.roomMeta.category || 'DELUXE' },
            checkInDate: payload.checkInDate,
            checkOutDate: payload.checkOutDate,
            totalAmount: pendingBooking.totalAmount,
            paymentStatus: payload.paymentStatus
        });
    } catch (err) {
        console.error('Offline booking fallback:', err);
        closeModal('paymentModal');
        finalizeBookingAndShowVoucher({
            id: Math.floor(10000 + Math.random() * 90000),
            customer: { name: payload.customerName, email: payload.customerEmail },
            room: { roomNumber: String(payload.roomId), roomType: pendingBooking.roomMeta.category || 'DELUXE' },
            checkInDate: payload.checkInDate,
            checkOutDate: payload.checkOutDate,
            totalAmount: pendingBooking.totalAmount,
            paymentStatus: payload.paymentStatus
        });
    }
}

function finalizeBookingAndShowVoucher(booking) {
    const vId = document.getElementById('voucherBookingId');
    const vGuest = document.getElementById('voucherGuestName');
    const vRoom = document.getElementById('voucherRoom');
    const vIn = document.getElementById('voucherCheckIn');
    const vOut = document.getElementById('voucherCheckOut');
    const vAmount = document.getElementById('voucherAmount');

    const roomNum = booking.room ? booking.room.roomNumber : '102';
    const roomMeta = ROOM_DATABASE[roomNum] || {};

    if (vId) vId.textContent = `BOOKING REF: #TORO-${booking.id || '92810'}`;
    if (vGuest) vGuest.textContent = booking.customer ? booking.customer.name : 'Valued Guest';
    if (vRoom) vRoom.textContent = `Suite ${roomNum} • ${roomMeta.title || 'Luxury Villa'}`;
    if (vIn) vIn.textContent = `${formatDate(booking.checkInDate)} (From 2:00 PM)`;
    if (vOut) vOut.textContent = `${formatDate(booking.checkOutDate)} (12:00 PM)`;
    if (vAmount) vAmount.textContent = formatCurrency(booking.totalAmount || 3500);

    // Update active stay for keyless mobile check-in
    currentNfcStay = {
        roomNum: roomNum,
        roomName: roomMeta.title || 'Oceanfront Deluxe Beach Villa',
        guest: booking.customer ? booking.customer.name : 'Valued Guest',
        location: roomMeta.location || 'Candolim Beachfront • North Goa',
        checkIn: formatDate(booking.checkInDate),
        checkOut: formatDate(booking.checkOutDate)
    };

    openModal('paymentSuccessModal');
}

function printVoucher() {
    window.print();
}

function launchKeylessFromVoucher() {
    closeModal('paymentSuccessModal');
    openKeylessModal(currentNfcStay);
}

function formatCardNumber(input) {
    let val = input.value.replace(/\D/g, '');
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    input.value = formatted.substring(0, 19);

    const icon = document.getElementById('cardTypeDetect');
    const brand = document.getElementById('previewCardBrand');
    if (val.startsWith('4')) {
        if (icon) icon.innerHTML = '<i class="fa-brands fa-cc-visa"></i>';
        if (brand) brand.innerHTML = '<i class="fa-brands fa-cc-visa"></i> VISA';
    } else if (val.startsWith('5')) {
        if (icon) icon.innerHTML = '<i class="fa-brands fa-cc-mastercard"></i>';
        if (brand) brand.innerHTML = '<i class="fa-brands fa-cc-mastercard"></i> MASTERCARD';
    } else if (val.startsWith('3')) {
        if (icon) icon.innerHTML = '<i class="fa-brands fa-cc-amex"></i>';
        if (brand) brand.innerHTML = '<i class="fa-brands fa-cc-amex"></i> AMEX';
    } else if (val.startsWith('6')) {
        if (icon) icon.innerHTML = '<i class="fa-solid fa-credit-card"></i>';
        if (brand) brand.textContent = 'RUPAY';
    }
}

function formatCardExp(input) {
    let val = input.value.replace(/\D/g, '');
    if (val.length >= 2) {
        input.value = val.substring(0, 2) + '/' + val.substring(2, 4);
    } else {
        input.value = val;
    }
}

function updateCardPreview() {
    const nameVal = document.getElementById('payCardName')?.value;
    const numVal = document.getElementById('payCardNumber')?.value;
    const expVal = document.getElementById('payCardExp')?.value;

    const prevName = document.getElementById('previewCardName');
    const prevNum = document.getElementById('previewCardNumber');
    const prevExp = document.getElementById('previewCardExp');

    if (prevName) prevName.textContent = nameVal ? nameVal.toUpperCase() : 'GUEST RESERVATION';
    if (prevNum) prevNum.textContent = numVal ? numVal : '•••• •••• •••• 4242';
    if (prevExp) prevExp.textContent = expVal ? expVal : '12/28';
}

// ========================================================
// ROADMAP FEATURE 5: KEYLESS MOBILE CHECK-IN & NFC PASS
// ========================================================
let currentNfcStay = {
    roomNum: '102',
    roomName: 'Oceanfront Deluxe Beach Villa',
    guest: 'Priya Patel',
    location: 'Candolim Beachfront • North Goa',
    checkIn: 'Today',
    checkOut: 'In 3 Days'
};

function openKeylessModal(stay = null) {
    if (stay) currentNfcStay = stay;

    const numEl = document.getElementById('nfcPassRoomNum');
    const nameEl = document.getElementById('nfcPassRoomName');
    const locEl = document.getElementById('nfcPassLocation');
    const guestEl = document.getElementById('nfcPassGuest');

    if (numEl) numEl.textContent = currentNfcStay.roomNum;
    if (nameEl) nameEl.textContent = currentNfcStay.roomName;
    if (locEl) locEl.textContent = currentNfcStay.location;
    if (guestEl) guestEl.textContent = currentNfcStay.guest;

    // Reset status
    const statusEl = document.getElementById('nfcUnlockStatus');
    const iconEl = document.getElementById('nfcLockIcon');
    const targetEl = document.getElementById('nfcSensorTarget');

    if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'nfc-unlock-status';
    }
    if (iconEl) iconEl.className = 'fa-solid fa-key';
    if (targetEl) targetEl.style.boxShadow = '';

    openModal('keylessModal');
}

function triggerDoorUnlock() {
    initAudioContext();
    const statusEl = document.getElementById('nfcUnlockStatus');
    const iconEl = document.getElementById('nfcLockIcon');
    const targetEl = document.getElementById('nfcSensorTarget');

    if (statusEl) {
        statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Reading Encrypted NFC Token...';
        statusEl.className = 'nfc-unlock-status';
    }

    // Play dual electronic lock unlock chime via Web Audio API
    if (audioCtx) {
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
            osc.frequency.setValueAtTime(1760, audioCtx.currentTime + 0.12); // A6
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.45);
        } catch (e) {}
    }

    // Haptic vibration on mobile
    if (navigator.vibrate) {
        navigator.vibrate([80, 40, 140]);
    }

    setTimeout(() => {
        if (iconEl) iconEl.className = 'fa-solid fa-lock-open';
        if (statusEl) {
            statusEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> DOOR LATCH UNLOCKED &bull; Welcome to Suite ${currentNfcStay.roomNum}`;
            statusEl.className = 'nfc-unlock-status unlocked';
        }
        if (targetEl) targetEl.style.boxShadow = '0 0 30px rgba(52, 211, 153, 0.8)';
        showToast(`Suite ${currentNfcStay.roomNum} door latch unlocked! Welcome inside.`);
    }, 600);
}

// ========================================================
// ROADMAP FEATURE 3: AI BUTLER ASSISTANT ("JEEVES")
// ========================================================
function toggleAiButler() {
    const drawer = document.getElementById('aiButlerDrawer');
    if (drawer) {
        drawer.classList.toggle('active');
        if (drawer.classList.contains('active')) {
            const input = document.getElementById('aiChatInput');
            if (input) input.focus();
        }
    }
}

function askAiButler(promptText) {
    const input = document.getElementById('aiChatInput');
    if (input) input.value = promptText;
    processAiButlerQuery(promptText);
}

function handleAiButlerSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('aiChatInput');
    if (!input || !input.value.trim()) return;
    const q = input.value.trim();
    input.value = '';
    processAiButlerQuery(q);
}

async function processAiButlerQuery(userQuery) {
    appendAiMessage('user', userQuery);

    // Typing indicator
    const stream = document.getElementById('aiChatStream');
    const typingId = 'aiTyping_' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = typingId;
    typingDiv.className = 'ai-msg ai-bot';
    typingDiv.innerHTML = `<div class="ai-bubble"><i class="fa-solid fa-ellipsis fa-fade"></i> Jeeves is reflecting on your request...</div>`;
    stream.appendChild(typingDiv);
    stream.scrollTop = stream.scrollHeight;

    const apiKey = localStorage.getItem('gemini_api_key');
    let responseText = '';

    if (apiKey) {
        try {
            const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are Jeeves, an impeccably polite, warm, and sophisticated personal luxury butler for TORO Luxury Hotels & Resorts in India (properties in Goa, Udaipur, Manali, Mumbai, Jaipur, and Kerala). Answer the guest's inquiry with tailored hospitality recommendations, warmth, and impeccable etiquette. Keep answers elegant, concise (2-3 short paragraphs), and authentic.\n\nGuest Request: ${userQuery}`
                        }]
                    }]
                })
            });
            if (geminiRes.ok) {
                const data = await geminiRes.json();
                responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            }
        } catch (e) {
            console.warn('Gemini API call failed, falling back to local matrix:', e);
        }
    }

    if (!responseText) {
        responseText = generateLocalButlerResponse(userQuery);
    }

    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    appendAiMessage('bot', responseText);
}

function appendAiMessage(role, htmlText) {
    const stream = document.getElementById('aiChatStream');
    if (!stream) return;
    const msg = document.createElement('div');
    msg.className = `ai-msg ai-${role}`;
    msg.innerHTML = `
        <div class="ai-bubble">${htmlText}</div>
        <div class="ai-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    stream.appendChild(msg);
    stream.scrollTop = stream.scrollHeight;
}

function generateLocalButlerResponse(query) {
    const q = query.toLowerCase();

    // In-Room Dining & Room Service Dispatch
    if (q.includes('order') || q.includes('breakfast') || q.includes('dining') || q.includes('chai') || q.includes('champagne')) {
        dispatchServiceTicketFromAi('In-Room Dining: Gourmet Masala Chai & Artisanal Breakfast', '102', 'Priya Patel', 850);
        return `It is my absolute pleasure. I have formally dispatched an express priority ticket to our culinary kitchen for <strong>Gourmet Breakfast & Artisanal Masala Chai</strong> for Suite 102.
        <br><br>
        Our private dining steward will present your tray in approximately 18 minutes. Please let me know if you desire extra Himalayan wildflower honey.`;
    }

    // Spa & Wellness Dispatch
    if (q.includes('spa') || q.includes('massage') || q.includes('abhyanga') || q.includes('ayurveda')) {
        dispatchServiceTicketFromAi('Ayurvedic Abhyanga Wellness Spa (90 Mins)', '102', 'Priya Patel', 2200);
        return `A blissful choice. I have reserved your <strong>Ayurvedic Abhyanga Herbal Therapy</strong> with our senior Vaidya for 5:30 PM today.
        <br><br>
        Warm virgin coconut and sandalwood oils are currently being prepared. A fresh silk robe and floral foot soak will precede your treatment.`;
    }

    // Itinerary Planning
    if (q.includes('itinerary') || q.includes('goa') || q.includes('trip') || q.includes('plan')) {
        return `Allow me to present your bespoke <strong>3-Day Royal Sanctuary Itinerary</strong>:
        <br><br>
        <strong>Day 1 &bull; Maritime Serenity</strong>: Morning yoga on Candolim beach, followed by private sunset champagne yacht charter along the Mandovi estuaries.
        <br>
        <strong>Day 2 &bull; Heritage & Spice</strong>: Private chauffeured Mercedes to the Portuguese Latin Quarter (Fontainhas) and an organic spice plantation luncheon.
        <br>
        <strong>Day 3 &bull; Ayurvedic Restoration</strong>: Tailored holistic spa therapies, concluding with a candlelit beachfront seafood supper under the coastal palms.`;
    }

    // Suite Inclusions / The Stuffs
    if (q.includes('penthouse') || q.includes('jacuzzi') || q.includes('amenities') || q.includes('inclusions')) {
        return `The <strong>Amber Royal Penthouse</strong> is our crowning jewel. Your inclusions encompass:
        <br><br>
        &bull; 24-Hour dedicated personal butler on standby.<br>
        &bull; Freestanding terrace hydrotherapy Jacuzzi with 360° Amber Palace skyline views.<br>
        &bull; Curated wine cellar and unlimited Nespresso Creatista bar.<br>
        &bull; Complimentary airport Mercedes S-Class round-trip chauffeur transfer.`;
    }

    // Default polite Butler reply
    return `Certainly. At TORO, your every wish is anticipated with utmost discretion. I have logged your preference with the concierge desk.
    <br><br>
    Is there any other bespoke arrangement I may coordinate for you—perhaps private airport transit, laundry valet, or evening high tea?`;
}

async function dispatchServiceTicketFromAi(serviceName, roomNumber, guestName, cost) {
    try {
        await fetch(`${API_BASE}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                serviceName: serviceName,
                roomNumber: roomNumber,
                customerName: guestName,
                cost: cost,
                notes: 'Automated dispatch via TORO AI Butler Concierge'
            })
        });
        loadDashboardStats();
    } catch (e) {
        console.warn('AI Butler offline ticket logging:', e);
    }
}

function openGeminiConfigModal() {
    const input = document.getElementById('geminiApiKeyInput');
    const existing = localStorage.getItem('gemini_api_key') || '';
    if (input) input.value = existing;
    openModal('geminiApiKeyModal');
}

function saveGeminiApiKey() {
    const input = document.getElementById('geminiApiKeyInput');
    if (input) {
        const val = input.value.trim();
        if (val) {
            localStorage.setItem('gemini_api_key', val);
            showToast('Gemini API Key activated for Jeeves AI Butler!');
        } else {
            localStorage.removeItem('gemini_api_key');
            showToast('Switched Jeeves back to TORO Local Luxury Matrix.');
        }
    }
    closeModal('geminiApiKeyModal');
}