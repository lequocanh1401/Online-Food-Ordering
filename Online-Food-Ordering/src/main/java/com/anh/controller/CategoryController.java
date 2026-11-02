package com.anh.controller;

import com.anh.model.Category;
import com.anh.model.User;
import com.anh.response.MessageResponse;
import com.anh.service.CategoryService;
import com.anh.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;
    @Autowired
    private UserService userService;

    @PostMapping("/admin/category")
    public ResponseEntity<Category> createCategory(
            @RequestBody Category category,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Category createdCategory = categoryService.createCategory(category.getName(), user.getId());
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @GetMapping("/category/restaurant/{id}")
    public ResponseEntity<List<Category>> getRestaurantCategory(
            @PathVariable Long id) throws Exception {
        List<Category> categories = categoryService.findCategoryByRestaurantId(id);
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }

    @PutMapping("/admin/category/{id}")
    public ResponseEntity<Category> updateCategory(
            @PathVariable Long id,
            @RequestBody Category category,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Category updatedCategory = categoryService.updateCategory(id, category.getName());
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    @DeleteMapping("/admin/category/{id}")
    public ResponseEntity<MessageResponse> deleteCategory(
            @PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        categoryService.deleteCategory(id);
        MessageResponse res = new MessageResponse();
        res.setMessage("Category deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}