/***
 * 接口参数
 */
/*测试环境*/
export const serverConfig = {
    goodsURL: "http://42.193.3.91:8073/GoodService", //商品服务
    memberURL: "http://42.193.3.91:8072/MemberService", //会员服务
    systemsettingURL: "http://42.193.3.91:8070/SystemSettingService", //系统设置服务
    orderURL: "http://42.193.3.91:8071/OrderService", // 订单服务
    pictureURL:"http://42.193.3.91:8074/GoodService",// 文件服务
	//设置企业微信消息地址 用于获取 企业用户的基本资料
	qywxServicesAPI:"",//服务商接口
	qywxOpenAPI: "https://crm.f8com.cn/openapi",
	currentVerion: false, //是否为服务商版本，false:非服务商；true: 服务商；
	//非服务商需要配置以下内容
	customerInfo: {
		customerId: "E3F8",//客户编码
		unikey: "c6e65a0ddc7945ed86212089656a0a69",//导购助手Unikey
		qywxurl: 'https://xls2020.com/FE3QYWX_Message/',
		datatype: "1", //0:IPOS;1:E3;2:3000+
	},
}

/*测试环境域名*/
// export const serverConfig = {
// 	goodsURL: "https://www.xls2020.com/XWSaaS_GoodService", //商品服务
// 	memberURL: "https://www.xls2020.com/XWSaaS_MemberService", //会员服务
// 	systemsettingURL: "https://www.xls2020.com/XWSaaS_SystemSettingService", //系统设置服务
// 	orderURL: "https://www.xls2020.com/XWSaaS_OrderService", // 订单服务
// 	pictureURL:"http://42.193.3.91:8074/GoodService",// 文件服务
// 	//设置企业微信消息地址 用于获取 企业用户的基本资料
// 	qywxServicesAPI:"",//服务商接口
// 	qywxOpenAPI: "",
// 	currentVerion: false, //是否为服务商版本，false:非服务商；true: 服务商；
// 	//非服务商需要配置以下内容
// 	customerInfo: {
// 		customerId: "E3F8",//客户编码
// 		unikey: "c6e65a0ddc7945ed86212089656a0a69",//导购助手Unikey
// 		// qywxurl: "https://www.f8crm.cn/XWSaaS_ApiTask/WxWork/provider/E3F8/",
// 		qywxurl: 'https://xls2020.com/FE3QYWX_Message/',
// 		datatype: "1", //0:IPOS;1:E3;2:3000+
// 	},
// }

/*正式环境*/
// export const serverConfig = {
// 	goodsURL: "https://crm.f8com.cn/goods", //商品服务
// 	memberURL: "https://crm.f8com.cn/member", //会员服务
// 	systemsettingURL: "https://crm.f8com.cn/system", //系统设置服务
// 	orderURL: "https://crm.f8com.cn/order", // 订单服务
// 	pictureURL: "https://tool.f8com.cn/picture", // 文件服务
// 	//设置企业微信消息地址 用于获取 企业用户的基本资料
// 	qywxServicesAPI:"",//服务商接口
// 	currentVerion: false, //是否为服务商版本，false:非服务商；true: 服务商；
// 	//非服务商需要配置以下内容
// 	customerInfo: {
// 		customerId: "E3F8",//客户编码
// 		unikey: "c6e65a0ddc7945ed86212089656a0a69",//导购助手Unikey
// 		qywxurl: 'https://xls2020.com/FE3QYWX_Message/',
// 		datatype: "1", //0:IPOS;1:E3;2:3000+
// 	},
// }
