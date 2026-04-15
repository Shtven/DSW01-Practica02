package com.example.empleados.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(name = "DepartamentoResponse")
public class DepartamentoResponse {

    private String clave;
    private String nombre;
    private List<String> empleados;

    public DepartamentoResponse() {
    }

    public DepartamentoResponse(String clave, String nombre, List<String> empleados) {
        this.clave = clave;
        this.nombre = nombre;
        this.empleados = empleados;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public List<String> getEmpleados() {
        return empleados;
    }

    public void setEmpleados(List<String> empleados) {
        this.empleados = empleados;
    }
}