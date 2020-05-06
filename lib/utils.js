import moment from 'moment'
// import 'moment/locale/zh-cn' // 中文包

export function getLastUpdated(time) {
	return moment(time).fromNow()
}
