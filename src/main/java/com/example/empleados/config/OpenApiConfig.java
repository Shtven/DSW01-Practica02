package com.example.empleados.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI empleadosOpenApi() {
        String securitySchemeName = "basicAuth";

        return new OpenAPI()
            .info(new Info()
                .title("API CRUD Empleados y Departamentos")
                .version("1.0.0")
                .description("API para gestion de empleados y departamentos con autenticacion HTTP Basic por empleado"))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .schemaRequirement(securitySchemeName,
                new SecurityScheme()
                    .name(securitySchemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("basic")
                    .description("Username: correo de empleado en minusculas, Password: contrasena de empleado"));
    }
}
