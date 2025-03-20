ALTER TABLE `morning_attendance` DROP FOREIGN KEY `morning_attendance_route_id_routes_id_fk`;
--> statement-breakpoint
ALTER TABLE `morning_attendance` DROP FOREIGN KEY `morning_attendance_bus_id_buses_id_fk`;
--> statement-breakpoint
ALTER TABLE `morning_attendance` ADD CONSTRAINT `morning_attendance_route_id_routes_id_fk` FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `morning_attendance` ADD CONSTRAINT `morning_attendance_bus_id_buses_id_fk` FOREIGN KEY (`bus_id`) REFERENCES `buses`(`id`) ON DELETE cascade ON UPDATE cascade;