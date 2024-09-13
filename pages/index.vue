<template>
</template>

<script setup>
	const router = useRouter();
    const queryParams = {
			msg: '此活動頁面跑去火星了，看看其他活動吧。',
			//eventUrlParam: eventUrlParam.value
		};
    router.push({
			path: '/error',
			query: queryParams
		})
</script>

<style >
</style>
