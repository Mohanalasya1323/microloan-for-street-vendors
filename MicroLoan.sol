// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MicroLoan {
    address public owner;

    struct Loan {
        address payable vendor;
        uint amount;
        bool approved;
        bool repaid;
    }

    Loan[] public loans;

    constructor() {
        owner = msg.sender;
    }

    function requestLoan(uint _amount) public {
        loans.push(Loan(payable(msg.sender), _amount, false, false));
    }

    function approveLoan(uint loanId) public payable {
        require(msg.sender == owner, "Only admin can approve");
        Loan storage loan = loans[loanId];
        require(!loan.approved, "Already approved");
        require(msg.value == loan.amount, "Send exact amount");
        loan.vendor.transfer(msg.value);
        loan.approved = true;
    }

    function repayLoan(uint loanId) public payable {
        Loan storage loan = loans[loanId];
        require(msg.sender == loan.vendor, "Only vendor can repay");
        require(loan.approved, "Loan not approved");
        require(!loan.repaid, "Already repaid");
        require(msg.value == loan.amount, "Send full repayment");

        payable(owner).transfer(msg.value);
        loan.repaid = true;
    }

    function getLoan(uint loanId) public view returns (
        address, uint, bool, bool
    ) {
        Loan memory loan = loans[loanId];
        return (loan.vendor, loan.amount, loan.approved, loan.repaid);
    }
}
