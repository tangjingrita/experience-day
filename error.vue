<template>
	<div>{{error.statusCode}}<br>
		{{error.message}}
	</div>
</template>

<script setup>
	defineProps({
		error: Object
	})
</script>

<style>
</style>
