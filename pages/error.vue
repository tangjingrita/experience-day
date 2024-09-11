<template>
	<info>
		<template v-slot:img>
			<div style="height: 30px;width: 100%;">&nbsp;</div>
		</template>
		<div>{{msg}}</div>
	</info>
</template>

<script setup>
	useHead({
	  title: '提示',
	  meta: [
	    { name: 'description', content: 'error page.' },
	  ]
	});
	
	const route = useRoute();
	const msg = route.query.msg;
	console.info("route.params->", route.query)
	let eventT = route.query.eventUrlParam;
	onMounted(async () => {
		if (typeof(eventT) != 'undefined' && eventT != '')
		{
			const configData4Store = configDataStore();
			configData4Store.getData(eventT);
		}
	});
</script>

<style scoped>
</style>
