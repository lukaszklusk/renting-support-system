package pl.edu.agh.student.rentsys.security;

public enum UserRole {
    CLIENT("ROLE_CLIENT"),
    OWNER("ROLE_OWNER"),
    ADMIN("ROLE_ADMIN");

    private final String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
