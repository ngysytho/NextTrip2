package com.nexttrip2.server.repository;

import com.nexttrip2.server.model.Place;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlaceRepository extends MongoRepository<Place, String> {
}
