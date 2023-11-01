<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="auto">
                <div class="d-flex flex-column justify-center">
                    <h1>Страница не найдена</h1>
                    <v-btn color="blue" x-large text @click="$router.back()">Вернуться</v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "not-found"
    }
</script>

<style scoped>

</style>
