<script setup lang="ts">
import { showToast } from 'vant'
import type { UserInfo } from '@/typing'
import { solar2lunar } from '@/utils/configs/dateTransform'
import natalChart from '@/components/natalChart/index.vue'
import copyHandle from '@/utils/hooks/useCopy';

const router = useRouter()
const resultData = ref<any>()
const userInfo = ref<UserInfo>({
  name: '',
  birthdayYMD: [],
  birthdayHMS: [],
})

const ymdValue = computed(() => {
  return userInfo.value.birthdayYMD.join('-')
})

const hmsValue = computed(() => {
  return userInfo.value.birthdayHMS.join(':')
})

const showPicker = ref<boolean>(false)
const showTimer = ref<boolean>(false)
const selectedDate = ref(['1999', '01', '01'])
const minDate = new Date(1900, 1, 1)
const maxDate = new Date()
const selectedTime = ref(['12', '00'])

function onSubmit() {
  const { name, birthdayYMD } = userInfo.value
  // 阳历转农历
  const { lYear, lMonth, lDay } = solar2lunar(Number(birthdayYMD[0]), Number(birthdayYMD[1]), Number(birthdayYMD[2]))

  const result = {
    name: name || '无名氏',
    d: `${lYear}-${lMonth}-${lDay}`,
    t: hmsValue.value,
  }
  resultData.value = result
}

function onShare() {
  const shareUrl = `http://localhost:3000/chart?name=${userInfo.value.name}&ymdValue=${ymdValue.value}&hmsValue=${hmsValue.value}`
  copyHandle(shareUrl)
  showToast('复制链接成功')
}

function handleDateConfirm(value: any) {
  userInfo.value.birthdayYMD = value.selectedValues
  showPicker.value = false
}

function handleTimeConfirm(value: any) {
  userInfo.value.birthdayHMS = value.selectedValues
  showTimer.value = false
}

// back
const onClickLeft = () => router.push({name: 'main'})

const autoInit = (query: any) => {
  userInfo.value.name = query?.name || ''
  userInfo.value.birthdayHMS = query.hmsValue.split(':')
  userInfo.value.birthdayYMD = query.ymdValue.split('-')
  onSubmit()
}

onMounted(() => {
  console.log(router.currentRoute.value);
  const routerQuery = router.currentRoute.value.query
  if (routerQuery?.ymdValue && routerQuery?.hmsValue) {
    autoInit(routerQuery)
  }
})
</script>

<template>
  <VanNavBar title="⭐ 命盘" left-arrow fixed @click-left="onClickLeft" />

  <div class="container">
    <van-form @submit="onSubmit">
      <van-cell-group title="个人信息" inset>
        <van-field v-model="userInfo.name" name="姓名" label="姓名" placeholder="输入姓名" />
        <van-field
          v-model="ymdValue" readonly name="出生年月日选择" label="出生年月日" placeholder="点击选择出生年月日"
          :rules="[{ required: true, message: '请填写出生年月日' }]" @click="showPicker = true"
        />
        <van-field
          v-model="hmsValue" readonly name="出生时分选择" label="出生时分" placeholder="点击选择出生时分"
          :rules="[{ required: true, message: '请填写出生时分' }]" @click="showTimer = true"
        />
      </van-cell-group>
      <div style="margin: 16px;display: flex;justify-content: space-between;">
        <van-button round block type="primary" native-type="submit" style="width: 48%;">
          排盘
        </van-button>
        <van-button round block plain style="width: 48%;background: transparent;border-color: #000000;" @click="onShare">
          分享
        </van-button>
      </div>
    </van-form>
    <natal-chart v-if="resultData" :result="resultData" />
    <van-popup v-model:show="showPicker" position="bottom">
      <van-date-picker
        v-model="selectedDate" title="选择出生年月日" :min-date="minDate" :max-date="maxDate"
        @confirm="handleDateConfirm" @cancel="showPicker = false"
      />
    </van-popup>
    <van-popup v-model:show="showTimer" position="bottom">
      <van-time-picker
        v-model="selectedTime" :columns-type="['hour', 'minute']" title="选择出生时分"
        @confirm="handleTimeConfirm" @cancel="showTimer = false"
      />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 16px;
  position: relative;
  overflow-y: auto;
}

.chart {
  width: 100%;
  height: 300px;
  background: #fff;
}

.chart.item {
  margin-top: 15px;
}

[data-theme='dark'] {
  .chart {
    color: #fff;
    background: #222;
  }
}
</style>
