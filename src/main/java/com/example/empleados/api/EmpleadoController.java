package com.example.empleados.api;

import com.example.empleados.api.dto.CreateEmpleadoRequest;
import com.example.empleados.api.dto.EmpleadoPageResponse;
import com.example.empleados.api.dto.EmpleadoResponse;
import com.example.empleados.api.dto.UpdateEmpleadoRequest;
import com.example.empleados.service.EmpleadoService;
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
@RequestMapping("/api/empleados")
@Validated
@SecurityRequirement(name = "basicAuth")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @Operation(summary = "Crear empleado")
    @ApiResponse(responseCode = "201", description = "Empleado creado")
    @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmpleadoResponse create(@Valid @RequestBody CreateEmpleadoRequest request) {
        return empleadoService.create(request);
    }

    @Operation(summary = "Consultar empleado por clave")
    @ApiResponse(responseCode = "200", description = "Empleado encontrado")
    @ApiResponse(responseCode = "400", description = "Clave inválida")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @ApiResponse(responseCode = "404", description = "Empleado no encontrado")
    @GetMapping("/{clave}")
    public EmpleadoResponse getByClave(
        @PathVariable
        @Pattern(regexp = "^E[0-9]+$", message = "clave debe cumplir formato E + dígitos")
        String clave
    ) {
        return empleadoService.getByClave(clave);
    }

    @Operation(summary = "Listar empleados paginados")
    @ApiResponse(responseCode = "200", description = "Página de empleados")
    @ApiResponse(responseCode = "400", description = "Parámetros inválidos")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @GetMapping
    public EmpleadoPageResponse list(
        @RequestParam @Min(value = 0, message = "page debe ser >= 0") int page,
        @RequestParam @Min(value = 1, message = "size debe ser >= 1") @Max(value = 200, message = "size debe ser <= 200") int size
    ) {
        return empleadoService.list(page, size);
    }

    @Operation(summary = "Actualizar empleado")
    @ApiResponse(responseCode = "200", description = "Empleado actualizado")
    @ApiResponse(responseCode = "400", description = "Solicitud inválida")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @ApiResponse(responseCode = "404", description = "Empleado no encontrado")
    @PutMapping("/{clave}")
    public EmpleadoResponse update(
        @PathVariable
        @Pattern(regexp = "^E[0-9]+$", message = "clave debe cumplir formato E + dígitos")
        String clave,
        @Valid @RequestBody UpdateEmpleadoRequest request
    ) {
        return empleadoService.update(clave, request);
    }

    @Operation(summary = "Eliminar empleado")
    @ApiResponse(responseCode = "204", description = "Empleado eliminado")
    @ApiResponse(responseCode = "400", description = "Clave inválida")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @ApiResponse(responseCode = "404", description = "Empleado no encontrado")
    @DeleteMapping("/{clave}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
        @PathVariable
        @Pattern(regexp = "^E[0-9]+$", message = "clave debe cumplir formato E + dígitos")
        String clave
    ) {
        empleadoService.delete(clave);
    }
}
