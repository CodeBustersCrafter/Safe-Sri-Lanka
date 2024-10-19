import ballerina/sql;

public type UserProfile record {|
    @sql:Column {name : "id"}
    readonly int id;
    @sql:Column {name : "name"}
    string name;
    @sql:Column {name : "mobile"}
    string mobile;
    @sql:Column {name : "whatsapp"}
    string whatsapp;
    @sql:Column {name : "email"}
    string email;
    @sql:Column {name : "location"}
    string location;
    @sql:Column {name : "profileImage"}
    string profileImage; // URL or base64 string
|};

public type DangerZone record {|
    readonly int id;
    decimal lat;
    decimal lon;
    string description;
    decimal? distance;
|};

public type EmergencyNumber record {|
    string id;
    string emoji; 
    string title;
    string number;
|};

public type SOSSignal record {|
    readonly int id;
    int senderId;
    decimal lat;
    decimal lon;
    string timestamp;
    boolean isActive;
    string? otp;
|};

public type SOSMessage record {|
    string types;
    int senderId;
    decimal lat;
    decimal lon;
    int sosId;
|};

public type UncomfortableMessage record {|
    string types;
    int senderId;
    decimal lat;
    decimal lon;
    int uncomfortableId;
|};

public type UncomfortableSignal record {|
    readonly int id;
    int senderId;
    decimal lat;
    decimal lon;
    string description;
|};