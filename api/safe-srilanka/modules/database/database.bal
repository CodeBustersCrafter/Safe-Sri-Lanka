import ballerinax/mysql.driver as _;
import ballerinax/mysql;

// MySQL Database configuration
configurable string dbUser = "root";
configurable string dbPassword = "root";
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbName = "safe_sri_lanka";
configurable int poolSize = 5;

// Create a connection pool to store multiple clients
public final mysql:Client[] clientPool = [];

// Initialize the client pool
function init() {
    foreach int i in 0 ..< poolSize {
        mysql:Client|error dbClient = new (
            host = dbHost,
            user = dbUser,
            password = dbPassword,
            database = dbName,
            port = dbPort
        );
        if (dbClient is mysql:Client) {
            clientPool.push(dbClient);
        } else {
            panic error("Failed to initialize database client: " + dbClient.message());
        }
    }
}

// Function to get a client from the pool
public int pointer = 0;
public function getClient() returns mysql:Client {
    int index = pointer % poolSize;
    pointer = pointer + 1;
    return clientPool[index];
}
