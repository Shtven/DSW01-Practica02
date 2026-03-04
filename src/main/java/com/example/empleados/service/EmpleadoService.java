package com.example.empleados.service;

import com.example.empleados.api.dto.CreateEmpleadoRequest;
import com.example.empleados.api.dto.EmpleadoPageResponse;
import com.example.empleados.api.dto.EmpleadoResponse;
import com.example.empleados.api.dto.UpdateEmpleadoRequest;
import com.example.empleados.domain.Empleado;
import com.example.empleados.repository.EmpleadoRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;

    public EmpleadoService(EmpleadoRepository empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    @Transactional
    public EmpleadoResponse create(CreateEmpleadoRequest request) {
        Long next = empleadoRepository.getNextSequenceValue();
        String clave = "E" + next;

        Empleado empleado = new Empleado();
        empleado.setClave(clave);
        empleado.setNombre(request.getNombre().trim());
        empleado.setDireccion(request.getDireccion().trim());
        empleado.setTelefono(request.getTelefono().trim());

        Empleado saved = empleadoRepository.save(empleado);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public EmpleadoResponse getByClave(String clave) {
        Empleado empleado = empleadoRepository.findById(clave)
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
        Empleado empleado = empleadoRepository.findById(clave)
            .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado: " + clave));

        empleado.setNombre(request.getNombre().trim());
        empleado.setDireccion(request.getDireccion().trim());
        empleado.setTelefono(request.getTelefono().trim());

        Empleado saved = empleadoRepository.save(empleado);
        return toResponse(saved);
    }

    @Transactional
    public void delete(String clave) {
        if (!empleadoRepository.existsById(clave)) {
            throw new ResourceNotFoundException("Empleado no encontrado: " + clave);
        }

        empleadoRepository.deleteById(clave);
    }

    private EmpleadoResponse toResponse(Empleado empleado) {
        return new EmpleadoResponse(
            empleado.getClave(),
            empleado.getNombre(),
            empleado.getDireccion(),
            empleado.getTelefono()
        );
    }
}
