ALTER TABLE `users` RENAME COLUMN `route_stop_id` TO `routeId`;--> statement-breakpoint
ALTER TABLE `users` DROP FOREIGN KEY `users_route_stop_id_route_stops_id_fk`;
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_routeId_routes_id_fk` FOREIGN KEY (`routeId`) REFERENCES `routes`(`id`) ON DELETE set null ON UPDATE cascade;