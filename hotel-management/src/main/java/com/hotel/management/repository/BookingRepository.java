package com.hotel.management.repository;

import com.hotel.management.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStatusIgnoreCase(String status);
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByRoomId(Long roomId);
    List<Booking> findAllByOrderByBookingTimeDesc();

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.status <> 'CANCELLED'")
    Double calculateTotalRevenue();

    @Query("SELECT COUNT(DISTINCT b.customer.id) FROM Booking b")
    Long countDistinctCustomersBooked();

    long countByStatusIgnoreCase(String status);
}
