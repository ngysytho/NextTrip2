package com.nexttrip2.server.service;

import java.util.Map;

public interface PlaceService {
    Map<String, Object> getPlacesByGroupTypeWithPagination(String groupType, int page, int limit);
}
