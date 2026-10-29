# Local Kubernetes (Kind) notes

Do not start here. First verify the application with `docker compose up --build`.

These manifests are a starter template for a local Kind cluster. For a fully working deployment, build and load the images into Kind, then apply the manifests:
```powershell
docker build -t task-manager-backend:local ./backend
docker build -t task-manager-frontend:local ./frontend
kind load docker-image task-manager-backend:local --name YOUR-CLUSTER-NAME
kind load docker-image task-manager-frontend:local --name YOUR-CLUSTER-NAME
kubectl apply -f k8s/
```

MongoDB uses a PVC. Local clusters may require a default StorageClass. For a small laptop, keep replicas at 1 and add monitoring only after the application works.
