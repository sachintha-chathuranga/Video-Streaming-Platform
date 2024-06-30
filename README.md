# Video-Streaming-Platform

This is a full stack project develop using springboot and angular framwork

### Setup environment variables in VS Code Launch Configuration:

1. Create launch.json file inside .vscode directory.(you might need to create it in the .vscode directory in your root directory if it doesn't exist)

2. Add the following configuration for your Spring Boot application:

````{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Spring Boot App",
      "request": "launch",
      "mainClass": "com.fourbit.sachintha.VideoServiceApplication",
      "env": {
        "DB_URL": "jdbc:mysql://localhost:3306/mydatabase",
        "DB_USER_NAME": "root",
        "DB_PASSWORD": "root",
        "AWS_REGION": "ap-south-1",
        "AWS_S3_REGION": "ap-south-1",
        "AWS_ACCESS_KEY": "rgg",
        "AWS_SECRET_KEY": "sedfe",
        "AWS_BUCKET_NAME": "ap-bucket",
        "OAUTH_ISSUER_URI": "http://localhost:8181/realms/local-keycloak",
        "OAUTH_AUDIENCE": "http://localhost:8080"
      }
    }
  ]
}```
````
