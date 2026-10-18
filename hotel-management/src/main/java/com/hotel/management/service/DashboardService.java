package com.hotel.management.service;

import com.hotel.management.dto.DashboardStats;
import com.hotel.management.repository.BookingRepository;
import com.hotel.management.repository.CustomerRepository;
import com.hotel.management.repository.RoomRepository;
import com.hotel.management.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final RoomRepository roomRepository;
    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRequestRepository serviceRequestRepository;

    @Autowired
    public DashboardService(RoomRepository roomRepository, CustomerRepository customerRepository, BookingRepository bookingRepository, ServiceRequestRepository serviceRequestRepository) {
        this.roomRepository = roomRepository;
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
        this.serviceRequestRepository = serviceRequestRepository;
    }

    public DashboardStats getDashboardStats() {
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.countByStatusIgnoreCase("AVAILABLE");
        long bookedRooms = roomRepository.countByStatusIgnoreCase("BOOKED");
        long maintenanceRooms = roomRepository.countByStatusIgnoreCase("MAINTENANCE");

        long totalCustomers = customerRepository.count();
        long totalBookings = bookingRepository.count();
        long activeBookings = bookingRepository.countByStatusIgnoreCase("CONFIRMED")
                + bookingRepository.countByStatusIgnoreCase("CHECKED_IN");

        Double revenue = bookingRepository.calculateTotalRevenue();
        double totalRevenue = revenue != null ? revenue : 0.0;

        long pendingServices = serviceRequestRepository.countByStatusIgnoreCase("PENDING");

        return new DashboardStats(
                totalRooms,
                availableRooms,
                bookedRooms,
                maintenanceRooms,
                totalCustomers,
                totalBookings,
                activeBookings,
                totalRevenue,
                pendingServices
        );
    }
}
