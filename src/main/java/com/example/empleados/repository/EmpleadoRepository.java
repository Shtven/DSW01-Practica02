package com.example.empleados.repository;

import com.example.empleados.domain.Empleado;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmpleadoRepository extends JpaRepository<Empleado, String> {

    @Query(value = "SELECT nextval('empleados_seq')", nativeQuery = true)
    Long getNextSequenceValue();

    Optional<Empleado> findByNombreIgnoreCase(String nombre);

    Optional<Empleado> findByCorreoIgnoreCase(String correo);

    boolean existsByNombreIgnoreCaseAndClaveNot(String nombre, String clave);

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByCorreoIgnoreCase(String correo);

    boolean existsByCorreoIgnoreCaseAndClaveNot(String correo, String clave);

    long countByDepartamento_Clave(String departamentoClave);
}
