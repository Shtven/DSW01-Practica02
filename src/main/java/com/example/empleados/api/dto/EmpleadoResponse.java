package com.example.empleados.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "EmpleadoResponse")
public class EmpleadoResponse {

    @Schema(example = "E1")
    private String clave;
    private String nombre;
    private String correo;
    private String direccion;
    private String telefono;
    private String departamentoClave;

    public EmpleadoResponse() {
    }

    public EmpleadoResponse(String clave, String nombre, String correo, String direccion, String telefono, String departamentoClave) {
        this.clave = clave;
        this.nombre = nombre;
        this.correo = correo;
        this.direccion = direccion;
        this.telefono = telefono;
        this.departamentoClave = departamentoClave;
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

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDepartamentoClave() {
        return departamentoClave;
    }

    public void setDepartamentoClave(String departamentoClave) {
        this.departamentoClave = departamentoClave;
    }
}
