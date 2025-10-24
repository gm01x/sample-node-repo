# ArgoCD setup instructions
# Create namespace
 ```kubectl create namespace argocd ```

# Install ArgoCD
 ```kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml ```

# Access ArgoCD UI (port-forward)
 ```kubectl port-forward svc/argocd-server -n argocd 8080:443 ```

# Get initial admin password
 ```kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d ```
