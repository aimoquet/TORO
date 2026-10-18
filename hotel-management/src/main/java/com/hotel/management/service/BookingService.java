package com.hotel.management.service;

import com.hotel.management.dto.BookingRequest;
import com.hotel.management.model.Booking;
import com.hotel.management.model.Customer;
import com.hotel.management.model.Room;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.CustomerRepository;
import com.hotel.management.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final RoomRepository roomRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository, CustomerRepository customerRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingTimeDesc();
    }

    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatusIgnoreCase(status);
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    @Transactional
    public Booking createBooking(BookingRequest req) {
        // 1. Resolve Customer
        Customer customer;
        if (req.getCustomerId() != null) {
            customer = customerRepository.findById(req.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + req.getCustomerId()));
        } else if (req.getCustomerEmail() != null && !req.getCustomerEmail().isBlank()) {
            customer = customerRepository.findByEmail(req.getCustomerEmail().trim())
                    .orElseGet(() -> {
                        Customer newCust = new Customer(
                                req.getCustomerName() != null ? req.getCustomerName() : "Guest",
                                req.getCustomerEmail().trim(),
                                req.getCustomerPhone() != null ? req.getCustomerPhone() : "N/A",
                                null,
                                null
                        );
                        return customerRepository.save(newCust);
                    });
        } else if (req.getCustomerName() != null && !req.getCustomerName().isBlank()) {
            // Find by name or create
            String email = req.getCustomerName().toLowerCase().replaceAll("\\s+", ".") + "@hotelguest.com";
            customer = customerRepository.findByEmail(email)
                    .orElseGet(() -> customerRepository.save(new Customer(
                            req.getCustomerName(),
                            email,
                            req.getCustomerPhone() != null ? req.getCustomerPhone() : "N/A",
                            null,
                            null
                    )));
        } else {
            throw new IllegalArgumentException("Customer details (name/email/id) are required.");
        }

        // 2. Resolve Room
        Room room;
        if (req.getRoomId() != null) {
            room = roomRepository.findById(req.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found with ID: " + req.getRoomId()));
        } else if (req.getRoomNumber() != null && !req.getRoomNumber().isBlank()) {
            room = roomRepository.findByRoomNumber(req.getRoomNumber().trim())
                    .orElseThrow(() -> new RuntimeException("Room not found with number: " + req.getRoomNumber()));
        } else {
            throw new IllegalArgumentException("Room ID or Room number is required.");
        }

        // 3. Dates & Price calculation
        LocalDate checkIn = req.getCheckInDate() != null ? req.getCheckInDate() : LocalDate.now();
        LocalDate checkOut = req.getCheckOutDate() != null ? req.getCheckOutDate() : checkIn.plusDays(1);
        if (checkOut.isBefore(checkIn)) {
            throw new IllegalArgumentException("Check-out date cannot be earlier than check-in date.");
        }

        long days = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (days <= 0) {
            days = 1; // Minimum 1 day stay
        }

        double totalAmount = room.getPricePerNight() * days;

        // 4. Update room status to BOOKED
        room.setStatus("BOOKED");
        roomRepository.save(room);

        // 5. Create Booking
        Booking booking = new Booking(
                customer,
                room,
                checkIn,
                checkOut,
                totalAmount,
                "CONFIRMED",
                req.getPaymentStatus() != null ? req.getPaymentStatus() : "PAID",
                req.getSpecialRequests()
        );

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking updateBookingStatus(Long id, String newStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        String upperStatus = newStatus.toUpperCase();
        booking.setStatus(upperStatus);

        Room room = booking.getRoom();
        if ("CHECKED_OUT".equals(upperStatus) || "CANCELLED".equals(upperStatus)) {
            room.setStatus("AVAILABLE");
            roomRepository.save(room);
        } else if ("CHECKED_IN".equals(upperStatus) || "CONFIRMED".equals(upperStatus)) {
            room.setStatus("BOOKED");
            roomRepository.save(room);
        }

        return bookingRepository.save(booking);
    }

    @Transactional
    public void deleteBooking(Long id) {
        bookingRepository.findById(id).ifPresent(booking -> {
            if ("CONFIRMED".equalsIgnoreCase(booking.getStatus()) || "CHECKED_IN".equalsIgnoreCase(booking.getStatus())) {
                Room room = booking.getRoom();
                room.setStatus("AVAILABLE");
                roomRepository.save(room);
            }
            bookingRepository.delete(booking);
        });
    }
}
