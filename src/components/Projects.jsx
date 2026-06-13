import React from 'react';
import AnimateBox from './AnimateBox';

const PROJECTS = [
  {
    id: 8,
    name: 'Advanced Enterprise CI/CD Pipeline',
    repoName: 'enterprise-devops-pipeline',
    description: 'A comprehensive, enterprise-grade CI/CD pipeline integrating Jenkins, Helm, Ansible, and AWS for zero-downtime deployments.',
    extendedDescription: (
      <div style={{ marginTop: '10px', fontSize: '14px', lineHeight: '1.6' }}>
        <strong>About</strong><br />
        This project demonstrates an advanced DevOps workflow for a distributed microservices architecture. It uses Jenkins for CI/CD orchestration, Ansible for configuration management, Helm for Kubernetes deployments, and leverages AWS EKS and ECS for highly-available cloud infrastructure, connected by Kafka event streaming.<br /><br />
        <strong>⚙️ Architecture &amp; Microservices</strong><br />
        - <strong>Microservices:</strong> Decoupled backend services communicating asynchronously via Apache Kafka.<br />
        - <strong>Event-Driven:</strong> High-throughput message queuing managed by Kafka for robust data processing.<br />
        - <strong>API Gateway:</strong> Nginx configured as a reverse proxy and API Gateway, handling rate limiting and SSL termination.<br /><br />
        <strong>⚙️ CI/CD Workflow (Jenkins)</strong><br />
        - <strong>Continuous Integration:</strong> Automated building, testing, and Docker image creation triggered by GitHub webhooks.<br />
        - <strong>Security Scanning:</strong> Integrated SonarQube and Trivy for static code analysis and container vulnerability scanning.<br />
        - <strong>Artifact Management:</strong> Pushing validated Docker images to Amazon ECR.<br /><br />
        <strong>🛠️ Infrastructure &amp; Configuration (Terraform, Ansible, Helm)</strong><br />
        - <strong>Terraform (IaC):</strong> Provisioned the entire AWS infrastructure (VPC, Subnets, EKS clusters, ECS Fargate profiles) using modular Infrastructure as Code.<br />
        - <strong>Ansible:</strong> Automated provisioning of Jenkins worker nodes and baseline AWS configurations.<br />
        - <strong>Helm:</strong> Templated Kubernetes manifests to deploy microservices dynamically across Development, Staging, and Production clusters.<br />
        - <strong>Rollouts:</strong> Automated Helm chart upgrades managed within the Jenkins pipeline for reliable, zero-downtime releases.<br /><br />
        <strong>☁️ AWS Infrastructure (EKS &amp; ECS)</strong><br />
        - <strong>EKS (Elastic Kubernetes Service):</strong> Managed Kubernetes cluster spanning multiple Availability Zones for primary microservices.<br />
        - <strong>ECS (Elastic Container Service):</strong> Running auxiliary services and background workers using AWS Fargate for serverless compute.<br />
        - <strong>Auto Scaling:</strong> Configured Cluster Autoscaler and AWS ALB Ingress Controller for traffic distribution.<br />
        - <strong>Monitoring:</strong> Integrated Prometheus and Grafana for cluster health and application metrics.<br />
      </div>
    ),
    techStack: ['Jenkins', 'Helm', 'Ansible', 'AWS EKS', 'AWS ECS', 'Kafka', 'Nginx', 'Microservices', 'Docker', 'Terraform'],
    link: 'https://github.com/sazamansari?tab=repositories'
  },
  {
    id: 2,
    name: 'Deploy Flask App to Kubernetes (EKS)',
    repoName: 'Deploy-Your-Flask-App-to-Kubernetes-Using-EKS',
    description: 'Deployed a scalable Flask application using Amazon Elastic Kubernetes Service (EKS).',
    extendedDescription: (
      <div style={{ marginTop: '10px', fontSize: '14px', lineHeight: '1.6' }}>
        <strong>About</strong><br />
        A production-grade, full-stack DevOps implementation featuring a React frontend, Node.js backend, and automated AWS infrastructure managed via Terraform.<br /><br />
        <strong>☁️ Local Development</strong><br />
        Get the environment running locally in seconds using Docker Compose:<br />
        <pre style={{ background: '#eee', padding: '5px', borderRadius: '4px' }}>docker-compose up --build</pre>
        Frontend: http://localhost:5173<br />
        Backend API: http://localhost:3000<br /><br />
        <strong>🚀 Cloud Deployment (AWS)</strong><br />
        1. Provision Infrastructure<br />
        <pre style={{ background: '#eee', padding: '5px', borderRadius: '4px' }}>cd terraform/environments/dev
terraform init
terraform apply -auto-approve</pre>
        2. Connect to EKS<br />
        <pre style={{ background: '#eee', padding: '5px', borderRadius: '4px' }}>aws eks update-kubeconfig --name demo-eks --region ap-south-1</pre>
        3. Deploy Application<br />
        <pre style={{ background: '#eee', padding: '5px', borderRadius: '4px' }}># Build & Push images to ECR
docker build -t &lt;ACCOUNT_ID&gt;.dkr.ecr.ap-south-1.amazonaws.com/demo-backend:latest ./app/backend
docker push &lt;ACCOUNT_ID&gt;.dkr.ecr.ap-south-1.amazonaws.com/demo-backend:latest
# Apply Kubernetes Manifests
kubectl apply -f k8s/</pre>
        <strong>🔐 Security Architecture</strong><br />
        We use a zero-trust approach for credentials. Instead of hardcoding keys, the backend pod uses an IAM Role (...-backend-irsa) to dynamically fetch database credentials from AWS Secrets Manager at runtime.<br /><br />
        <strong>🌐 Network Isolation</strong><br />
        RDS: Placed in private subnets with no public access.<br />
        EKS Nodes: Managed in private subnets, receiving traffic only via the ALB.<br />
        ALB: Internet-facing, providing a single secure entry point.<br /><br />
        <strong>🧹 Cleanup</strong><br />
        To avoid AWS costs when finished:<br />
        <pre style={{ background: '#eee', padding: '5px', borderRadius: '4px' }}>kubectl delete -f k8s/
cd terraform/environments/dev
terraform destroy -auto-approve</pre>
      </div>
    ),
    techStack: ['Kubernetes', 'AWS EKS', 'Docker', 'Flask', 'Python'],
    link: 'https://github.com/sazamansari/Deploy-Your-Flask-App-to-Kubernetes-Using-EKS'
  },
  {
    id: 3,
    name: 'CI/CD Deployment of React App on AWS EC2',
    repoName: 'CI-CD-Deployment-of-React-Application-using-Jenkins-Docker-Nginx-on-AWS-EC2',
    description: 'A complete CI/CD pipeline deploying a React application using Jenkins, Docker, and Nginx on AWS EC2.',
    techStack: ['Jenkins', 'Docker', 'Nginx', 'AWS EC2', 'React'],
    link: 'https://github.com/sazamansari/CI-CD-Deployment-of-React-Application-using-Jenkins-Docker-Nginx-on-AWS-EC2'
  },
  {
    id: 4,
    name: 'Node.js Project with DevOps Pipeline',
    repoName: 'Node.js-project-with-a-DevOps-pipeline',
    description: 'Implemented a DevOps pipeline for a Node.js project featuring continuous integration and deployment.',
    techStack: ['Node.js', 'CI/CD', 'Docker', 'Pipeline'],
    link: 'https://github.com/sazamansari/Node.js-project-with-a-DevOps-pipeline'
  },
  {
    id: 5,
    name: 'Jenkins Setup on EC2 with React App',
    repoName: 'jenkins-setup-ec2-CI-CD-with-reactapp',
    description: 'Setup and configuration of Jenkins on AWS EC2 for automating React application builds and deployments.',
    techStack: ['Jenkins', 'AWS EC2', 'CI/CD', 'React'],
    link: 'https://github.com/sazamansari/jenkins-setup-ec2-CI-CD-with-reactapp'
  },
  {
    id: 6,
    name: 'Docker App on EC2',
    repoName: 'dockerapp-on--ec2',
    description: 'Containerized application deployment directly onto Amazon EC2 instances using Docker.',
    techStack: ['Docker', 'AWS EC2'],
    link: 'https://github.com/sazamansari/dockerapp-on--ec2'
  },
  {
    id: 7,
    name: 'GitHub Actions CI/CD',
    repoName: 'GithubAction-CI-CD',
    description: 'Automated workflows and pipelines leveraging GitHub Actions for continuous integration and delivery.',
    techStack: ['GitHub Actions', 'CI/CD', 'Automation'],
    link: 'https://github.com/sazamansari/GithubAction-CI-CD'
  }
];

