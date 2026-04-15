package com.example.empleados.api;

import com.example.empleados.api.dto.DepartamentoPageResponse;
import com.example.empleados.api.dto.DepartamentoRequest;
import com.example.empleados.api.dto.DepartamentoResponse;
import com.example.empleados.service.DepartamentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/departamentos")
@Validated
@SecurityRequirement(name = "basicAuth")
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    public DepartamentoController(DepartamentoService departamentoService) {
        this.departamentoService = departamentoService;
    }

    @Operation(summary = "Crear departamento")
    @ApiResponse(responseCode = "201", description = "Departamento creado")
    @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DepartamentoResponse create(@Valid @RequestBody DepartamentoRequest request) {
        return departamentoService.create(request);
    }

    @Operation(summary = "Consultar departamento por clave")
    @ApiResponse(responseCode = "200", description = "Departamento encontrado")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @ApiResponse(responseCode = "404", description = "Departamento no encontrado")
    @GetMapping("/{clave}")
    public DepartamentoResponse getByClave(
        @PathVariable
        @Pattern(regexp = "^D[0-9]+$", message = "clave debe cumplir formato D + dígitos")
        String clave
    ) {
        return departamentoService.getByClave(clave);
    }

    @Operation(summary = "Listar departamentos paginados")
    @ApiResponse(responseCode = "200", description = "Página de departamentos")
    @ApiResponse(responseCode = "400", description = "Parámetros inválidos")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @GetMapping
    public DepartamentoPageResponse list(
        @RequestParam @Min(value = 0, message = "page debe ser >= 0") int page,
        @RequestParam @Min(value = 1, message = "size debe ser >= 1") @Max(value = 200, message = "size debe ser <= 200") int size
    ) {
        return departamentoService.list(page, size);
    }

    @Operation(summary = "Actualizar departamento")
    @ApiResponse(responseCode = "200", description = "Departamento actualizado")
    @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @ApiResponse(responseCode = "404", description = "Departamento no encontrado")
    @PutMapping("/{clave}")
    public DepartamentoResponse update(
        @PathVariable
        @Pattern(regexp = "^D[0-9]+$", message = "clave debe cumplir formato D + dígitos")
        String clave,
        @Valid @RequestBody DepartamentoRequest request
    ) {
        return departamentoService.update(clave, request);
    }

    @Operation(summary = "Eliminar departamento")
    @ApiResponse(responseCode = "204", description = "Departamento eliminado")
    @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @ApiResponse(responseCode = "404", description = "Departamento no encontrado")
    @DeleteMapping("/{clave}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
        @PathVariable
        @Pattern(regexp = "^D[0-9]+$", message = "clave debe cumplir formato D + dígitos")
        String clave
    ) {
        departamentoService.delete(clave);
    }
}