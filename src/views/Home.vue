<template>
    <div class="home">
        <h3>我是首页</h3>
    </div>
</template>
<script>
import {getUserList} from '@/api'
export default {
    data () {
        return {}
    },
    mounted(){
        let obj = {params:{'query':'', 'pagenum':1, 'pagesize':1}}
        getUserList(obj).then(res => {
            console.log(res)
        })
    }
}
</script>
<style lang="scss" scoped>
    .home{
        text-align: center;
        h3{
            font-weight: bold;
            color: red;
            padding: 20px;
            font-size: 25px;
        }
    }
</style>
