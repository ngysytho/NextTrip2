package com.nexttrip2.server.service;

import com.nexttrip2.server.dto.TripPlanDto;
import com.nexttrip2.server.dto.TripPlaceDto;
import com.nexttrip2.server.model.Trip;
import com.nexttrip2.server.responses.TripPlanResponse;

import java.util.List;

/**
 * Interface service xử lý nghiệp vụ Trip
 */
public interface ITripService {

    /**
     * Tạo mới một chuyến đi
     * @param trip Trip cần tạo
     * @return Trip đã được lưu
     */
    Trip createTrip(Trip trip);

    /**
     * Lấy danh sách trip theo userId
     * @param userId id của user
     * @return danh sách Trip
     */
    List<Trip> getTripsByUserId(String userId);

    /**
     * Sắp xếp lại thứ tự các place trong trip
     * @param tripId id của trip
     * @param placeIdsInOrder danh sách placeIds theo thứ tự mới
     * @return Trip sau khi reorder
     */
    Trip reorderTripPlaces(String tripId, List<String> placeIdsInOrder);

    /**
     * Cập nhật status của trip
     * @param tripId id của trip
     * @param status status mới
     * @return Trip đã update status
     */
    Trip updateTripStatus(String tripId, String status);

    /**
     * Cập nhật 1 place cụ thể trong trip
     * @param tripId id của trip
     * @param updatedPlaceDto thông tin place mới
     * @return Trip đã update place
     */
    Trip updateTripPlace(String tripId, TripPlaceDto updatedPlaceDto);

    /**
     * Lấy Trip Plan (budget + schedule)
     * @param tripId id của trip
     * @return TripPlanResponse
     */
    TripPlanResponse getTripPlan(String tripId);

    /**
     * Update Trip Plan (budget + schedule)
     * @param tripId id của trip
     * @param plan TripPlanDto mới
     * @return TripPlanResponse
     */
    TripPlanResponse updateTripPlan(String tripId, TripPlanDto plan);

    /**
     * Lấy chi tiết 1 trip theo tripId
     * @param tripId id của trip
     * @return Trip chi tiết
     */
    Trip getTripById(String tripId);
}
