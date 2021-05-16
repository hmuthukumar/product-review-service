import Mongoose = require('mongoose');
import * as config from 'config';
import { logger } from '../../middleware/common/Logging';

Mongoose.Promise = global.Promise;

class MongooseAccess {
  static mongooseInstance : any;
  static mongooseConnection : Mongoose.Connection;

  constructor() {
    MongooseAccess.connect();
  }

  static connect() : Mongoose.Connection {

    if (this.mongooseInstance) {
      return this.mongooseInstance;
    }

    let connectionString = config.get('mongo.urlClient').toString();
    this.mongooseConnection = Mongoose.connection;

    this.mongooseConnection.once('open', () => {
       logger.info('Connect to an mongodb is opened.');
    });

    this.mongooseInstance = Mongoose.connect(connectionString, {
                                useNewUrlParser: true,
                                useFindAndModify: true,
                                useUnifiedTopology: true,
                                useCreateIndex: true,
                            });

    this.mongooseConnection.on('connected', () => {
      logger.info('Mongoose default connection open to ' +connectionString);
    });

    // If the connection throws an error
    this.mongooseConnection.on('error', (msg) => {
      logger.info('Mongoose default connection message:', msg);
    });

    // When the connection is disconnected
    this.mongooseConnection.on('disconnected', () => {
      //Keep trying the DB connection every 10 seconds
      //when it is in disconnected mode, This will provide some resience for the system
      setTimeout(function() {
        this.mongooseInstance = Mongoose.connect(connectionString, {
                                    useNewUrlParser: true,
                                    useFindAndModify: true,
                                    useUnifiedTopology: true,
                                    useCreateIndex: true,
                                });
      }, 10000);
      logger.info('Mongoose default connection disconnected.');
    });

    // When the connection is reconnected
    this.mongooseConnection.on('reconnected', () => {
      logger.info('Mongoose default connection is reconnected.');
    });

    // If the Node process ends, close the Mongoose connection
    // arguably this can be done for SIGTERM as well
    //Anyway this is one of the step for graceful shutdown
    process.on('SIGINT', () => {
      this.mongooseConnection.close(() => {
      logger.info('Mongoose default connection disconnected through app termination.');
        process.exit(0);
      });
    });

    return this.mongooseInstance;
  }

}

MongooseAccess.connect();
export { MongooseAccess };
