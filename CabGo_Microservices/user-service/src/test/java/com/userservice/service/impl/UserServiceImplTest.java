package com.userservice.service.impl;

import com.commonlib.dto.UserLoginRequest;
import com.commonlib.dto.UserRegisterRequest;
import com.commonlib.enums.Role;
import com.commonlib.exception.UserNotFoundException;
import com.commonlib.utils.JwtUtil;
import com.userservice.entity.User;
import com.userservice.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_shouldSaveUser() {
        UserRegisterRequest request = new UserRegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("pass");
        request.setName("Test");
        request.setPhone("1234567890");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("hashed");

        String result = userService.register(request);

        assertEquals("User registered successfully!", result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_shouldThrowIfEmailExists() {
        UserRegisterRequest request = new UserRegisterRequest();
        request.setEmail("test@example.com");
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(new User()));

        assertThrows(RuntimeException.class, () -> userService.register(request));
    }

    @Test
    void login_shouldReturnToken() {
        UserLoginRequest request = new UserLoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("pass");
        User user = User.builder().email("test@example.com").passwordHash("hashed").role(Role.USER).build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPasswordHash())).thenReturn(true);
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("token");

        String token = userService.login(request);

        assertEquals("token", token);
    }

    @Test
    void login_shouldThrowIfUserNotFound() {
        UserLoginRequest request = new UserLoginRequest();
        request.setEmail("notfound@example.com");
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.login(request));
    }

    @Test
    void login_shouldThrowIfPasswordInvalid() {
        UserLoginRequest request = new UserLoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrong");
        User user = User.builder().email("test@example.com").passwordHash("hashed").role(Role.USER).build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPasswordHash())).thenReturn(false);

        assertThrows(RuntimeException.class, () -> userService.login(request));
    }

    @Test
    void getProfile_shouldReturnUser() {
        String token = "token";
        String email = "test@example.com";
        User user = new User();

        when(jwtUtil.validateToken(token)).thenReturn(true);
        when(jwtUtil.extractEmail(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        User result = userService.getProfile(token);

        assertEquals(user, result);
    }

    @Test
    void getProfile_shouldThrowIfTokenInvalid() {
        String token = "bad";
        when(jwtUtil.validateToken(token)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> userService.getProfile(token));
    }

    @Test
    void logout_shouldNotThrow() {
        assertDoesNotThrow(() -> userService.logout());
    }

    @Test
    void getUserByEmail_shouldReturnUser() {
        String email = "test@example.com";
        User user = new User();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        User result = userService.getUserByEmail(email);

        assertEquals(user, result);
    }

    @Test
    void getUserByEmail_shouldThrowIfNotFound() {
        String email = "notfound@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getUserByEmail(email));
    }

    @Test
    void getUserById_shouldReturnUser() {
        Long id = 1L;
        User user = new User();
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        User result = userService.getUserById(id);

        assertEquals(user, result);
    }

    @Test
    void getUserById_shouldThrowIfNotFound() {
        Long id = 2L;
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getUserById(id));
    }
}