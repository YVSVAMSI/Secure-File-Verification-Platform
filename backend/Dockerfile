# Multi-stage Dockerfile for Spring Boot Backend (Java 21)

# STAGE 1: Build application JAR with Maven settings mirror
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml, settings.xml, and source code
COPY pom.xml settings.xml ./
COPY src ./src

# Build production JAR package using Google Maven Central mirror and retry flags
RUN mvn clean package -s settings.xml -DskipTests -Dmaven.wagon.http.retryHandler.count=5

# STAGE 2: Lightweight runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built jar from stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose server port
EXPOSE 8080

# Run Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
