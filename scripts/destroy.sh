#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_warning "This will destroy all infrastructure!"
read -p "Are you sure? Type 'destroy' to confirm: " confirm

if [ "$confirm" != "destroy" ]; then
    echo "Destruction cancelled."
    exit 0
fi

print_status "Destroying infrastructure..."

cd terraform/environments/dev
terraform destroy -auto-approve
cd ../../..

print_status "Infrastructure destroyed successfully!"