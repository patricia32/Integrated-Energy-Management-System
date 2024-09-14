package ro.tuc.ds2020.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.constants.NotificationEndpoints;
import ro.tuc.ds2020.entities.AdminChats;
import ro.tuc.ds2020.entities.Message;

import java.util.*;

@Service
public class ChatService {

    public static List<AdminChats> adminChats = new ArrayList<>();

    @Autowired
    private final SimpMessagingTemplate template;
    public ChatService(SimpMessagingTemplate template) {
        this.template = template;
    }

    public void sendMessage(UUID idAdmin, UUID idClient, String usernameSender, String messageFromClient, boolean messageSentByClient){
        Map<String, Object> messagePayload = new HashMap<>();
        messagePayload.put("senderId", idClient);
        messagePayload.put("senderUsername", usernameSender);
        messagePayload.put("content", messageFromClient);

        Message message = new Message(idClient, idAdmin, usernameSender, messageFromClient, messageSentByClient);

        boolean found = false;
        for(AdminChats adminChat: adminChats){
            if(adminChat.getIdAdmin().equals(idAdmin)){
                adminChat.getMessages().add(message);
                if(!adminChat.getChats().contains(usernameSender))
                    adminChat.getChats().add(usernameSender);
                found = true;
                break;
            }
        }
        if(!found){
            AdminChats newAdminChats = new AdminChats();
            newAdminChats.setIdAdmin(idAdmin);
            newAdminChats.getChats().add(usernameSender);
            newAdminChats.getMessages().add(message);
            adminChats.add(newAdminChats);
        }
        if(messageSentByClient)
            this.template.convertAndSend( NotificationEndpoints.MESSAGE + idAdmin.toString(), messagePayload);
        else
            this.template.convertAndSend( NotificationEndpoints.MESSAGE + idClient.toString(), messagePayload);
    }

    public List<String> getAdminChats(UUID idAdmin){
        List<String> chats = new ArrayList<>();
        for(AdminChats adminChats:ChatService.adminChats){
            if(adminChats.getIdAdmin().equals(idAdmin))
                chats.addAll(adminChats.getChats());
            break;
        }
        return chats;
    }

    public List<Message> getAdminChatMessages(UUID idAdmin, UUID idClient){
        List<Message> messages = new ArrayList<>();
        for(AdminChats adminChat:ChatService.adminChats) {
            if (adminChat.getIdAdmin().equals(idAdmin))
                for (Message message : adminChat.getMessages())
                    if (message.getIdClient().equals(idClient))
                        messages.add(message);
        }
        return messages;
    }

    public void SendMessageToClient(UUID idAdmin, UUID idClient, String messageFromClient){

        Map<String, Object> messagePayload = new HashMap<>();
        messagePayload.put("senderId", idClient);
        messagePayload.put("content", messageFromClient);

        this.template.convertAndSend( NotificationEndpoints.MESSAGE + idClient.toString(), messagePayload);
    }

    public void sendSeenMessage(UUID idSender,  String usernameSender, UUID idReceiver, String message) {
        Map<String, Object> messagePayload = new HashMap<>();
        messagePayload.put("idSender", idSender);
        messagePayload.put("usernameSender", usernameSender);
        messagePayload.put("content", message);

        this.template.convertAndSend( NotificationEndpoints.MESSAGE + idReceiver.toString(), messagePayload);
    }
}
