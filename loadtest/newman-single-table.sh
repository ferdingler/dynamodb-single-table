newman run single.postman_collection.json \
--iteration-count 10000 \
--iteration-data customers.csv \
--delay-request 1000

# read  -n 1 -p "Press any key to continue"