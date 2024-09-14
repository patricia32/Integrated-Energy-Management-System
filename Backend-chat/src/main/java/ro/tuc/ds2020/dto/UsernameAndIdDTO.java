package ro.tuc.ds2020.dto;

import java.util.UUID;

public class UsernameAndIdDTO {
    private UUID idClient;
    private String usernameClient;

    public UsernameAndIdDTO() {
    }

    public UsernameAndIdDTO(UUID idClient, String usernameClient) {
        this.idClient = idClient;
        this.usernameClient = usernameClient;
    }

    public UUID getIdClient() {
        return idClient;
    }
    public void setIdClient(UUID idClient) {
        this.idClient = idClient;
    }

    public String getUsernameClient() {
        return usernameClient;
    }
    public void setUsernameClient(String usernameClient) {
        this.usernameClient = usernameClient;
    }
}
