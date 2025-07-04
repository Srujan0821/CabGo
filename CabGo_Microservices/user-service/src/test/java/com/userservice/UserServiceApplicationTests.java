package com.userservice;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

@SpringBootTest
class UserServiceApplicationTests {

	@Autowired
	private ApplicationContext context;

	@Test
	void contextLoads() {
		// Verifies that the Spring context loads successfully
	}

	@Test
	void applicationContextIsNotNull() {
		assertThat(context).isNotNull();
	}

	@Test
	void userServiceApplicationBeanExists() {
		assertThat(context.containsBean("userServiceApplication")).isTrue();
	}
}