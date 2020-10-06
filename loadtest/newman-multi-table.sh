newman run multi.postman_collection.json \
--iteration-count 10000 \
--iteration-data customers.csv \
--delay-request 1000
