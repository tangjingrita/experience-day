<template>
	<info>
		<template v-slot:img>
			<img :src="posterImage" class="img-fluid img-sp">
		</template>
		<div v-html="quotaFullText">
		</div>
	</info>
</template>

<script setup>
	const router = useRouter();
		useHead({
		  title: '登記提示',
		  meta: [
		    { name: 'description', content: 'full page.' },
		  ]
		});
	
	const toErrorPage = (msg) => {
		const queryParams = {
			msg: msg,
			eventUrlParam: eventUrlParam.value
		};
		router.push({
			path: '/error',
			query: queryParams
		})
	}

	const route = useRoute();
	const eventUrlParam = ref('');
	console.info("route.params->", route.query)
	let eventT = route.query.eventUrlParam;
	if (typeof(eventT) != 'undefined' && eventT != '')
		eventUrlParam.value = eventT;
	const posterImage = ref('');
	const quotaFullText = ref('');
	const configData4Store = configDataStore();
	//onMounted(async () => {
		const configDataTemp = await configData4Store.getData(eventUrlParam.value);
		if (configDataTemp && configDataTemp.data && configDataTemp.data.length>0) {
			let dataf = configDataTemp.data[0].attributes;
			if(dataf.posterImage && dataf.imageDns)
			  posterImage.value = dataf.imageDns + dataf.posterImage.data[0].attributes.url;
			if(dataf.quotaFullText)
			  quotaFullText.value = dataf.quotaFullText;
			  let code = configDataTemp.responseCode;
		let emsg =configDataTemp.responseMessage;
							console.info("get Data from api error:", code+":"+emsg)
							if (code == 4)
								toErrorPage(emsg);
		}	
		
	//});
</script>

<style >
</style>
