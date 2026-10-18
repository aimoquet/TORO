package com.hotel.management.service;

import com.hotel.management.model.Customer;
import com.hotel.management.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Optional<Customer> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email);
    }

    public List<Customer> searchCustomers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return customerRepository.findAll();
        }
        return customerRepository.searchCustomers(keyword.trim());
    }

    public Customer saveCustomer(Customer customer) {
        // If customer exists with same email, update or return
        Optional<Customer> existing = customerRepository.findByEmail(customer.getEmail());
        if (existing.isPresent()) {
            Customer c = existing.get();
            c.setName(customer.getName());
            c.setPhone(customer.getPhone());
            if (customer.getIdProofNumber() != null) c.setIdProofNumber(customer.getIdProofNumber());
            if (customer.getAddress() != null) c.setAddress(customer.getAddress());
            return customerRepository.save(c);
        }
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer updated) {
        return customerRepository.findById(id).map(c -> {
            c.setName(updated.getName());
            c.setEmail(updated.getEmail());
            c.setPhone(updated.getPhone());
            c.setIdProofNumber(updated.getIdProofNumber());
            c.setAddress(updated.getAddress());
            return customerRepository.save(c);
        }).orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
