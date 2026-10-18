package com.hotel.management.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HotelController {

    @GetMapping("/api/test")
    public String test() {
        return "Hotel Management System Backend is Working!";
    }
}