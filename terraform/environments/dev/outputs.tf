output "vpc_id" {
  description = "VPC ID"
  value       = module.network.vpc_id
}

output "public_subnet_id" {
  description = "Public subnet ID"
  value       = module.network.public_subnet_id
}

output "web_server_public_ip" {
  description = "Web server public IP"
  value       = module.compute.public_ip
}

output "web_server_id" {
  description = "Web server instance ID"
  value       = module.compute.instance_id
}