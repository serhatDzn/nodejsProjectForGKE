# For Nginx ingress
```
helm install nginx-ingress-controller oci://ghcr.io/nginxinc/charts/nginx-ingress --version 1.0.2 -n test --set controller.ingressClass.name=nginx --set controller.service.type=LoadBalancer
```

# For TLS Certificate

## Cert-manager installation
```
helm repo add jetstack https://charts.jetstack.io
helm repo update
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.2/cert-manager.crds.yaml
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.2 
```

## Cluster issuer and Certifiacte Creation

```
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
  namespace: cert-manager
spec:
  acme:
    email: serhatduzen@tekirdag.life
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-issuer-account-key
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

```
kubectl 
```
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: nodejsapp-tekirdag-life
  namespace: test
spec:
  secretName: nodejsapp-tekirdag-life-tls
  duration: 2160h
  renewBefore: 360h
  subject:
    organizations:
      - tekirdag-life
  isCA: false
  privateKey:
    algorithm: RSA
    encoding: PKCS1
    size: 2048
  usages:
    - server auth
    - client auth
  dnsNames:
    - nodejsapp.tekirdag.life
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
    group: cert-manager.io
EOF

```

