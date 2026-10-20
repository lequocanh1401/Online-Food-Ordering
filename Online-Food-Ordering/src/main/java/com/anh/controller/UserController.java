package com.anh.controller;

import com.anh.model.Address;
import com.anh.model.User;
import com.anh.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> findUserByJwtToken(@RequestHeader("Authorization") String jwt) throws Exception {
        // Lấy token từ Header, đưa cho UserService xử lý
        User user = userService.findUserByJwtToken(jwt);

        // Trả về thông tin User kèm mã 200 OK
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateUserProfile(
            @RequestHeader("Authorization") String jwt,
            @RequestBody User userDetails) throws Exception {
        User updatedUser = userService.updateUserProfile(jwt, userDetails);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PutMapping("/profile/address")
    public ResponseEntity<User> addAddressToUser(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Address address) throws Exception {
        User user = userService.addAddressToUser(jwt, address);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/profile/address/{addressId}")
    public ResponseEntity<User> deleteAddressFromUser(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long addressId) throws Exception {
        User user = userService.deleteAddressFromUser(jwt, addressId);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/profile/address/{addressId}")
    public ResponseEntity<User> updateAddress(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long addressId,
            @RequestBody Address addressDetails) throws Exception {
        User user = userService.updateAddress(jwt, addressId, addressDetails);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}