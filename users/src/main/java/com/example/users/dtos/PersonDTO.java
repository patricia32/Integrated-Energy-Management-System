package com.example.users.dtos;


import com.example.users.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

import java.util.UUID;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PersonDTO extends RepresentationModel<PersonDTO> {
    private UUID id;
    private Role role;
}
