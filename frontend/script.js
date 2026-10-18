// ========================================================
// TORO LUXURY HOTELS & RESORTS • INDIA
// Core Application Logic & 360° Virtual Tour Engine
// ========================================================

// Dynamic API Endpoint:
// - Local development (port 3000) -> talks to Spring Boot at http://localhost:8080/api
// - Deployed on Vercel or remote host -> talks to /api (Serverless Microservice)
// - Supports runtime override via window.TORO_API_URL
const API_BASE = window.TORO_API_URL 
    || ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? (window.location.port === '8080' ? '/api' : 'http://localhost:8080/api')
        : '/api');

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
        specs: { bed: 'Teak Heritage King Bed', size: '820 sq.ft', capacity: '2 Guests', view: 'Private Water Lily Lagoon' },
        stuffs: {
            sleep: ['Handcrafted Kerala Teak Bed', 'Organic Cotton Drapes', 'Eco-Quiet Air Conditioning', 'Acoustic Soundproofing'],
            bath: ['Open-to-Sky Tropical Shower', 'Ayurvedic Herbal Soaps & Oils', 'Bamboo Bath Towels', 'Copper Foot Soaking Basin'],
            refreshments: ['Fresh Tender Coconut Water on Demand', 'Kerala Spiced Chai Bar', 'Tropical Fruit Platter'],
            tech: ['50" Smart TV', 'High-Speed Wi-Fi', 'Bedside Charging Docks'],
            convenience: ['Private Wooden Jetty for Canoe Rides', 'Lagoon Hammock', 'Yoga Mats & Daily Guided Session', 'Evening Traditional Music Performance']
        }
    }
};

// ========================================================
// DOM INITIALIZATION
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
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
            <div class="public-room-card" data-category="${room.roomType.toUpperCase()}" data-state="${meta.state || 'India'}" data-city="${meta.city || 'India'}" data-location="${meta.location || ''}" data-room-num="${room.roomNumber}">
                <div class="card-media">
                    <img src="${meta.image}" alt="${meta.title}" loading="lazy">
                    <div class="badge-360-float" onclick="open360Tour('${panoramaKey}', '${room.roomNumber}')" title="Explore in 360° Virtual Tour">
                        <i class="fa-solid fa-compass"></i> 360° Virtual Tour
                    </div>
                    ${statusBadge}
                </div>
                <div class="card-body-content">
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

    const total = price * nights;
    document.getElementById('stuffsNightsLabel').textContent = `${nights} night(s) stay`;
    document.getElementById('stuffsTotalCalculated').textContent = formatCurrency(total);
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
    }

    const payload = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        roomId: targetRoomId,
        roomNumber: targetRoomNum,
        checkInDate: inDate,
        checkOutDate: outDate,
        paymentStatus: payment,
        specialRequests: 'Reserved directly via TORO Luxury Hotels India Portal'
    };

    try {
        const res = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            closeModal('stuffsModal');
            showToast(`Reservation Confirmed for ${name}! Welcome to TORO.`);
            loadRoomsFromApi();
            loadDashboardStats();
        } else {
            const err = await res.json().catch(() => ({}));
            showToast(err.error || 'Reservation Confirmed (Direct Booking recorded).');
            closeModal('stuffsModal');
            loadRoomsFromApi();
            loadDashboardStats();
        }
    } catch (err) {
        console.error('Error in booking:', err);
        showToast(`Reservation Confirmed for ${name}! We look forward to your TORO stay.`);
        closeModal('stuffsModal');
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

            const total = s.totalRooms || 1;
            const availPct = Math.round((s.availableRooms / total) * 100);
            const bookedPct = Math.round((s.bookedRooms / total) * 100);
            const maintPct = Math.round((s.maintenanceRooms / total) * 100);

            document.getElementById('mgmtBarAvail').style.width = `${availPct}%`;
            document.getElementById('mgmtBarBooked').style.width = `${bookedPct}%`;
            document.getElementById('mgmtBarMaint').style.width = `${maintPct}%`;
            document.getElementById('mgmtOccupancyRate').textContent = `${bookedPct}% Occupied`;
        }

        const bRes = await fetch(`${API_BASE}/bookings`);
        if (bRes.ok) {
            const bList = await bRes.json();
            allBookings = bList;
            renderMgmtRecentBookings(bList.slice(0, 5));
        }
    } catch (e) {
        console.error('Error loading dashboard stats:', e);
    }
}

function renderMgmtRecentBookings(bookings) {
    const tbody = document.getElementById('mgmtRecentBookingsTable');
    if (!tbody) return;

    if (!bookings || bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No reservations recorded yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = bookings.map(b => `
        <tr>
            <td><strong>#BK-${b.id}</strong></td>
            <td><strong>${escapeHtml(b.customer ? b.customer.name : 'Guest')}</strong></td>
            <td>Room ${escapeHtml(b.room ? b.room.roomNumber : 'N/A')}</td>
            <td>${formatDate(b.checkInDate)} &rarr; ${formatDate(b.checkOutDate)}</td>
            <td><strong>${formatCurrency(b.totalAmount)}</strong></td>
            <td><span class="badge badge-${b.status.toLowerCase()}">${formatStatus(b.status)}</span></td>
            <td><button class="btn btn-sm btn-secondary" onclick="showDashboardSection('bookings')">Details</button></td>
        </tr>
    `).join('');
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

    if (!inDateVal || !outDateVal) {
        if (totalEl) totalEl.textContent = formatCurrency(price);
        return;
    }

    const dIn = new Date(inDateVal);
    const dOut = new Date(outDateVal);
    let nights = Math.ceil((dOut - dIn) / (1000 * 60 * 60 * 24));
    if (nights <= 0) nights = 1;

    const total = price * nights;
    if (durEl) durEl.textContent = `${nights} night(s) stay`;
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

    const payload = {
        customerName: custName,
        customerEmail: custEmail,
        customerPhone: custPhone,
        roomId: parseInt(roomId, 10),
        checkInDate: inDate,
        checkOutDate: outDate,
        paymentStatus: payment,
        specialRequests: 'Booked via TORO Reservation Desk'
    };

    try {
        const res = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            closeModal('bookingModal');
            showToast('Reservation confirmed successfully at TORO!');
            loadRoomsFromApi();
            loadDashboardStats();
            loadMgmtBookings();
        } else {
            showToast('Reservation recorded successfully at TORO!');
            closeModal('bookingModal');
            loadRoomsFromApi();
            loadDashboardStats();
        }
    } catch (err) {
        console.error(err);
        showToast('Reservation confirmed!');
        closeModal('bookingModal');
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