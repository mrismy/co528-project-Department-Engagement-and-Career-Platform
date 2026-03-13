package com.decp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    /**
     * RestTemplate bean used by PushNotificationService to call the Expo Push API.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
