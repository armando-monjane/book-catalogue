import { User } from "@prisma/client";
import prisma from "../services/prisma";
import { UserCreate } from "../models/user-create";

export const createUser = async (data: UserCreate) => {
  const user = await prisma.user.create({
    data,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      password: false,
    },
  });
  return user;
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};

export const updateUser = async (id: number, data: User) => {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

export const deleteUser = async (id: number) => {
  await prisma.user.delete({ where: { id } });
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};
