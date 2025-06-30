package com.nexttrip2.server.repository;

import com.nexttrip2.server.model.Place;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface PlaceRepository extends MongoRepository<Place, String> {

    @Query("{ 'type_places' : ?0 }")
    List<Place> findByTypePlacesOrderByCreatedAtDesc(String type_places, Pageable pageable);
}
