ALTER TABLE `morning_attendance` DROP FOREIGN KEY `morning_attendance_route_id_routes_id_fk`;
--> statement-breakpoint
ALTER TABLE `morning_attendance` DROP FOREIGN KEY `morning_attendance_bus_id_buses_id_fk`;
--> statement-breakpoint
ALTER TABLE `morning_attendance` ADD CONSTRAINT `morning_attendance_route_id_routes_id_fk` FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `morning_attendance` ADD CONSTRAINT `morning_attendance_bus_id_buses_id_fk` FOREIGN KEY (`bus_id`) REFERENCES `buses`(`id`) ON DELETE no action ON UPDATE no action;