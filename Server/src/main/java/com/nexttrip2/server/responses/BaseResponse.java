package com.nexttrip2.server.responses;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class BaseResponse {
    private Date createdAt;
    private Date updatedAt;
}
