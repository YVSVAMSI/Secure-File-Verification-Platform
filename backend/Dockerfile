# Multi-stage Dockerfile for Spring Boot Backend (Java 21)

# STAGE 1: Build application JAR
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build production JAR package, skipping tests
RUN mvn clean package -DskipTests

# STAGE 2: Lightweight runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built jar from stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose server port (Render sets PORT env variable dynamically)
EXPOSE 8080

# Run Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
