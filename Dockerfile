# Stage 1: Build the React frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /src

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Build the .NET backend and bundle frontend output into wwwroot
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /src

COPY backend/Server/Server.csproj backend/Server/
RUN dotnet restore backend/Server/Server.csproj

COPY backend/ backend/

RUN dotnet publish backend/Server/Server.csproj -c Release -o /Server/publish

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /Server

COPY --from=backend-builder /Server/publish .

CMD ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-10000} dotnet Server.dll"]