<template>
	<form class="flex">
		<div class="w-2/3">
			<div>
				<label for="select pr-2">Select a category:</label>
				<select id="select" v-model="selectedCategory">
					<option v-for="option in categories" :value="option.id">
						{{ option.name }}
					</option>
				</select>
			</div>
			<p class="mt-3">OR</p>
			<div class="mt-4">
				<label for="input">Enter a new category:</label>
				<input type="text" v-model="inputCategory" />
				<p class="text-sm mt-2">* Input category has priority</p>
			</div>
		</div>
		<div class="w-1/3 ml-4">
			<button
				type="submit"
				@click.prevent="submitForm"
				class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded mt-5"
			>
				Submit
			</button>
			<template v-if="formError">
				<p class="text-red-900 mt-2 text-sm">{{ formError }}</p>
			</template>
		</div>
	</form>
</template>

<script setup>
const inputCategory = useState('inputCategory', () => '');
const formError = useState('formError', () => '');
const transaction = useState('transaction');
const selectedCategory = useState(
	'selectedCategory',
	() => transaction.value.category.id
);
const category = useState('category');
const categories = useState('categories');
const showForm = useState('showform');

const getCategories = gql`
	query getCategories {
		categories {
			id
			name
			color
		}
	}
`;
const CreateCategory = gql`
	mutation CreateCategory($newCategoryName: String!, $color: String) {
		createCategory(name: $newCategoryName, color: $color) {
			name
			color
		}
	}
`;

const UpdateTransaction = gql`
	mutation UpdateTransaction($updateTransactionId: ID!, $categoryId: ID!) {
		updateTransaction(id: $updateTransactionId, categoryId: $categoryId) {
			id
			category {
				id
				name
				color
			}
		}
	}
`;

async function submitForm() {
	let hasInput = inputCategory.value ? true : false;

	if (hasInput && inputCategory.value) {
		try {
			formError.value = '';
			let { data } = await useAsyncQuery(CreateCategory, {
				newCategoryName: inputCategory.value,
			});
			category.value.name = data.value.createCategory.name;
			category.value.color = data.value.createCategory.color;
			inputCategory.value = '';
			showForm.value = false;
		} catch (error) {
			console.error(error);
		}
	} else if (!hasInput && selectedCategory.value) {
		try {
			formError.value = '';
			let { data } = await useAsyncQuery(UpdateTransaction, {
				updateTransactionId: transaction.value.id,
				categoryId: selectedCategory.value,
			});

			category.value.name = data.value.updateTransaction.category.name;
			category.value.color = data.value.updateTransaction.category.color;
			showForm.value = false;
		} catch (error) {
			console.error(error);
		}
	} else {
		formError.value =
			'* You need to select an category or to add a custom one.';
	}
}

const { data } = await useAsyncQuery(getCategories);
if (data?.value) {
	categories.value = data.value.categories;
}
</script>
