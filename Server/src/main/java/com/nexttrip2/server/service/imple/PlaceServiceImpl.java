package com.nexttrip2.server.service.imple;

import com.nexttrip2.server.model.Place;
import com.nexttrip2.server.repository.PlaceRepository;
import com.nexttrip2.server.service.PlaceService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PlaceServiceImpl implements PlaceService {

    private final PlaceRepository placeRepository;

    public PlaceServiceImpl(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    @Override
    public Map<String, Object> getPlacesByGroupTypeWithPagination(String group_type, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit + 1);

        // 🔧 Gọi method ignore case mới
        Page<Place> placesPage = placeRepository.findByGroupTypeIgnoreCaseOrderByCreatedAtDesc(group_type, pageable);
        List<Place> places = placesPage.getContent();

        boolean hasMore = places.size() > limit;
        if (hasMore) {
            places = places.subList(0, limit);
        }

        // ✅ Logging kết quả
        System.out.println("✅ Found " + places.size() + " places for groupType: " + group_type);

        Map<String, Object> response = new HashMap<>();
        response.put("data", places);
        response.put("hasMore", hasMore);
        return response;
    }
}
