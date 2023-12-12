package pl.edu.agh.student.rentsys.model;

import java.util.Optional;

public enum AgreementStatus {
    proposed, accepted, active, finished, withdrawn_client, withdrawn_owner, rejected_client, rejected_owner, cancelled_owner, cancelled_client;

    public boolean isAlive() {
        return this == proposed || this == accepted || this == active;
    }

    public Optional<AgreementStatus> reject(boolean isOwner) {
        switch (this) {
            case proposed:
                if (isOwner) {
                    return Optional.of(withdrawn_owner);
                } else {
                    return Optional.of(rejected_client);
                }
            case accepted:
                if (isOwner) {
                    return Optional.of(rejected_owner);
                } else {
                    return Optional.of(withdrawn_client);
                }
            case active:
                if (isOwner) {
                    return Optional.of(cancelled_owner);
                } else {
                    return Optional.of(cancelled_client);
                }
            default:
                return Optional.empty();
        }
    }

    public Optional<AgreementStatus> accept(boolean isOwner) {
        switch (this) {
            case proposed:
                if (isOwner) {
                    return Optional.empty();
                } else {
                    return Optional.of(accepted);
                }
            case accepted:
                if (isOwner) {
                    return Optional.of(active);
                } else {
                    return Optional.empty();
                }
            default:
                return Optional.empty();
        }
    }

    public NotificationType mapToNotificationType() {
        return switch (this) {
            case proposed -> NotificationType.agreement_proposed;
            case accepted -> NotificationType.agreement_accepted;
            case active -> NotificationType.agreement_activated;
            case finished -> NotificationType.agreement_finished;
            case withdrawn_owner -> NotificationType.agreement_withdrawn_owner;
            case withdrawn_client -> NotificationType.agreement_withdrawn_client;
            case rejected_client -> NotificationType.agreement_rejected_client;
            case rejected_owner -> NotificationType.agreement_rejected_owner;
            case cancelled_owner -> NotificationType.agreement_cancelled_owner;
            case cancelled_client -> NotificationType.agreement_cancelled_client;
            default -> null;
        };
    }
}
