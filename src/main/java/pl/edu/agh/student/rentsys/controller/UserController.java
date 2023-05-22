package pl.edu.agh.student.rentsys.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/a")
    public String printA(){
        return "A";
    }
}
