-- Delete boners from 2012 that have no records (lost in Rails migration)
DELETE FROM boners
WHERE NOT EXISTS (SELECT 1 FROM records WHERE records.serial = boners.serial);
