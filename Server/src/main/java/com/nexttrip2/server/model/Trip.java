package com.nexttrip2.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "trips")
public class Trip {

    @Id
    private String id;

    private String userId;
    private String tripName;
    private String pickupAddress;
    private String returnAddress;
    private String startDate;
    private String endDate;
    private TripStatus status; // ✅ enum status

    private List<TripPlace> places;

    // ✅ new fields: dùng model thay vì DTO
    private List<BudgetItem> budget = new ArrayList<>();
    private List<ScheduleItem> schedule = new ArrayList<>();

    // === GETTERS & SETTERS ===

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTripName() { return tripName; }
    public void setTripName(String tripName) { this.tripName = tripName; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public String getReturnAddress() { return returnAddress; }
    public void setReturnAddress(String returnAddress) { this.returnAddress = returnAddress; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public TripStatus getStatus() { return status; }
    public void setStatus(TripStatus status) { this.status = status; }

    public List<TripPlace> getPlaces() { return places; }
    public void setPlaces(List<TripPlace> places) { this.places = places; }

    public List<BudgetItem> getBudget() { return budget; }
    public void setBudget(List<BudgetItem> budget) { this.budget = budget; }

    public List<ScheduleItem> getSchedule() { return schedule; }
    public void setSchedule(List<ScheduleItem> schedule) { this.schedule = schedule; }
}
