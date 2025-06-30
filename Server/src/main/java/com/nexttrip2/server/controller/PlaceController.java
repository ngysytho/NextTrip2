package com.nexttrip2.server.controller;

import com.nexttrip2.server.service.PlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "*")
public class PlaceController {

    private final PlaceService placeService;

    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    @GetMapping("/category/{type}")
    public ResponseEntity<Map<String, Object>> getByTypeWithPagination(
            @PathVariable String type,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int limit
    ) {
        System.out.println("API CALLED with type: " + type + ", page: " + page + ", limit: " + limit);
        Map<String, Object> result = placeService.getPlacesByTypeWithPagination(type, page, limit);
        return ResponseEntity.ok(result);
    }

}
