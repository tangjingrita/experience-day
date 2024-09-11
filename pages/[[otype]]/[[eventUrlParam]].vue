<template>
	<info v-show="showMain">
		<template v-slot:img>
			<img :src="posterImage" class="img-fluid img-sp">
		</template>
		<div>
			<el-form ref="formRef" :model="ruleForm" status-icon :rules="rules" auto-complete="on" label-width="auto"
				class="demo-ruleForm spdiv" :hide-required-asterisk="true" label-position="right" size="large">
				<el-form-item v-for="item in registrationItemList" :label="item.name"
					:prop="fmToLowerCase(item.dbfield)">
					<el-input auto-complete="on" type="text" v-model="ruleForm[fmToLowerCase(item.dbfield)]"
						:id="fmToLowerCase(item.dbfield)" :ref="fmToLowerCase(item.dbfield)"
						:placeholder="item.mandatory=='true'?'必須填寫':''"></el-input>
				</el-form-item>
				<el-form-item label="體驗場次" prop="sessionEvent" id="sessionEvent" v-show="showForm">
					<el-select v-model="ruleForm.sessionEvent" placeholder="請選擇" @change="loadingMaxseatperregistration">
				
						<el-option v-for="item in timeslotList" :label="item.date+' '+item.starttime+'-'+item.endtime" 
							:value="item.id+'@@'+item.date+'@@'+item.starttime+'-'+item.endtime+'@@'+item.maxseatperregistration" />
					</el-select>
				</el-form-item>
				<el-form-item label="預留座位" prop="participant" v-show="showForm">
					<el-select v-model="ruleForm.participant" id="participant" placeholder="請選擇">
						<el-option v-for="number in maxSeatpPerregistration" :value="number" :key="number"
							:label="number" />
					</el-select>
				</el-form-item>
				<div class="form-group" style="text-align: center;">
					<div style="color: red;font-size: 14px;">
						{{dataMsg}}
					</div>
				</div>
				<p style="text-align: center;" v-show="showForm">
					<el-button size="large" v-loading.fullscreen.lock="loading" type="primary"
						style="margin-top:10px;text-align: center;background-color: #ebae1c;border-color: #ebae1c; width: 150px; font-size: 18px; letter-spacing: 5px;"
						@click.native.prevent="handleReg">確認</el-button>
				</p>
			</el-form>
		</div>
	</info>
</template>


