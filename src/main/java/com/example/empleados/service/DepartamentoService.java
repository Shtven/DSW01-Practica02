package com.example.empleados.service;

import com.example.empleados.api.dto.DepartamentoPageResponse;
import com.example.empleados.api.dto.DepartamentoRequest;
import com.example.empleados.api.dto.DepartamentoResponse;
import com.example.empleados.domain.Departamento;
import com.example.empleados.repository.DepartamentoRepository;
import com.example.empleados.repository.EmpleadoRepository;
import java.util.List;
import java.util.Objects;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DepartamentoService {

    private final DepartamentoRepository departamentoRepository;
    private final EmpleadoRepository empleadoRepository;

    public DepartamentoService(DepartamentoRepository departamentoRepository, EmpleadoRepository empleadoRepository) {
        this.departamentoRepository = departamentoRepository;
        this.empleadoRepository = empleadoRepository;
    }

    @Transactional
    public DepartamentoResponse create(DepartamentoRequest request) {
        Long next = departamentoRepository.getNextSequenceValue();
        String clave = "D" + next;

        Departamento departamento = new Departamento();
        departamento.setClave(clave);
        departamento.setNombre(request.getNombre().trim());

        return toResponse(departamentoRepository.save(departamento));
    }

    @Transactional(readOnly = true)
    public DepartamentoResponse getByClave(String clave) {
        String safeClave = Objects.requireNonNull(clave, "clave es obligatoria");
        Departamento departamento = departamentoRepository.findById(safeClave)
            .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado: " + clave));
        return toResponse(departamento);
    }

    @Transactional(readOnly = true)
    public DepartamentoPageResponse list(int page, int size) {
        Page<Departamento> departamentos = departamentoRepository.findAll(PageRequest.of(page, size));
        List<DepartamentoResponse> content = departamentos.getContent().stream()
            .map(this::toResponse)
            .toList();

        return new DepartamentoPageResponse(content, departamentos.getNumber(), departamentos.getSize(),
            departamentos.getTotalElements(), departamentos.getTotalPages());
    }

    @Transactional
    public DepartamentoResponse update(String clave, DepartamentoRequest request) {
        String safeClave = Objects.requireNonNull(clave, "clave es obligatoria");
        Departamento departamento = departamentoRepository.findById(safeClave)
            .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado: " + clave));
        departamento.setNombre(request.getNombre().trim());
        return toResponse(departamentoRepository.save(departamento));
    }

    @Transactional
    public void delete(String clave) {
        String safeClave = Objects.requireNonNull(clave, "clave es obligatoria");
        if (!departamentoRepository.existsById(safeClave)) {
            throw new ResourceNotFoundException("Departamento no encontrado: " + clave);
        }

        if (empleadoRepository.countByDepartamento_Clave(safeClave) > 0) {
            throw new IllegalArgumentException("No se puede eliminar el departamento porque tiene empleados asociados");
        }

        departamentoRepository.deleteById(safeClave);
    }

    private DepartamentoResponse toResponse(Departamento departamento) {
        List<String> empleados = departamento.getEmpleados().stream()
            .map(e -> e.getClave())
            .toList();
        return new DepartamentoResponse(departamento.getClave(), departamento.getNombre(), empleados);
    }
}