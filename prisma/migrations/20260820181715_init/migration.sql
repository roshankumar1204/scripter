-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceUrl" TEXT NOT NULL,
    "rawMarkdown" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Beat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "sourceSnippet" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "narration" TEXT NOT NULL,
    "uiActionType" TEXT NOT NULL,
    "uiActionTarget" TEXT NOT NULL,
    "uiActionFallback" TEXT NOT NULL,
    "anticipatedQuestions" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "confidence" TEXT NOT NULL DEFAULT 'medium',
    "unsupportedClaims" TEXT NOT NULL DEFAULT '[]',
    "sourceWordCount" INTEGER NOT NULL,
    "editedByHuman" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Beat_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
