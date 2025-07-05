package com.nexttrip2.server.responses;

import com.nexttrip2.server.dto.BudgetItemDto;
import com.nexttrip2.server.dto.ScheduleItemDto;
import java.util.List;

public class TripPlanResponse {

    private List<BudgetItemDto> budget;
    private List<ScheduleItemDto> schedule;

    public TripPlanResponse() {}

    public TripPlanResponse(List<BudgetItemDto> budget, List<ScheduleItemDto> schedule) {
        this.budget = budget;
        this.schedule = schedule;
    }

    public List<BudgetItemDto> getBudget() { return budget; }
    public void setBudget(List<BudgetItemDto> budget) { this.budget = budget; }

    public List<ScheduleItemDto> getSchedule() { return schedule; }
    public void setSchedule(List<ScheduleItemDto> schedule) { this.schedule = schedule; }
}
