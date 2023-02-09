const { PrismaClient } = require('@prisma/client');

const csv = require('csv-parser');
const fs = require('fs');

const prisma = new PrismaClient();

const seedFile = async (filePath: string, modelName: string) =>
	new Promise((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', async (row: any) => {
				try {
					await prisma[modelName].create({
						data: row,
					});
				} catch (error) {
					reject(error);
				}
			})
			.on('end', resolve);
	});

async function seedAccounts() {
	await seedFile('./data/accounts.csv', 'account');
}
async function seedCategories() {
	await seedFile('./data/categories.csv', 'category');
}

async function seedTransactions() {
	try {
		fs.createReadStream('./data/transactions.csv')
			.pipe(csv())
			.on('data', async (row: any) => {
				try {
					const data = {
						...row,
						categoryId: !row.categoryId ? null : row.categoryId,
						amount: parseFloat(row.amount),
						date: new Date(row.date),
					};
					await prisma.transaction.create({
						data,
					});
				} catch (error) {
					console.log(error);
				}
			});
	} catch (error) {
		console.error(error);
	}
}

async function seed() {
	try {
		await Promise.all([seedAccounts(), seedCategories()])
			.then(() => {
				seedTransactions();
			})
			.catch((error) => {
				console.error(error);
			});
	} catch (error) {
		console.error(error);
	} finally {
		await prisma.$disconnect();
	}
}

seed();
