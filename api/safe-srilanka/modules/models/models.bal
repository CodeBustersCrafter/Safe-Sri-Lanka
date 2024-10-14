import ballerina/sql;

public type UserProfile record {|
    @sql:Column {name : "id"}
    readonly int id;
    @sql:Column {name : "name"}
    string name;
    @sql:Column {name : "mobile"}
    string mobile;
    @sql:Column {name : "email"}
    string email;
    @sql:Column {name : "location"}
    string location;
    @sql:Column {name : "profileImage"}
    string profileImage; // URL or base64 string
|};