  450  echo h2load -n200 -c100 -m10 https://localhost:8000 >test-h2.sh
  451  echo h2load -n200 -c100 -m10 --h1 https://localhost:8000 >test-h1.sh
  452  chmod u+x *.sh
  453* ./run-snow.sh
  454* ls ssl
  455* find ~/demos -name mj-hp-i5-tower.key
  456* git log mj-hp-i5-tower.key
  457* git log -- mj-hp-i5-tower.key
  458* hostname
  459* find ~/demos -name '*key*'
  460* find ~/demos -name '*key*' | grep -v node_modules
  461* git log --follow -- ./ssl/mj-hp-i5-tower.key
  462* git log --follow -- ./ssl/*.key
  463* git log --all --first-parent --remotes --reflog --author-date-order -- ./ssl/mj-hp-i5-tower.key
  464* git log --stat './ssl/*'
  465* git log
  466* find ~/projects/george -name '*key*'
  467* find ~/projects/george -name '*key*' | grep -v node_modules
  468* cd ssl
  469* ls
  470* cd ../../server3
  471* ls
  472* cd ssl
  473* ls
  474* cat my-keys.sh
  475* ls ~/demos/snow/server/certs
  476* less ~/demos/snow/server/certs/make-certs.sh
  477* cd ../../koa/ssl
  478* cp ~/demos/snow/server/certs/make-certs.sh 
  479* cp ~/demos/snow/server/certs/make-certs.sh .
  480* less make-certs.sh
  481* ./make-certs.sh
  482* sudo -i
  483* /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
  484* brew install hello
  485* sudo apt-get install build-essential curl file git
  486* sudo -i
  487* brew install mkcert
  488* ls
  489* cat make-certs.sh
  490* ./make-certs.sh
  491* grep ssl ../*.js 
  492* cp ./mj-hp-i5-tower+5-key.pem ./mj-hp-i5-tower.key
  493* cp ./mj-hp-i5-tower+5.pem ./mj-hp-i5-tower.crt
  494* cd ..
  495* # ./run-snow.sh
  496* ./run-snow.sh
  497  ./test-h2.sh
  498  sudo apt-get install nghttp2-client
  499  ./test-h2.sh
  500* vi ./run-snow.sh
  501  echo sudo apt-get install nghttp2-client >>test-h2.sh
  502  vi test-h2.sh
  503  ls *.sh
  504  cat doc-test.sh
  505* cat run-snow.sh
  506* node server.js --help
  507* code .
  508* grep push *.js 
  509* ./run-snow.sh
  510* cd ../src
  511* ls
  512* ls ../public
  513* cd ../koa
  514* ./run-snow.sh
  515  ./test-h2.sh
  516  ./test-h1.sh
  517  ls *.sh
  518  cat doc-test.sh
  519  cat cannon.sh
  520  ls
  521  ls ../server3
  522  ls ../server2
  523  ls ../server
  524  less ../server/test.sh
  525  # cp ../server/test.sh .
  526  ls *.sh
  527  cp ../server/test.sh .
  528  cat test.sh
  529  nghttp -ans https://localhost:8000
  530  time nghttp -ans https://localhost:8000
  531  cat test.sh
  532  npx sitespeed.io https://localhost:8000 
  533  npx sitespeed.io --help
  534  # sitespeed.io 
  535  ls
  536  npm i sitespeed.io --save-dev
  537  npm audit
  538  npm audit fix
  539  grep sitespeed.io package.json
  540  ls *.sh
  541  clear
  542  npm run test
  543  git status
  544  git add run-snow.sh run-wpack.sh sitespeed-result/ test-h1.sh test-h2.sh test.sh 
  545  git status
  546  git commit -am 'timing tests run serving snowpack built front-end, 10 runs first paint 158mS'
  547  cat .gitignore
  548  ls ssl
  549  git add ssl/make-certs.sh
  550  git add -f ssl/make-certs.sh
  551  git commit -am 'how the certs were made'
  552  git push
  553* ./run-wpack.sh
  554* cd /home/mjackson/demos/wpack/public
  555* ls
  556* ls -l
  557* cat ~/demos/snow/koa/run-wpack.sh
  558* cd ~/demos/snow/koa/
  559* vi run-wpack.sh
  560* ./run-wpack.sh
  561* ls -al /home/mjackson/demos/wpack/public
  562* ls -al /home/mjackson/demos/wpack
  563* ls -al /home/mjackson/demos/wpack/public/static
  564* ls -al /home/mjackson/demos/wpack/public/static/media
  565* vi run-wpack.sh
  566* ./run-wpack.sh
  567  npm run test
  568* ./run-wpack.sh
  569  npm run test
