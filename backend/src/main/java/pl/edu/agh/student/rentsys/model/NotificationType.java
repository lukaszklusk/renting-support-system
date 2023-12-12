package pl.edu.agh.student.rentsys.model;

public enum NotificationType {
    agreement_activated, agreement_proposed, agreement_accepted, agreement_finished,
    agreement_withdrawn_owner, agreement_withdrawn_client, agreement_rejected_client, agreement_rejected_owner,
    agreement_cancelled_client, agreement_cancelled_owner,
    equipment_added, equipment_removed, equipment_failure, equipment_fix,
    apartment_created, apartment_removed;
}
