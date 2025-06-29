package com.nexttrip2.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "Place")
public class Place {

    @Id
    private String place_id;

    private String owner_id;
    private String name_places;
    private String description_places;
    private String address_places;
    private String province_places;
    private String phone_number_places;
    private String email_places;
    private String website_url_places;
    private String image_url_places;
    private String type_places;
    private String open_time_places;
    private String close_time_places;
    private Float ticket_price_places;
    private Float rating_places = 0.0f; // default 0.0
}
