package com.example.users.dtos;



import com.example.users.entities.Role;
import lombok.Getter;
import lombok.Setter;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.UUID;

@Setter
@Getter
public class PersonDetailsDTO {

    private UUID id;
    @NotNull
    private String username;
    private String password;
    private int age;
    private Role role;

    public PersonDetailsDTO() {
    }

    public PersonDetailsDTO(String username, int age, Role role) {
        this.username = username;
        this.role = role;
        this.age = age;
    }

    public PersonDetailsDTO(UUID id, String username, String password, int age, Role role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.age = age;
    }
}
