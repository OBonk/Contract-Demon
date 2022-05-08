pragma solidity ^0.8.4;
contract intTar{
    int8 mynum;
    constructor(){
        mynum = 3;
    }
    function test(int8 _in) public{
        mynum += _in;
    }
}