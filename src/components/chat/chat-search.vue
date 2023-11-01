<template>
	<div class="chat-search">
		<v-form v-model="valid" class="chat-search__form" ref="searchForm" @submit.prevent="submit">
				<v-text-field ref="searchTextField" class="align-center"
							  v-debounce="submit"
							  :loading="loading.search"
							  v-model="quicksearch"
							  outlined
							  clearable
							  append-outer-icon="mdi-magnify"
							  @click:append-outer="submit"
							  @click:clear="clearClicked"
							  placeholder="Поиск"
							  hide-details dense
							  :rules="rules"
				>
				</v-text-field>
		</v-form>
	</div>
</template>

<script>
	import {mapActions} from 'vuex'

    export default {
        name: "chat-search",
		data() {
        	return {
        		valid: false,
				quicksearch: '',
				rules: [ v => !!v ],
				loading: {
					search: false
				}
			}
		},
		methods: {
			...mapActions({
				search: "chats/search",
				clearSearchResult: "chats/clearSearch",
				showSnackbar: "app/showSnackbar"
			}),
			submit() {
				const { valid, quicksearch } = this;
				if(valid && quicksearch) {
					this.loading.search = true;
					this.search({ quicksearch })
						.catch(e => {
							this.showSnackbar(e)
						})
						.finally(() => {
							this.loading.search = false;
						})
				}
			},
			clearClicked() {
				this.clearSearchResult();
				this.resetValidation()
			},
			resetValidation() {
				this.$refs['searchForm'].resetValidation()
			}
		},
		mounted() {
			const input = document.querySelector('.chat-search__form input[type=text]');
			input.addEventListener('blur', function () {
				this.resetValidation()
			}.bind(this));
		}
	}
</script>

<style scoped lang="sass">
	.chat-search
		display: flex
		align-items: center
		&__form
			width: 100%
</style>
