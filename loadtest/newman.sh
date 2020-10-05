newman run single.postman_collection.json \
--iteration-data customers.json \
--delay-request 100

read  -n 1 -p "Press any key to continue"

newman run multi.postman_collection.json \
--iteration-data customers.json \
--delay-request 100