package com.nexttrip2.server.service.imple;

import com.nexttrip2.server.dto.*;
import com.nexttrip2.server.responses.TripPlanResponse;
import com.nexttrip2.server.model.*;
import com.nexttrip2.server.repository.TripRepository;
import com.nexttrip2.server.service.ITripService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService implements ITripService {

    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    @Override
    public Trip createTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    @Override
    public List<Trip> getTripsByUserId(String userId) {
        return tripRepository.findByUserId(userId);
    }

    @Override
    public Trip reorderTripPlaces(String tripId, List<String> placeIdsInOrder) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() ->
                new RuntimeException("Trip not found with id: " + tripId)
        );

        List<TripPlace> places = trip.getPlaces();

        for (int i = 0; i < placeIdsInOrder.size(); i++) {
            String placeId = placeIdsInOrder.get(i);
            for (TripPlace place : places) {
                if (place.getPlaceId().equals(placeId)) {
                    place.setOrderIndex(i);
                    break;
                }
            }
        }

        trip.setPlaces(places);
        return tripRepository.save(trip);
    }

    @Override
    public Trip updateTripStatus(String tripId, String newStatus) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() ->
                new RuntimeException("Trip not found with id: " + tripId)
        );

        try {
            trip.setStatus(TripStatus.valueOf(newStatus.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value: " + newStatus);
        }

        return tripRepository.save(trip);
    }

    @Override
    public Trip updateTripPlace(String tripId, TripPlaceDto updatedPlaceDto) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() ->
                new RuntimeException("Trip not found with id: " + tripId)
        );

        List<TripPlace> places = trip.getPlaces();

        boolean updated = false;
        for (TripPlace place : places) {
            if (place.getPlaceId().equals(updatedPlaceDto.getPlaceId())) {
                place.setName(updatedPlaceDto.getName());
                place.setAddress(updatedPlaceDto.getAddress());
                place.setDescription(updatedPlaceDto.getDescription());
                place.setPrice(updatedPlaceDto.getPrice());
                place.setOrderIndex(updatedPlaceDto.getOrderIndex());
                place.setStartTime(updatedPlaceDto.getStartTime());
                place.setEndTime(updatedPlaceDto.getEndTime());
                place.setMenu(updatedPlaceDto.getMenu());
                place.setNote(updatedPlaceDto.getNote());
                updated = true;
                break;
            }
        }

        if (!updated) {
            throw new RuntimeException("Place not found in trip: " + updatedPlaceDto.getPlaceId());
        }

        trip.setPlaces(places);
        return tripRepository.save(trip);
    }

    // ✅ GET Trip Plan
    @Override
    public TripPlanResponse getTripPlan(String tripId) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() ->
                new RuntimeException("Trip not found with id: " + tripId)
        );

        TripPlanResponse response = new TripPlanResponse();
        response.setBudget(trip.getBudget().stream()
                .map(this::toBudgetItemDto)
                .collect(Collectors.toList()));
        response.setSchedule(trip.getSchedule().stream()
                .map(this::toScheduleItemDto)
                .collect(Collectors.toList()));

        return response;
    }

    // ✅ UPDATE Trip Plan
    @Override
    public TripPlanResponse updateTripPlan(String tripId, TripPlanDto planDto) {
        Trip trip = tripRepository.findById(tripId).orElseThrow(() ->
                new RuntimeException("Trip not found with id: " + tripId)
        );

        trip.setBudget(planDto.getBudget().stream()
                .map(this::toBudgetItem)
                .collect(Collectors.toList()));
        trip.setSchedule(planDto.getSchedule().stream()
                .map(this::toScheduleItem)
                .collect(Collectors.toList()));

        tripRepository.save(trip);

        TripPlanResponse response = new TripPlanResponse();
        response.setBudget(planDto.getBudget());
        response.setSchedule(planDto.getSchedule());
        return response;
    }

    // 🔧 Convert Model ➔ DTO
    private BudgetItemDto toBudgetItemDto(BudgetItem item) {
        return new BudgetItemDto(
                item.getCategory(),
                item.getName(),
                item.getQuantity(),
                item.getEstimate(),
                item.getTotal(),
                item.getNote()
        );
    }

    private ScheduleItemDto toScheduleItemDto(ScheduleItem item) {
        return new ScheduleItemDto(
                item.getTime(),
                item.getLocation(),
                item.getActivity(),
                item.getNote()
        );
    }

    // 🔧 Convert DTO ➔ Model
    private BudgetItem toBudgetItem(BudgetItemDto dto) {
        return new BudgetItem(
                dto.getCategory(),
                dto.getName(),
                dto.getQuantity(),
                dto.getEstimate(),
                dto.getTotal(),
                dto.getNote()
        );
    }

    private ScheduleItem toScheduleItem(ScheduleItemDto dto) {
        return new ScheduleItem(
                dto.getTime(),
                dto.getLocation(),
                dto.getActivity(),
                dto.getNote()
        );
    }

    @Override
    public Trip getTripById(String tripId) {
        return tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + tripId));
    }

}
