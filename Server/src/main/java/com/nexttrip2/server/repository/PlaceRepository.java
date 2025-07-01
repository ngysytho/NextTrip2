package com.nexttrip2.server.repository;

import com.nexttrip2.server.model.Place;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface PlaceRepository extends MongoRepository<Place, String> {

    @Query(value = "{ 'group_type' : { $regex: ?0, $options: 'i' } }")
    Page<Place> findByGroupTypeIgnoreCaseOrderByCreatedAtDesc(String group_type, Pageable pageable);

}
