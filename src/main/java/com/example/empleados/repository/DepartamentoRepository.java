package com.example.empleados.repository;

import com.example.empleados.domain.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DepartamentoRepository extends JpaRepository<Departamento, String> {

	@Query(value = "SELECT nextval('departamentos_seq')", nativeQuery = true)
	Long getNextSequenceValue();
}