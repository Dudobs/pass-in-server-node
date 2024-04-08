/*
  Warnings:

  - A unique constraint covering the columns `[event_id,email]` on the table `attendees` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "attendees_event_id_email_idx";

-- CreateIndex
CREATE UNIQUE INDEX "attendees_event_id_email_key" ON "attendees"("event_id", "email");
