import {
	defineStore
} from "pinia"
import { useRouter } from 'vue-router';

//defineStore（模块名称）模块名称在开发者调试工具能显示这个名字
export const configDataStore = defineStore('configData', {
	//当前模块管理的数据
	state: () => {
		return {
			configData: {},
			posts: [],
		}
	},
	//包含N个只读的计算属性的数据
	getters: {
		// async getData() {
		// 	let dataTemp = this.configData;
		// 	console.info(dataTemp)
		// 	console.info(dataTemp.eventID)
		// 	console.info("EventUrlAlias:",eventT)
		// 	if (!dataTemp.eventID)
		// 		await this.setData(eventT);
		// 	else
		// 		console.info("get Data from state:", dataTemp)
		// 	return this.configData;
		// }
	},
	//相当于vuex的action+mucatation的集合体
	//action函数需要发送请求，也需要直接更新数据
	actions: {
			 async toFullPage(eventUrlParam,router){
			    const queryParams = {
					eventUrlParam: eventUrlParam
				};
				router.push({
					path: '/full',
					query: queryParams
				})
			},
			 async toErrorPage (msg,eventUrlParam,router){
				const queryParams = {
					msg: msg,
					eventUrlParam: eventUrlParam
				};
				router.push({
					path: '/error',
					query: queryParams
				})
			},
			setScssValue(configDataTemp)
			{
				if(configDataTemp.primaryColor)
				  document.getElementsByTagName("body")[0].style.setProperty('--mainColor',configDataTemp.primaryColor);
				if(configDataTemp.secondaryColor)
				  document.getElementsByTagName("body")[0].style.setProperty('--secondColor',configDataTemp.secondaryColor);
			},
			async getData(eventT) {
				let configDataTemp = this.configData;
				if (configDataTemp) {
					if(configDataTemp.data && configDataTemp.data.length>0)
					{
						let dataTemp = configDataTemp.data[0].attributes;
					let code = configDataTemp.responseCode;
				    let emsg =configDataTemp.responseMessage;
					

				console.info(dataTemp)
				console.info(dataTemp.eventID)
				console.info("EventUrlAlias:",eventT)
				if (!dataTemp.eventID){
					await this.setData(eventT);
				}
				else
					console.info("get Data from state:", dataTemp)
				if(import.meta.client)
				this.setScssValue(dataTemp)
					}else
					await this.setData(eventT);
				}else
				   await this.setData(eventT);
				return this.configData;
			},

			async fetchPosts(eventT) {
				try {
				  const response = await postApi("/getConfig",
					{
						params: {
							eventUrlParam:eventT
						  },
						  method:'POST',
					});
				  this.posts = response;
				} catch (error) {
				  console.error('Failed to fetch posts:', error);
				}
			  }
			  ,
		async setData(eventT) {
			try {
				const data  = await postApi("/getConfig",
					{
						params: {
							eventUrlParam:eventT
						  }
					}
				)
				console.log("call setData:",data)
				this.configData = data;
				/*let code = data.responseCode;
						if (code == 0) {
							let dataf = data.data[0].attributes;
							this.configData = dataf;
							console.info("get Data from api:", this.configData)
						} else
						{
							let emsg =data.responseMessage;
							console.info("get Data from api error:", code+":"+emsg)
							if (code == 2)
							{
								let dataf = data.data[0].attributes;
								this.configData = dataf;
								console.info("get Data from api:", this.configData)
								this.toFullPage(eventT,router);
							}
							else
								this.toErrorPage(emsg,eventT,router);
						}*/
			} catch (error) {
				console.error("Error fetching data:", error.message);
				//this.toErrorPage("數據加載失敗了，請稍後再試。",'',router);
			}
		}
	}
})
