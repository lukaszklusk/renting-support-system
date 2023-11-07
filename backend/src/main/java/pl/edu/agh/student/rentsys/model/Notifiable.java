package pl.edu.agh.student.rentsys.model;

public interface Notifiable {
    void addNotification(Notification notification);
    String getName();
}
