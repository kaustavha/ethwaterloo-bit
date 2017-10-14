pragma solidity ^0.4.2;

contract IdentityStorage {
	uint currentTax = 1000 finney;
	uint trumpTax = 0;
	uint minTaxTime = 1 min;
	uint creationTime = now;
	uint lastTaxRun = creationTime;
	address public owner = msg.sender;
	uint public coffers = 0;
	uint public creationTime = now;

	uint idCount = 0; // should ideally be something like a nonce
	enum State {Created, Banned, Tombstoned, Premium}
	struct Identity {
		State state;
		string name;
		string private email;
		address associatedAddress;
		string identityProvider
		string secret; // hash on front
		uint money;
		address lastFunder;
		uint lastActive;
	}
	mapping (uint => Identity) identities;


	// ===================== HELPER FUNCS ===============================
	// only zuck and you can mess with your acc. can be useful to give admin some rights in case of recovery needs
	modifier onlyBy(address acc) {
		require(msg.sender == acc || msg.sender == owner);
		_; 
	}

	modifier adminOnly() {
		require(msg.sender == owner);
		_; 
	}

	modifier ownerOnly() { 
		uint i = findByAddress(msg.sender);
		
		if (now >= _time) throw; 
		_; 
	}
	
	

	modifier onlyAfter(uint _time) {
		if (now >= _time) throw; 
		_; 
	}

	// charge for access to privileged fields and users personal data like email
	modifier cost(uint amount) {
		require(msg.value >= amount);
		_; 
		if (msg.value > amount) msg.sender.send(msg.value - amount);
	}


	// Req a certain state for some privileged actions
	modifier reqState(State s) {
		uint i = findByAddress(msg.sender);
		if (i == -1) throw; // make sure person is registered in our dapp
		Identity id = identities[i];
		require(id.state == s);
		_;
	}

	// =============== END HELPERS ============================================

	// ACCOUNT CREATION, MODIFICATION, FUNDING
	function createId(string name, string email, address addy, string idProvider, string secret) {
		identities[idCount++] = Identity(State.Created,name,email,addy,idProvider,secret,0,addy,now);
	}

	function fundId(uint i) payable {
		Identity id = identities[i];
		identities[id].money += msg.value;
		// make them premium if bal over 10 eth
		if (identities[id].money > 10 ether) identities[id].state = State.Premium; // TODO: Premium feats
		identities[id].lastActive = now;
	}

	function modify(uint id) {
		require(msg.sender == identities[id].associatedAddress);
	}


	// TAXATION

	// if user wasnt active since last tax time, tax them. use taxes to make setting lastActive time free?
	function tax() internal
	onlyAfter(lastTaxRun + minTaxTime)
	onlyBy(owner) 
	{
		if (currentTax == 0) return;
		for (int i = 0; i < idCount; i++) {
			Identity id = identities[i];
			if (id.money < currentTax) {
				id.state = State.Tombstoned; // if out of money then tombstone, assume user is dead, TODO: resurrect function, should cost more than tax
			} else if (id.lastActive < lastTaxRun) {
				// if user has been active since last tax run dont tax them
				// Tax the rich differently, reverse robinhood style cos trump
				if (id.state == State.Premium) {
					id.money -= trumpTax;
					coffers += trumpTax;
				} else {
					id.money -= currentTax;
					coffers += currentTax;
				}
			}
		}
		lastTaxRun = now;
	}

	// FIND FUNCS

	function findByName(string lookupStr) constant returns (int) {
		for (int i=0;i<idCount;i++) {
			Identity id = identities[i];
			if (id.name == lookupStr) return i;
		}
		return -1;
	}

	function findByAddress(address addy) constant returns (int) {
		for (int i=0;i<idCount;i++) {
			if (identities[i].associatedAddress == addy) return i;
		}
		return -1;
	}
	function findByEmail(string lookupStr) constant returns (int) {
		for (int i=0;i<idCount;i++) {
			if (identities[i].email == lookupStr) return i;
		}
		return -1;
	}

	function getCount() constant returns (int) {
		return idCount;
	}


	// DATA GETTING FUNCS
	function getAll(uint i) constant onlyBy(msg.sender) returns (string, string, string, address, string, string, uint, address, uint) {
		// figure out enum state of acc
		string state;
		Identity id = identities[i];
		if (id.state == State.Created) {
			state = "Created";
		} else if (id.state == State.Banned) {
			state = "Bammed";
		} else if (id.state == State.Tombstoned) {
			state = "Tombstoned";
		} else if (id.state == State.Premium) {
			state = "Trump";
		}

		return (
			state,
			id.name,
			id.email,
			id.associatedAddress,
			id.identityProvider,
			id.secret,
			id.money,
			id.lastFunder,
			id.lastActive
		);
	}

	// privileged func for monetization
	function getEmail(int i) payable cost(currentTax) reqState(State.Premium) returns (string) {
		// we charge the tax price for privileged info access
		// half goes to owner
		Identity id = identities[i];
		id.amount += msg.value/2;
		coffers += msg.value/2;
		return id.email;
	}

	function banAcc(uint id) {

	}

	function closeAccount(uint id) onlyBy(msg.) returns (bool) {
		Identity id = identities[id];
		if (id.state == State.Banned) {

		}

	}

	function end() onlyBy(owner) {
		selfdestruct(owner);
	}
}
