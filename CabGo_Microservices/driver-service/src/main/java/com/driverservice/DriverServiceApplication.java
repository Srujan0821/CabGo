package com.driverservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {
        "com.commonlib.utils", // Shared utilities
        "com.driverservice" // Driver-service specific packages
})

public class DriverServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DriverServiceApplication.class, args);
		System.out.println("Driver Service is running...");
		System.out.println("Access the Driver Service at: http://localhost:8082");
	}

}
