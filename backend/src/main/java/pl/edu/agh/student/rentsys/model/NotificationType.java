package pl.edu.agh.student.rentsys.model;

public enum NotificationType {
    agreement_activated, agreement_declined, agreement_withdrawn, agreement_proposed, agreement_accepted,
    agreement_rejected_client, agreement_rejected_owner, agreement_cancelled_client, agreement_cancelled_owner,
    equipment_added, equipment_removed, equipment_failure, equipment_fix,
    apartment_created;

    public static NotificationType mapStatusToNotificationType(AgreementStatus status) {
        return switch (status) {
            case proposed -> NotificationType.agreement_proposed;
            case accepted -> NotificationType.agreement_accepted;
            case active -> NotificationType.agreement_activated;
            case withdrawn -> NotificationType.agreement_withdrawn;
            case rejected_client -> NotificationType.agreement_rejected_client;
            default -> null;
        };
    }
}
