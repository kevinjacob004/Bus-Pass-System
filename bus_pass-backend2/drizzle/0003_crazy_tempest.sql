ALTER TABLE `users` DROP FOREIGN KEY `users_route_stop_id_route_stops_id_fk`;
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_route_stop_id_route_stops_id_fk` FOREIGN KEY (`route_stop_id`) REFERENCES `route_stops`(`id`) ON DELETE set null ON UPDATE cascade;