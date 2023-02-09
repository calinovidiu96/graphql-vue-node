<template>
	<p class="text-3xl text-center mt-10 text-slate-600 font-bold">
		Transaction Details
	</p>
	<NuxtLink to="/">
		<button
			class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded ml-20 flex"
		>
			<div class="w-6 mr-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="{1.5}"
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
					/>
				</svg>
			</div>
			Back to all transactions
		</button>
	</NuxtLink>
	<div class="mx-20 mt-10 rounded-lg border shadow-2xl bg-slate-100">
		<div class="overflow-hidden bg-white shadow sm:rounded-lg">
			<div class="px-4 py-5 sm:px-6">
				<h3 class="text-lg font-medium leading-6 text-gray-900">
					Customer Informations
				</h3>
				<p class="mt-1 max-w-2xl text-sm text-gray-500">
					Informations about transaction with ID: {{ transaction.id }}
				</p>
			</div>
			<div class="border-t border-gray-200">
				<dl>
					<div
						class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500">
							Full Customer Name
						</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							{{ transaction.account.name }}
						</dd>
					</div>
					<div
						class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500">
							Transaction reference
						</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							<template v-if="transaction?.reference">
								{{ transaction.reference }}
							</template>
							<template v-else>
								<span class="text-gray-400">No reference provided</span>
							</template>
						</dd>
					</div>
					<div
						class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500">Bank</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							{{ transaction.account.bank }}
						</dd>
					</div>
					<div
						class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500">Transaction Date</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							{{ formatDate(transaction.date) }}
						</dd>
					</div>
					<div
						class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500">Amount</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							<span class="font-bold mr-1 text-gray-400">
								{{ transaction.currency }}</span
							>
							{{ transaction.amount }}
						</dd>
					</div>
					<div
						class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt class="text-sm font-medium text-gray-500">Category</dt>
						<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
							<div
								class="font-medium py-2 px-4 rounded text-center opacity-60"
								:style="{
									'background-color': '#' + category.color,
									display: 'inline-block',
								}"
							>
								<p class="text-black">{{ category.name }}</p>
							</div>
						</dd>
					</div>

					<div
						class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
					>
						<dt></dt>
						<dd class="flex">
							<div class="w-6 mr-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="{1.5}"
									stroke="currentColor"
									className="w-6 h-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
									/>
								</svg>
							</div>
							<a
								@click="showForm = !showForm"
								href="#"
								class="font-medium text-slate-600 hover:text-slate-400"
							>
								Chose Another Category
							</a>
						</dd>
					</div>
					<div
						v-if="showForm"
						class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex items-center justify-center bg-slate-300"
					>
						<dt></dt>
						<dd class="flex">
							<ChangeCategory />
						</dd>
					</div>
				</dl>
			</div>
		</div>
	</div>
</template>

<script setup>
const route = useRoute();
const showForm = useState('showform', () => false);
const categories = useState('categories', () => []);
const transaction = useState('transaction', () => []);
const category = useState('category', () => ({}));

function formatDate(date) {
	const parsedDate = parseInt(date, 10);
	return new Date(parsedDate);
}

const getTransaction = gql`
	query geTransaction($id: ID!) {
		transaction(id: $id) {
			id
			reference
			category {
				id
				name
				color
			}
			date
			amount
			currency
			account {
				id
				name
				bank
			}
		}
	}
`;

let variables = { id: route.params.id };
const { data } = await useAsyncQuery(getTransaction, variables);

if (data?.value) {
	transaction.value = data.value.transaction;

	category.value.id = transaction.value.category.id;
	category.value.name = transaction.value.category.name;
	category.value.color = transaction.value.category.color;
}
</script>
