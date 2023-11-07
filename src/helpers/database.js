import {
    openDatabase,
    enablePromise,
    deleteDatabase,
} from "react-native-sqlite-storage";
import { DATABASE } from "../constants";

enablePromise(true);

export class Database {
    static database;
    static getDatabase() {
        if (Database.database == null) {
            Database.database = openDatabase({
                name: DATABASE.NAME,
                location: "default",
            });
        }
        return Database.database;
    }
}

export const syncTableHikes = async database => {
    const query = `CREATE TABLE IF NOT EXISTS ${DATABASE.TABLES.HIKES}(
          _id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          location TEXT NOT NULL,
          date TEXT NOT NULL,
          isParkingAvailable INTEGER NOT NULL,
          durationInHours REAL NOT NULL,
          difficultyLevel INTEGER NOT NULL,
          description TEXT,
          rating REAL NOT NULL,
          distance REAL NOT NULL,
          distanceUnit TEXT NOT NULL
      );`;
    await database.executeSql(query);
};

export const saveHike = async (database, hike) => {
    const {
        name,
        location,
        date,
        isParkingAvailable,
        durationInHours,
        difficultyLevel,
        description,
        rating,
        distance,
        distanceUnit,
    } = hike;
    const query = `INSERT INTO ${
        DATABASE.TABLES.HIKES
    } (name, location, date, isParkingAvailable, durationInHours, difficultyLevel,
        description, rating, distance, distanceUnit) values
      ('${name}', '${location}', '${date}', '${isParkingAvailable}', '${durationInHours}', '${difficultyLevel}', 
      ${
          description ? `'${description}'` : null
      }, '${rating}', '${distance}', '${distanceUnit}')`;
    return database.executeSql(query);
};

export const updateHike = async (database, hike) => {
    const {
        hikeId,
        name,
        location,
        date,
        isParkingAvailable,
        durationInHours,
        difficultyLevel,
        description,
        rating,
        distance,
        distanceUnit,
    } = hike;

    const updateFields = `name = '${name}', location = '${location}', date = '${date}', isParkingAvailable = '${isParkingAvailable}',
    durationInHours = '${durationInHours}', difficultyLevel = '${difficultyLevel}', description = ${
        description ? `'${description}'` : null
    },
    rating = '${rating}', distance = '${distance}', distanceUnit = '${distanceUnit}'`;

    const query =
        `UPDATE ${DATABASE.TABLES.HIKES} SET ` +
        updateFields +
        ` WHERE _id = ${hikeId}`;

    return database.executeSql(query);
};

export const getAllHikes = async database => {
    const results = await database.executeSql(
        `SELECT * FROM ${DATABASE.TABLES.HIKES}`,
    );
    return results;
};

export const getHike = async (database, { hikeId }) => {
    const dataResults = await database.executeSql(
        `SELECT * FROM ${DATABASE.TABLES.HIKES} WHERE _id = ${hikeId}`,
    );
    return dataResults[0]?.rows?.item(0);
};

export const getHikes = async (database, query = {}) => {
    const { limit = 10, skip = 0 } = query;
    const dataResults = await database.executeSql(
        `SELECT * FROM ${DATABASE.TABLES.HIKES} LIMIT ${limit} OFFSET ${skip}`,
    );
    const countResults = await database.executeSql(
        `SELECT count(*) FROM ${DATABASE.TABLES.HIKES}`,
    );

    const data = [];
    dataResults.map(result => {
        for (let index = 0; index < result.rows.length; index++) {
            data.push(result.rows.item(index));
        }
    });

    const count = countResults[0]?.rows?.item(0)["count(*)"];

    return {
        data,
        count,
    };
};

export const deleteHike = async (database, { hikeId }) => {
    const results = await database.executeSql(
        `DELETE FROM ${DATABASE.TABLES.HIKES} WHERE _id = ${hikeId}`,
    );
    const rowsAffected = results[0]?.rowsAffected || 0;
    return rowsAffected;
};

export const clearAllHikes = async database => {
    const results = await database.executeSql(
        `DELETE FROM ${DATABASE.TABLES.HIKES}`,
    );
    return results;
};

export const dropDatabase = async () => {
    return await deleteDatabase(DATABASE.NAME);
};
