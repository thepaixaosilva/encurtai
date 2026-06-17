CREATE TABLE `urls` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`long_url` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
