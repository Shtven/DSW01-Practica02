package com.example.empleados.service;

import com.example.empleados.domain.Empleado;
import com.example.empleados.repository.EmpleadoRepository;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class EmpleadoUserDetailsService implements UserDetailsService {

    private final EmpleadoRepository empleadoRepository;
    private final String bootstrapAdminEmail;

    public EmpleadoUserDetailsService(
        EmpleadoRepository empleadoRepository,
        @Value("${app.auth.bootstrap-admin-email:admin@example.com}") String bootstrapAdminEmail
    ) {
        this.empleadoRepository = empleadoRepository;
        this.bootstrapAdminEmail = bootstrapAdminEmail == null
            ? "admin@example.com"
            : bootstrapAdminEmail.trim().toLowerCase(Locale.ROOT);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String normalized = username == null ? "" : username.trim().toLowerCase(Locale.ROOT);
        Empleado empleado = empleadoRepository.findByCorreoIgnoreCase(normalized)
            .orElseThrow(() -> new UsernameNotFoundException("Credenciales invalidas"));

        if (isTemporaryEmail(empleado.getCorreo())) {
            throw new UsernameNotFoundException("Credenciales invalidas");
        }

        if (empleado.getContrasena() == null || empleado.getContrasena().isBlank()) {
            throw new UsernameNotFoundException("Credenciales invalidas");
        }

        String[] authorities = normalized.equals(bootstrapAdminEmail)
            ? new String[] {"ROLE_ADMIN", "ROLE_USER"}
            : new String[] {"ROLE_USER"};

        return new User(empleado.getCorreo(), empleado.getContrasena(), AuthorityUtils.createAuthorityList(authorities));
    }

    private boolean isTemporaryEmail(String correo) {
        return correo != null && correo.toLowerCase(Locale.ROOT).endsWith(EmpleadoService.TEMP_EMAIL_SUFFIX);
    }
}
