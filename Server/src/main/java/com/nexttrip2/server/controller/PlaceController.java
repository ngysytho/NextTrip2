package com.nexttrip2.server.controller;

import com.nexttrip2.server.service.PlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "*") // ✅ CORS config tạm thời, nên cấu hình cụ thể domain production
public class PlaceController {

    private final PlaceService placeService;

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

}
