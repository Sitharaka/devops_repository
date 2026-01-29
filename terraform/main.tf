terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

resource "docker_network" "mern_net" {
  name = "mern_network"
}

resource "docker_image" "backend" {
  name         = "devops-backend:local"
  build {
    context    = "../backend"
    dockerfile = "../backend/Dockerfile"
  }
}

resource "docker_image" "frontend" {
  name         = "devops-frontend:local"
  build {
    context    = "../frontend"
    dockerfile = "../frontend/Dockerfile"
  }
}

resource "docker_container" "backend" {
  name  = "mern-backend"
  image = docker_image.backend.name
  networks_advanced {
    name = docker_network.mern_net.name
  }
  env = [
    "NODE_ENV=production",
    "MONGO_URL=mongodb://host.docker.internal:27017/devopsdb"
  ]
  ports {
    internal = 5000
    external = 5000
  }
}

resource "docker_container" "frontend" {
  name  = "mern-frontend"
  image = docker_image.frontend.name
  networks_advanced {
    name = docker_network.mern_net.name
  }
  ports {
    internal = 80
    external = 3000
  }
  depends_on = [docker_container.backend]
}
