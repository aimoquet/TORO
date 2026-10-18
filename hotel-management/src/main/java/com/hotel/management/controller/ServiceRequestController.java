package com.hotel.management.controller;

import com.hotel.management.dto.ServiceOrderRequest;
import com.hotel.management.model.ServiceRequest;
import com.hotel.management.service.HotelServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceRequestController {

    private final HotelServiceRequestService serviceRequestService;

    @Autowired
    public ServiceRequestController(HotelServiceRequestService serviceRequestService) {
        this.serviceRequestService = serviceRequestService;
    }

    @GetMapping
    public List<ServiceRequest> getAllServices(@RequestParam(required = false) String status) {
        if (status != null && !status.isBlank()) {
            return serviceRequestService.getServiceRequestsByStatus(status);
        }
        return serviceRequestService.getAllServiceRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceRequest> getServiceById(@PathVariable Long id) {
        return serviceRequestService.getServiceRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ServiceRequest> createServiceRequest(@RequestBody ServiceOrderRequest req) {
        ServiceRequest created = serviceRequestService.createServiceRequest(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ServiceRequest> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(serviceRequestService.updateServiceStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceRequestService.deleteServiceRequest(id);
        return ResponseEntity.noContent().build();
    }
}
