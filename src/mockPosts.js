// Premium technical blog posts covering DevOps, Docker, Kubernetes, CI/CD, AWS
export const MOCK_POSTS = [
  {
    $id: 'post-1',
    title: 'How I Migrated Infrastructure to AWS Graviton & Cut Costs by 40%',
    excerpt: 'A deep dive into ARM-based EC2 instances, compatibility challenges, and the performance wins we got at POD INVEST.',
    content: `## Overview
    
Migrating from x86 to AWS Graviton2/Graviton3 processors is one of the most impactful cost-optimization strategies available today. At POD INVEST, we achieved a 40% reduction in EC2 costs without sacrificing performance — in fact, we saw improvements.

## Why Graviton?

Graviton processors offer up to 40% better price-performance ratio compared to equivalent x86-based instances. For compute-heavy workloads like Node.js API servers and MongoDB-connected microservices, the gains are significant.

## The Migration Process

1. **Audit dependencies** – Ensure all native modules support ARM64.
2. **Update Docker images** – Use multi-arch builds with \`buildx\`.
3. **Test in staging** – Shadow traffic before full cutover.
4. **Monitor closely** – CloudWatch metrics for CPU, memory, latency.

## Results

- 40% reduction in EC2 monthly spend
- 12% improvement in API response times
- Zero downtime deployment using blue-green strategy`,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    date: '2026-05-18',
    author: 'Md Shadab Azam Ansari',
    category: 'AWS',
    readTime: '6 min read',
  },
  {
    $id: 'post-2',
    title: 'CI/CD with GitHub Actions: From Zero to Production in 30 Minutes',
    excerpt: 'Setting up a full CI/CD pipeline for a NestJS API on EC2 with Nginx, SSL, and zero-downtime deployments.',
    content: `## Introduction

Automating deployments saves hours every week. Here's the exact pipeline I built at POD INVEST for our NestJS backend.

## The Stack

- **NestJS** API (TypeScript)
- **EC2** (Ubuntu, ARM64 Graviton)
- **Nginx** as reverse proxy
- **PM2** for process management
- **GitHub Actions** for CI/CD

## The Pipeline

\`\`\`yaml
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: \${{ secrets.EC2_HOST }}
          username: ubuntu
          key: \${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /app
            git pull origin main
            npm ci
            npm run build
            pm2 reload all
\`\`\`

## Zero-Downtime with PM2

Using \`pm2 reload\` instead of \`pm2 restart\` ensures connections drain gracefully before the process restarts.`,
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80',
    date: '2026-05-10',
    author: 'Md Shadab Azam Ansari',
    category: 'CI/CD',
    readTime: '8 min read',
  },
  {
    $id: 'post-4',
    title: 'Docker + Kubernetes: Deploying a MERN App at Scale',
    excerpt: 'A complete walkthrough of containerising a MERN stack app with Docker and orchestrating it on Kubernetes.',
    content: `## The Goal

Deploy a production-grade MERN app (MongoDB, Express, React, Node) using Docker and Kubernetes with auto-scaling.

## Docker Setup

### API Dockerfile

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
\`\`\`

## Kubernetes Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    spec:
      containers:
        - name: api
          image: your-registry/api:latest
          ports:
            - containerPort: 5000
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&q=80',
    date: '2026-04-12',
    author: 'Md Shadab Azam Ansari',
    category: 'Kubernetes',
    readTime: '12 min read',
  },
  {
    $id: 'post-5',
    title: 'AWS Lambda + API Gateway: Building Serverless APIs',
    excerpt: 'How I built and deployed serverless APIs using Lambda, API Gateway, and DynamoDB — with real-world gotchas.',
    content: `## Why Serverless?

Pay only for what you use. No servers to manage. Auto-scaling built in. Perfect for APIs with variable traffic.

## Architecture

- **API Gateway** – HTTP endpoint
- **Lambda** – Business logic (Node.js)
- **DynamoDB** – NoSQL data store

## Cold Start Mitigation

Cold starts are the #1 complaint with Lambda. Solutions:

1. Use Provisioned Concurrency for critical functions
2. Keep packages small – bundle with esbuild
3. Avoid heavy ORMs – use lightweight AWS SDK v3`,
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80',
    date: '2026-03-30',
    author: 'Md Shadab Azam Ansari',
    category: 'AWS',
    readTime: '9 min read',
  },
  {
    $id: 'post-7',
    title: 'Mastering Docker Multi-stage Builds for Leaner Images',
    excerpt: 'How to cut down your Docker image sizes by up to 90% using multi-stage builds for React and Go apps.',
    content: `## Why Image Size Matters

Smaller Docker images deploy faster, consume less disk space, and reduce the attack surface for vulnerabilities.

## React Application: The Wrong Way
Using a single stage to build and serve React results in a ~1.2GB image because it contains all node_modules and dev dependencies.

## The Multi-stage Way
\`\`\`dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

## Results
Our final image size dropped from **1.15GB** to just **24MB**! That is a 97% reduction in size.`,
    coverImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&q=80',
    date: '2026-03-01',
    author: 'Md Shadab Azam Ansari',
    category: 'Docker',
    readTime: '6 min read',
  },
  {
    $id: 'post-8',
    title: 'GitOps Best Practices: ArgoCD in Production',
    excerpt: 'Implementing continuous delivery with ArgoCD, Kubernetes, and Git as the single source of truth.',
    content: `## What is GitOps?

GitOps is a paradigm where the desired state of your Kubernetes cluster is stored in Git repositories. ArgoCD is the tool that synchronises Git with active cluster configurations.

## Key GitOps Rules

1. **Git as the Single Source of Truth**: Never edit resources using \`kubectl edit\`.
2. **Pull-based Syncing**: Let ArgoCD pull configurations, instead of pushing from CI runners.
3. **Automated Drift Detection**: Automatically revert manual cluster modifications.

## Setting Up ArgoCD Application

\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: billing-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: 'https://github.com/my-org/billing-gitops'
    targetRevision: HEAD
    path: k8s/prod
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: billing
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80',
    date: '2026-02-14',
    author: 'Md Shadab Azam Ansari',
    category: 'DevOps',
    readTime: '9 min read',
  },
  {
    $id: 'post-9',
    title: 'Kubernetes HPA: Auto-scaling Under Heavy Traffic',
    excerpt: 'Configuring Horizontal Pod Autoscaler based on CPU and custom metrics for high availability.',
    content: `## The Autoscaling Problem

Sudden traffic spikes can crash your application pods before you can respond. Kubernetes Horizontal Pod Autoscaler (HPA) solves this by automatically spinning up replicas.

## Core Prerequisites

- **Metrics Server** must be running in the cluster.
- Pods must have **CPU and Memory requests** defined.

## Defining the HPA

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: payment-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: payment-service
  minReplicas: 2
  maxReplicas: 15
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 75
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80',
    date: '2026-02-05',
    author: 'Md Shadab Azam Ansari',
    category: 'Kubernetes',
    readTime: '7 min read',
  },
  {
    $id: 'post-10',
    title: 'Infrastructure as Code: Terraform vs. OpenTofu',
    excerpt: 'An unbiased comparison of Terraform and the Linux Foundation’s open-source fork, OpenTofu.',
    content: `## Background

In 2023, HashiCorp shifted Terraform from the Mozilla Public License to the Business Source License (BSL). The community responded by forking the code to create **OpenTofu**, now managed by the Linux Foundation.

## Standard Differences

- **Licensing**: Terraform is under BSL, while OpenTofu remains 100% open-source under MPL.
- **Provider Registry**: OpenTofu uses its own distributed registry; Terraform uses the HashiCorp registry.
- **New Features**: OpenTofu 1.6+ introduced state encryption and testing improvements.

## Compatibility

At present, OpenTofu is a drop-in replacement for Terraform <=1.5. Switching is as easy as running:
\`\`\`bash
tofu init
tofu plan
tofu apply
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&q=80',
    date: '2026-01-20',
    author: 'Md Shadab Azam Ansari',
    category: 'DevOps',
    readTime: '8 min read',
  },
  {
    $id: 'post-11',
    title: 'Jenkins Shared Libraries: Modularising Build Scripts',
    excerpt: 'Ditch the duplicate Jenkinsfiles. Write reusable, clean build pipelines with custom Groovy shared libraries.',
    content: `## The Pipeline Spaghetti Problem

If you have 50 microservices, maintaining 50 separate Jenkinsfiles with duplicate build, test, and deploy stages is a maintenance nightmare.

## The Solution: Shared Libraries

A Shared Library is a collection of Groovy files stored in a git repository that Jenkins imports at runtime.

## Directory Structure
\`\`\`
my-shared-library/
├── src/
│   └── com/helper/Builder.groovy
├── vars/
│   └── buildMicroservice.groovy
\`\`\`

## Using in a Jenkinsfile
\`\`\`groovy
@Library('my-shared-library') _

buildMicroservice {
    appName = 'orders-service'
    language = 'nodejs'
    port = 8080
}
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&q=80',
    date: '2026-01-05',
    author: 'Md Shadab Azam Ansari',
    category: 'CI/CD',
    readTime: '9 min read',
  },
  {
    $id: 'post-12',
    title: 'Monitoring Kubernetes Cluster with Prometheus and Grafana',
    excerpt: 'A step-by-step setup guide using Helm to deploy the kube-prometheus-stack for enterprise observability.',
    content: `## The Need for Observability

You cannot debug what you do not measure. Monitoring cluster health, pod resource usages, and API latency is critical for running applications at scale.

## The Observability Stack

- **Prometheus** for metrics collection and storage.
- **Grafana** for dashboard visualization.
- **Node Exporter** to extract infrastructure-level metrics.

## Deploying with Helm

\`\`\`bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus-stack prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    date: '2025-12-18',
    author: 'Md Shadab Azam Ansari',
    category: 'Kubernetes',
    readTime: '10 min read',
  },
  {
    $id: 'post-13',
    title: 'Designing Secure IAM Policies on AWS',
    excerpt: 'Practising the Principle of Least Privilege (PoLP) to lock down AWS accounts and prevent security breaches.',
    content: `## Overview

Over 80% of cloud security breaches are caused by misconfigured IAM roles. Granting wildcards (\`*\`) to developer accounts or EC2 roles is a high security risk.

## Key Rules for AWS IAM

1. **Never use the Root Account** for daily operations.
2. **Enable MFA** on all user accounts.
3. **Practise Least Privilege**: Grant only the permissions absolutely necessary.

## Example of Secure Policy

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::app-production-assets/*"
    }
  ]
}
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80',
    date: '2025-12-05',
    author: 'Md Shadab Azam Ansari',
    category: 'AWS',
    readTime: '7 min read',
  },
  {
    $id: 'post-14',
    title: 'How to Set Up Nginx Reverse Proxy with Let\'s Encrypt',
    excerpt: 'A production deployment guide for routing domain traffic to backend servers securely with automated SSL.',
    content: `## Why Use a Reverse Proxy?

A reverse proxy acts as an intermediary, routing external client requests to internal microservices while handling SSL termination, rate limiting, and request buffering.

## Configuration File
Save this in \`/etc/nginx/sites-available/app\`:
\`\`\`nginx
server {
    listen 80;
    server_name mydomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
\`\`\`

## Adding SSL with Certbot
\`\`\`bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d mydomain.com
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80',
    date: '2025-11-20',
    author: 'Md Shadab Azam Ansari',
    category: 'DevOps',
    readTime: '6 min read',
  },
  {
    $id: 'post-15',
    title: 'Understanding Docker Networking Drivers Deep Dive',
    excerpt: 'An in-depth analysis of Bridge, Host, Overlay, and Macvlan drivers and when to choose each.',
    content: `## Introduction

Docker containers do not live in isolation; they must communicate. Choosing the correct networking driver shapes the performance, routing, and security.

## Core Drivers

- **Bridge**: The default driver. Good for standalone containers communicating inside the same host.
- **Host**: Removes networking isolation. Improves throughput but exposes containers to port conflicts.
- **Overlay**: Connects multiple docker daemons together. Essential for Docker Swarm and distributed systems.
- **Macvlan**: Assigns a unique MAC address directly, making it look like a physical device on your router.`,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    date: '2025-11-02',
    author: 'Md Shadab Azam Ansari',
    category: 'Docker',
    readTime: '11 min read',
  },
  {
    $id: 'post-16',
    title: 'Helm Charts: Templating Kubernetes YAMLs Like a Pro',
    excerpt: 'Tired of writing duplicate Kubernetes configs? Package and template your applications with Helm.',
    content: `## The YAML Overload

If you deploy to Dev, Staging, and Production, copy-pasting Kubernetes deployments leads to huge config drift. Helm solves this by parameterising YAML configs.

## Creating a Helm Chart

\`\`\`bash
helm create my-webapp
\`\`\`

## Templating in Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-deploy
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: web
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&q=80',
    date: '2025-10-15',
    author: 'Md Shadab Azam Ansari',
    category: 'Kubernetes',
    readTime: '8 min read',
  },
  {
    $id: 'post-17',
    title: 'Building a High Availability PostgreSQL Cluster on AWS',
    excerpt: 'Strategies for setting up replication, active-passive failover, and automated backups for core databases.',
    content: `## Overview

Data is the lifeblood of any system. If your master database crashes, your entire business stops. Setting up high-availability clusters is a non-negotiable step.

## HA Topology

- **Primary Database**: Receives all read and write queries.
- **Standby Database**: Replicates data asynchronously or synchronously.
- **PgBouncer**: Manages connection pooling.

## AWS RDS Approach
The easiest way on AWS is checking the **Multi-AZ Deployment** checkbox. AWS manages synchronous replication, health checks, and dns failover automatically.`,
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80',
    date: '2025-10-01',
    author: 'Md Shadab Azam Ansari',
    category: 'AWS',
    readTime: '9 min read',
  },
  {
    $id: 'post-18',
    title: 'Migrating from Jenkins to GitLab CI: A Migration Guide',
    excerpt: 'A comprehensive migration map to rewrite Jenkins declarative pipelines into GitLab CI yaml configs.',
    content: `## Why Migrate?

Jenkins is a powerful tool but requires constant maintenance, plugin updates, and dedicated server configurations. GitLab CI provides a modern, container-first approach natively integrated into repository systems.

## Comparative Overview

| Concept | Jenkins | GitLab CI |
|---------|---------|-----------|
| Config | Jenkinsfile (Groovy) | .gitlab-ci.yml (YAML) |
| Runner | Jenkins Agent | GitLab Runner |
| Artifacts | ArchiveArtifacts | artifacts:paths |

## Writing GitLab Config
\`\`\`yaml
stages:
  - build
  - test

build_job:
  stage: build
  image: node:18-alpine
  script:
    - npm ci
    - npm run build
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&q=80',
    date: '2025-09-18',
    author: 'Md Shadab Azam Ansari',
    category: 'CI/CD',
    readTime: '8 min read',
  },
  {
    $id: 'post-21',
    title: 'Jenkins Declarative vs. Scripted Pipeline: Comparison',
    excerpt: 'Detailed breakdown of Groovy scripting styles in Jenkins and when to use declarative syntax.',
    content: `## Overview

Jenkins pipelines can be written in two syntaxes: **Declarative** (introduced later to simplify writing configs) and **Scripted** (traditional, fully customisable Groovy scripts).

## Declarative Pipeline
Easiest, opinionated layout with clear blocks.
\`\`\`groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building...'
            }
        }
    }
}
\`\`\`

## Scripted Pipeline
Offers total flexibility but can become hard to maintain.
\`\`\`groovy
node {
    stage('Build') {
        echo 'Building...'
    }
}
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1542744095-2917c4569f24?w=600&q=80',
    date: '2025-08-01',
    author: 'Md Shadab Azam Ansari',
    category: 'CI/CD',
    readTime: '6 min read',
  },
  {
    $id: 'post-22',
    title: 'Secret Management in Kubernetes using HashiCorp Vault',
    excerpt: 'Avoid committing plain-text credentials. Inject secrets dynamically into pod layers with HashiCorp Vault.',
    content: `## The Vulnerability

Using standard Kubernetes secrets is insecure because they are merely Base64-encoded strings, easily decoded by anyone with read access to the namespace.

## Enter HashiCorp Vault

Vault secure, encrypts, and dynamically leases access credentials.

## Injection Mechanism

By using the **Vault Agent Injector**, we inject secrets directly as temporary files inside the container memory.

\`\`\`yaml
metadata:
  annotations:
    vault.hashicorp.com/agent-inject: 'true'
    vault.hashicorp.com/role: 'my-app'
    vault.hashicorp.com/agent-inject-secret-config: 'secret/data/config'
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80',
    date: '2025-07-15',
    author: 'Md Shadab Azam Ansari',
    category: 'Kubernetes',
    readTime: '11 min read',
  },
  {
    $id: 'post-24',
    title: 'AWS VPC Design: Best Practices for Security and Subnets',
    excerpt: 'How to architecture clean Virtual Private Clouds with public, private, and isolated data subnets.',
    content: `## VPC Core Topology

A solid VPC design isolates internal systems from public networks. A standard setup requires splitting the VPC into public and private subnets across multiple Availability Zones.

## Subnet Architecture

- **Public Subnet**: Receives internet traffic via Internet Gateway. Renders NAT Gateways and Load Balancers.
- **Private Subnet**: Houses business API servers. Communicates with outside internet via NAT Gateway.
- **Data Subnet**: Isolated. Holds MongoDB or PostgreSQL database servers. Zero external inbound/outbound rules.`,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    date: '2025-06-18',
    author: 'Md Shadab Azam Ansari',
    category: 'AWS',
    readTime: '8 min read',
  },
  {
    $id: 'post-25',
    title: 'Docker Container Security: Auditing and Hardening',
    excerpt: 'Protecting your containers from security vulnerabilities using Trivy, non-root users, and read-only root filesystems.',
    content: `## Security Checklist

Unsecured Docker containers can lead to host-level security compromises. Practise defensive containerisation.

## Best Practices

1. **Scan Images Regularly**: Use Trivy to audit packages.
2. **Never Run as Root**: Declare a dedicated user.
3. **Use Read-Only Root Filesystems**: Prevent files from being written or altered at runtime.

\`\`\`dockerfile
FROM node:18-alpine
# Declare non-root user
USER node
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&q=80',
    date: '2025-06-05',
    author: 'Md Shadab Azam Ansari',
    category: 'Docker',
    readTime: '7 min read',
  },
  {
    $id: 'post-26',
    title: 'Implementing Canary Deployments with Istio Service Mesh',
    excerpt: 'Configuring traffic routing rules in Kubernetes to release features to 5% of users safely.',
    content: `## What is a Canary Deployment?

Instead of routing 100% of traffic to a new version, a canary deployment routes a small slice (e.g. 5%) of production traffic to test for bugs, before a full rollout.

## Istio VirtualService Routing

\`\`\`yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
spec:
  hosts:
  - recommendations
  http:
  - route:
    - destination:
        host: recommendations
        subset: v1
      weight: 95
    - destination:
        host: recommendations
        subset: v2
      weight: 5
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80',
    date: '2025-05-20',
    author: 'Md Shadab Azam Ansari',
    category: 'Kubernetes',
    readTime: '9 min read',
  },
  {
    $id: 'post-27',
    title: 'Jenkins Multi-Branch Pipelines: Dynamic CI/CD Setup',
    excerpt: 'Automatically discover new repository branches and execute pipelines dynamically.',
    content: `## The Challenge

Manually creating build configurations for every feature branch developers create is tedious.

## Enter Multi-Branch Pipelines

A Jenkins Multi-Branch pipeline automates this. Simply declare a single Jenkinsfile in the root, and Jenkins scans the git repository dynamically.

## Dynamic Pipeline Execution
Whenever a developer commits a new branch (e.g., \`feature/login\`), Jenkins automatically starts a matching build job and registers test feedback on GitHub pull requests.`,
    coverImage: 'https://images.unsplash.com/photo-1542744095-2917c4569f24?w=600&q=80',
    date: '2025-05-02',
    author: 'Md Shadab Azam Ansari',
    category: 'CI/CD',
    readTime: '6 min read',
  },
  {
    $id: 'post-29',
    title: 'Containerising Python Applications with Poetry and Docker',
    excerpt: 'Using Poetry package manager for clean, deterministic Python container image dependency installations.',
    content: `## The Virtualenv Problem in Containers

Deploying Python applications using raw pip requirements files can lead to subtle runtime dependency version drift.

## Standard Poetry Setup

\`\`\`dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN pip install poetry
COPY pyproject.toml poetry.lock ./
# Avoid creating virtualenv in container
RUN poetry config virtualenvs.create false && poetry install --no-dev
COPY . .
CMD ["python", "main.py"]
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&q=80',
    date: '2025-04-05',
    author: 'Md Shadab Azam Ansari',
    category: 'Docker',
    readTime: '7 min read',
  },
  {
    $id: 'post-30',
    title: 'Troubleshooting Kubernetes CrashLoopBackOff: A Step-by-Step Guide',
    excerpt: 'Mastering debugging workflows for resolving pod restart crashes like a senior engineer.',
    content: `## What is CrashLoopBackOff?

This error code indicates that the Kubernetes pod successfully started but exited or crashed immediately afterward, causing Kubernetes to wait before restarting it again.

## Standard Debugging Steps

1. **Get Pod Logs**:
   \`\`\`bash
   kubectl logs <pod-name> --previous
   \`\`\`
2. **Describe the Pod Configuration**:
   \`\`\`bash
   kubectl describe pod <pod-name>
   \`\`\`
3. **Validate ConfigMaps and Secrets**: Ensure environment variables are loaded properly.`,
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80',
    date: '2025-03-20',
    author: 'Md Shadab Azam Ansari',
    category: 'Kubernetes',
    readTime: '8 min read',
  },
  {
    $id: 'post-31',
    title: 'Deploying Next.js on AWS ECS Fargate',
    excerpt: 'Containerising Next.js and routing traffic securely using AWS ECS, Application Load Balancers, and Fargate.',
    content: `## The Fargate Advantage

AWS Fargate runs containers serverlessly. You do not have to provision or scale EC2 instances; you simply define CPU and memory parameters.

## Architectural Flow

- **Route 53** -> **Application Load Balancer** -> **ECS Fargate Service** -> **AWS CloudWatch**

## Key Gotcha
Next.js outputs built-in server features inside Docker, so make sure \`output: "standalone"\` is configured in \`next.config.js\` to keep the docker image lightweight.`,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    date: '2025-03-05',
    author: 'Md Shadab Azam Ansari',
    category: 'AWS',
    readTime: '9 min read',
  },
  {
    $id: 'post-32',
    title: 'Database Migrations in CI/CD: Strategies for Zero Downtime',
    excerpt: 'Designing reliable database schema migrations that deploy safely during deployment processes.',
    content: `## The Risk

Running database migrations concurrently with API updates can lead to connection failures, database locks, or server downtime if not carefully managed.

## The Expand-and-Contract Pattern

1. **Expand**: Add new database columns alongside old columns (supporting old API versions).
2. **Migrate**: Copy data from old columns to new columns.
3. **Deploy**: Roll out the new API version.
4. **Contract**: Safely delete the old database columns once stable.`,
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80',
    date: '2025-02-18',
    author: 'Md Shadab Azam Ansari',
    category: 'DevOps',
    readTime: '8 min read',
  },
  {
    $id: 'post-34',
    title: 'AWS CloudWatch Logs & Metrics: Custom Dashboard Setup',
    excerpt: 'Consolidating infrastructure and API metrics in real-time onto premium observability dashboards.',
    content: `## Overview

A custom dashboard gives operational visibility to key stakeholders.

## Core Metrics to Track

- **EC2 CPU & Network I/O**
- **ALB Response Times & 5xx HTTP Status Rates**
- **RDS Active Connections & Storage Limits**

## Automation with Terraform
AWS CloudWatch dashboards can be declared directly in your IaC code repository, ensuring easy duplication across environments.`,
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    date: '2025-01-20',
    author: 'Md Shadab Azam Ansari',
    category: 'AWS',
    readTime: '7 min read',
  },
  {
    $id: 'post-35',
    title: 'Managing Monorepos with Turborepo and Docker',
    excerpt: 'Optimising container cache strategies to build microservices fast inside unified workspaces.',
    content: `## Monorepo Speed Challenges

In large codebases, running a full docker build takes forever because docker cannot cache native package imports well.

## Turborepo Prune to the Rescue

Turborepo can prune workspace subdirectories to build only what is required.

\`\`\`bash
npx turbo prune --scope=web-api --docker
\`\`\`

This command outputs a lean workspace subset containing only the dependencies and code files of the targeted app.`,
    coverImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&q=80',
    date: '2025-01-05',
    author: 'Md Shadab Azam Ansari',
    category: 'Docker',
    readTime: '8 min read',
  },
  {
    $id: 'post-36',
    title: 'Jenkins Pipelines for Multi-Environment Environments',
    excerpt: 'Designing parameters and security checks to manage Dev, Staging, and Production stages.',
    content: `## Best Practices

A solid Jenkins pipeline must route builds through progressive testing environments safely.

## Core Rules

- **Promote Artifacts**: Build the docker image once, then push it through staging and production.
- **Manual Gates**: Require explicit developer approval before releasing code to Production.

\`\`\`groovy
stage('Deploy to Production') {
    input {
        message "Approve deployment to production?"
        ok "Deploy"
    }
    steps {
        echo 'Deploying...'
    }
}
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=600&q=80',
    date: '2024-12-18',
    author: 'Md Shadab Azam Ansari',
    category: 'CI/CD',
    readTime: '7 min read',
  },
  {
    $id: 'post-38',
    title: 'Kubernetes Ingress Controllers: Nginx vs. Traefik',
    excerpt: 'Choosing the best entry point for your cluster: a comparison of Nginx Ingress and Traefik.',
    content: `## Introduction

An Ingress Controller exposes HTTP and HTTPS routes from outside the cluster to services within the cluster.

## Nginx Ingress Controller
The de-facto standard. Extremely robust, features rich annotation configurations, and is trusted by enterprise architectures.

## Traefik Ingress
Modern, natively integrates auto-discovery features, and configures Let's Encrypt certificates automatically. Excellent for dynamic microservices.`,
    coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&q=80',
    date: '2024-11-20',
    author: 'Md Shadab Azam Ansari',
    category: 'Kubernetes',
    readTime: '8 min read',
  },
  {
    $id: 'post-39',
    title: 'Deploying Static Sites to AWS CloudFront & S3',
    excerpt: 'A blueprint for deploying fast, high-performance static websites with HTTPS and global CDN routing.',
    content: `## The Architecture

Hosting static sites (React, Vue, or static HTML) is cheapest and fastest when using AWS storage and CDN layers instead of server configurations.

## AWS Stack

1. **S3 Bucket**: Stores physical assets (HTML, CSS, JS).
2. **CloudFront**: Caches files on global edge locations.
3. **ACM (Certificate Manager)**: Renders free SSL configurations.

## Cache Invalidation
Whenever you release updates, trigger a CloudFront invalidation path (\`/*\`) to force edge servers to load the new files instantly.`,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    date: '2024-11-02',
    author: 'Md Shadab Azam Ansari',
    category: 'AWS',
    readTime: '7 min read',
  },
  {
    $id: 'post-40',
    title: 'Docker Swarm vs. Kubernetes: When to Choose Which',
    excerpt: 'A comparative analysis of orchestrator weights and operation complexities.',
    content: `## Overview

Orchestration is essential for container scaling, but choosing the right platform depends on your operational limits.

## Docker Swarm
Super easy to learn and configure. Excellent choice for small setups, single-node systems, and developers without dedicated DevOps teams.

## Kubernetes
Heavy, complex, but extremely powerful. Offers advanced scaling parameters, custom extensions, and is the absolute standard for enterprise architectures.`,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    date: '2024-10-18',
    author: 'Md Shadab Azam Ansari',
    category: 'Docker',
    readTime: '8 min read',
  },
  {
    $id: 'post-41',
    title: 'Designing Event-Driven Architectures with AWS EventBridge',
    excerpt: 'Routing microservice events seamlessly using AWS EventBridge serverless event buses.',
    content: `## Why EventBridge?

EventBridge facilitates loose coupling. Instead of APIs directly invoking other APIs, they simply publish events to a central event bus.

## Event Schema Definition

\`\`\`json
{
  "Source": "custom.orderService",
  "DetailType": "OrderCompleted",
  "Detail": {
    "orderId": "XYZ-987",
    "amount": 149.50
  }
}
\`\`\`

## Event Consumers
Target endpoints like AWS Lambda, Step Functions, or third-party webhooks receive events matching designated routing rules.`,
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80',
    date: '2024-10-05',
    author: 'Md Shadab Azam Ansari',
    category: 'AWS',
    readTime: '8 min read',
  },
  {
    $id: 'post-42',
    title: 'CI/CD Pipeline Security: Hardening GitHub Runners',
    excerpt: 'Protecting your build pipelines from dependency injection attacks and malicious code changes.',
    content: `## The Vulnerability

Attackers are targeting CI pipelines to inject malicious code into production servers or steal API credentials from repository secrets.

## Key Hardening Guidelines

1. **Lock Down Runner Permissions**: Grant write access to repository layers only when necessary.
2. **Pin Action Versions**: Avoid using \`actions/checkout@v3\`. Pin exact SHA hashes instead.
3. **Audit Pull Requests**: Never run pipelines automatically on pull requests from unverified external contributors.`,
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80',
    date: '2024-09-20',
    author: 'Md Shadab Azam Ansari',
    category: 'CI/CD',
    readTime: '9 min read',
  },
  {
    $id: 'post-44',
    title: 'Kubernetes Storage Classes: Dynamic Provisioning with EBS',
    excerpt: 'How to manage persistent volumes dynamically inside Kubernetes cluster nodes using AWS EBS.',
    content: `## The Stateful Challenge

Kubernetes containers are ephemeral by default. If a database pod restarts, all stored data is lost. We need dynamic volume mappings.

## StorageClass Configuration

\`\`\`yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ebs-sc
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
\`\`\`

This tells Kubernetes to automatically provision EBS volumes on AWS whenever a pod requests persistent storage.`,
    coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&q=80',
    date: '2024-08-20',
    author: 'Md Shadab Azam Ansari',
    category: 'Kubernetes',
    readTime: '8 min read',
  },
  {
    $id: 'post-45',
    title: 'Docker Volume Mounts vs. Bind Mounts: Key Differences',
    excerpt: 'Understanding storage mechanisms in Docker and when to choose volumes over host path mounts.',
    content: `## Introduction

Docker offers two main approaches to persisting files inside container hosts: **Volumes** and **Bind Mounts**.

## Volumes
Managed entirely by Docker. Files are stored in Docker-specific directories, secure from host process modifications. Best choice for database storage.

## Bind Mounts
Map a container path directly to a host directory. Highly useful during local development to hot-reload code updates instantly.`,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
    date: '2024-08-05',
    author: 'Md Shadab Azam Ansari',
    category: 'Docker',
    readTime: '6 min read',
  },
  {
    $id: 'post-46',
    title: 'Jenkins Integration with Slack for Deployment Notifications',
    excerpt: 'Keep your engineering team updated with automated build statuses posted directly to Slack channels.',
    content: `## Why Notify?

Observability should be collaborative. Real-time build alerts let teams know when deployments start, succeed, or fail.

## Setup Steps

1. **Install Slack Plugin** inside Jenkins configuration.
2. **Configure Webhook** credentials inside the Slack Admin area.
3. **Declare Stage Step** inside your Jenkinsfile Groovy pipeline:

\`\`\`groovy
post {
    failure {
        slackSend channel: '#deploy-alerts',
                  color: '#FF0000',
                  message: "BUILD FAILED: Job \${env.JOB_NAME} [\${env.BUILD_NUMBER}]"
    }
}
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1542744095-2917c4569f24?w=600&q=80',
    date: '2024-07-20',
    author: 'Md Shadab Azam Ansari',
    category: 'CI/CD',
    readTime: '7 min read',
  },
  {
    $id: 'post-48',
    title: 'AWS Route53 Traffic Routing & Failover Strategies',
    excerpt: 'Designing reliable disaster recovery routing systems using Route53 active-passive health checks.',
    content: `## Overview

Disaster recovery is a critical component of enterprise operations.

## Routing Architectures

- **Latency-Based Routing**: Route users to the AWS region that provides the lowest network latency.
- **Failover Routing**: Automatically route users to a secondary backup site if the primary site fails health checks.
- **Weighted Routing**: Route a percentage of traffic to test new production regions.`,
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    date: '2024-06-20',
    author: 'Md Shadab Azam Ansari',
    category: 'AWS',
    readTime: '8 min read',
  },
  {
    $id: 'post-50',
    title: 'Kubernetes DaemonSets and StatefulSets: When to Use Them',
    excerpt: 'Understanding core workload definitions in Kubernetes for running logs agents and relational databases.',
    content: `## Introduction

Standard deployments are stateless and ephemeral. For custom architectures, Kubernetes offers specialized controllers.

## DaemonSets
Ensures that all (or some) nodes run a copy of a Pod. Highly useful for logging agents (e.g., Fluentd) and monitoring agents (e.g., Prometheus Node Exporter).

## StatefulSets
Manages workloads that require unique identity configurations, including persistent hostname strings and dedicated volume mappings (e.g., PostgreSQL, Elasticsearch).`,
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&q=80',
    date: '2024-05-20',
    author: 'Md Shadab Azam Ansari',
    category: 'Kubernetes',
    readTime: '8 min read',
  },
  {
    $id: 'post-51',
    title: 'Container Orchestration Security: Network Policies in Kubernetes',
    excerpt: 'Practising network micro-segmentation by limiting pod-to-pod communication channels.',
    content: `## The Default Risk

By default, Kubernetes networking allows every pod in the cluster to talk to every other pod. This means if a frontend container is compromised, the attacker can access the core database directly.

## Hardening with NetworkPolicies

NetworkPolicies act as cluster firewall rules.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
spec:
  podSelector:
    matchLabels:
      app: database
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api-server
\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80',
    date: '2024-05-02',
    author: 'Md Shadab Azam Ansari',
    category: 'Kubernetes',
    readTime: '10 min read',
  }
];
