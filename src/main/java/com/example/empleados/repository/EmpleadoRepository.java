package com.example.empleados.repository;

import com.example.empleados.domain.Empleado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmpleadoRepository extends JpaRepository<Empleado, String> {

    Page<Empleado> findAll(Pageable pageable);

    @Query(value = "SELECT nextval('empleados_seq')", nativeQuery = true)
    Long getNextSequenceValue();
}
