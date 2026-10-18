// ========================================================
// TORO LUXURY HOTELS & RESORTS • VERCEL SERVERLESS REST API
// Node.js Serverless Microservice compatible with Spring Boot REST API
// ========================================================

// In-Memory Database (persists across warm serverless invocations)
let rooms = [
  {
    id: 1,
    roomNumber: "101",
    roomType: "SINGLE",
    pricePerNight: 2000.0,
    status: "AVAILABLE",
    amenities: "High-speed WiFi, Single Bed, Smart TV, AC",
    capacity: 1,
    description: "Comfortable single room ideal for solo travelers and business guests."
  },
  {
    id: 2,
    roomNumber: "102",
    roomType: "DELUXE",
    pricePerNight: 3500.0,
    status: "BOOKED",
    amenities: "WiFi, King Bed, 55\" Smart TV, Mini Bar, Balcony",
    capacity: 2,
    description: "Spacious room with modern interiors and city skyline view."
  },
  {
    id: 3,
    roomNumber: "103",
    roomType: "SUITE",
    pricePerNight: 5500.0,
    status: "AVAILABLE",
    amenities: "King Bed, Jacuzzi, Private Lounge, Free Breakfast, Ocean View",
    capacity: 3,
    description: "Luxury suite with panoramic views and dedicated concierge service."
  },
  {
    id: 4,
    roomNumber: "104",
    roomType: "DELUXE",
    pricePerNight: 4800.0,
    status: "AVAILABLE",
    amenities: "2 Queen Beds, Bathtub, Living Area, Kids Pack",
    capacity: 4,
    description: "Perfect setup for family vacation with maximum comfort."
  },
  {
    id: 5,
    roomNumber: "201",
    roomType: "PRESIDENTIAL",
    pricePerNight: 9500.0,
    status: "AVAILABLE",
    amenities: "Private Terrace, Butler Service, Kitchenette, Marble Bath",
    capacity: 4,
    description: "Ultimate luxury experience tailored for distinguished guests."
  },
  {
    id: 6,
    roomNumber: "202",
    roomType: "DOUBLE",
    pricePerNight: 3000.0,
    status: "MAINTENANCE",
    amenities: "Queen Bed, AC, Work Desk, Rain Shower",
    capacity: 2,
    description: "Scheduled routine maintenance and deep sanitization."
  }
];

let customers = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    idProofNumber: "1234-5678-9012",
    address: "Mumbai, Maharashtra"
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 98123 45678",
    idProofNumber: "Z1234567",
    address: "Ahmedabad, Gujarat"
  },
  {
    id: 3,
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "+91 97234 56789",
    idProofNumber: "4321-8765-2109",
    address: "Bangalore, Karnataka"
  },
  {
    id: 4,
    name: "Ananya Iyer",
    email: "ananya.iyer@example.com",
    phone: "+91 96345 67890",
    idProofNumber: "P9876543",
    address: "Chennai, Tamil Nadu"
  }
];

let bookings = [
  {
    id: 1,
    customer: customers[1], // Priya Patel
    room: rooms[1], // 102
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    totalAmount: 10500.0,
    status: "CONFIRMED",
    paymentStatus: "PAID",
    specialRequests: "Late check-in requested (after 8 PM)",
    bookingTime: new Date().toISOString()
  }
];

let services = [
  {
    id: 1,
    serviceName: "Room Dining (Gourmet Breakfast)",
    roomNumber: "102",
    customerName: "Priya Patel",
    cost: 750.0,
    status: "IN_PROGRESS",
    notes: "Deliver at 8:30 AM with extra coffee",
    requestedAt: new Date().toISOString()
  },
  {
    id: 2,
    serviceName: "Laundry & Dry Clean",
    roomNumber: "101",
    customerName: "Aarav Sharma",
    cost: 350.0,
    status: "PENDING",
    notes: "Express wash for 2 shirts",
    requestedAt: new Date().toISOString()
  },
  {
    id: 3,
    serviceName: "Airport Transfer",
    roomNumber: "103",
    customerName: "Rohan Mehta",
    cost: 1200.0,
    status: "COMPLETED",
    notes: "Pickup from Terminal 2 at 4 PM",
    requestedAt: new Date().toISOString()
  }
];

