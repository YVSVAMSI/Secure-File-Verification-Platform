# Multi-stage Dockerfile for Spring Boot Backend (Java 21)

# STAGE 1: Build application JAR
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy pom.xml and settings.xml, resolve all dependencies into a cached layer.
# settings.xml points at Google's Maven Central mirror because repo1.maven.org
# rate-limits Render's shared build IPs with HTTP 429.
COPY pom.xml settings.xml ./
RUN mvn -s settings.xml -B dependency:go-offline

# Copy source code (only invalidates the deps layer when pom.xml changes)
COPY src ./src

# Build production JAR package
RUN mvn -s settings.xml clean package -DskipTests

# STAGE 2: Lightweight runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built jar from stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose server port
EXPOSE 8080

# Run Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
