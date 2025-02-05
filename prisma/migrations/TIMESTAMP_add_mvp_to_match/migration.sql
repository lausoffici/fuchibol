-- AlterTable
ALTER TABLE "Match" ADD COLUMN "mvpId" TEXT REFERENCES "Player"(id); 