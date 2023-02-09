<template>
	<div class="mb-60">
		<p class="text-3xl text-slate-600 text-center mt-10 font-bold">
			Transactions List
		</p>
		<template v-if="transactions.length > 0">
			<div class="mx-20 mt-10 rounded-xl border shadow-2xl">
				<table
					class="table-auto w-full text-left content-center bg-slate-100 rounded-xl"
				>
					<thead class="rounded-xl">
						<tr class="bg-gray-800 text-white rounded-t-full">
							<th class="w-1/2 px-4 py-4 rounded-tl-xl">Reference</th>
							<th class="px-4 py-2">Category</th>
							<th class="px-4 py-2">Date</th>
							<th class="px-4 py-2 text-right rounded-tr-xl">Amount</th>
						</tr>
					</thead>
					<tbody>
						<template v-for="transaction in transactions" :key="transaction.id">
							<tr
								@click="goToTransaction(transaction.id)"
								class="hover:font-bold hover:text-gray-900 leading-loose hover:bg-gray-200"
							>
								<td class="px-4 py-2">
									<template v-if="transaction?.reference">
										{{ transaction.reference }}
									</template>
									<template v-else>
										<span class="text-gray-400">No reference provided</span>
									</template>
								</td>
								<td class="px-4 py-2">
									<div
										class="font-medium py-2 px-4 rounded text-center opacity-60"
										:style="{
											'background-color': '#' + transaction.category.color,
											display: 'inline-block',
										}"
									>
										<p class="text-black">{{ transaction.category.name }}</p>
									</div>
								</td>
								<td class="px-4 py-2">
									{{ formatDate(transaction.date) }}
								</td>
								<td class="px-4 py-2 text-right">
									{{ transaction.amount }}
									<span class="text-gray-400 pl-2">{{
										transaction.currency
									}}</span>
								</td>
							</tr>
						</template>
					</tbody>
				</table>
			</div>
		</template>
		<template v-else>
			<LoadingSpinner class="my-20" />
		</template>

		<template v-if="transactions.length > 0">
			<div class="flex justify-between mt-10 mx-20">
				<button
					:disabled="(pageNumber < 2, isLoading)"
					@click="previousPage()"
					:class="{ disabled: pageNumber <= 1 || isLoading }"
					class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded"
				>
					Previous Page
				</button>
				<template v-if="isLoading">
					<LoadingSpinner />
				</template>
				<template v-else> Page: {{ pageNumber }} </template>

				<button
					@click="nextPage()"
					:disabled="isLoading"
					:class="{ disabled: isLoading }"
					class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded ml-20"
				>
					Next Page
				</button>
			</div>
		</template>
	</div>
</template>
<style>
.disabled {
	pointer-events: none;
	cursor: not-allowed;
	background-color: gray;
	color: #ddd;
}
</style>
<script setup>
const router = useRouter();
const PAGE_SIZE = 20;

const transactions = useState('transactions', () => []);
const pageNumber = useState('pageNumber', () => 1);
const offset = useState('offset', () => PAGE_SIZE);
const isLoading = useState('isLoading', () => false);

const getTransactions = gql`
	query getTransactions($limit: Int!, $offset: Int!) {
		transactions(limit: $limit, offset: $offset) {
			id
			reference
			category {
				name
				color
			}
			date
			amount
			currency
		}
	}
`;

async function fetchTransactions(limit, offset) {
	try {
		const { data } = await useAsyncQuery(getTransactions, { limit, offset });

		if (data.value?.transactions) {
			transactions.value = data.value.transactions;
		}
	} catch (err) {
		// Handle error
		console.error(err);
	}
}

fetchTransactions(PAGE_SIZE, offset.value);

function formatDate(date) {
	const parsedDate = parseInt(date, 10);
	const dateObject = new Date(parsedDate);

	return dateObject.toLocaleDateString('en-US');
}

function goToTransaction(id) {
	router.push({ path: `/${id}` });
}

async function previousPage() {
	if (pageNumber.value > 1) {
		pageNumber.value--;
		offset.value = PAGE_SIZE * pageNumber.value;
		isLoading.value = true;

		await fetchTransactions(PAGE_SIZE, offset.value);

		isLoading.value = false;
	}
}
async function nextPage() {
	try {
		pageNumber.value++;
		offset.value = PAGE_SIZE * pageNumber.value;
		isLoading.value = true;

		await fetchTransactions(PAGE_SIZE, offset.value);

		isLoading.value = false;
	} catch (err) {
		// Handle error
		console.error(err);
	}
}
</script>
