package com.nexttrip2.server.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpeningHourPlace {

    private String day;
    private String hours;
}
