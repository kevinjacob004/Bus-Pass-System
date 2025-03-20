ALTER TABLE `off_days` MODIFY COLUMN `branch` enum('ECE','CSE','EEE','ME','CE','IT') NOT NULL;--> statement-breakpoint
ALTER TABLE `daily_pass` ADD `is_booked` boolean DEFAULT false;

ALTER TABLE `users` DROP FOREIGN KEY `users_route_stop_id_route_stops_id_fk`;
ALTER TABLE `users` ADD CONSTRAINT `users_route_stop_id_route_stops_id_fk`
    FOREIGN KEY (`route_stop_id`) REFERENCES `route_stops` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;