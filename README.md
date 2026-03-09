# Sample Node.js Application with GitOps CI/CD Pipeline (PR)

A containerized Node.js application demonstrating a complete GitOps CI/CD pipeline using GitHub Actions, ArgoCD, and Argo Workflows.

## 🏗️ Architecture

This project implements a production-ready CI/CD pipeline with the following components:

- **GitHub Actions**: Automated building and container registry publishing
- **Argo Workflows**: Manual deployment control with approval gates
- **ArgoCD**: GitOps-based continuous delivery
- **Kubernetes**: Container orchestration with health checks and resource management
- **Slack Integration**: Real-time deployment notifications

## 📋 Prerequisites

- Docker
- Kubernetes cluster (local or cloud)
- kubectl configured
- GitHub repository with Container Registry access
- Slack webhook URL (optional, for notifications)

## 🚀 Quick Start

### 1. Clone and Setup Repository

```bash
git clone https://github.com/gm01x/sample-node-repo.git
cd sample-node-repo
npm install
```

### 2. Install ArgoCD

```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access ArgoCD UI (port-forward)
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### 3. Install Argo Workflows

```bash
# Create namespace
kubectl create namespace argo

# Install Argo Workflows
kubectl apply -n argo -f https://raw.githubusercontent.com/argoproj/argo-workflows/stable/manifests/quick-start-postgres.yaml

# Create service account for workflows
kubectl apply -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: argo-workflow-sa
  namespace: argo
---
apiVersion: rbac.authorization.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: argo-workflow-role
rules:
- apiGroups: [""]
  resources: ["pods", "pods/exec"]
  verbs: ["create", "get", "list", "watch", "update", "patch", "delete"]
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get"]
---
apiVersion: rbac.authorization.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: argo-workflow-binding
roleRef:
  apiGroup: rbac.authorization.authorization.k8s.io
  kind: ClusterRole
  name: argo-workflow-role
subjects:
- kind: ServiceAccount
  name: argo-workflow-sa
  namespace: argo
EOF
```

### 4. Configure ArgoCD Application

Apply the ArgoCD application configuration:

```bash
kubectl apply -f argocd/application.yaml
```

## 🔄 CI/CD Pipeline

### Phase 1: Automated Build (GitHub Actions)

**Trigger**: Push to `main` branch or pull request

**Process**:
1. Checks out code
2. Logs into GitHub Container Registry
3. Builds Docker image
4. Pushes image with multiple tags:
   - Branch name (e.g., `main`)
   - Commit SHA (e.g., `main-abc123d`)
   - `latest` for main branch

### Phase 2: Manual Deployment (Argo Workflows)

**Trigger**: Manual workflow execution

**Process**:
1. **Image Validation**: Verifies image exists in registry
2. **Slack Notification**: Announces deployment start
3. **Manual Approval**: Requires human approval to proceed
4. **Manifest Update**: Updates `k8s/deployment.yaml` with new image tag
5. **Git Commit**: Pushes changes to trigger ArgoCD sync

### Phase 3: Automated Sync (ArgoCD)

**Trigger**: Changes to `k8s/` directory in Git

**Process**:
- Automatically detects manifest changes
- Syncs Kubernetes resources
- Self-heals if drift detected
- Prunes removed resources

## 📦 Deployment Process

### Manual Deployment

1. **Push Code**: Push changes to `main` branch → GitHub Actions builds image
2. **Trigger Workflow**: Run Argo Workflow with desired image tag
3. **Approve**: Click approve in Argo Workflows UI
4. **Auto-deploy**: ArgoCD syncs automatically

### Workflow Parameters

- `image-tag`: Docker image tag to deploy (e.g., `latest`, `main-abc123d`)
- `repo-owner`: GitHub username/organization
- `repo-name`: Repository name
- `github-repo`: Full GitHub repo path
- `slack-webhook`: Slack webhook URL for notifications

## 📊 Application Details

- **Port**: 3000
- **Health Check**: `/health` endpoint
- **Replicas**: 2 (configured in deployment)
- **Resources**: CPU: 50m-100m, Memory: 64Mi-128Mi

## 🔧 Configuration

### Environment Variables

```yaml
env:
  - name: PORT
    value: "3000"
  - name: APP_VERSION
    value: "1.0.0"
```

### Secrets Required

For Argo Workflows to update Git manifests, create this secret:

```bash
kubectl -n argo create secret generic github-credentials \
  --from-literal=token=YOUR_GITHUB_TOKEN
```

## 📱 Monitoring & Notifications

- **Health Checks**: Liveness and readiness probes
- **Slack Notifications**: Deployment status updates
- **ArgoCD UI**: Visual deployment status
- **Argo Workflows UI**: Pipeline execution monitoring

## 🛠️ Development

### Local Development

```bash
# Run locally
npm start

# Build Docker image
docker build -t sample-node-app .

# Run in Docker
docker run -p 3000:3000 sample-node-app
```

### Testing

```bash
# Run tests
npm test

# Health check
curl http://localhost:3000/health
```

## 📝 API Endpoints

- `GET /`: Main application page
- `GET /health`: Health check endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test locally
4. Push to your fork
5. Create a pull request

## 📄 License

This project is licensed under the MIT License.
