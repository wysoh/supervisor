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
test

```

- test
- test

 * test
 * test