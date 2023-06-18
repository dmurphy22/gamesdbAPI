DROP TABLE IF EXISTS GameImage;
DROP TABLE IF EXISTS GameAlternateName;
DROP TABLE IF EXISTS Game;
DROP TABLE IF EXISTS MameFile;
DROP TABLE IF EXISTS File;
DROP TABLE IF EXISTS Platform;
DROP TABLE IF EXISTS PlatformAlternateName;


CREATE TABLE Platform (
  id INTEGER PRIMARY KEY,
  Name TEXT,
  Emulated BOOLEAN,
  ReleaseDate TEXT,
  Developer TEXT,
  Manufacturer TEXT,
  Cpu TEXT,
  Memory TEXT,
  Graphics TEXT,
  Sound TEXT,
  Display TEXT,
  Media TEXT,
  MaxControllers INTEGER,
  Notes TEXT,
  Category TEXT,
  UseMameFiles BOOLEAN
);

CREATE TABLE PlatformAlternateName (
  id INTEGER PRIMARY KEY,
  AlternateName TEXT
);

CREATE TABLE File (
  id INTEGER PRIMARY KEY,
  PlatformId INTEGER,
  FileName TEXT,
  GameName TEXT,
  FOREIGN KEY (PlatformId) REFERENCES Platform(id)
);

CREATE TABLE MameFile (
  id INTEGER PRIMARY KEY,
  FileName TEXT,
  Name TEXT,
  Status TEXT,
  Developer TEXT,
  Publisher TEXT,
  Year INTEGER,
  IsMechanical BOOLEAN,
  IsBootleg BOOLEAN,
  IsPrototype BOOLEAN,
  IsHack BOOLEAN,
  IsMature BOOLEAN,
  IsQuiz BOOLEAN,
  IsFruit BOOLEAN,
  IsCasino BOOLEAN,
  IsRhythm BOOLEAN,
  IsTableTop BOOLEAN,
  IsPlayChoice BOOLEAN,
  IsMahjong BOOLEAN,
  IsNonArcade BOOLEAN,
  Genre TEXT,
  PlayMode TEXT,
  Language TEXT,
  Source TEXT
);

CREATE TABLE Game (
  id INTEGER PRIMARY KEY,
  Name TEXT,
  ReleaseYear INTEGER,
  Overview TEXT,
  MaxPlayers INTEGER,
  ReleaseType TEXT,
  Cooperative BOOLEAN,
  DatabaseID INTEGER,
  Platform TEXT,
  CommunityRatingCount INTEGER,
  Genres TEXT,
  Developer TEXT,
  Publisher TEXT
);

CREATE TABLE GameAlternateName (
  id INTEGER PRIMARY KEY,
  AlternateName TEXT,
  DatabaseID INTEGER,
  FOREIGN KEY (DatabaseID) REFERENCES Game(DatabaseID)
);

CREATE TABLE GameImage (
  id INTEGER PRIMARY KEY,
  DatabaseID INTEGER,
  FileName TEXT,
  Type TEXT,
  CRC32 INTEGER,
  FOREIGN KEY (DatabaseID) REFERENCES Game(DatabaseID)
);