export default function Projects() {
  return (
    <section className="colorlib-work" data-section="projects" id="projects">
      <div className="colorlib-narrow-content">
        <div className="row">
          <div className="col-md-12">
            <AnimateBox effect="fadeInLeft">
              <div className="row row-bottom-padded-sm">
                <div className="col-md-12">
                  <div className="about-desc">
                    <h1>DevOps &amp; Cloud Projects</h1>
                  </div>
                </div>
              </div>
            </AnimateBox>

            <div className="row">
              {PROJECTS.map((project, idx) => (
                <div className="col-md-6 col-sm-6" key={project.id}>
                  <AnimateBox effect="fadeInUp" delay={idx * 100}>
                    <div className="project" style={{ padding: '2em', background: '#f9f9f9', borderRadius: '10px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '300px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>
                        <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: '#2c98f0', textDecoration: 'none' }}>
                          <i className="fa fa-github" style={{ marginRight: '8px' }} />
                          {project.name}
                        </a>
                      </h3>
                      <div style={{ flexGrow: 1, marginBottom: '20px' }}>
                        <p style={{ fontSize: '15px', color: '#666', marginBottom: '10px' }}>{project.description}</p>
                        {project.extendedDescription && (
                          <details style={{ cursor: 'pointer', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                            <summary style={{ fontWeight: 'bold', color: '#2c98f0', outline: 'none' }}>View Detailed Instructions</summary>
                            {project.extendedDescription}
                          </details>
                        )}
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                          {project.techStack.map((tech, i) => (
                            <span key={i} style={{ background: '#e1f0fa', color: '#2c98f0', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '4px', background: '#2c98f0', color: '#fff', textDecoration: 'none', display: 'inline-block', border: 'none' }}>
                          View Repository
                        </a>
                      </div>
                    </div>
                  </AnimateBox>
                </div>
              ))}
            </div>
            
            <div className="row">
              <div className="col-md-12">
                <AnimateBox effect="fadeInUp">
                  <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    <a href="https://github.com/sazamansari?tab=repositories" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg btn-load-more" style={{ padding: '12px 24px', fontSize: '16px', borderRadius: '30px' }}>
                      View All Projects on GitHub <i className="fa fa-arrow-right" style={{ marginLeft: '8px' }} />
                    </a>
                  </p>
                </AnimateBox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
