import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";

// PrismaClientをモックする
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prisma);
});

export const prisma = mockDeep<PrismaClient>();
