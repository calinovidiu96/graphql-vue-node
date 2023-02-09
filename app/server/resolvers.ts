import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

interface Transaction {
	id: string;
	categoryId: string;
	accountId: string;
}

interface Account {
	accountid: string;
}

interface singleTransaction {
	id: string;
	currency: string;
}

interface Variables {
	limit: number;
	offset: number;
}

interface Category {
	id: string;
	name: string;
	color: string;
}

export const resolvers = {
	Query: {
		transactions: async (_: any, variables: Variables) => {
			let data = await prisma.transaction.findMany();
			let { limit, offset } = variables;
			return data.slice(offset, limit + offset);
		},
		transaction: (_root: any, { id }: singleTransaction) =>
			prisma.transaction.findUnique({
				where: { id: id },
			}),
		categories: () => prisma.category.findMany(),
	},

	Mutation: {
		createCategory: async (_root: any, newCategory: Category) => {
			newCategory.id = uuidv4();
			newCategory.color = 'c5e3c6';
			return prisma.category.create({ data: newCategory });
		},
		updateTransaction: async (_root: any, updates: Transaction) => {
			return await prisma.transaction.update({
				where: {
					id: updates.id,
				},
				data: {
					categoryId: updates.categoryId,
				},
			});
		},
	},

	Transaction: {
		category: (transaction: Transaction) => {
			return prisma.category.findUnique({
				where: { id: transaction.categoryId },
			});
		},
		account: (transaction: Transaction) => {
			return prisma.account.findUnique({
				where: { id: transaction.accountId },
			});
		},
	},

	Account: {
		transactions: (account: Account) => {
			return prisma.transaction.findMany({
				where: { id: account.accountid },
				take: 10,
			});
		},
	},
};