<script setup>
	const configData4Store = configDataStore();
	let  config = useRuntimeConfig();
     
	const router = useRouter();
	const route = useRoute();
	const eventUrlParam = ref("");
	const status = ref("0");
	const loading = ref(false);
	const registrationItemList = reactive([]);
	const timeslotList = reactive([]);
	const dataMsg = ref("");
	const formRef = ref({});
	const showForm = ref(false);
	const showMain = ref(false);
	const configData = ref({});
	const posterImage = ref('');
	const eventName = ref('');
    const  maxSeatpPerregistration = ref([1]); 

	

	const checkHkPhone4rule = (rule, value, callback) => {
		var reg = /^([3|4|5|6|7|9])[\d]{7}$/;
		if (!reg.test(value))
			return callback(new Error('電話號碼格式不正確'));
		else
			callback();
	}

	 const checkHkPhoneDup4rule = async (rule, value, callback) => {
		let sessionEventTemp = ruleForm.value.sessionEvent;
		let st = sessionEventTemp.split("@@");
		let phone = ruleForm.value.phone;
		if (sessionEventTemp == "" || phone == "")
			callback();
		else {
			let res = await postApi("/checkDup",
					{
						params: {
							phone: phone,
						event: configData.value.eventID + "," + st[0],
						date: st[1],
						  },
					});
				console.info("checkDup result", res);
					let resultCode = res.responseCode;
					if (resultCode == 3) {
						return callback(new Error('此電話號碼已經登記'));
					} else {
						callback();
					}
		}
	};
	const ruleForm = ref({
		name: '',
		phone: '',
		email: '',
		participant: '',
		sessionEvent: '',
	});

	const rules = {
		name: [{
			required: true,
			message: '請輸入姓名',
			trigger: 'blur'
		}],
		phone: [{
				required: true,
				message: '請輸入電話',
				trigger: 'blur'
			},
			{
				validator: checkHkPhone4rule,
				trigger: 'blur'
			},
			{
				validator: checkHkPhoneDup4rule,
				trigger: 'blur'
			}
		],
		email: [{
				required: true,
				message: '請輸入電郵',
				trigger: 'blur'
			},
			{
				type: 'email',
				message: '電郵格式不正確',
				trigger: 'blur'
			},
		],
		participant: [{
			required: true,
			message: '請選擇預留座位',
			//trigger: 'change'
		}],
		sessionEvent: [{
			required: true,
			message: '請選擇體驗日場次',
			//trigger: 'change'
		}]
	};


	// 定义一个函数来格式化文本为小写
	const fmToLowerCase = (value) => {
		return value.toLowerCase();
	}

	const handleReg = async () => {
		await formRef.value?.validate()
		await regEvent()

	}
	const toSuccessPage = (date) => {
		const queryParams = {
			eventDate: date,
			eventUrlParam: eventUrlParam.value
		};
		router.push({
			path: '/success',
			query: queryParams
		});
	}
	const toFullPage = () => {
		const queryParams = {
			eventUrlParam: eventUrlParam.value
		};
		router.push({
			path: '/full',
			query: queryParams
		})
	}
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


	const checkHKPhone = (phoneNo) => {
		var reg = /^([3|4|5|6|7|9])[\d]{7}$/;
		if (!reg.test(phoneNo))
			return false;
		else
			return true;
	};
	const checkEmail = (email) => {
		var reg = /^[a-zA-Z0-9_-]+(\.([a-zA-Z0-9_-])+)*@[a-zA-Z0-9_-]+[.][a-zA-Z0-9_-]+([.][a-zA-Z0-9_-]+)*$/;
		if (!reg.test(email))
			return false;
		else
			return true;
	}
   const loadingMaxseatperregistration =()=>
   {
	   let sessionEventTemp = ruleForm.value.sessionEvent;
	   let st = sessionEventTemp.split("@@");
	   let msp = +st[3];
	   maxSeatpPerregistration.value =  Array.from({ length: msp }, (_, i) => msp - i)
	   if(!maxSeatpPerregistration.value.includes(ruleForm.value.participant))
	     ruleForm.value.participant = maxSeatpPerregistration.value[0];
   }

  
	const regEvent = async () => {
		var checkData = true;
		if (ruleForm.value.name == null || ruleForm.value.name == '') {
			checkData = false;
			dataMsg.value = '請輸入姓名';
			nextTick(() => {
				document.getElementById("name").focus()
			});
		} else if (ruleForm.value.phone == null || ruleForm.value.phone == '') {
			checkData = false;
			dataMsg.value = '請輸入電話';
			nextTick(() => {
				document.getElementById("phone").focus()
			});
		} else if (!checkHKPhone(ruleForm.value.phone)) {
			checkData = false;
			dataMsg.value = '電話號碼格式不正確';
			nextTick(() => {
				document.getElementById("phone").focus()
			});
		} else if (ruleForm.value.email == null || ruleForm.value.email == '') {
			checkData = false;
			dataMsg.value = '請輸入電郵';
			nextTick(() => {
				document.getElementById("email").focus()
			});
		} else if (ruleForm.value.email != '' && !checkEmail(ruleForm.value.email)) {
			checkData = false;
			dataMsg.value = '電郵格式不正確';
			nextTick(() => {
				document.getElementById("email").focus()
			});
		} else if (ruleForm.value.participant == null || ruleForm.value.participant == '' || ruleForm.value
			.participant == '-1') {
			checkData = false;
			dataMsg.value = '請選擇預留座位';
			nextTick(() => {
				document.getElementById("participant").focus()
			});
		} else if (ruleForm.value.sessionEvent == null || ruleForm.value.sessionEvent == '' || ruleForm
			.value.sessionEvent == '-1') {
			checkData = false;
			dataMsg.value = '請選擇體驗日場次';
			nextTick(() => {
				document.getElementById("sessionEvent").focus()
			});
		}
		if (checkData) {
			loading.value = true;
			dataMsg.value = "";
			let sessionEventTemp = ruleForm.value.sessionEvent;
			let st = sessionEventTemp.split("@@");
			let res = await postApi("/reg",
					{
						params: {
						name: ruleForm.value.name,
						phone: ruleForm.value.phone,
						email: ruleForm.value.email,
						event: configData.value.eventID + "," + st[0],
						date: st[1],
						timeslot:st[2],
						participant: ruleForm.value.participant,
						status: status.value,
						eventUrlParam: eventUrlParam.value
					},
					});
				loading.value = false;
					console.info("reg result:", res);
					let resultCode = res.responseCode;
					if (resultCode == 0)
						toSuccessPage(st[1] + " " + st[2]);
					else
						dataMsg.value = res.responseMessage;

			// $fetch({
			// 		url: config.public.baseURL4Proxy + '/reg',
			// 		params: {
			// 			name: ruleForm.value.name,
			// 			phone: ruleForm.value.phone,
			// 			email: ruleForm.value.email,
			// 			event: configData.value.eventID + "," + st[0],
			// 			date: st[1],
			// 			timeslot:st[2],
			// 			participant: ruleForm.value.participant,
			// 			status: status.value,
			// 			eventUrlParam: eventUrlParam.value
			// 		},
			// 		method: 'post'
			// 	}).then((res) => {
			// 		loading.value = false;
			// 		console.info("reg result:", res);
			// 		let resultCode = res.data.responseCode;
			// 		if (resultCode == 0)
			// 			toSuccessPage(st[1] + " " + st[2]);
			// 		else
			// 			dataMsg.value = res.data.responseMessage;
			// 	})
			// 	.catch((error) => {
			// 		loading.value = false;
			// 		console.error("reg", error);
			// 	})
		}
	}

	watch(() => ruleForm.value.sessionEvent, (newName, oldName) => {
		console.log(`Name changed from ${oldName} to ${newName}`);
		if (ruleForm.value.phone != '') {
			nextTick(() => {
				document.getElementById("phone").focus();
				document.getElementById("phone").blur();
			});
		}
	});

	onMounted(async () => {
		
	});
	
