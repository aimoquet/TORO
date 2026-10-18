package com.hotel.management.service;

import com.hotel.management.model.Room;
import com.hotel.management.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getRoomsByStatus(String status) {
        return roomRepository.findByStatusIgnoreCase(status);
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByStatusIgnoreCase("AVAILABLE");
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public Optional<Room> getRoomByNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber);
    }

    public Room saveRoom(Room room) {
        if (room.getStatus() == null || room.getStatus().isBlank()) {
            room.setStatus("AVAILABLE");
        }
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room updatedRoom) {
        return roomRepository.findById(id).map(existing -> {
            existing.setRoomNumber(updatedRoom.getRoomNumber());
            existing.setRoomType(updatedRoom.getRoomType());
            existing.setPricePerNight(updatedRoom.getPricePerNight());
            if (updatedRoom.getStatus() != null) {
                existing.setStatus(updatedRoom.getStatus());
            }
            existing.setAmenities(updatedRoom.getAmenities());
            existing.setCapacity(updatedRoom.getCapacity());
            existing.setDescription(updatedRoom.getDescription());
            return roomRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Room not found with ID: " + id));
    }

    public Room updateRoomStatus(Long id, String newStatus) {
        return roomRepository.findById(id).map(existing -> {
            existing.setStatus(newStatus.toUpperCase());
            return roomRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Room not found with ID: " + id));
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}
