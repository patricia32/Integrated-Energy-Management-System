package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.entities.AdminChats;
import ro.tuc.ds2020.entities.Message;
import ro.tuc.ds2020.services.ChatService;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@RequestMapping(value = "")
public class ChatController {

    @Autowired
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/sendMessageToAdmin/{idAdmin}/{idClient}/{usernameClient}/{messageFromClient}")
    public ResponseEntity sendMessageToAdmin(@PathVariable UUID idAdmin, @PathVariable UUID idClient, @PathVariable String usernameClient, @PathVariable String messageFromClient){
        chatService.sendMessage(idAdmin, idClient, usernameClient, messageFromClient, true);
        return new ResponseEntity(HttpStatus.OK);
    }

    @GetMapping("/sendMessageToClient/{idAdmin}/{idClient}/{usernameClient}/{messageFromAdmin}")
    public ResponseEntity sendMessageToClient(@PathVariable UUID idAdmin, @PathVariable UUID idClient, @PathVariable String usernameClient, @PathVariable String messageFromAdmin){
        chatService.sendMessage(idAdmin, idClient, usernameClient, messageFromAdmin, false);
        return new ResponseEntity(HttpStatus.OK);
    }

    @GetMapping("/getAdminChats/{idAdmin}")
    public ResponseEntity<List<String>> getAdminChats(@PathVariable UUID idAdmin){
        return new ResponseEntity<>(chatService.getAdminChats(idAdmin), HttpStatus.OK);
    }

    @GetMapping("/getAdminChatMessages/{idAdmin}/{idClient}")
    public ResponseEntity<List<Message>> getAdminChatMessages(@PathVariable UUID idAdmin, @PathVariable UUID idClient){
        return new ResponseEntity<>(chatService.getAdminChatMessages(idAdmin, idClient), HttpStatus.OK);
    }

    @GetMapping("/sendSeenMessage/{idSender}/{usernameSender}/{idReceiver}/{message}")
    public ResponseEntity sendSeenMessage(@PathVariable UUID idSender, @PathVariable String usernameSender, @PathVariable UUID idReceiver, @PathVariable String message){
        chatService.sendSeenMessage(idSender, usernameSender, idReceiver, message);
        return new ResponseEntity(HttpStatus.OK);
    }
}
