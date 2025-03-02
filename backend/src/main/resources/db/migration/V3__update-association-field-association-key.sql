-- V3__update-association-filed-association-key.sql

-- Add field association key to association
ALTER TABLE associations
ADD COLUMN association_key VARCHAR(255) UNIQUE NOT NULL;


-- Add relation on volunteers to associations
ALTER TABLE volunteers
ADD COLUMN related_association_uuid BINARY(16) NOT NULL,
ADD CONSTRAINT fk_volunteers_association_uuid
FOREIGN KEY (related_association_uuid) REFERENCES associations (uuid),