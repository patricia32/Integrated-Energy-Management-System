package ro.tuc.ds2020.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AdminChats {
    private UUID idAdmin;
    private List<Message> messages = new ArrayList<>();
    private List<String> chats = new ArrayList<>();

    public AdminChats() {
    }

    public UUID getIdAdmin() {
        return idAdmin;
    }
    public void setIdAdmin(UUID idAdmin) {
        this.idAdmin = idAdmin;
    }

    public List<Message> getMessages() {
        return messages;
    }
    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public List<String> getChats() {
        return chats;
    }
    public void String(List<String> chats) {
        this.chats = chats;
    }
}
