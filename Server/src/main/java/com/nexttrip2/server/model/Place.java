package com.nexttrip2.server.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

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

    @Field("province_places")
    private String province_places;

    @Field("phone_number_places")
    private String phone_number_places;

    @Field("email_places")
    private String email_places;

    @Field("website_url_places")
    private String website_url_places;

    @Field("image_url_places")
    private String image_url_places;

    @Field("type_places")
    private String type_places;

    @Field("open_time_places")
    private String open_time_places;

    @Field("close_time_places")
    private String close_time_places;

    @Field("ticket_price_places")
    private Float ticket_price_places;

    @Field("rating_places")
    private Float rating_places = 0.0f; // default 0.0

    @CreatedDate
    @Field("createdAt")
    private Date createdAt = new Date();

    @LastModifiedDate
    @Field("updatedAt")
    private Date updatedAt = new Date();
}
