package com.rideservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.rideservice.feign")
@ComponentScan(basePackages = {"com.rideservice", "com.commonlib.utils"})
public class RideServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(RideServiceApplication.class, args);
		System.out.println("Ride Service Application Started");
		System.out.println("Access the Driver Service at: http://localhost:8083");
	}

}
