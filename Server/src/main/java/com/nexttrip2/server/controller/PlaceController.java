package com.nexttrip2.server.controller;

import com.nexttrip2.server.model.Place;
import com.nexttrip2.server.repository.PlaceRepository;
import com.nexttrip2.server.service.PlaceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "*") // ✅ CORS config tạm thời, nên cấu hình cụ thể domain production
public class PlaceController {

    private final PlaceService placeService;
    @Autowired
    private PlaceRepository placeRepository;


    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    @GetMapping("/category/{groupType}")
    public ResponseEntity<Map<String, Object>> getByGroupTypeWithPagination(
            @PathVariable String groupType,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int limit
    ) {
        groupType = URLDecoder.decode(groupType, StandardCharsets.UTF_8);
        
        System.out.println("➡️ API CALLED with groupType: " + groupType + ", page: " + page + ", limit: " + limit);

        Map<String, Object> result = placeService.getPlacesByGroupTypeWithPagination(groupType, page, limit);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlaceById(@PathVariable String id) {
        Optional<Place> place = placeRepository.findById(id);
        if (place.isPresent()) {
            return ResponseEntity.ok(place.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}