# Monitoring Tool ınstallations

## Prometheus With Helm

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

helm repo update

helm install prometheus prometheus-community/prometheus \
  --set server.persistentVolume.enabled=false \
  --set server.service.type=LoadBalancer \
  --set alertmanager.enabled=false \
  --set prometheus-pushgateway.enabled=false
```

## Grafana With Helm
```
helm repo add grafana https://grafana.github.io/helm-charts

helm repo update

helm install grafana grafana/grafana \
  --set service.type=LoadBalancer
```