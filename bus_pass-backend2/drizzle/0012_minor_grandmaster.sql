RENAME TABLE `daily_pass` TO `day_pass`;--> statement-breakpoint
ALTER TABLE `day_pass` DROP FOREIGN KEY `daily_pass_stop_id_route_stops_id_fk`;
--> statement-breakpoint
ALTER TABLE `day_pass` DROP FOREIGN KEY `daily_pass_route_id_routes_id_fk`;
--> statement-breakpoint
ALTER TABLE `day_pass` DROP FOREIGN KEY `daily_pass_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `day_pass` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `day_pass` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `day_pass` ADD CONSTRAINT `day_pass_stop_id_route_stops_id_fk` FOREIGN KEY (`stop_id`) REFERENCES `route_stops`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `day_pass` ADD CONSTRAINT `day_pass_route_id_routes_id_fk` FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `day_pass` ADD CONSTRAINT `day_pass_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;