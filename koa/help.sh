

sudo npm install clinic

# Run one of there in a shell for the server

clinic doctor -- node server.js --port 8000 --home ../public
clinic bubbleprof -- node server.js --port 8000 --home ../public

# run this in another shell to simulate multiple clients (sequentially)

for i in {1..100}; do nghttp -ans https://localhost:8000 ; done 


h2load -n100000 -c100 -m10 https://localhost:8000
h2load -n100000 -c100 -m10 --h1 https://localhost:8000


#####################################################################33
### Junk ###

sudo npm i autocannon -g           every connection was an error
sudo npm install -g loadtest       every connection was an error
sudo npm install -g artillery      did not install 

loadtest -n 200 https://localhost:8000
