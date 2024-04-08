-- DropIndex
DROP INDEX "attendees_email_event_id_idx";

-- CreateIndex
CREATE INDEX "attendees_event_id_email_idx" ON "attendees"("event_id", "email");
