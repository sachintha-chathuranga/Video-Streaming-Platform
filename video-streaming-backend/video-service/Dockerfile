FROM maven:3.6.3 AS build
WORKDIR	/app
COPY pom.xml /app
RUN mvn dependency:resolve
COPY . ./app
RUN mvn clean
RUN mvn package -DskipTests -X

FROM openjdk
COPY --from=build /app/target/*.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]