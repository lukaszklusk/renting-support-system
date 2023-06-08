package pl.edu.agh.student.rentsys.tests;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/demo")
public class DemoController {

    @GetMapping
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("test");
    }

    @GetMapping(path = "/client")
    public ResponseEntity<String> client() {
        return ResponseEntity.ok("client");
    }
    @GetMapping(path = "/owner")
    public ResponseEntity<String> owner() {
        return ResponseEntity.ok("owner");
    }

    @GetMapping(path = "/admin")
    public ResponseEntity<String> admin() {
        return ResponseEntity.ok("admin");
    }
}
