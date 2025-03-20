ALTER TABLE `daily_pass` MODIFY COLUMN `ticket_no` int NOT NULL;--> statement-breakpoint
ALTER TABLE `daily_pass` MODIFY COLUMN `ticket_no` int NOT NULL DEFAULT 0;