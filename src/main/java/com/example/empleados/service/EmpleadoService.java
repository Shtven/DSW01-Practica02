package com.example.empleados.service;

import com.example.empleados.api.dto.CreateEmpleadoRequest;
import com.example.empleados.api.dto.EmpleadoPageResponse;
import com.example.empleados.api.dto.EmpleadoResponse;
import com.example.empleados.api.dto.UpdateEmpleadoRequest;
import com.example.empleados.domain.Departamento;
import com.example.empleados.domain.Empleado;
import com.example.empleados.repository.DepartamentoRepository;
import com.example.empleados.repository.EmpleadoRepository;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmpleadoService {

    public static final String TEMP_EMAIL_SUFFIX = "@local.invalid";

    private final EmpleadoRepository empleadoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final PasswordEncoder passwordEncoder;
    private final String bootstrapAdminEmail;

    public EmpleadoService(
        EmpleadoRepository empleadoRepository,
        DepartamentoRepository departamentoRepository,
        PasswordEncoder passwordEncoder,
        @Value("${app.auth.bootstrap-admin-email:admin@example.com}") String bootstrapAdminEmail
    ) {
        this.empleadoRepository = empleadoRepository;
        this.departamentoRepository = departamentoRepository;
        this.passwordEncoder = passwordEncoder;
        this.bootstrapAdminEmail = normalizeEmail(bootstrapAdminEmail);
    }

    @Transactional
    public EmpleadoResponse create(CreateEmpleadoRequest request) {
        Long next = empleadoRepository.getNextSequenceValue();
        String clave = "E" + next;
        String normalizedNombre = normalizeNombre(request.getNombre());
        String normalizedCorreo = normalizeEmail(request.getCorreo());
        validateUniqueNombreForCreate(normalizedNombre);
        validateUniqueCorreoForCreate(normalizedCorreo);
        validateNotTemporaryCorreo(normalizedCorreo);
        String departamentoClave = requireNonNull(request.getDepartamentoClave(), "departamentoClave es obligatorio").trim();
        Departamento departamento = departamentoRepository.findById(departamentoClave)
            .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado: " + request.getDepartamentoClave()));

        Empleado empleado = new Empleado();
        empleado.setClave(clave);
        empleado.setNombre(normalizedNombre);
        empleado.setCorreo(normalizedCorreo);
        empleado.setContrasena(passwordEncoder.encode(request.getContrasena().trim()));
        empleado.setDireccion(request.getDireccion().trim());
        empleado.setTelefono(request.getTelefono().trim());
        empleado.setDepartamento(departamento);

        Empleado saved = empleadoRepository.save(empleado);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public EmpleadoResponse getByClave(String clave) {
        String safeClave = requireNonNull(clave, "clave es obligatoria");
        Empleado empleado = empleadoRepository.findById(safeClave)
            .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado: " + clave));
        return toResponse(empleado);
    }

    @Transactional(readOnly = true)
    public EmpleadoPageResponse list(int page, int size) {
        Page<Empleado> empleados = empleadoRepository.findAll(PageRequest.of(page, size));
        List<EmpleadoResponse> content = empleados.getContent().stream()
            .map(this::toResponse)
            .toList();

        return new EmpleadoPageResponse(content, empleados.getNumber(), empleados.getSize(),
            empleados.getTotalElements(), empleados.getTotalPages());
    }

    @Transactional
    public EmpleadoResponse update(String clave, UpdateEmpleadoRequest request) {
        String safeClave = requireNonNull(clave, "clave es obligatoria");
        Empleado empleado = empleadoRepository.findById(safeClave)
            .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado: " + clave));

        String normalizedNombre = normalizeNombre(request.getNombre());
        String normalizedCorreo = normalizeEmail(request.getCorreo());
        validateUniqueNombreForUpdate(normalizedNombre, safeClave);
        validateUniqueCorreoForUpdate(normalizedCorreo, safeClave);
        validateNotTemporaryCorreo(normalizedCorreo);
        validateTemporaryReplacementAuthorization(empleado.getCorreo(), normalizedCorreo);
        empleado.setNombre(normalizedNombre);
        empleado.setCorreo(normalizedCorreo);
        empleado.setContrasena(passwordEncoder.encode(request.getContrasena().trim()));
        empleado.setDireccion(request.getDireccion().trim());
        empleado.setTelefono(request.getTelefono().trim());
        String departamentoClave = requireNonNull(request.getDepartamentoClave(), "departamentoClave es obligatorio").trim();
        Departamento departamento = departamentoRepository.findById(departamentoClave)
            .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado: " + request.getDepartamentoClave()));
        empleado.setDepartamento(departamento);

        Empleado saved = empleadoRepository.save(empleado);
        return toResponse(saved);
    }

    @Transactional
    public void delete(String clave) {
        String safeClave = requireNonNull(clave, "clave es obligatoria");
        if (!empleadoRepository.existsById(safeClave)) {
            throw new ResourceNotFoundException("Empleado no encontrado: " + clave);
        }

        empleadoRepository.deleteById(safeClave);
    }

    private EmpleadoResponse toResponse(Empleado empleado) {
        return new EmpleadoResponse(
            empleado.getClave(),
            empleado.getNombre(),
            empleado.getCorreo(),
            empleado.getDireccion(),
            empleado.getTelefono(),
            empleado.getDepartamento() != null ? empleado.getDepartamento().getClave() : null
        );
    }

    private String normalizeNombre(String nombre) {
        return nombre.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeEmail(String correo) {
        String value = correo == null ? "" : correo.trim().toLowerCase(Locale.ROOT);
        if (value.isBlank()) {
            throw new IllegalArgumentException("correo es obligatorio");
        }
        return value;
    }

    private boolean isTemporaryEmail(String correo) {
        return correo != null && correo.toLowerCase(Locale.ROOT).endsWith(TEMP_EMAIL_SUFFIX);
    }

    private void validateUniqueNombreForCreate(String nombre) {
        if (empleadoRepository.existsByNombreIgnoreCase(nombre)) {
            throw new IllegalArgumentException("nombre ya se encuentra registrado");
        }
    }

    private void validateUniqueNombreForUpdate(String nombre, String clave) {
        if (empleadoRepository.existsByNombreIgnoreCaseAndClaveNot(nombre, clave)) {
            throw new IllegalArgumentException("nombre ya se encuentra registrado");
        }
    }

    private void validateUniqueCorreoForCreate(String correo) {
        if (empleadoRepository.existsByCorreoIgnoreCase(correo)) {
            throw new IllegalArgumentException("correo ya se encuentra registrado");
        }
    }

    private void validateUniqueCorreoForUpdate(String correo, String clave) {
        if (empleadoRepository.existsByCorreoIgnoreCaseAndClaveNot(correo, clave)) {
            throw new IllegalArgumentException("correo ya se encuentra registrado");
        }
    }

    private void validateNotTemporaryCorreo(String correo) {
        if (isTemporaryEmail(correo)) {
            throw new IllegalArgumentException("correo temporal no permitido");
        }
    }

    private void validateTemporaryReplacementAuthorization(String currentCorreo, String newCorreo) {
        if (!isTemporaryEmail(currentCorreo) || isTemporaryEmail(newCorreo)) {
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = authentication != null ? normalizeEmail(authentication.getName()) : "";
        if (!bootstrapAdminEmail.equals(currentUser)) {
            throw new AccessDeniedException("solo administrador puede reemplazar correo temporal");
        }
    }

    private String requireNonNull(String value, String message) {
        return Objects.requireNonNull(value, message);
    }
}
