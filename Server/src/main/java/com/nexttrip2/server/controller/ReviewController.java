package com.nexttrip2.server.controller;

import com.nexttrip2.server.model.Review;
import com.nexttrip2.server.repository.ReviewRepository;
import com.nexttrip2.server.responses.ReviewResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);
    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@RequestBody Review review) {
        Review savedReview = reviewRepository.save(review);
        logger.info("✅ Created review by user: {}", savedReview.getUsername());

        // ✅ Sử dụng getter snake_case đúng theo model
        ReviewResponse response = new ReviewResponse(
                savedReview.getReview_id(),
                savedReview.getPlace_id(),
                savedReview.getUser_id(),
                savedReview.getUsername(),
                savedReview.getComment(),
                savedReview.getRating()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{placeId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByPlaceId(@PathVariable String placeId) {
        // ✅ Repository method match snake_case field
        List<ReviewResponse> reviews = reviewRepository.findByPlaceId(placeId).stream()
                .map(r -> new ReviewResponse(
                        r.getReview_id(),
                        r.getPlace_id(),
                        r.getUser_id(),
                        r.getUsername(),
                        r.getComment(),
                        r.getRating()
                ))
                .collect(Collectors.toList());

        logger.info("✅ Fetched {} reviews for placeId: {}", reviews.size(), placeId);
        return ResponseEntity.ok(reviews);
    }
}
