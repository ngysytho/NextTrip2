package com.nexttrip2.server.dto;

import java.util.List;

public class DeleteCartItemsRequest {
    private List<String> placeIds;

    public DeleteCartItemsRequest() {}

    public List<String> getPlaceIds() {
        return placeIds;
    }

    public void setPlaceIds(List<String> placeIds) {
        this.placeIds = placeIds;
    }
}
