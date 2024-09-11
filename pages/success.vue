<template>
	<info>
		<template v-slot:img>
			<img :src="resultImage" class="img-fluid img-sp">
		</template>
		<div v-html="successRegText">
		</div>
	</info>
</template>

<script setup>

	
	useHead({
	  title: '登記完成',
	  meta: [
	    { name: 'description', content: 'success page.' },
	  ]
	});
	
	const route = useRoute();
	const eventDate = route.query.eventDate;
	const eventUrlParam = ref('');
	console.info("route.params->", route.query)
	let eventT = route.query.eventUrlParam;
	if (typeof(eventT) != 'undefined' && eventT != '')
		eventUrlParam.value = eventT;
		
	const successRegText = ref('');
	const resultImage = ref('');
	const configData4Store = configDataStore();
	//onMounted(async () => {
		const configDataTemp = await configData4Store.getData(eventUrlParam.value);
		if (configDataTemp && configDataTemp.data && configDataTemp.data.length>0) {
			let code = configDataTemp.responseCode;
		let emsg =configDataTemp.responseMessage;
							console.info("get Data from api error:", code+":"+emsg)
							if (code == 4)
								toErrorPage(emsg);
			let dataf = configDataTemp.data[0].attributes;
			if(dataf.resultImage && dataf.imageDns)
			  resultImage.value = dataf.imageDns + dataf.resultImage.data[0].attributes.url;
			if(dataf.successRegText)
			  successRegText.value = dataf.successRegText.replace('{TIMESLOT}',eventDate);
		}	
		
	//});
	
	
</script>
<style scoped>
</style>