// 使用 Pinia store


//let eventT = route.params.eventUrlParam;
//		console.info("Pinia store.........",configData4Store.fetchPosts(eventT));







console.info("route.name>", route.name)
		console.info("route.params->", route.params)
		let eventT = route.params.eventUrlParam;
		let otype = route.params.otype;
		if (typeof(eventT) != 'undefined' && eventT != '')
			eventUrlParam.value = eventT;
		if (otype == "p")
			status.value = "1";
		console.info("onMounted获取config信息");
		loading.value = true; // 设置加载状态为true
		const configDataTemp = await configData4Store.getData(eventT,router);
		if (configDataTemp) {
			//checkQuota();
			let code = configDataTemp.responseCode;
			if(configDataTemp.data && configDataTemp.data.length>0)
		{
			let dataf = configDataTemp.data[0].attributes;
			 configData.value = dataf;
			 console.info("get Data from api:", dataf)
		}
						if (code == 0) {
							showMain.value = true;
			                showForm.value = true;
						} else
						{
							let emsg =configDataTemp.responseMessage;
							console.info("get Data from api error:", code+":"+emsg)
							if (code == 2)
								toFullPage();
							else
								toErrorPage(emsg);
						}


		} else {
			toErrorPage("數據加載失敗了，請稍後再試。");//可以加入slot進行按鈕重新加載頁面，待優化
		}
		loading.value = false; // 无论请求成功或失败，都将加载状态设置为false
		if(configData.value)
		{
			if(configData.value.eventName)
			eventName.value= configData.value.eventName;
			if(configData.value.registrationItemList)
		  registrationItemList.push(...configData.value.registrationItemList); //方式可以
		
		if(configData.value.timeslotList)
		  timeslotList.push(...configData.value.timeslotList);
		if(configData.value.posterImage && configData.value.imageDns)
		  posterImage.value = configData.value.imageDns + configData.value.posterImage.data[0].attributes.url;
		//當場次只有一個時，默認選中
		if (timeslotList.length ==1) {
		      let itemSp = timeslotList[0];
			  ruleForm.value.sessionEvent =  itemSp.id+'@@'+itemSp.date+'@@'+itemSp.starttime+'-'+itemSp.endtime+'@@'+itemSp.maxseatperregistration
			  ruleForm.value.participant = maxSeatpPerregistration.value[0];
		}
		}
		
		useHead({
		  title: '體驗日',
		  meta: [
		    { name: 'description', content: 'full page.' },
		  ],
		  titleTemplate: `%s - ${eventName.value}` //響應式標題必須用  ` 包起來
		});
</script>
<style scoped>
	:deep(.el-form-item__label) {
		color: #ffffff;
		/* 设置 label 的文字颜色为蓝色 */
		font-size: 16px;
		/* 设置 label 的字体大小 */
		font-weight: 500;
		/* 设置 label 的字体粗细为粗体 */
		/* 可以添加其他样式，如字体、对齐方式等 */
	}
</style>
