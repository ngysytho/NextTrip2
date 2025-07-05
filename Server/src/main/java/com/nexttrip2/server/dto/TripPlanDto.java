package com.nexttrip2.server.dto;

import java.util.List;

public class TripPlanDto {
    private List<BudgetItemDto> budget;
    private List<ScheduleItemDto> schedule;

    public List<BudgetItemDto> getBudget() { return budget; }
    public void setBudget(List<BudgetItemDto> budget) { this.budget = budget; }

    public List<ScheduleItemDto> getSchedule() { return schedule; }
    public void setSchedule(List<ScheduleItemDto> schedule) { this.schedule = schedule; }
}
