# For Nginx ingress
```
helm install nginx-ingress-controller oci://ghcr.io/nginxinc/charts/nginx-ingress --version 1.0.2 -n test --set controller.ingressClass.name=nginx --set controller.service.type=LoadBalancer
```

# For TLS Certificate

```
sudo certbot certonly --standalone -d tekirdag.life

sudo ls /etc/letsencrypt/live/nodejsapp.tekirdag.life

kubectl create secret tls mytlssecret --cert=/etc/letsencrypt/live/nodejsapp.tekirdag.life/fullchain.pem --key=/etc/letsencrypt/live/nodejsapp.tekirdag.life/privkey.pem -n test

```

or

```
helm repo add jetstack https://charts.jetstack.io
helm repo update
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.2/cert-manager.crds.yaml
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.2 

cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: serhatduzen3@gmail.com
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

# Locust Load Testing
``````
helm repo add locustio https://locustio.github.io/

main.py
"
from locust import HttpUser, task, between
from lib.example_functions import choose_random_page


default_headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}


class WebsiteUser(HttpUser):
    wait_time = between(1, 2)

    @task(1)
    def get_index(self):
        self.client.get("/", headers=default_headers)

    @task(3)
    def get_random_page(self):
        self.client.get(choose_random_page(), headers=default_headers)
"

kubectl create configmap locustfile-config --from-file=main.py

helm install sd-locust locustio/locust \
  --set loadtest.locust_host=https://nodejsapp.tekirdag.life \
  --set loadtest.locust_locustfile_configmap=locustfile-config \
  --set loadtest.name=sd-load-test \
  --set worker.replicas=3 \
  --set loadtest.environment.TARGET_USER_COUNT=5000