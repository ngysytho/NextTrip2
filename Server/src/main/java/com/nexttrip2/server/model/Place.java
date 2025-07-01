package com.nexttrip2.server.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

@Document(collection = "Place")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Place {

    @Id
    @Field("place_id")
    private String place_id;

    @Field("owner_id")
    private String owner_id;

    @Field("name_places")
    private String name_places;

    @Field("description_places")
    private String description_places;

    @Field("address_places")
    private String address_places;

    @Field("street_places")
    private String street_places;

    @Field("neighborhood_places")
    private String neighborhood_places;

    @Field("city_places")
    private String city_places;

    @Field("state_places")
    private String state_places;

    @Field("postal_code_places")
    private String postal_code_places;

    @Field("country_code_places")
    private String country_code_places;

    @Field("latitude_places")
    private Double latitude_places;

    @Field("longitude_places")
    private Double longitude_places;

    @Field("location")
    private GeoJsonPoint location;

    @Field("phone_number_places")
    private String phone_number_places;

    @Field("email_places")
    private String email_places;

    @Field("website_url_places")
    private String website_url_places;

    @Field("google_map_url_places")
    private String google_map_url_places;

    @Field("image_url_places")
    private String image_url_places;

    @Field("type_places")
    private String type_places;

    @Field("categories_places")
    private List<String> categories_places;

    @Field("open_time_places")
    private String open_time_places;

    @Field("close_time_places")
    private String close_time_places;

    @Field("opening_hours_places")
    private List<OpeningHourPlace> opening_hours_places;

    @Field("ticket_price_places")
    private Float ticket_price_places;

    @Field("rating_places")
    private Float rating_places = 0.0f;

    @Field("reviews_count_places")
    private Integer reviews_count_places;

    @Field("permanently_closed_places")
    private Boolean permanently_closed_places;

    @Field("temporarily_closed_places")
    private Boolean temporarily_closed_places;

    @Field("group_type")
    private String group_type;

    @CreatedDate
    @Field("createdAt")
    private Date createdAt = new Date();

    @LastModifiedDate
    @Field("updatedAt")
    private Date updatedAt = new Date();

}
