package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.model.User;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllBySender(User sender);
    List<Message> findAllByReceiver(User receiver);
    List<Message> findAllBySenderOrReceiver(User sender, User receiver);
}
