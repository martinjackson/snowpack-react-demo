

sudo npm install clinic

# Run one of there in a shell for the server

clinic doctor -- node server.js --port 8000 --home ../public
clinic bubbleprof -- node server.js --port 8000 --home ../public

# run this in another shell to simulate multiple clients (sequentially)

for i in {1..100}; do nghttp -ans https://localhost:8000 ; done 




#####################################################################33
### Junk ###

sudo npm i autocannon -g           every connection was an error
sudo npm install -g loadtest       every connection was an error
sudo npm install -g artillery      did not install 

loadtest -n 200 https://localhost:8000
