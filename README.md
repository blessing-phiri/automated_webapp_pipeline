# Zero-Touch AWS Deployment Pipeline

> Fully automated provisioning and deployment of a production-grade web application on AWS — from a single `git push` to a live, configured server in under 10 minutes, with zero manual intervention.

[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![IaC](https://img.shields.io/badge/IaC-Terraform-7B42BC?style=flat-square&logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Config](https://img.shields.io/badge/Config-Ansible-EE0000?style=flat-square&logo=ansible&logoColor=white)](https://www.ansible.com/)
[![Cloud](https://img.shields.io/badge/Cloud-AWS-FF9900?style=flat-square&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![OS](https://img.shields.io/badge/OS-RHEL%209-EE0000?style=flat-square&logo=red-hat&logoColor=white)](https://www.redhat.com/)

---

## 📌 Problem Statement

Manual infrastructure provisioning is slow, error-prone, and impossible to scale. Every new environment — dev, staging, prod — requires repeating the same steps, introducing inconsistency and human error.

This project solves that by combining **Infrastructure as Code**, **Configuration Management**, and **CI/CD automation** into a single, repeatable pipeline that provisions identical environments on demand, every time.

---

## ⚡ Key Outcomes

| Metric | Result |
|--------|--------|
| Deployment time (infra + config + app) | **< 10 minutes** |
| Manual steps required | **0** |
| Environment consistency | **100% (idempotent)** |
| Pipeline trigger | **Git push to main** |
| Infrastructure teardown | **Fully automated** |

---

## 🏗️ Architecture

```
Developer
    │
    └── git push
            │
            ▼
    ┌─────────────────┐
    │  GitHub Actions  │  ← Orchestrates entire pipeline
    └────────┬────────┘
             │
     ┌───────┴────────┐
     │                │
     ▼                ▼
┌─────────┐    ┌────────────┐
│Terraform│    │  Destroy   │
│ Deploy  │    │  Workflow  │
└────┬────┘    └────────────┘
     │
     ▼
┌──────────────────────────────┐
│         AWS Infrastructure    │
│                               │
│  VPC (10.0.0.0/16)           │
│  ├── Public Subnet            │
│  │   └── EC2 t3.micro (RHEL9)│
│  ├── Internet Gateway         │
│  ├── Route Tables             │
│  └── Security Group           │
└──────────────┬───────────────┘
               │
               ▼
        ┌──────────────┐
        │    Ansible    │  ← Configures server & deploys app
        │               │
        │  - Updates OS │
        │  - Installs   │
        │    Nginx      │
        │  - Deploys    │
        │    App        │
        └──────────────┘
               │
               ▼
        🌐 Live Web App
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| CI/CD Orchestration | GitHub Actions | Pipeline trigger and coordination |
| Infrastructure as Code | Terraform >= 1.6.0 | Provision AWS resources |
| Configuration Management | Ansible >= 2.15.0 | Server setup and app deployment |
| Cloud Provider | AWS (EC2, VPC, IAM) | Host infrastructure |
| Web Server | Nginx | Serve application |
| Operating System | RHEL 9 | Production OS |
| Scripting | Bash | Automation and orchestration |

---

## 📁 Project Structure

```
automated_webapp_pipeline/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Main CI/CD pipeline
│       └── destroy.yml         # Infrastructure teardown
├── terraform/
│   ├── modules/
│   │   ├── network/            # VPC, subnets, IGW, routing
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   └── compute/            # EC2, security groups
│   │       ├── main.tf
│   │       ├── variables.tf
│   │       └── outputs.tf
│   └── environments/
│       └── dev/
│           ├── main.tf
│           ├── variables.tf
│           └── outputs.tf
├── ansible/
│   ├── playbooks/
│   │   └── deploy_webapp.yml   # Main deployment playbook
│   ├── templates/
│   │   └── nginx.conf.j2       # Nginx config template
│   ├── inventory/
│   │   └── hosts               # Dynamic inventory
│   └── ansible.cfg
├── app/
│   └── index.html              # Web application
├── scripts/
│   ├── deploy.sh               # Deployment orchestration
│   └── destroy.sh              # Cleanup script
├── .gitignore
└── README.md
```

---

## 🚀 How It Works

### Pipeline Flow

**1. Developer pushes to `main`**
GitHub Actions triggers automatically.

**2. Terraform provisions infrastructure**
```hcl
# Modular approach — network and compute are separate concerns
module "network" {
  source      = "../../modules/network"
  vpc_cidr    = var.vpc_cidr
  project_name = var.project_name
  environment  = var.environment
}

module "compute" {
  source            = "../../modules/compute"
  vpc_id            = module.network.vpc_id
  public_subnet_id  = module.network.public_subnet_id
  instance_type     = var.instance_type
  project_name      = var.project_name
  environment       = var.environment
}
```

**3. Ansible configures the server**
Idempotent — safe to run multiple times without side effects.
```yaml
- name: Deploy Web Application
  hosts: webservers
  become: yes
  tasks:
    - name: Install and configure Nginx
      yum:
        name: nginx
        state: present

    - name: Deploy application
      copy:
        src: ../../app/
        dest: /var/www/html/
        owner: nginx
        group: nginx
        mode: '0644'

    - name: Ensure Nginx is running
      systemd:
        name: nginx
        state: started
        enabled: yes
```

**4. Application is live**
End-to-end, no human involved.

---

## 🔒 Security Considerations

> **Production note:** The SSH security group rule in this project allows inbound access from `0.0.0.0/0` for demonstration purposes. In a production environment this would be replaced with one of the following:
> - **AWS Systems Manager Session Manager** — no inbound SSH required at all
> - **Bastion host** in a separate management subnet with access restricted to known IP ranges
> - **VPN-gated access** — SSH only accessible from within a private VPN

Other security practices implemented:
- IAM roles follow least-privilege principle
- SSH key pair authentication (no password auth)
- Security groups restrict HTTP/HTTPS to required ports only
- Sensitive values (AWS credentials, SSH keys) stored as GitHub Secrets — never in code

---

## ⚙️ Setup & Usage

### Prerequisites
- AWS account with programmatic access
- GitHub repository with Actions enabled
- Terraform >= 1.6.0
- Ansible >= 2.15.0
- AWS CLI v2

### GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `EC2_PRIVATE_KEY` | SSH private key for EC2 access |

### Deploy

```bash
# Simply push to main — the pipeline handles everything
git push origin main
```

Or trigger manually from GitHub Actions UI.

### Destroy

```bash
# Trigger the destroy workflow from GitHub Actions
# Or run locally:
./scripts/destroy.sh
```

---

## 🔄 CI/CD Pipeline Detail

```yaml
# .github/workflows/deploy.yml (simplified)
name: Deploy Infrastructure and Application

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Terraform Init & Apply
        run: |
          cd terraform/environments/dev
          terraform init
          terraform apply -auto-approve

      - name: Run Ansible playbook
        run: |
          ansible-playbook -i ansible/inventory/hosts \
            ansible/playbooks/deploy_webapp.yml
```

---

## 📚 What This Demonstrates

- **Modular IaC** — Terraform modules separate network and compute concerns, making the code reusable across environments
- **Idempotent configuration** — Ansible playbooks can be run repeatedly with identical results
- **Pipeline-driven infrastructure** — No console clicks, no manual steps, fully auditable via Git history
- **Separation of concerns** — Each tool does what it does best: Terraform for provisioning, Ansible for configuration, GitHub Actions for orchestration
- **Production patterns** — Environment-based directory structure, secrets management, teardown automation

---

## 🔮 Future Improvements

- [ ] Add Terraform remote state with S3 backend and DynamoDB locking
- [ ] Implement multi-environment support (dev/staging/prod)
- [ ] Replace SSH access with AWS SSM Session Manager
- [ ] Add Prometheus + Grafana monitoring stack
- [ ] Implement blue/green deployment strategy
- [ ] Add automated infrastructure cost reporting

---

## 👤 Author

**Blessing Phiri** — Platform Engineer | RHCA | Kubestronaut

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/blessing-phiri-614b77209/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/blessing-phiri)
[![Website](https://img.shields.io/badge/Website-000000?style=flat-square&logo=About.me&logoColor=white)](https://blessingphiri.dev)
