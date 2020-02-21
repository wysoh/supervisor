Install ProtoBuf
    wget http://protobuf.googlecode.com/files/protobuf-2.4.1.tar.bz2
    tar xfj protobuf-2.4.1.tar.bz2
    pushd protobuf-2.4.1
    ./configure
    make
    sudo make install

The protobuf module for node is expecting the header files in the right place, make links if it's not installed there:
    sudo ln -s /usr/local/protobuf-2.4.1/include/google/ /usr/local/include/google


sudo yum install python26
npm install --python=python26

```
conn Tunnel1
authby=secret
auto=start
left=%defaultroute
leftid=<customer_gw1_ip>
right=<vpn_gw_ip>
type=tunnel
ikelifetime=8h
keylife=1h
phase2alg=aes128-sha1;modp1024
ike=aes128-sha1;modp1024
auth=esp
keyingtries=%forever
keyexchange=ike
leftsubnet=<LOCAL NETWORK>
rightsubnet=<REMOTE NETWORK>
dpddelay=10
dpdtimeout=30
dpdaction=restart_by_peer


```

- test
- test

 * test
 * test
