package pl.edu.agh.student.rentsys.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.edu.agh.student.rentsys.model.Picture;

public interface PictureRepository extends JpaRepository<Picture, Long> {
}
