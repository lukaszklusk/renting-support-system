package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.Message;
import pl.edu.agh.student.rentsys.model.MessageType;
import pl.edu.agh.student.rentsys.user.User;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllBySender(User sender);
    List<Message> findAllByReceiver(User receiver);
    List<Message> findAllBySenderAndMessageType(User sender, MessageType messageType);
    List<Message> findAllByReceiverAndMessageType(User receiver, MessageType messageType);
}
