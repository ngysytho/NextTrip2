package com.nexttrip2.server.model;

public class ScheduleItem {

    private String time;
    private String location;
    private String activity;
    private String note;

    public ScheduleItem() {}

    public ScheduleItem(String time, String location, String activity, String note) {
        this.time = time;
        this.location = location;
        this.activity = activity;
        this.note = note;
    }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getActivity() { return activity; }
    public void setActivity(String activity) { this.activity = activity; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}