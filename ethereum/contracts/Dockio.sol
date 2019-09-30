pragma solidity ^0.4.24;

contract UserContract {
    struct User{
        string name;
        string designation;
    }
    mapping (address => User) public addressToUsers;
    mapping (address => bool ) public userExists;
    address[] public addressesOfUsers;

    function hasUser(address _user) public view returns (bool hasIndeed){
        return userExists[_user];
    }
    function createUser (
        string _name, 
        string _designation
    ) public returns (bool _success) {
        require(!hasUser(msg.sender),"User account already exists!");  
        require(bytes(_name).length > 0 && bytes(_name).length <= 30,"Name exceeds limit.");
        require(bytes(_designation).length < 20,"Designaton exceeds limit.");
        User storage user = addressToUsers[msg.sender];
        user.name = _name;
        user.designation = _designation;
        userExists[msg.sender] = true;
        addressesOfUsers.push(msg.sender) - 1;
        _success = true;
    }
    function getUserAddresses() public view returns (address[]) {
        return addressesOfUsers;
    }
    function getUser(address _address) public view  returns (string,string){
        return (addressToUsers[_address].name,addressToUsers[_address].designation);
    }
}


contract StudentContract is UserContract{
    FileContract filecontract;
    constructor(address _fileContractAddress) public {
        filecontract = FileContract(_fileContractAddress);
    }
    function getFile(address _owner, uint8 _index) public  view returns (string _ipfsHash, string _title, string _description, uint256 _uploadedOn,string _originalHash){   
        require(_owner != 0x0,"Invalid Address");
        require(_index >= 0 && _index <= 2**8 - 1,"Invalid Index");
        return filecontract.getFile(_owner,  _index);
    }
    function getFileCount(address _studentAddress) public view returns(uint256 count){
        return filecontract.getFileCount(_studentAddress);
    }
}

contract SchoolContract is UserContract {
    FileContract filecontract;
    StudentContract studentcontract;
    constructor(address _fileContractAddress, address _studentContractAddress) public {
        filecontract = FileContract(_fileContractAddress);
        studentcontract = StudentContract(_studentContractAddress);
    }
    mapping(address => address[]) public schoolStudents;
    mapping(address => bool) public studentInSchools;
    function addStudent(address _studentAddress) public returns (bool){
        require(studentcontract.hasUser(_studentAddress), "Account of student not found"); //student must have account
        require(!studentInSchools[_studentAddress], "Student already is in another school."); //student must not be in another school
        schoolStudents[msg.sender].push(_studentAddress);
        studentInSchools[_studentAddress] = true;
        return true;
    }
    function hasStudent(address _studentAddress) public view returns (bool){
        for(uint i = 0;i < schoolStudents[msg.sender].length;i++){
            if(schoolStudents[msg.sender][i] == _studentAddress )
                return true;
        }
    }
    function getStudent(address _school,uint _index) public view returns(address) {
        return schoolStudents[_school][_index];
    }
    function getStudents(address _school) public view returns(address[]) {
        return schoolStudents[_school];
    }
    function studentCount() public view returns (uint){
        return schoolStudents[msg.sender].length;
    }
    //upload file for a student
    function uploadFile(
        string _ipfsHash, 
        string _title, 
        string _description,
        address _studentAddress,
        string _originalHash
    ) public returns (bool _success) {
        require(hasStudent(_studentAddress), "Account of student not found"); 
        return filecontract.uploadFile(_ipfsHash,_title,_description,_studentAddress, _originalHash);
    }
    //view files of a student
    function getFile(address _studentAddress, uint8 _index) 
        public  view returns (
        string _ipfsHash, 
        string _title, 
        string _description, 
        uint256 _uploadedOn,
        string _originalHash
    ) {
        
        return filecontract.getFile(_studentAddress,  _index);
    }
    
    function getFileCount(address _studentAddress) public view returns(uint256 count){
        return filecontract.getFileCount(_studentAddress);
    }
}

contract CompanyContract is UserContract {
    SchoolContract schoolcontract;
    constructor(address _schoolContractAddress) public {
        schoolcontract = SchoolContract(_schoolContractAddress);
    }
    function getSchoolAddresses() public view returns (address[]) {
        return schoolcontract.getUserAddresses();
    }
    function getSchoolStudentAddresses(address _schoolAddress) public view returns (address[]) {
        return schoolcontract.getStudents(_schoolAddress);
    }
}


contract RequestContract {
    //approvals Logic
    struct Request{
        string description;
        address reciever;
        address sender;
    }
    mapping(address => Request[]) public sentRequests;
    mapping(address => Request[]) public recievedRequests;

    function sendRequest(address _reciever,string _description)public returns(bool _success) {
        require(_reciever != msg.sender, "Cannot send request to yourself");
        require(bytes(_description).length < 1024, "Exceeded description limit");    
        Request memory request = Request({
            description:_description,
            reciever: _reciever,
            sender: msg.sender
        });
        sentRequests[msg.sender].push(request) - 1;
        recievedRequests[_reciever].push(request) - 1;
        _success = true;
    }
    function getSentRequestsCount(address _owner) public view returns (uint){
        return sentRequests[_owner].length;
    }
    function getRecievedRequestCount(address _owner) public view returns(uint){
        return recievedRequests[_owner].length;
    }
    function getRecievedRequest(address _studentAddress,uint _index) public view returns (string, address,address){   
        Request memory request = recievedRequests[_studentAddress][_index];
        return(
            request.description,
            request.reciever,
            request.sender
            );
    }
    function getSentRequest(address _companyAddress,uint _index) public view returns (string, address,address){
        Request memory request = sentRequests[_companyAddress][_index];   
        return(
            request.description,
            request.reciever,
            request.sender
            );
    }
}

