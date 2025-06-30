package com.nexttrip2.server.service;

import java.util.Map;

public interface PlaceService {
    Map<String, Object> getPlacesByTypeWithPagination(String type, int page, int limit);
}
