ALTER TABLE `daily_pass` DROP FOREIGN KEY `daily_pass_route_id_route_stops_route_id_fk`;
--> statement-breakpoint
ALTER TABLE `daily_pass` ADD CONSTRAINT `daily_pass_route_id_routes_id_fk` FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE no action ON UPDATE no action;