contract ShareFileContract {
    //file storing Logic
    struct File {
        string ipfsHash;        // IPFS hash
        string title;           // File title
        string description;     // File description          
        uint256 uploadedOn;     // Uploaded timestamp
        string originalHash;    //For integrity check
    }
    // Maps owner to their files
      mapping(address => mapping(address => File[])) public sharedFiles;
    function uploadFile(
        string _ipfsHash, 
        string _title, 
        string _description,
        string _originalHash,
        address _companyAddress,
        address _studentAddress
    ) public returns (bool _success) {
        require(bytes(_ipfsHash).length == 46, "Invalid IPFS hash");
        require(bytes(_title).length > 0 && bytes(_title).length <= 256, "Exceeded title limit.");
        require(bytes(_description).length < 1024, "Exceeded description limit");
        uint256 uploadedOn = now;
        File memory file = File(
            _ipfsHash,
            _title,
            _description,
            uploadedOn,
            _originalHash
        );
        sharedFiles[_companyAddress][_studentAddress].push(file);
        _success = true;
    }
    function getFileCount(address _companyAddress, address _studentAddress) public view returns (uint256) {
        require(_companyAddress != 0x0,"Invalid Address");
        require(_studentAddress != 0x0,"Invalid Address");
        return sharedFiles[_companyAddress][_studentAddress].length;
    }
    function getFile(address _companyAddress,address _studentAddress, uint8 _index) 
        public  view returns (
        string _ipfsHash, 
        string _title, 
        string _description, 
        uint256 _uploadedOn,
        string _originalHash
    ) {
        require(_companyAddress != 0x0,"Invalid Address");
         require(_studentAddress != 0x0,"Invalid Address");
        require(_index >= 0 && _index <= 2**8 - 1,"Invalid Index");
        require(sharedFiles[_companyAddress][_studentAddress].length > 0,"No files found");

        File storage file = sharedFiles[_companyAddress][_studentAddress][_index];   
        return (
            file.ipfsHash, 
            file.title, 
            file.description, 
            file.uploadedOn,
            file.originalHash
        );
    }
}

contract FileContract {
    //file storing Logic    
    struct File {
        string ipfsHash;        // IPFS hash
        string title;           // File title
        string description;     // File description          
        uint256 uploadedOn;     // Uploaded timestamp
        string originalHash;    //For integrity check
    }

    // Maps owner to their files
    mapping (address => File[]) public ownerToFiles;

    
    function uploadFile(
        string _ipfsHash, 
        string _title, 
        string _description,
        address _studentAddress,
        string _originalHash
    ) public returns (bool _success) {
            
        require(bytes(_ipfsHash).length == 46, "Invalid IPFS hash");
        require(bytes(_title).length > 0 && bytes(_title).length <= 256, "Exceeded title limit.");
        require(bytes(_description).length < 1024, "Exceeded description limit");

        uint256 uploadedOn = now;
        File memory file = File(
            _ipfsHash,
            _title,
            _description,
            uploadedOn,
            _originalHash
        );
        
        
        ownerToFiles[_studentAddress].push(file);
        
        _success = true;
    }
    
    
    
    function getFileCount(address _owner) 
        public view 
        returns (uint256) 
    {
        require(_owner != 0x0,"Invalid Address");
        return ownerToFiles[_owner].length;
    }

    function getFile(address _owner, uint8 _index) 
        public  view returns (
        string _ipfsHash, 
        string _title, 
        string _description, 
        uint256 _uploadedOn,
        string _originalHash
    ) {
        
        require(_owner != 0x0,"Invalid Address");
        require(_index >= 0 && _index <= 2**8 - 1,"Invalid Index");
        require(ownerToFiles[_owner].length > 0,"No files found");

        File storage file = ownerToFiles[_owner][_index];
        
        return (
            file.ipfsHash, 
            file.title, 
            file.description, 
            file.uploadedOn,
            file.originalHash
        );
    }
}

contract FundRaising {
    mapping(address=>uint) public contributions;
    uint public totalContributors;
    uint public minimumContribution;
    uint public raisedAmount = 0 ;
    address public admin;
    constructor() public{
        minimumContribution = 1000000;
        admin = msg.sender;
    }
    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    } 
    function contribute() public payable {
        require(msg.value > minimumContribution);
        if(contributions[msg.sender] == 0)
        {
            totalContributors++;
        }
        contributions[msg.sender] += msg.value;
        raisedAmount+=msg.value;
    }
    function makePayment(address studentAddress,uint amountToTransfer) public onlyAdmin returns (bool) {
        studentAddress.transfer(amountToTransfer);
        return true;
    }
}

contract CertificateAuthority{
    mapping(address => string) publicKeys;
    mapping(address => string) privateKeys;

     function setPublicKey(string publicKey) public returns (bool) {
            publicKeys[msg.sender] = publicKey;
            return true;
     }

        function getPublicKey(address userAddress) public view returns (string){
            return publicKeys[userAddress];
        }


    function setPrivateKey(string privateKey) public returns (bool) {
            privateKeys[msg.sender] = privateKey;
            return true;
     }

        function getPrivateKey() public view returns (string){
            return privateKeys[msg.sender];
        }
}