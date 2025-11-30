#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    command -v terraform >/dev/null 2>&1 || { print_error "Terraform is not installed. Aborting."; exit 1; }
    command -v ansible >/dev/null 2>&1 || { print_error "Ansible is not installed. Aborting."; exit 1; }
    command -v aws >/dev/null 2>&1 || { print_error "AWS CLI is not installed. Aborting."; exit 1; }
    
    print_status "All requirements satisfied!"
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    print_status "Deploying infrastructure with Terraform..."
    
    cd terraform/environments/dev
    
    terraform init
    terraform validate
    terraform plan -out=tfplan
    
    read -p "Apply this plan? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        terraform apply tfplan
        print_status "Infrastructure deployed successfully!"
    else
        print_warning "Deployment cancelled."
        exit 0
    fi
    
    cd ../../..
}

# Get EC2 public IP from Terraform output
get_ec2_ip() {
    print_status "Getting EC2 public IP..."
    
    cd terraform/environments/dev
    EC2_IP=$(terraform output -raw web_server_public_ip)
    cd ../../..
    
    if [ -z "$EC2_IP" ]; then
        print_error "Could not retrieve EC2 IP. Aborting."
        exit 1
    fi
    
    print_status "EC2 IP: $EC2_IP"
    echo "$EC2_IP"
}

# Wait for EC2 to be ready
wait_for_ec2() {
    local ip=$1
    print_status "Waiting for EC2 instance to be ready..."
    
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -i ~/.ssh/devops-project-key.pem ec2-user@"$ip" "echo 'ready'" 2>/dev/null; then
            print_status "EC2 instance is ready!"
            return 0
        fi
        
        attempt=$((attempt + 1))
        print_status "Attempt $attempt/$max_attempts - Waiting 10 seconds..."
        sleep 10
    done
    
    print_error "EC2 instance did not become ready in time."
    exit 1
}

# Update Ansible inventory
update_inventory() {
    local ip=$1
    print_status "Updating Ansible inventory..."
    
    cat > ansible/inventory/hosts <<EOF
[webservers]
web1 ansible_host=$ip ansible_user=ec2-user ansible_ssh_private_key_file=~/.ssh/devops-project-key.pem

[webservers:vars]
ansible_python_interpreter=/usr/bin/python3
EOF
    
    print_status "Inventory updated!"
}

# Deploy application with Ansible
deploy_application() {
    print_status "Deploying application with Ansible..."
    
    cd ansible
    ansible-playbook -i inventory/hosts playbooks/deploy_webapp.yml
    cd ..
    
    print_status "Application deployed successfully!"
}

# Main execution
main() {
    print_status "Starting deployment process..."
    
    check_requirements
    deploy_infrastructure
    
    EC2_IP=$(get_ec2_ip)
    wait_for_ec2 "$EC2_IP"
    update_inventory "$EC2_IP"
    deploy_application
    
    print_status "==================================="
    print_status "Deployment completed successfully!"
    print_status "Access your application at: http://$EC2_IP"
    print_status "==================================="
}

# Run main function
main
