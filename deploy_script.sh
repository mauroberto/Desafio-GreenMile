cd ~/mongodb-linux-x86_64-3.4.4/bin
nohup sudo ./mongod --dbpath ~/datadir > mongonohup.logs &
cd ~/Desafio-GreenMile 
nohup npm start > nohup.logs &