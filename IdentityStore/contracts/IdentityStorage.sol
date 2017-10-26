pragma solidity ^0.4.15;

contract IdentityStorage {


	// ALL values with PUBLIC will have getter and setters automatically instantiated
	// e.g. in frontend -> window.ISA.currentTax() -> returns promise which resolves to 1000
	uint public currentTax = 1000 finney;
	uint public trumpTax = 0;
	uint public minTaxTime = 1 minutes;

	string public currentUrl;

	uint public minPruneTime = 2*minTaxTime; // prune once every 2 tax rounds
	uint public creationTime = now;
	uint public lastTaxRun = creationTime;
	uint public lastPruneRun = creationTime;
	address public owner = msg.sender;
	uint public coffers = 0;

	uint public idCount = 0; // should ideally be something like a nonce
	enum State {Created, Banned, Tombstoned, Premium}
	struct Identity {
		State state;
		string name;
		string email;
		address associatedAddress;
		string identityProvider;
		string secret; // hash on front
		uint money;
		address lastFunder;
		uint lastActive;
	}
	mapping (uint => Identity) identities;


	bool private sendBack;
	string private returnUrl;

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
		int i = findByAddress(msg.sender);
		require(msg.sender == identities[uint(i)].associatedAddress);
		_; 
	}

	modifier ownerOrAdmin() {
		int i = findByAddress(msg.sender);
		require(identities[uint(i)].associatedAddress == msg.sender || msg.sender == owner);
		_;
	}
	
	modifier reqValidId(uint i) {
		require(i < idCount);
		_;
	}

	modifier onlyAfter(uint _time) {
		require(now >= _time); 
		_; 
	}

	// charge for access to privileged fields and users personal data like email
	modifier cost(uint amount) {
		require(msg.value >= amount);
		_; 
		if (msg.value > amount) msg.sender.transfer(msg.value - amount);
	}


	// Req a certain state for some privileged actions
	modifier reqState(State s) {
		int i = findByAddress(msg.sender);
		require(i != -1); // make sure person is registered in our dapp
		require(identities[uint(i)].state == s);
		_;
	}

	function isValidState(Identity id) constant internal returns (bool) {
		if (id.state == State.Tombstoned || id.state == State.Banned) return false;
		return true;
	}
	function updateLastActive(Identity id) internal {
		id.lastActive = now;
	}
	function compare(string a, string b) internal returns (bool) {
		return sha3(a) == sha3(b); // check strings by converting to sha3 or err
	}
	// =============== END HELPERS ============================================

	// EVENTS!!!!!!!!!!!!!

	event IdCreated(uint i);
	// redirect path for external calls to route user back to using app
	function setReturnPath(string url) {
		returnUrl = url;
		sendBack = true;
	}

	function unsetReturnPath() {
		sendBack = false;
		returnUrl = "";
	}

	function getCreateFunc() returns (string) {
		if (sendBack) return "createAndReturn";
		if (!sendBack) return "createId";
	}

	function setCurrentUrl(string url) {
		currentUrl = url;
	}

	function createIdAndReturn(string name, string email, address addy, string idProvider, string secret) returns (string, uint) {
		uint id = createId(name, email, addy, idProvider, secret);
		string retUrl = returnUrl;
		unsetReturnPath();
		return (retUrl, id);
	}

	// ACCOUNT CREATION, MODIFICATION, FUNDING
	function createId(string name, string email, address addy, string idProvider, string secret) returns (uint) {
		if (findId(name, email, addy, idProvider, secret) == -1) {
			identities[idCount] = Identity(State.Created,name,email,addy,idProvider,secret,0,addy,now);
			idCount++;
		}
		IdCreated(idCount);
		return idCount;
		// identities[idCount] = Identity(State.Created,name,email,addy,idProvider,secret,0,addy,now);
		// idCount++;
	}

	function fundId(uint i) payable {
		Identity id = identities[i];
		id.money += msg.value;
		// make them premium if bal over 10 eth
		if (id.money > 10 ether) id.state = State.Premium; // TODO: Premium feats
		id.lastActive = now;
		id.lastFunder = msg.sender;
	}

	// FOREIGN DAPP UTIL FUNCS	
	// NEED FUNC FOR OTHER CONTRACT TO CALL TO CHECK IF VALID user
	function validateUser(address addy, string s) constant returns (bool) {
		uint i = 0;
		Identity id = identities[0];
		while (i<idCount && id.associatedAddress != addy && !compare(id.secret, s)) {
			id = identities[i++];
		}
		if (i<idCount && id.associatedAddress != addy && !compare(id.secret, s)) return true;
		return false;
	}

	// privileged func for monetization
	function getEmail(uint i) payable reqValidId(i) cost(currentTax) reqState(State.Premium) returns (string) {
		// we charge the tax price for privileged info access
		// half goes to owner
		Identity id = identities[i];
		if (!isValidState(id)) {
			coffers += msg.value;
		} else {
			id.money += msg.value/2;
			coffers += msg.value/2;
			id.lastActive = now;
		}

		return id.email;
	}

	// IMPLEMENTERS OF OUR API CAN CALL THIS FUNC TO UPDATE USERS LAST ACTIVE TIME POINT AND PREVENT TAXATION
	function updateLastActive(uint i) {
		identities[i].lastActive = now;
	}

