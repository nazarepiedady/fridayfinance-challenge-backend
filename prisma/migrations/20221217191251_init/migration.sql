-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "bank" VARCHAR(150) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "color" VARCHAR(8),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transition" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "reference" VARCHAR(255),
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(6) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transition" ADD CONSTRAINT "Transition_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transition" ADD CONSTRAINT "Transition_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;