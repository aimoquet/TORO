package com.hotel.management.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roomNumber;

    @Column(nullable = false)
    private String roomType; // SINGLE, DOUBLE, DELUXE, SUITE, PRESIDENTIAL

    @Column(nullable = false)
    private Double pricePerNight;

    @Column(nullable = false)
    private String status; // AVAILABLE, BOOKED, MAINTENANCE

    private String amenities; // e.g. "WiFi, AC, TV, Mini Bar, Ocean View"

    private Integer capacity;

    private String description;

    public Room() {
    }

    public Room(String roomNumber, String roomType, Double pricePerNight, String status, String amenities, Integer capacity, String description) {
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.pricePerNight = pricePerNight;
        this.status = status != null ? status : "AVAILABLE";
        this.amenities = amenities;
        this.capacity = capacity != null ? capacity : 2;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public Double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(Double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
