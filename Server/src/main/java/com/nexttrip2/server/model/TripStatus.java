package com.nexttrip2.server.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TripStatus {
    UPCOMING, ONGOING, COMPLETED, CANCELLED, DRAFT;

    @JsonCreator
    public static TripStatus from(String value) {
        return TripStatus.valueOf(value.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
