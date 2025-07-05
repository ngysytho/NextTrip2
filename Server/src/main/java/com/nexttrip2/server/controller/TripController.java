package com.nexttrip2.server.controller;

import com.nexttrip2.server.dto.TripPlaceDto;
import com.nexttrip2.server.dto.TripPlanDto;
import com.nexttrip2.server.model.Trip;
import com.nexttrip2.server.responses.TripPlanResponse; // ✅ Import response
import com.nexttrip2.server.service.ITripService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final ITripService tripService;

    public TripController(ITripService tripService) {
        this.tripService = tripService;
    }

    // ✅ Tạo mới chuyến đi
    @PostMapping
    public Trip createTrip(@RequestBody Trip trip) {
        return tripService.createTrip(trip);
    }

    // ✅ Lấy danh sách chuyến đi theo userId
    @GetMapping("/user/{userId}")
    public List<Trip> getTrips(@PathVariable String userId) {
        return tripService.getTripsByUserId(userId);
    }

    // ✅ Sắp xếp lại thứ tự places trong trip
    @PutMapping("/{tripId}/reorder")
    public Trip reorderTripPlaces(@PathVariable String tripId, @RequestBody List<String> placeIdsInOrder) {
        return tripService.reorderTripPlaces(tripId, placeIdsInOrder);
    }

    // ✅ Cập nhật status chuyến đi
    @PutMapping("/{tripId}/status")
    public Trip updateTripStatus(@PathVariable String tripId, @RequestParam String status) {
        return tripService.updateTripStatus(tripId, status);
    }

    // ✅ Cập nhật 1 place cụ thể trong trip
    @PatchMapping("/{tripId}/places")
    public Trip updateTripPlace(
        @PathVariable String tripId,
        @RequestBody TripPlaceDto placeDto
    ) {
        return tripService.updateTripPlace(tripId, placeDto);
    }

    // ✅ Get plan
    @GetMapping("/{tripId}/plan")
    public TripPlanResponse getTripPlan(@PathVariable String tripId) {
        return tripService.getTripPlan(tripId);
    }

    // ✅ Update plan
    @PutMapping("/{tripId}/plan")
    public TripPlanResponse updateTripPlan(@PathVariable String tripId, @RequestBody TripPlanDto plan) {
        return tripService.updateTripPlan(tripId, plan);
    }

    // ✅ Get trip by id
    @GetMapping("/{tripId}")
    public Trip getTripById(@PathVariable String tripId) {
        return tripService.getTripById(tripId);
    }


}
