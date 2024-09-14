package ro.tuc.ds2020.entities;

import java.util.UUID;

public class Message {
    private UUID idClient;
    private UUID idAdmin;
    private String usernameClient;
    private String content;
    private boolean messageSentByClient;

    public Message(UUID idClient, UUID idAdmin, String usernameClient, String content, boolean messageSentByClient) {
        this.idClient = idClient;
        this.idAdmin = idAdmin;
        this.usernameClient = usernameClient;
        this.content = content;
        this.messageSentByClient = messageSentByClient;
    }

    public UUID getIdClient() {
        return idClient;
    }
    public UUID getIdAdmin() {
        return idAdmin;
    }
    public String getUsernameClient() {
        return usernameClient;
    }
    public String getContent() {
        return content;
    }
    public boolean isMessageSentByClient() {
        return messageSentByClient;
    }
}
