package com.example.users.dtos;

import com.example.users.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PersonRegisterDTO {
    private String username;
    private String password;
    private int age;
    private Role role;
}
