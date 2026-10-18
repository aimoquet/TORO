package com.hotel.management.service;

import com.hotel.management.dto.ServiceOrderRequest;
import com.hotel.management.model.ServiceRequest;
import com.hotel.management.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;

    @Autowired
    public HotelServiceRequestService(ServiceRequestRepository serviceRequestRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
    }

    public List<ServiceRequest> getAllServiceRequests() {
        return serviceRequestRepository.findAllByOrderByRequestTimeDesc();
    }

    public List<ServiceRequest> getServiceRequestsByStatus(String status) {
        return serviceRequestRepository.findByStatusIgnoreCase(status);
    }

    public Optional<ServiceRequest> getServiceRequestById(Long id) {
        return serviceRequestRepository.findById(id);
    }

    public ServiceRequest createServiceRequest(ServiceOrderRequest req) {
        ServiceRequest serviceRequest = new ServiceRequest(
                req.getServiceName(),
                req.getRoomNumber() != null ? req.getRoomNumber() : "General",
                req.getCustomerName() != null ? req.getCustomerName() : "Guest",
                req.getCost() != null ? req.getCost() : 0.0,
                "PENDING",
                req.getNotes()
        );
        return serviceRequestRepository.save(serviceRequest);
    }

    public ServiceRequest updateServiceStatus(Long id, String status) {
        return serviceRequestRepository.findById(id).map(req -> {
            req.setStatus(status.toUpperCase());
            return serviceRequestRepository.save(req);
        }).orElseThrow(() -> new RuntimeException("Service request not found with ID: " + id));
    }

    public void deleteServiceRequest(Long id) {
        serviceRequestRepository.deleteById(id);
    }
}
