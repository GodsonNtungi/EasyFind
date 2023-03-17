# MCHONGOTZ WEBSITE.

docker run
```shell
docker run --name ecommerce \ 
  -v "/c/Users/DevOps Engineer/WebstormProjects/mchongotz-eshop/entrypoint.sh:/app/entrypoint.sh" \
  -v "/c/Users/DevOps Engineer/WebstormProjects/mchongotz-eshop/.env.production.local:/app/.env.production.local" \
  -p 4200:3000 ecommerce

```

