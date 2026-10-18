package com.hotel.management.config;

import com.hotel.management.model.Booking;
import com.hotel.management.model.Customer;
import com.hotel.management.model.Room;
import com.hotel.management.model.ServiceRequest;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.CustomerRepository;
import com.hotel.management.repository.RoomRepository;
import com.hotel.management.repository.ServiceRequestRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRequestRepository serviceRequestRepository;

    public DataInitializer(RoomRepository roomRepository,
                           CustomerRepository customerRepository,
                           BookingRepository bookingRepository,
                           ServiceRequestRepository serviceRequestRepository) {
        this.roomRepository = roomRepository;
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
        this.serviceRequestRepository = serviceRequestRepository;
    }

    @Override
    public void run(String... args) {
        if (roomRepository.count() == 0) {
            Room r101 = new Room("101", "SINGLE", 2000.0, "AVAILABLE", "High-speed WiFi, Single Bed, Smart TV, AC", 1, "Comfortable single room ideal for solo travelers and business guests.");
            Room r102 = new Room("102", "DELUXE", 3500.0, "BOOKED", "WiFi, King Bed, 55\" Smart TV, Mini Bar, Balcony", 2, "Spacious room with modern interiors and city skyline view.");
            Room r103 = new Room("103", "SUITE", 5500.0, "AVAILABLE", "King Bed, Jacuzzi, Private Lounge, Free Breakfast, Ocean View", 3, "Luxury suite with panoramic views and dedicated concierge service.");
            Room r104 = new Room("104", "DELUXE", 4800.0, "AVAILABLE", "2 Queen Beds, Bathtub, Living Area, Kids Pack", 4, "Perfect setup for family vacation with maximum comfort.");
            Room r201 = new Room("201", "SUITE", 9500.0, "AVAILABLE", "Private Terrace, Butler Service, Kitchenette, Marble Bath", 4, "Ultimate luxury experience tailored for distinguished guests.");
            Room r202 = new Room("202", "DOUBLE", 3000.0, "MAINTENANCE", "Queen Bed, AC, Work Desk, Rain Shower", 2, "Scheduled routine maintenance and deep sanitization.");

            roomRepository.saveAll(List.of(r101, r102, r103, r104, r201, r202));
        }

        if (customerRepository.count() == 0) {
            Customer c1 = new Customer("Aarav Sharma", "aarav.sharma@example.com", "+91 98765 43210", "1234-5678-9012", "Mumbai, Maharashtra");
            Customer c2 = new Customer("Priya Patel", "priya.patel@example.com", "+91 98123 45678", "Z1234567", "Ahmedabad, Gujarat");
            Customer c3 = new Customer("Rohan Mehta", "rohan.mehta@example.com", "+91 97234 56789", "4321-8765-2109", "Bangalore, Karnataka");
            Customer c4 = new Customer("Ananya Iyer", "ananya.iyer@example.com", "+91 96345 67890", "P9876543", "Chennai, Tamil Nadu");

            customerRepository.saveAll(List.of(c1, c2, c3, c4));
        }

        if (bookingRepository.count() == 0) {
            customerRepository.findByEmail("priya.patel@example.com").ifPresent(customer -> {
                roomRepository.findByRoomNumber("102").ifPresent(room -> {
                    Booking booking = new Booking(
                            customer,
                            room,
                            LocalDate.now(),
                            LocalDate.now().plusDays(3),
                            10500.0,
                            "CONFIRMED",
                            "PAID",
                            "Late check-in requested (after 8 PM)"
                    );
                    bookingRepository.save(booking);
                });
            });
        }

        if (serviceRequestRepository.count() == 0) {
            ServiceRequest s1 = new ServiceRequest("Room Dining (Gourmet Breakfast)", "102", "Priya Patel", 750.0, "IN_PROGRESS", "Deliver at 8:30 AM with extra coffee");
            ServiceRequest s2 = new ServiceRequest("Laundry & Dry Clean", "101", "Aarav Sharma", 350.0, "PENDING", "Express wash for 2 shirts");
            ServiceRequest s3 = new ServiceRequest("Airport Transfer", "103", "Rohan Mehta", 1200.0, "COMPLETED", "Pickup from Terminal 2 at 4 PM");

            serviceRequestRepository.saveAll(List.of(s1, s2, s3));
        }
    }
}
