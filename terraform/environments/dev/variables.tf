variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "Public subnet CIDR"
  type        = string
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"  # Free tier eligible
}

variable "key_name" {
  description = "EC2 key pair name"
  type        = string
  default     = "automated-web-pipeline"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "automated_pipeline"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}
