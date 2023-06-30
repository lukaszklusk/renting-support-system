package pl.edu.agh.student.rentsys.service;


import org.springframework.stereotype.Service;
import pl.edu.agh.student.rentsys.model.User;
import pl.edu.agh.student.rentsys.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public Optional<User> getUserById(long id){
        return userRepository.findById(id);
    }

    public User createNewUser(User user){
        return userRepository.save(user);
    }
}