// TODO
	// function modify(uint id) {
	// 	require(msg.sender == identities[id].associatedAddress);
	// }




	// FIND FUNCS
	function findByName(string lookupStr) constant returns (int) {
		for (uint i=0;i<idCount;i++) {
			Identity id = identities[i];
			if (compare(id.name, lookupStr)) return int(i);
		}
		return -1;
	}
	function findByAddress(address addy) constant returns (int) {
		for (uint i=0;i<idCount;i++) {
			if (identities[i].associatedAddress == addy) return int(i);
		}
		return -1;
	}
	function findByEmail(string lookupStr) constant returns (int) {
		for (uint i=0;i<idCount;i++) {
			if (compare(identities[i].email, lookupStr)) return int(i);
		}
		return -1;
	}

	function find(
		string name, 
		string email, 
		address associatedAddress,
		string identityProvider, 
		string secret) constant returns (bool) 
	{
		for (uint i=0;i<idCount;i++) {
			Identity id = identities[i];
			if (compare(id.name, name) &&
				compare(id.email, email) &&
				id.associatedAddress == associatedAddress &&
				compare(id.identityProvider, identityProvider) &&
				compare(id.secret, secret)) return true; // need to conv to sha3 to compare strings
		}
		return false;
	}


	function findId(
		string name, 
		string email, 
		address associatedAddress,
		string identityProvider, 
		string secret) constant returns (int) 
	{
		for (uint i=0;i<idCount;i++) {
			Identity id = identities[i];
			if (compare(id.name, name) &&
				compare(id.email, email) &&
				id.associatedAddress == associatedAddress &&
				compare(id.identityProvider, identityProvider) &&
				compare(id.secret, secret)) return int(i); // need to conv to sha3 to compare strings
		}
		return -1;
	}

	// TAXATION & CLEANUP, ADMIN LEVEL FUNCS

	// if user wasnt active since last tax time, tax them. use taxes to make setting lastActive time free?
	function tax() onlyAfter(lastTaxRun + minTaxTime) adminOnly {
		if (currentTax == 0) return;
		for (uint i = 0; i < idCount; i++) {
			Identity id = identities[i];
			if (isValidState(id)) {
				if (id.money < currentTax) {
					id.state = State.Tombstoned; // if out of money then tombstone, assume user is dead, TODO: resurrect function, and cleanup should cost more than tax
				} else if (id.lastActive < lastTaxRun) {
					id.lastActive = now;
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
		}
		lastTaxRun = now;
	}

	function prune() onlyAfter(lastPruneRun + minPruneTime) adminOnly {
		// mapping(uint => Identity) pruned;
		// uint j=0;
		// Identity 
		for (uint i=0;i<idCount; i++) {
			Identity id = identities[i];
			if (!isValidState(id)) {
				delete identities[i];
			}
		}
		lastPruneRun = now;
		// identities = pruned;
	}

	function banAcc(uint i) adminOnly reqValidId(i) {
		identities[i].state = State.Banned;
		uint confiscatedFunds = identities[i].money;
		identities[i].money = 0;
		coffers += confiscatedFunds;
	}	

	function closeAccount(uint i) ownerOrAdmin reqValidId(i) returns (bool) {
		Identity id = identities[i];
		if (id.state == State.Banned) {
			return false; // cant close a banned acc, we confiscate funds
		} else {
			uint amt = id.money;
			id.money = 0;
			id.state = State.Tombstoned;
			// Clean up space
			id.associatedAddress.transfer(amt);
			return true;
		}

	}

	function end() ownerOrAdmin onlyBy(owner) {
		selfdestruct(owner);
	}

	function getAccountState(uint i) constant ownerOrAdmin reqValidId(i) returns (string) {
		string memory state;
		Identity id = identities[i];
		if (id.state == State.Created) {
			state = "Created";
		} else if (id.state == State.Banned) {
			state = "Banned";
		} else if (id.state == State.Tombstoned) {
			state = "Tombstoned";
		} else if (id.state == State.Premium) {
			state = "Premium";
		}
		return state;
	}

	// DATA GETTING FUNCS
	function getAll(uint i) constant ownerOrAdmin reqValidId(i) returns (address, uint, address, uint) {
		// figure out enum state of acc
		string memory state;
		Identity id = identities[i];
		uint lastActive = id.lastActive;
		id.lastActive = now;

		return (
			id.associatedAddress,
			id.money,
			id.lastFunder,
			lastActive
		);
	}

	function getSocial(uint i) constant ownerOrAdmin reqValidId(i) returns (string, string, string) {
		identities[i].lastActive = now;
		return (
			identities[i].name,
			identities[i].email,
			identities[i].identityProvider
		);
	}
}