let nextRoomId = 7;
let nextCustomerId = 5;
let nextBookingId = 2;
let nextServiceId = 4;

async function parseBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body); } catch (e) { return {}; }
    }
    return req.body;
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.end();
  }

  // Optional: Forward to external Java Spring Boot backend if BACKEND_URL environment variable is set
  if (process.env.BACKEND_URL) {
    try {
      const targetUrl = new URL(req.url, process.env.BACKEND_URL);
      const headers = { ...req.headers };
      delete headers.host;

      const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await parseBody(req) : null;
      const proxyRes = await fetch(targetUrl.toString(), {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      const responseData = await proxyRes.text();
      res.statusCode = proxyRes.status;
      res.setHeader('Content-Type', proxyRes.headers.get('content-type') || 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.end(responseData);
    } catch (err) {
      console.error('Error proxying to BACKEND_URL:', err);
      // Fallback to local serverless handler below if backend is unreachable
    }
  }

  // Parse path and query params
  const fullUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = fullUrl.pathname;
  
  // Normalize path so /api/rooms and /rooms both work
  if (!pathname.startsWith('/api')) {
    pathname = '/api' + (pathname.startsWith('/') ? pathname : '/' + pathname);
  }
  const searchParams = fullUrl.searchParams;
  const method = req.method;

  // ----------------------------------------------------
  // HEALTH CHECK & METADATA (/api)
  // ----------------------------------------------------
  if (pathname === '/api' || pathname === '/api/') {
    return sendJson(res, 200, {
      status: 'UP',
      service: 'TORO Luxury Hotels & Resorts API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: [
        '/api/rooms',
        '/api/bookings',
        '/api/customers',
        '/api/services',
        '/api/dashboard/stats'
      ]
    });
  }

  // ----------------------------------------------------
  // ROOMS ENDPOINTS (/api/rooms)
  // ----------------------------------------------------
  if (pathname === '/api/rooms' || pathname === '/api/rooms/') {
    if (method === 'GET') {
      const statusParam = searchParams.get('status');
      if (statusParam) {
        return sendJson(res, 200, rooms.filter(r => r.status.toLowerCase() === statusParam.toLowerCase()));
      }
      return sendJson(res, 200, rooms);
    }

    if (method === 'POST') {
      const body = await parseBody(req);
      const newRoom = {
        id: nextRoomId++,
        roomNumber: String(body.roomNumber || nextRoomId),
        roomType: (body.roomType || 'DELUXE').toUpperCase(),
        pricePerNight: parseFloat(body.pricePerNight) || 3000.0,
        status: (body.status || 'AVAILABLE').toUpperCase(),
        amenities: body.amenities || 'WiFi, AC, TV',
        capacity: parseInt(body.capacity, 10) || 2,
        description: body.description || ''
      };
      rooms.push(newRoom);
      return sendJson(res, 201, newRoom);
    }
  }

  if (pathname === '/api/rooms/available') {
    return sendJson(res, 200, rooms.filter(r => r.status.toUpperCase() === 'AVAILABLE'));
  }

  const roomStatusMatch = pathname.match(/^\/api\/rooms\/([^/]+)\/status\/?$/);
  if (roomStatusMatch && (method === 'PATCH' || method === 'PUT')) {
    const roomId = roomStatusMatch[1];
    const body = await parseBody(req);
    const newStatus = body.status || searchParams.get('status');
    const room = rooms.find(r => String(r.id) === roomId || r.roomNumber === roomId);
    if (!room) return sendJson(res, 404, { error: 'Room not found' });
    if (newStatus) room.status = newStatus.toUpperCase();
    return sendJson(res, 200, room);
  }

  const singleRoomMatch = pathname.match(/^\/api\/rooms\/([^/]+)\/?$/);
  if (singleRoomMatch && !pathname.endsWith('/status')) {
    const roomId = singleRoomMatch[1];
    const room = rooms.find(r => String(r.id) === roomId || r.roomNumber === roomId);

    if (method === 'GET') {
      if (!room) return sendJson(res, 404, { error: 'Room not found' });
      return sendJson(res, 200, room);
    }

    if (method === 'PUT') {
      if (!room) return sendJson(res, 404, { error: 'Room not found' });
      const body = await parseBody(req);
      Object.assign(room, {
        roomNumber: body.roomNumber || room.roomNumber,
        roomType: (body.roomType || room.roomType).toUpperCase(),
        pricePerNight: body.pricePerNight ? parseFloat(body.pricePerNight) : room.pricePerNight,
        status: (body.status || room.status).toUpperCase(),
        amenities: body.amenities !== undefined ? body.amenities : room.amenities,
        capacity: body.capacity ? parseInt(body.capacity, 10) : room.capacity,
        description: body.description !== undefined ? body.description : room.description
      });
      return sendJson(res, 200, room);
    }

    if (method === 'DELETE') {
      rooms = rooms.filter(r => String(r.id) !== roomId && r.roomNumber !== roomId);
      res.statusCode = 204;
      return res.end();
    }
  }

  // ----------------------------------------------------
  // BOOKINGS ENDPOINTS (/api/bookings)
  // ----------------------------------------------------
  if (pathname === '/api/bookings' || pathname === '/api/bookings/') {
    if (method === 'GET') {
      const statusParam = searchParams.get('status');
      if (statusParam) {
        return sendJson(res, 200, bookings.filter(b => b.status.toLowerCase() === statusParam.toLowerCase()));
      }
      return sendJson(res, 200, bookings);
    }

    if (method === 'POST') {
      const body = await parseBody(req);
      
      // Customer lookup or creation
      let customer = null;
      if (body.customerId) {
        customer = customers.find(c => c.id === parseInt(body.customerId, 10));
      }
      if (!customer && body.customerEmail) {
        customer = customers.find(c => c.email.toLowerCase() === body.customerEmail.toLowerCase());
      }
      if (!customer) {
        customer = {
          id: nextCustomerId++,
          name: body.customerName || 'Guest User',
          email: body.customerEmail || `guest${Date.now()}@example.com`,
          phone: body.customerPhone || '+91 90000 00000',
          idProofNumber: 'ID-' + Math.floor(100000 + Math.random() * 900000),
          address: 'India'
        };
        customers.push(customer);
      }

      // Room lookup
      let room = null;
      if (body.roomId) {
        room = rooms.find(r => r.id === parseInt(body.roomId, 10));
      }
      if (!room && body.roomNumber) {
        room = rooms.find(r => r.roomNumber === String(body.roomNumber));
      }
      if (!room) {
        room = rooms.find(r => r.status === 'AVAILABLE') || rooms[0];
      }

      // Calculate stay duration and total amount
      const checkIn = new Date(body.checkInDate || Date.now());
      const checkOut = new Date(body.checkOutDate || (Date.now() + 86400000));
      const diffDays = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
      const totalAmount = body.totalAmount ? parseFloat(body.totalAmount) : (room.pricePerNight * diffDays);

      const newBooking = {
        id: nextBookingId++,
        customer,
        room,
        checkInDate: body.checkInDate || new Date().toISOString().split('T')[0],
        checkOutDate: body.checkOutDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        totalAmount,
        status: (body.status || 'CONFIRMED').toUpperCase(),
        paymentStatus: (body.paymentStatus || 'PAID').toUpperCase(),
        specialRequests: body.specialRequests || '',
        bookingTime: new Date().toISOString()
      };

      // Mark room as BOOKED
      room.status = 'BOOKED';
      bookings.push(newBooking);
      return sendJson(res, 201, newBooking);
    }
  }

  const bookingStatusMatch = pathname.match(/^\/api\/bookings\/([^/]+)\/status\/?$/);
  if (bookingStatusMatch && (method === 'PATCH' || method === 'PUT')) {
    const bookingId = bookingStatusMatch[1];
    const body = await parseBody(req);
    const newStatus = body.status || searchParams.get('status');
    const booking = bookings.find(b => String(b.id) === bookingId);
    if (!booking) return sendJson(res, 404, { error: 'Booking not found' });
    if (newStatus) {
      booking.status = newStatus.toUpperCase();
      if (['CHECKED_OUT', 'CANCELLED'].includes(booking.status)) {
        if (booking.room) booking.room.status = 'AVAILABLE';
      }
    }
    return sendJson(res, 200, booking);
  }

  const singleBookingMatch = pathname.match(/^\/api\/bookings\/([^/]+)\/?$/);
  if (singleBookingMatch && !pathname.endsWith('/status')) {
    const bookingId = singleBookingMatch[1];
    const booking = bookings.find(b => String(b.id) === bookingId);

    if (method === 'GET') {
      if (!booking) return sendJson(res, 404, { error: 'Booking not found' });
      return sendJson(res, 200, booking);
    }

    if (method === 'DELETE') {
      const idx = bookings.findIndex(b => String(b.id) === bookingId);
      if (idx !== -1) {
        if (bookings[idx].room) bookings[idx].room.status = 'AVAILABLE';
        bookings.splice(idx, 1);
      }
      res.statusCode = 204;
      return res.end();
    }
  }

  // ----------------------------------------------------
  // CUSTOMERS ENDPOINTS (/api/customers)
  // ----------------------------------------------------
  if (pathname === '/api/customers' || pathname === '/api/customers/') {
    if (method === 'GET') {
      const search = searchParams.get('search');
      if (search) {
        const query = search.toLowerCase();
        return sendJson(res, 200, customers.filter(c => 
          (c.name && c.name.toLowerCase().includes(query)) ||
          (c.email && c.email.toLowerCase().includes(query)) ||
          (c.phone && c.phone.includes(query))
        ));
      }
      return sendJson(res, 200, customers);
    }

    if (method === 'POST') {
      const body = await parseBody(req);
      const newCustomer = {
        id: nextCustomerId++,
        name: body.name || 'New Customer',
        email: body.email || `customer${Date.now()}@example.com`,
        phone: body.phone || '+91 90000 00000',
        idProofNumber: body.idProofNumber || 'ID-' + Math.floor(100000 + Math.random() * 900000),
        address: body.address || 'India'
      };
      customers.push(newCustomer);
      return sendJson(res, 201, newCustomer);
    }
  }

  const singleCustomerMatch = pathname.match(/^\/api\/customers\/([^/]+)\/?$/);
  if (singleCustomerMatch) {
    const custId = singleCustomerMatch[1];
    const customer = customers.find(c => String(c.id) === custId);

    if (method === 'GET') {
      if (!customer) return sendJson(res, 404, { error: 'Customer not found' });
      return sendJson(res, 200, customer);
    }

    if (method === 'PUT') {
      if (!customer) return sendJson(res, 404, { error: 'Customer not found' });
      const body = await parseBody(req);
      Object.assign(customer, {
        name: body.name || customer.name,
        email: body.email || customer.email,
        phone: body.phone || customer.phone,
        idProofNumber: body.idProofNumber || customer.idProofNumber,
        address: body.address !== undefined ? body.address : customer.address
      });
      return sendJson(res, 200, customer);
    }

    if (method === 'DELETE') {
      customers = customers.filter(c => String(c.id) !== custId);
      res.statusCode = 204;
      return res.end();
    }
  }

  // ----------------------------------------------------
  // CONCIERGE SERVICES ENDPOINTS (/api/services)
  // ----------------------------------------------------
  if (pathname === '/api/services' || pathname === '/api/services/') {
    if (method === 'GET') {
      const statusParam = searchParams.get('status');
      if (statusParam) {
        return sendJson(res, 200, services.filter(s => s.status.toLowerCase() === statusParam.toLowerCase()));
      }
      return sendJson(res, 200, services);
    }

    if (method === 'POST') {
      const body = await parseBody(req);
      const newService = {
        id: nextServiceId++,
        serviceName: body.serviceName || 'Concierge Request',
        roomNumber: String(body.roomNumber || '101'),
        customerName: body.customerName || 'In-House Guest',
        cost: parseFloat(body.cost) || 0.0,
        status: (body.status || 'PENDING').toUpperCase(),
        notes: body.notes || '',
        requestedAt: new Date().toISOString()
      };
      services.push(newService);
      return sendJson(res, 201, newService);
    }
  }

  const serviceStatusMatch = pathname.match(/^\/api\/services\/([^/]+)\/status\/?$/);
  if (serviceStatusMatch && (method === 'PATCH' || method === 'PUT')) {
    const serviceId = serviceStatusMatch[1];
    const body = await parseBody(req);
    const newStatus = body.status || searchParams.get('status');
    const service = services.find(s => String(s.id) === serviceId);
    if (!service) return sendJson(res, 404, { error: 'Service request not found' });
    if (newStatus) service.status = newStatus.toUpperCase();
    return sendJson(res, 200, service);
  }

  const singleServiceMatch = pathname.match(/^\/api\/services\/([^/]+)\/?$/);
  if (singleServiceMatch && !pathname.endsWith('/status')) {
    const serviceId = singleServiceMatch[1];
    const service = services.find(s => String(s.id) === serviceId);

    if (method === 'GET') {
      if (!service) return sendJson(res, 404, { error: 'Service request not found' });
      return sendJson(res, 200, service);
    }

    if (method === 'DELETE') {
      services = services.filter(s => String(s.id) !== serviceId);
      res.statusCode = 204;
      return res.end();
    }
  }

  // ----------------------------------------------------
  // MANAGEMENT DASHBOARD STATS (/api/dashboard/stats)
  // ----------------------------------------------------
  if (pathname === '/api/dashboard/stats' || pathname === '/api/dashboard/stats/') {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status.toUpperCase() === 'AVAILABLE').length;
    const bookedRooms = rooms.filter(r => r.status.toUpperCase() === 'BOOKED').length;
    const maintenanceRooms = rooms.filter(r => r.status.toUpperCase() === 'MAINTENANCE').length;
    const totalCustomers = customers.length;
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => ['CONFIRMED', 'CHECKED_IN'].includes(b.status.toUpperCase())).length;
    const totalRevenue = bookings
      .filter(b => ['PAID', 'CONFIRMED'].includes(b.paymentStatus.toUpperCase()) || b.status.toUpperCase() === 'CONFIRMED')
      .reduce((sum, b) => sum + (parseFloat(b.totalAmount) || 0), 0);
    const pendingServices = services.filter(s => s.status.toUpperCase() === 'PENDING').length;

    return sendJson(res, 200, {
      totalRooms,
      availableRooms,
      bookedRooms,
      maintenanceRooms,
      totalCustomers,
      totalBookings,
      activeBookings,
      totalRevenue,
      pendingServices
    });
  }

  // Fallback 404
  return sendJson(res, 404, {
    error: 'Endpoint not found',
    requestedPath: pathname,
    availableEndpoints: [
      '/api/rooms',
      '/api/bookings',
      '/api/customers',
      '/api/services',
      '/api/dashboard/stats'
    ]
  });
};
