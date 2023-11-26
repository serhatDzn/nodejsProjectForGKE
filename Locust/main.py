from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(5, 15)

    @task(1)
    def my_task(self):
        self.client.get("/")