/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerID]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeCustomerID` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "stripeCustomerID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeCustomerID_key" ON "subscriptions"("stripeCustomerID");
