package com.hotel.management.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String serviceName; // Food Service, Laundry, Room Service, Spa, Airport Shuttle

    @Column(nullable = false)
    private String roomNumber;

    private String customerName;

    private Double cost;

    @Column(nullable = false)
    private String status; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED

    private LocalDateTime requestTime;

    private String notes;

    public ServiceRequest() {
        this.requestTime = LocalDateTime.now();
        this.status = "PENDING";
    }

    public ServiceRequest(String serviceName, String roomNumber, String customerName, Double cost, String status, String notes) {
        this.serviceName = serviceName;
        this.roomNumber = roomNumber;
        this.customerName = customerName;
        this.cost = cost != null ? cost : 0.0;
        this.status = status != null ? status : "PENDING";
        this.requestTime = LocalDateTime.now();
        this.notes = notes;
    }

    @PrePersist
    public void prePersist() {
        if (this.requestTime == null) {
            this.requestTime = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequestTime() {
        return requestTime;
    }

    public void setRequestTime(LocalDateTime requestTime) {
        this.requestTime = requestTime;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
