To run the load test against the Single Table stack:

```
newman run single.postman_collection.json \
--iteration-data customers.csv \
--delay-request 1000
```

To run the load test against the Multi Table stack:

```
newman run multi.postman_collection.json \
--iteration-data customers.csv \
--delay-request 1000
```
