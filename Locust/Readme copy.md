
# Locust Load Testing
```
docker run -it --rm \
  -v $PWD:/mnt/locust \
  locustio/locust \
  -f /mnt/locust/main.py \
  --host=https://nodejsapp.tekirdag.life \
  --csv=/mnt/locust/results \
  --headless \
  -u 1000 \
  -r 500 \
  -t 5m 
```

