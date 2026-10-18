package com.hotel.management.repository;

import com.hotel.management.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByStatusIgnoreCase(String status);
    List<ServiceRequest> findAllByOrderByRequestTimeDesc();
    long countByStatusIgnoreCase(String status);
}
