package com.hotel.management.dto;

public class DashboardStats {
    private long totalRooms;
    private long availableRooms;
    private long bookedRooms;
    private long maintenanceRooms;
    private long totalCustomers;
    private long totalBookings;
    private long activeBookings;
    private double totalRevenue;
    private long pendingServices;
    private long totalUsersBooked;
    private long uniqueGuestsBooked;

    public DashboardStats() {
    }

    public DashboardStats(long totalRooms, long availableRooms, long bookedRooms, long maintenanceRooms, long totalCustomers, long totalBookings, long activeBookings, double totalRevenue, long pendingServices, long totalUsersBooked) {
        this.totalRooms = totalRooms;
        this.availableRooms = availableRooms;
        this.bookedRooms = bookedRooms;
        this.maintenanceRooms = maintenanceRooms;
        this.totalCustomers = totalCustomers;
        this.totalBookings = totalBookings;
        this.activeBookings = activeBookings;
        this.totalRevenue = totalRevenue;
        this.pendingServices = pendingServices;
        this.totalUsersBooked = totalUsersBooked;
        this.uniqueGuestsBooked = totalUsersBooked;
    }

    public DashboardStats(long totalRooms, long availableRooms, long bookedRooms, long maintenanceRooms, long totalCustomers, long totalBookings, long activeBookings, double totalRevenue, long pendingServices) {
        this(totalRooms, availableRooms, bookedRooms, maintenanceRooms, totalCustomers, totalBookings, activeBookings, totalRevenue, pendingServices, 0);
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public long getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(long availableRooms) {
        this.availableRooms = availableRooms;
    }

    public long getBookedRooms() {
        return bookedRooms;
    }

    public void setBookedRooms(long bookedRooms) {
        this.bookedRooms = bookedRooms;
    }

    public long getMaintenanceRooms() {
        return maintenanceRooms;
    }

    public void setMaintenanceRooms(long maintenanceRooms) {
        this.maintenanceRooms = maintenanceRooms;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getActiveBookings() {
        return activeBookings;
    }

    public void setActiveBookings(long activeBookings) {
        this.activeBookings = activeBookings;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getPendingServices() {
        return pendingServices;
    }

    public void setPendingServices(long pendingServices) {
        this.pendingServices = pendingServices;
    }

    public long getTotalUsersBooked() {
        return totalUsersBooked;
    }

    public void setTotalUsersBooked(long totalUsersBooked) {
        this.totalUsersBooked = totalUsersBooked;
        this.uniqueGuestsBooked = totalUsersBooked;
    }

    public long getUniqueGuestsBooked() {
        return uniqueGuestsBooked;
    }

    public void setUniqueGuestsBooked(long uniqueGuestsBooked) {
        this.uniqueGuestsBooked = uniqueGuestsBooked;
    }
}
