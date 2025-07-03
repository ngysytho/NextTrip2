package com.nexttrip2.server.repository;

import com.nexttrip2.server.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {

    @Query("{ 'place_id' : ?0 }")
    List<Review> findByPlaceId(String placeId);

}
   