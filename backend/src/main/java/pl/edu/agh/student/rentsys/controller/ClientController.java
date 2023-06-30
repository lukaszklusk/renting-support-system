package pl.edu.agh.student.rentsys.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.student.rentsys.model.Client;
import pl.edu.agh.student.rentsys.model.User;
import pl.edu.agh.student.rentsys.service.AgreementService;
import pl.edu.agh.student.rentsys.service.ClientService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class ClientController {

    private ClientService clientService;
    private AgreementService agreementService;

    public ClientController(ClientService clientService, AgreementService agreementService) {
        this.clientService = clientService;
        this.agreementService = agreementService;
    }

    @GetMapping("/client")
    public ResponseEntity<List<Client>> getAllClients(){
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @GetMapping("/client/{cid}")
    public ResponseEntity<Client> getClientById(@PathVariable long cid){
        Optional<Client> client = clientService.getClientById(cid);
        if(client.isPresent()) return ResponseEntity.ok(client.get());
        else return ResponseEntity.notFound().build();
    }

    @PostMapping("/client")
    public ResponseEntity<Client> createClient(@RequestBody Map<String, Object> payload){
        if(!payload.containsKey("username") || !payload.containsKey("password") ||
                !payload.containsKey("email") || !payload.containsKey("phoneNumber")){
            return ResponseEntity.badRequest().build();
        }
        Client newClient = new Client();
        newClient.setUsername((String) payload.get("username"));
        newClient.setPassword((String) payload.get("password"));
        newClient.setEmail((String) payload.get("email"));
        newClient.setPhoneNumber((String) payload.get("phoneNumber"));
        Client client = clientService.createNewClient(newClient);
        if(client != null){
            return ResponseEntity.ok(client);
        }else{
            return ResponseEntity.internalServerError().build();
        }
    }
}
