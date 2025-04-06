import fs from "fs";
// const filePath = "/home/userData/tempUsers.json";  // Change path if needed

// Ensure file exists
// if (!fs.existsSync(filePath)) {
//     fs.writeFileSync(filePath, "[]", "utf-8");
// }

// export const saveToTempStorage = (users) => {
//     fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
// };

// export const readFromTempStorage = () => {
//     return JSON.parse(fs.readFileSync(filePath, "utf-8"));
// };

// Alternative local storage path for testing on localhost
// const localFilePathUser = "./storage/tempUsers.json";
const localFilePathUser = "/home/userData/tempUsers.json";

if (!fs.existsSync(localFilePathUser)) {
    fs.writeFileSync(localFilePathUser, "[]", "utf-8");
}

export const saveToTempUser = (users) => {
    fs.writeFileSync(localFilePathUser, JSON.stringify(users, null, 2), "utf-8");
};

export const readFromTempUser = () => {
    return JSON.parse(fs.readFileSync(localFilePathUser, "utf-8"));
};


// const localFilePathListing = "./storage/tempListing.json";
const localFilePathListing = "/home/userData/tempListing.json";


if (!fs.existsSync(localFilePathListing)) {
    fs.writeFileSync(localFilePathListing, "[]", "utf-8");
}

export const saveToTempListing = (listings) => {
    fs.writeFileSync(localFilePathListing, JSON.stringify(listings, null, 2), "utf-8");
};

export const readFromTempListing = () => {
    return JSON.parse(fs.readFileSync(localFilePathListing, "utf-8"));
};

// const localUserUpdate = "./storage/userUpdate.json";
const localUserUpdate = "/home/userData/userUpdate.json";



if (!fs.existsSync(localUserUpdate)) {
    fs.writeFileSync(localUserUpdate, "[]", "utf-8");
}

export const saveToUserUpdate = (userUpdate) => {
    fs.writeFileSync(localUserUpdate, JSON.stringify(userUpdate, null, 2), "utf-8");
};

export const readFromUserUpdate = () => {
    return JSON.parse(fs.readFileSync(localUserUpdate, "utf-8"));
};