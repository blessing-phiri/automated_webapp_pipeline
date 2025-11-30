terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC Module
module "network" {
  source = "../../modules/network"
  
  vpc_cidr           = var.vpc_cidr
  public_subnet_cidr = var.public_subnet_cidr
  project_name       = var.project_name
  environment        = var.environment
}

# EC2 Module
module "compute" {
  source = "../../modules/compute"
  
  vpc_id            = module.network.vpc_id
  public_subnet_id  = module.network.public_subnet_id
  instance_type     = var.instance_type
  key_name          = var.key_name
  project_name      = var.project_name
  environment       = var.environment
}
