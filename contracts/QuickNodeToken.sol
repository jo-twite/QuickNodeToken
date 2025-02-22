// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import { IERC20 } from "./IERC20.sol";


contract QuickNodeToken is IERC20 {  
    string public symbol;
    string public name;
    uint8 public decimals;
    uint public _totalSupply;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

    constructor() {
        symbol = "QNC";
        name = "QuickNode Coin";
        decimals = 18;
        _totalSupply = 1_000_001_000_000_000_000_000_000;
        balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    // return 1_000_001_000_000_000_000_000_000
    function totalSupply() public view returns (uint) {
        return _totalSupply;
    }

    // return balance
    function balanceOf(address account) public view returns (uint balance) {
        return balances[account];
    }
    
    /* amount > balance ? revert("Insufficient balance")
       successfull transfer ? should emit Transfer(msg.sender, recipient, amount)
    */
    function transfer(address recipient, uint amount) public returns (bool success) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    // return allowance
    function allowance(address owner, address spender) public view returns (uint remaining) {
        return allowed[owner][spender];
    }

    // should emit Approval
    function approve(address spender, uint amount) external returns (bool success) {
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /* balances[sender] < amount ? revert("Insufficient balance")
       !allowed[sender][msg.sender] ? revert("Allowance exceeded")
       successfull tranfer ? emit Tranfer(sender, recipient, amount)
    */
    function transferFrom(address sender, address recipient, uint amount) public returns (bool success) {
        require(balances[sender] >= amount, "Insufficient balance");
        require(allowed[sender][msg.sender] >= amount, "Allowance exceeded");
        balances[sender] -= amount;
        allowed[sender][msg.sender] -= amount;
        balances[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
}